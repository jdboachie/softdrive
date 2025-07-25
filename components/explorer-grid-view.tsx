"use client"

import Link from "next/link"
import { cn, formatBytes, formatRelativeDate } from "@/lib/utils"
import { useTeam } from "@/hooks/use-team"
import { FileActions, renderFileIcon } from "./file-item"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { FolderSimpleIcon } from "@phosphor-icons/react"
import { Skeleton } from "@/components/ui/skeleton"

export function ExplorerGridView({ files }: { files: Doc<"files">[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-7 space-y-8">
      {files.map((file: Doc<"files">) => (
        <FileCard key={file._id} file={file} />
      ))}
      {files.length === 0 && (
        <div className="col-span-full text-center text-sm text-muted-foreground">
          No files found.
        </div>
      )}
    </div>
  )
}

function FileCard({ file }: { file: Doc<"files"> }) {
  const { team } = useTeam()
  const fileUrl = useQuery(
    api.storage.getFileUrl,
    file.isFolder || !file.storageId ? "skip" : { src: file.storageId },
  )

  return (
    <div className={cn("flex flex-col gap-2 rounded-md text-center")}>
      <div className="border relative grid place-items-center h-52 rounded-sm bg-background">
        <FileActions
          file={file}
          useVerticalIcon
          className="absolute top-2 right-2"
        />
        {file.isFolder && (
          <FolderSimpleIcon
            weight="fill"
            size={128}
            className="size-32 text-primary"
          />
        )}
      </div>
      <div className="flex flex-col w-full">
        <Link
          target={file.isFolder ? "_self" : "_blank"}
          href={
            file.isFolder && team
              ? `/t/${team._id}/f/${file._id}`
              : !file.isFolder && fileUrl
                ? fileUrl
                : "#"
          }
          className="flex gap-2 items-center text-sm min-w-0 py-2 hover:underline hover:underline-offset-3 hover:decoration-dotted"
        >
          {file.isFolder ? (
            <FolderSimpleIcon weight="fill" className="size-6 text-primary" />
          ) : (
            renderFileIcon(file.type)
          )}
          <span className="truncate">{file.name}</span>
        </Link>
        <p className="text-xs text-left flex justify-between text-muted-foreground">
          {file.isFolder
            ? "Folder"
            : file.size
              ? formatBytes(file.size)
              : "File"}
          <span>
            {!file.isFolder && formatRelativeDate(file._creationTime)}
          </span>
        </p>
      </div>
    </div>
  )
}

export function ExplorerGridViewSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-7 space-y-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-md text-center">
          <Skeleton className="h-52" />
          <div className="flex flex-col w-full">
            <div className="flex gap-2 items-center text-sm min-w-0 py-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="text-xs text-left flex justify-between text-muted-foreground">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
