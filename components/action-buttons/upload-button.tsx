"use client"

// framework
import * as React from "react"
import { usePathname } from "next/navigation"

// form
import { z } from "zod"
import { useTeam } from "@/hooks/use-team"
import { useForm } from "react-hook-form"

// ui
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileIcon } from "@/components/file-ui/file-icon"
import { SplitButton } from "@/components/ui/split-button"
import { CheckIcon, XIcon, FilePlusIcon } from "lucide-react" // FolderPlusIcon

// backend
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, "Select at least one file to upload"),
})

interface UploadProgress {
  file: File
  status: "pending" | "uploading" | "completed" | "error"
  progress: number
  error?: string
}

export default function UploadButton() {
  const { team, loading } = useTeam()
  const pathname = usePathname()
  const folderId = pathname.split("/")[4] as Id<"files"> // /t/teamId/f/folderId

  const parentFolder = useQuery(
    api.files.getFileById,
    folderId ? { id: folderId } : "skip",
  )

  const createFile = useMutation(api.files.createFile)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState<UploadProgress[]>(
    [],
  )
  const [isUploading, setIsUploading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const completedCount = uploadProgress.filter(
    (p) => p.status === "completed",
  ).length
  const errorCount = uploadProgress.filter((p) => p.status === "error").length
  const totalCount = uploadProgress.length

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { files: [] },
  })

  const removeFile = (index: number) => {
    const currentFiles = form.getValues("files") ?? []
    const newFiles = currentFiles.filter((_, i) => i !== index)
    form.setValue("files", newFiles)

    // Also remove from upload progress
    setUploadProgress((prev) => prev.filter((_, i) => i !== index))
  }

  const validateFile = (file: File): string | null => {
    // Check file size (100MB limit)
    const maxSize = 50 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return `File size exceeds 50MB limit`
    }

    // Check file type (basic validation)
    const allowedTypes = [
      "image/",
      "video/",
      "audio/",
      "text/",
      "application/",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ]

    const isValidType = allowedTypes.some((type) => file.type.startsWith(type))
    if (!isValidType) {
      return `File type "${file.type}" is not supported`
    }

    return null
  }

  async function uploadFile(file: File, index: number): Promise<void> {
    try {
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        setUploadProgress((prev) =>
          prev.map((item, i) =>
            i === index
              ? { ...item, status: "error", error: validationError }
              : item,
          ),
        )
        return
      }

      // Update status to uploading
      setUploadProgress((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, status: "uploading", progress: 0 } : item,
        ),
      )

      // Generate upload URL
      const postUrl = await generateUploadUrl()
      if (!postUrl) {
        throw new Error("Could not get upload URL")
      }

      // Upload file with progress tracking
      const xhr = new XMLHttpRequest()

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            setUploadProgress((prev) =>
              prev.map((item, i) =>
                i === index ? { ...item, progress } : item,
              ),
            )
          }
        })

        xhr.addEventListener("load", async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const { storageId } = JSON.parse(xhr.responseText)

              // Create file record
              await createFile({
                name: file.name,
                type: file.type,
                size: file.size,
                teamId: team!._id,
                path: parentFolder
                  ? parentFolder.path + "/" + file.name
                  : file.name,
                storageId,
                parentId: folderId || undefined,
                breadcrumbs: parentFolder
                  ? [
                      ...(parentFolder.breadcrumbs ?? []),
                      {
                        folderId: parentFolder._id,
                        folderName: parentFolder.name,
                      },
                    ]
                  : [],
              })

              setUploadProgress((prev) =>
                prev.map((item, i) =>
                  i === index
                    ? { ...item, status: "completed", progress: 100 }
                    : item,
                ),
              )
              resolve()
            } catch (error) {
              setUploadProgress((prev) =>
                prev.map((item, i) =>
                  i === index
                    ? {
                        ...item,
                        status: "error",
                        error: "Failed to create file record",
                      }
                    : item,
                ),
              )
              reject(error)
            }
          } else {
            setUploadProgress((prev) =>
              prev.map((item, i) =>
                i === index
                  ? {
                      ...item,
                      status: "error",
                      error: `Upload failed: ${xhr.statusText}`,
                    }
                  : item,
              ),
            )
            reject(new Error(`Upload failed: ${xhr.statusText}`))
          }
        })

        xhr.addEventListener("error", () => {
          setUploadProgress((prev) =>
            prev.map((item, i) =>
              i === index
                ? {
                    ...item,
                    status: "error",
                    error: "Network error during upload",
                  }
                : item,
            ),
          )
          reject(new Error("Network error during upload"))
        })

        xhr.addEventListener("abort", () => {
          setUploadProgress((prev) =>
            prev.map((item, i) =>
              i === index
                ? { ...item, status: "error", error: "Upload was cancelled" }
                : item,
            ),
          )
          reject(new Error("Upload was cancelled"))
        })

        xhr.open("POST", postUrl)
        xhr.setRequestHeader("Content-Type", file.type)
        xhr.send(file)
      })
    } catch (error) {
      setUploadProgress((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                status: "error",
                error: error instanceof Error ? error.message : "Unknown error",
              }
            : item,
        ),
      )
      throw error
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!team) {
      toast.error("Unauthorized")
      return
    }

    setIsUploading(true)

    // Initialize progress tracking
    const initialProgress: UploadProgress[] = values.files.map((file) => ({
      file,
      status: "pending",
      progress: 0,
    }))
    setUploadProgress(initialProgress)

    try {
      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < values.files.length; i++) {
        await uploadFile(values.files[i], i)
      }

      const completedCount = uploadProgress.filter(
        (p) => p.status === "completed",
      ).length
      const errorCount = uploadProgress.filter(
        (p) => p.status === "error",
      ).length

      if (errorCount === 0) {
        toast.success(`${completedCount} file(s) uploaded successfully!`)
      } else if (completedCount === 0) {
        toast.error(`${errorCount} file(s) failed to upload`)
      } else {
        toast.success(
          `${completedCount} file(s) uploaded, ${errorCount} failed`,
        )
      }

      // Reset form and close dialog only if all uploads completed successfully
      if (errorCount === 0) {
        form.reset()
        // setDialogOpen(false)
      }
    } catch {
      toast.error("Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelection = (files: File[]) => {
    const currentFiles = form.getValues("files") ?? []
    const newFiles = [...currentFiles, ...files]
    form.setValue("files", newFiles)

    // Initialize progress for new files
    const newProgress: UploadProgress[] = files.map((file) => ({
      file,
      status: "pending",
      progress: 0,
    }))
    setUploadProgress((prev) => [...prev, ...newProgress])
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <SplitButton
          size={"lg"}
          disabled={loading}
          onClick={() => setDialogOpen(true)}
          // actions={[
          //   {
          //     disabled: true,
          //     icon: <FolderPlusIcon />,
          //     label: "Upload folder",
          //     onClick: () => toast.info("This is a work in progress"),
          //   },
          // ]}
        >
          <FilePlusIcon className="!size-4.5" />
          Upload files
        </SplitButton>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="border-b-0">
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription>
            {parentFolder
              ? `Add files to "${parentFolder.name}" folder in ${team?.name}`
              : `Add files to ${team?.name}'s drive`}
            {isUploading &&
              "You may navigate away from this page. Uploads will still continue (dont close the tab tho)"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="p-5">
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const droppedFiles = Array.from(
                            e.dataTransfer.files ?? [],
                          )
                          handleFileSelection(droppedFiles)
                        }}
                        className="border border-dashed max-h-72 min-h-16 overflow-auto rounded-lg bg-accent/15 p-3 gap-3"
                      >
                        <Input
                          ref={inputRef}
                          type="file"
                          multiple
                          onChange={(event) => {
                            const selectedFiles = Array.from(
                              event.target.files ?? [],
                            )
                            handleFileSelection(selectedFiles)
                          }}
                          className="hidden"
                        />
                        {form.getValues("files")?.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {form.getValues("files").map((file, idx) => {
                              const progress = uploadProgress[idx]
                              return (
                                <div
                                  key={idx}
                                  className="border flex items-center gap-2 rounded-sm p-2 h-10 bg-card relative"
                                >
                                  <FileIcon type={file.type} size="sm" />
                                  <span className="text-sm truncate flex-1">
                                    {file.name}
                                  </span>
                                  {progress && (
                                    <div className="flex items-center gap-2">
                                      {progress.status === "completed" && (
                                        <CheckIcon
                                          className="text-green-500"
                                          size={16}
                                        />
                                      )}
                                      {progress.status === "error" && (
                                        <span className="text-xs text-red-500">
                                          {progress.error}
                                        </span>
                                      )}
                                      {progress.status === "uploading" && (
                                        <Progress
                                          value={progress.progress}
                                          className="w-16 h-2"
                                        />
                                      )}
                                    </div>
                                  )}
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(idx)}
                                    disabled={isUploading}
                                    className="h-6 w-6 p-0"
                                  >
                                    <XIcon size={12} />
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        )}
                        <p className="text-xs mt-4 text-muted-foreground text-center">
                          Drag and drop or{" "}
                          <a
                            onClick={() => inputRef.current?.click()}
                            className="underline cursor-pointer transition hover:text-foreground"
                          >
                            select files
                          </a>{" "}
                          to upload
                        </p>
                      </div>
                    </FormControl>
                    <FormDescription>
                      {field.value.length > 0 && (
                        <>
                          {field.value.length} file
                          {field.value.length > 1 && "s"} selected for upload
                          {isUploading && totalCount > 0 && (
                            <span className="ml-2">
                              ({completedCount}/{totalCount} completed
                              {errorCount > 0 && `, ${errorCount} failed`})
                            </span>
                          )}
                        </>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="reset"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false)
                  form.reset()
                  setUploadProgress([])
                }}
                disabled={isUploading}
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={
                  form.formState.isLoading ||
                  isUploading ||
                  form.getValues("files")?.length === 0
                }
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
