"use client"

import { z } from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { useRouter, usePathname } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form"
import { FolderPlusIcon } from "lucide-react"
import { useTeam } from "@/hooks/use-team"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"

const schema = z.object({
  name: z.string().min(1, "Folder name is required"),
})

export default function NewFolderButton() {
  const router = useRouter()
  const { team, loading } = useTeam()
  const createFile = useMutation(api.files.createFile)

  const pathname = usePathname()
  const folderId = pathname.split("/")[4] as Id<"files">

  const parentFolder = useQuery(
    api.files.getFileById,
    folderId ? { id: folderId } : "skip",
  )

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!team) {
      toast.error("Unauthorized")
      return
    }
    setDialogOpen(false)
    form.reset()

    toast.promise(
      async () => {
        const newFolderId = await createFile({
          name: values.name,
          type: "folder",
          size: 0,
          teamId: team._id,
          isFolder: true,
          parentId: folderId,
          path: parentFolder?.path
            ? parentFolder.path + "/" + values.name
            : values.name,
          breadcrumbs: parentFolder
            ? [
                ...(parentFolder.breadcrumbs ?? []),
                { folderId: parentFolder._id, folderName: parentFolder.name },
              ]
            : [],
        })

        if (newFolderId) router.push(`/t/${team._id}/f/${newFolderId}`)
      },
      {
        loading: "Creating folder...",
        success: "Folder created",
        error: "Failed to create folder",
      },
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={loading}
          size="lg"
          variant={"outline"}
          onClick={() => setDialogOpen(true)}
        >
          <FolderPlusIcon size={32} className="size-5" />
          New folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="border-b-0">
          <DialogTitle>New folder</DialogTitle>
          <DialogDescription>
            This will create a new folder under{" "}
            <span className="font-medium">{team?.name}</span>
            {parentFolder && (
              <>
                {" / "}
                <span className="font-medium">
                  {parentFolder.breadcrumbs
                    ?.map((crumb) => crumb.folderName)
                    .join(" / ")}
                  {parentFolder.breadcrumbs?.length ? " / " : ""}
                  {parentFolder.name}
                </span>
              </>
            )}{" "}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="p-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Folder name" autoFocus {...field} />
                    </FormControl>
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
              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || !form.watch("name")?.trim()
                }
              >
                Create folder
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
