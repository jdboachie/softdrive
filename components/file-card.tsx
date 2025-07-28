"use client"

import Link from "next/link"
import Image from "next/image"
import { FileIcon } from "./file-icon"
import { useTeam } from "@/hooks/use-team"
import { FileActions } from "./file-actions"
import { Doc } from "@/convex/_generated/dataModel"
import { FolderSimpleIcon } from "@phosphor-icons/react"
import { cn, formatBytes, formatRelativeDate } from "@/lib/utils"
import { Checkbox } from "./ui/checkbox"

// Helper function to check if file type is an image
function isImageFile(fileType: string): boolean {
  return fileType.toLowerCase().startsWith("image/")
}

export default function FileCard({
  file,
  state,
  toggleChecked,
}: {
  file: Doc<"files">
  state?: string
  toggleChecked?: () => void
}) {
  const { team } = useTeam()

  return (
    <div
      data-state={state}
      className={cn(
        "relative flex flex-col gap-2 rounded-md text-center group",
      )}
    >
      <div
        data-state={state}
        className="absolute top-2 right-2 flex gap-2 justify-between items-center opacity-0 group-hover:opacity-100 data-[state=selected]:opacity-100 max-md:opacity-100 transition-opacity"
      >
        <Checkbox
          checked={state === "selected"}
          onCheckedChange={toggleChecked}
          className="text-primary-foreground size-6 rounded-md border-foreground/70 backdrop-blur-xs"
        />
        <FileActions
          file={file}
          useVerticalIcon
          buttonVariant="outline"
          className="shadow-none !bg-background"
        />
      </div>
      <Link
        target={file.isFolder ? "_self" : "_blank"}
        href={
          file.isFolder && team
            ? `/t/${team._id}/f/${file._id}`
            : !file.isFolder && file.url
              ? file.url
              : "#"
        }
        data-state={state}
        className="cursor-pointer border grid place-items-center h-40 sm:h-52 p-3 rounded-sm bg-card data-[state=selected]:bg-muted"
      >
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
      </Link>
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
