"use client"

import {
  ArrowCounterClockwiseIcon,
  BracketsCurlyIcon,
  CopyIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  FileCsvIcon,
  FilePdfIcon,
  FileXIcon,
  ImageSquareIcon,
  MicrosoftWordLogoIcon,
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
import { useMutation, useQuery } from "convex/react"
import { useTeam } from "@/hooks/use-team"
import { Doc } from "@/convex/_generated/dataModel"
import { formatBytes, formatRelativeDate } from "@/lib/utils"
import UserImage from "./user-image"

export function renderFileIcon(type: string) {
  if (!type) return <div className="size-5 bg-accent rounded-sm" />

  if (type === "application/pdf")
    return <FilePdfIcon size={32} className="size-5 shrink-0" />

  if (type === "text/csv")
    return <FileCsvIcon size={32} className="size-5 shrink-0" />

  if (type === "application/json")
    return <BracketsCurlyIcon size={32} className="size-5 shrink-0" />

  if (type === "image/jpeg" || type === "image/png")
    return <ImageSquareIcon size={32} className="size-5 shrink-0" />

  if (
    type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return (
      <MicrosoftWordLogoIcon
        size={32}
        weight="fill"
        className="size-5 shrink-0 text-blue-500"
      />
    )

  return <div className="size-5 rounded-sm bg-accent" />
}

export default function FileItem({
  file,
  // view = "list",
}: {
  file: Doc<"files">
  trash?: boolean
  // view?: "grid" | "list"
}) {
  const author = useQuery(api.users.getUserById, { userId: file.authorId })

  return (
    <>
      <li
        className={`justify-between flex items-center p-2 h-11 rounded-sm odd:bg-accent/70 odd:dark:bg-accent/30 even:bg-transparent hover:bg-neutral-200 dark:hover:bg-accent/70 transition-all duration-150 ease-in-out`}
      >
        <div className="flex items-center gap-2">
          {renderFileIcon(file.type)}
          <span className="truncate min-w-0 text-sm font-medium">
            {file.name}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 w-fit h-full max-md:hidden">
          <p className="text-xs">
            {file && !file.isFolder && file.size && formatBytes(file.size)}
          </p>
          <div className="size-5 border rounded-full">
            <UserImage src={author?.image} />
          </div>
          <span className="text-xs">
            {formatRelativeDate(file._creationTime)}
          </span>
        </div>
      </li>
    </>
  )
}

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

  const fileUrl = useQuery(
    api.storage.getFileUrl,
    file.isFolder || !file.storageId ? "skip" : { src: file.storageId },
  )

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
            if (!fileUrl) {
              toast.error("Could not get file url")
              return
            }
            await navigator.clipboard.writeText(fileUrl)
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
                  Delete permanently
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete file permanently?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The file will be permanently
                    deleted.
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
                weight={file.isStarred ? "fill" : "regular"}
                className="size-4"
              />
              {file.isStarred ? "Unstar" : "Star"}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={async () => {
                if (!fileUrl) {
                  toast.error("Could not download file")
                  return
                }
                const a = document.createElement("a")
                a.href = fileUrl
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
