"use client"

import { z } from "zod"
import * as React from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "convex/react"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTeam } from "@/hooks/use-team"
import { UploadIcon } from "@phosphor-icons/react"
import { usePathname } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { FileIcon } from "../file-ui/file-icon"

const formSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, "Select at least one file to upload"),
})

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
  const inputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { files: [] },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!team) {
      toast.error("Unauthorized")
      return
    }

    form.reset()
    setDialogOpen(false)

    toast.promise(
      Promise.all(
        values.files.map(async (file) => {
          const postUrl = await generateUploadUrl()
          if (!postUrl) {
            throw new Error("Could not get upload URL")
          }
          const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          })
          const { storageId } = await result.json()
          await createFile({
            name: file.name,
            type: file.type,
            size: file.size,
            teamId: team._id,
            path: parentFolder ? parentFolder.path + '/' + file.name : file.name,
            storageId,
            parentId: folderId || undefined,
            breadcrumbs: parentFolder
              ? [
                  ...(parentFolder.breadcrumbs ?? []),
                  { folderId: parentFolder._id, folderName: parentFolder.name },
                ]
              : [],
          })
        }),
      ),
      {
        loading: `Uploading ${values.files.length} file(s)...`,
        success: `${values.files.length} file(s) uploaded successfully!`,
        error: "Upload failed",
      },
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={loading}
          size="lg"
          onClick={() => setDialogOpen(true)}
          className="max-md:w-full"
        >
          <UploadIcon weight="bold" size={32} className="size-5" />
          Upload files
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="border-b-0">
          <DialogTitle>Upload files</DialogTitle>
          <DialogDescription>
            {parentFolder
              ? `Add files to “${parentFolder.name}” folder in ${team?.name}`
              : `Add files to ${team?.name}'s drive`}
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
                          const currentFiles = form.getValues("files") ?? []
                          form.setValue("files", [
                            ...currentFiles,
                            ...droppedFiles,
                          ])
                        }}
                        className="border border-dashed max-h-72 min-h-16 justify-center overflow-auto rounded-lg bg-accent/15 p-3 flex flex-col gap-3"
                      >
                        <Input
                          ref={inputRef}
                          type="file"
                          multiple
                          onChange={(event) => {
                            const selectedFiles = Array.from(
                              event.target.files ?? [],
                            )
                            const currentFiles = form.getValues("files") ?? []
                            form.setValue("files", [
                              ...currentFiles,
                              ...selectedFiles,
                            ])
                          }}
                          className="hidden"
                        />
                        {form.getValues("files")?.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {form.getValues("files").map((file, idx) => (
                              <div
                                key={idx}
                                className="border flex items-center gap-2 rounded-sm p-2 h-10 bg-card"
                              >
                                <FileIcon type={file.type} size="sm" />
                                <span className="text-sm truncate">
                                  {file.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground text-center">
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
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isLoading}>
                Upload
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
