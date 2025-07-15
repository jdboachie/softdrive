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
import { useMutation } from "convex/react"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useOrganization } from "@/hooks/use-organization"
import { FileIcon, UploadIcon } from "@phosphor-icons/react"

const formSchema = z.object({
  files: z
    .array(z.instanceof(File))
    .min(1, "Select at least one file to upload"),
})

export default function UploadButton() {
  const { organization } = useOrganization()
  const createFile = useMutation(api.files.createFile)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)

  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const maxFiles = 1

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!organization) {
      toast.error("Unauthorized")
      return
    }
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
          createFile({
            name: file.name,
            orgId: organization._id,
            storageId: storageId,
          })
        }),
      ),
      {
        loading: "Uploading files...",
        success: "Files uploaded successfully!",
        error: "Upload failed",
      },
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setDialogOpen(true)
          }}
        >
          <UploadIcon weight="bold" size={32} />
          Upload file
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload file</DialogTitle>
          <DialogDescription>
            Add files to{" "}
            <span className="font-medium">{organization?.name}&apos;s</span>{" "}
            drive
          </DialogDescription>
        </DialogHeader>
        <div className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                          if (droppedFiles.length) {
                            const currentFiles = form.getValues("files") ?? []
                            form.setValue("files", [
                              ...currentFiles,
                              ...droppedFiles,
                            ])
                          }
                        }}
                        className="border border-dashed max-h-72 overflow-auto rounded-lg bg-accent/15 p-3 flex flex-col gap-3"
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
                                <FileIcon />
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
                            select {maxFiles === 1 ? `file` : "files"}
                          </a>{" "}
                          to upload
                        </p>
                      </div>
                    </FormControl>
                    <FormDescription>
                      {field.value.length > 0 && (
                        <>
                          {field.value.length}{" "}
                          {field.value.length > 1 ? "files" : "file"} selected
                          for upload
                        </>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex justify-between">
                <Button
                  type="reset"
                  variant={"outline"}
                  onClick={() => {
                    setDialogOpen(false)
                    form.reset()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
