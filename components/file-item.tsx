"use client"

import {
  BracketsCurlyIcon,
  DotsThreeIcon,
  DownloadSimpleIcon,
  FileCsvIcon,
  FilePdfIcon,
  ImageSquareIcon,
  MicrosoftWordLogoIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { useOrganization } from "@/hooks/use-organization"
import { Doc } from "@/convex/_generated/dataModel"
import { formatBytes } from "@/lib/utils"
import UserImage from "./user-image"


export default function FileItem ({
  file,
  // view = "list",
}: {
  file: Doc<"files">
  // view?: "grid" | "list"
}) {
  const { organization } = useOrganization()
  const fileMetadata = useQuery(api.storage.getMetadata, {
    storageId: file.storageId,
  })
  const trashFile = useMutation(api.files.trashFile)
  const author = useQuery(api.users.getUserById, { userId: file.author })
  const fileUrl = useQuery(api.storage.getFileUrl, { src: file.storageId })

  const renderFileIcon = () => {
    const type = fileMetadata?.contentType

    if (!type) return <div className="size-5 bg-accent rounded-sm" />

    if (type === "application/pdf")
      return (
        <FilePdfIcon size={32} weight="fill" className="size-5 text-red-500" />
      )

    if (type === "text/csv") return <FileCsvIcon size={32} className="size-5" />

    if (type === "application/json")
      return <BracketsCurlyIcon size={32} className="size-5" />

    if (type === "image/jpeg")
      return <ImageSquareIcon size={32} className="size-5" />

    if (
      type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return (
        <MicrosoftWordLogoIcon
          size={32}
          weight="fill"
          className="size-5 text-blue-500"
        />
      )

    return <div className="size-5 rounded-sm bg-accent" />
  }

  function formatRelativeDate(timestamp: number) {
    // const now = new Date()
    const date = new Date(timestamp)
    // const diffDays = Math.floor(
    //   (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    // )

    // if (diffDays === 0) return "Today"
    // if (diffDays === 1) return "Yesterday"
    // if (diffDays === 2) return "Two days ago"

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <>
      <li
        className={`justify-between flex items-center p-2 h-11 rounded-sm odd:bg-accent/70 odd:dark:bg-accent/30 even:bg-transparent hover:bg-neutral-200 dark:hover:bg-accent/70 transition-all duration-150 ease-in-out`}
      >
        <div className="flex items-center gap-2">
          {renderFileIcon()}
          <span className="truncate min-w-0 text-sm font-medium">
            {file.name}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 w-fit h-full max-md:hidden">
          <p className="text-xs">
            {fileMetadata && formatBytes(fileMetadata.size)}
          </p>
          <div className="size-5 border rounded-full">
            <UserImage src={author?.image} />
          </div>
          <span className="text-xs">
            {formatRelativeDate(file._creationTime)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={"icon"}
                variant={"ghost"}
                className="!size-6"
              >
                <DotsThreeIcon
                  weight="bold"
                  className="size-4 text-foreground"
                />
                <span className="sr-only">Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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

                  toast.success("Download started")
                }}
              >
                <DownloadSimpleIcon weight="bold" />
                Download file
              </DropdownMenuItem>

              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  if (!organization) return
                  trashFile({ orgId: organization._id, fileId: file._id })
                  toast.info("File moved to trash", {
                    description: `${file.name} has been moved to trash successfully.`,
                  })
                }}
              >
                <TrashIcon weight="bold" />
                Move to trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </li>
    </>
  )
}
