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
  FolderSimpleIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
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
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { useTeam } from "@/hooks/use-team"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useState } from "react"

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
  const [moveDialogOpen, setMoveDialogOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFolderId, setSelectedFolderId] = useState<
    Id<"files"> | null | undefined
  >(null)

  const trashFile = useMutation(api.files.trashFile)
  const trashFolder = useMutation(api.files.trashFolder)
  const restoreFile = useMutation(api.files.restoreFile)
  const toggleFileFavorite = useMutation(api.files.toggleFileIsStarred)
  const deleteFilePermanently = useMutation(api.files.deleteFilePermanently)
  const moveFile = useMutation(api.files.moveFile)

  const folders = useQuery(
    api.files.getFolders,
    team ? { teamId: team._id, excludeFileId: file._id } : "skip",
  )

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
          <span className="sr-only">Actions</span>
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
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => {
                e.preventDefault()
                setDropdownOpen(false)
                setDeleteDialogOpen(true)
              }}
            >
              <FileXIcon weight="bold" />
              Delete forever
            </DropdownMenuItem>
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

            <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setMoveDialogOpen(true)
                  }}
                >
                  <FolderSimpleIcon weight="bold" />
                  Move to...
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle>Move &quot;{file.name}&quot;</DialogTitle>
                  <DialogDescription>
                    Select a destination folder for this{" "}
                    {file.isFolder ? "folder" : "file"}.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 p-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Destination folder
                    </label>
                    <Select
                      value={selectedFolderId || ""}
                      onValueChange={(value) => {
                        if (value === "root") setSelectedFolderId(undefined)
                        else setSelectedFolderId(value as Id<"files">)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a folder" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="root">
                          <div className="flex items-center gap-2">
                            <FolderSimpleIcon
                              weight="fill"
                              className="size-4"
                            />
                            <span>Root folder</span>
                          </div>
                        </SelectItem>
                        {folders?.map((folder) => (
                          <SelectItem key={folder._id} value={folder._id}>
                            <div className="flex items-center gap-2">
                              <FolderSimpleIcon
                                weight="fill"
                                className="size-4"
                              />
                              <span>{folder.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMoveDialogOpen(false)
                      setSelectedFolderId(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      if (!team) return

                      try {
                        await moveFile({
                          fileId: file._id,
                          newParentId: selectedFolderId || undefined,
                          teamId: team._id,
                        })

                        toast.success("File moved successfully")
                        setMoveDialogOpen(false)
                        setSelectedFolderId(null)
                      } catch (error) {
                        toast.error("Failed to move file", {
                          description:
                            error instanceof Error
                              ? error.message
                              : "Unknown error",
                        })
                      }
                    }}
                    disabled={!selectedFolderId && selectedFolderId !== null}
                  >
                    Move
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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

    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
  )
}
