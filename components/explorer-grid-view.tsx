"use client"

import Link from "next/link"
import Image from "next/image"
import { FileIcon } from "./file-icon"
import { useTeam } from "@/hooks/use-team"
import { FileActions } from "./file-actions"
import { Skeleton } from "@/components/ui/skeleton"
import { Doc } from "@/convex/_generated/dataModel"
import { FolderSimpleIcon } from "@phosphor-icons/react"
import { cn, formatBytes, formatRelativeDate } from "@/lib/utils"

// Helper function to check if file type is an image
function isImageFile(fileType: string): boolean {
  return fileType.toLowerCase().startsWith('image/')
}

export function ExplorerGridView({ files }: { files: Doc<"files">[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-7 space-y-8">
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

  return (
    <div className={cn("flex flex-col gap-2 rounded-md text-center")}>
      <div className="border relative grid place-items-center h-44 sm:h-52 p-3 rounded-sm bg-card hover:bg-muted">
        <FileActions
          file={file}
          useVerticalIcon
          buttonVariant="outline"
          className="absolute top-2 right-2 shadow-none"
        />
        {file.isFolder ? (
          <FolderSimpleIcon
            weight="fill"
            size={128}
            className="size-32 text-primary"
          />
        ) : isImageFile(file.type) && file.url ? (
          <Image
            src={file.url}
            alt={file.name}
            width={500}
            height={500}
            loading="lazy"
            className="size-full object-contain overflow-hidden rounded-xs"
          />
        ) : (
          <FileIcon type={file.type} size="lg" />
        )}
      </div>
      <div className="flex flex-col w-full px-1">
        <Link
          target={file.isFolder ? "_self" : "_blank"}
          href={
            file.isFolder && team
              ? `/t/${team._id}/f/${file._id}`
              : !file.isFolder && file.url
                ? file.url
                : "#"
          }
          className="flex gap-2 items-center text-sm min-w-0 py-2 hover:underline hover:underline-offset-3 hover:decoration-dotted"
        >
          {file.isFolder ? (
            <FolderSimpleIcon weight="fill" className="size-5 text-primary" />
          ) : (
            <FileIcon type={file.type} size="sm" />
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-7 space-y-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-md text-center">
          <Skeleton className="h-44 sm:h-52" />
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
