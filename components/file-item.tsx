"use client"

import UserImage from "./user-image"
import { FileIcon } from "./file-icon"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { formatBytes, formatRelativeDate } from "@/lib/utils"

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
    <li
      className={`justify-between flex items-center p-2 h-11 rounded-sm odd:bg-accent/70 odd:dark:bg-accent/30 even:bg-transparent hover:bg-neutral-200 dark:hover:bg-accent/70 transition-all duration-150 ease-in-out`}
    >
      <div className="flex items-center gap-2">
        <FileIcon type={file.type} size="sm" />
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
  )
}
