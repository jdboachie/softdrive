"use client"

import {
  ArrowCounterClockwiseIcon,
  CopyIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  FileXIcon,
  TrashIcon,
  StarIcon,
  DotsThreeVerticalIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useTeam } from "@/hooks/use-team"
import { Doc } from "@/convex/_generated/dataModel"

export const FileActions = ({
  file,
  buttonVariant = "ghost",
  className,
  useVerticalIcon,
}: {
  file: Doc<"files">
  buttonVariant?: "ghost" | "outline"
  className?: string
  useVerticalIcon?: boolean
}) => {
  const { team, loading } = useTeam()

  const trashFile = useMutation(api.files.trashFile)
  const trashFolder = useMutation(api.files.trashFolder)
  const restoreFile = useMutation(api.files.restoreFile)
  const toggleFileFavorite = useMutation(api.files.toggleFileIsStarred)
  const deleteFilePermanently = useMutation(api.files.deleteFilePermanently)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={loading}
          size={"icon"}
          variant={buttonVariant ?? "ghost"}
          className={"!size-7" + (className ? ` ${className}` : "")}
        >
          {useVerticalIcon ? (
            <DotsThreeVerticalIcon
              weight="bold"
              className="size-4 text-foreground"
            />
          ) : (
            <DotsThreeIcon weight="bold" className="size-4 text-foreground" />
          )}
          <span className="sr-only">File actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={async () => {
            if (!file.url) {
              toast.error("Could not get file url")
              return
            }
            await navigator.clipboard.writeText(file.url)
            toast.success("Link copied to clipboard")
          }}
        >
          <CopyIcon weight="bold" />
          Copy link
        </DropdownMenuItem>
        {file.trashedAt ? (
          <>
            <DropdownMenuItem
              onClick={() => {
                if (!team) return
                toast.promise(
                  restoreFile({ fileId: file._id, teamId: team._id }),
                  {
                    loading: "Restoring file...",
                    success: "Restored successfully",
                    error: "Error restoring file",
                  },
                )
              }}
            >
              <ArrowCounterClockwiseIcon weight="bold" />
              Restore
            </DropdownMenuItem>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem variant="destructive">
                  <FileXIcon weight="bold" />
                  Delete forever
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete forever?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The file will be permanently
                    deleted and cannot be recovered.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      if (!team) return
                      toast.promise(
                        deleteFilePermanently({
                          teamId: team._id,
                          fileId: file._id,
                        }),
                        {
                          loading: "Deleting file...",
                          success: "Deleted successfully",
                          error: "Error deleting file",
                        },
                      )
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onClick={() => {
                if (!team) return
                toggleFileFavorite({ teamId: team._id, fileId: file._id })
              }}
            >
              <StarIcon
                weight={file.isStarred ? "fill" : "bold"}
                className="size-4"
              />
              {file.isStarred ? "Unstar" : "Star"}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={async () => {
                if (!file.url) {
                  toast.error("Could not download file")
                  return
                }
                const a = document.createElement("a")
                a.href = file.url
                a.target = "_blank"
                a.download = file.name
                a.click()
                toast.info("Download started")
              }}
            >
              <DownloadSimpleIcon weight="bold" />
              Download file
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                if (!team) return

                toast.promise(
                  async () => {
                    if (file.isFolder) {
                      trashFolder({ teamId: team._id, fileId: file._id }).catch(
                        (err: Error) => {
                          toast.error(err.name, {
                            description:
                              "You may not have permission to delete this file",
                          })
                        },
                      )
                    } else {
                      trashFile({ teamId: team._id, fileId: file._id }).catch(
                        (err: Error) => {
                          toast.error(err.name, {
                            description:
                              "You may not have permission to delete this file",
                          })
                        },
                      )
                    }
                  },
                  {
                    loading: "Moving to trash...",
                    success: "File trashed successfully",
                  },
                )
              }}
            >
              <TrashIcon weight="bold" />
              Move to trash
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
