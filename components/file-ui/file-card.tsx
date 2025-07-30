"use client"

import Link from "next/link"
import Image from "next/image"
import { FileIcon } from "./file-icon"
import { useTeam } from "@/hooks/use-team"
import { FileActions } from "./file-actions"
import { Doc } from "@/convex/_generated/dataModel"
import { FolderSimpleIcon } from "@phosphor-icons/react"
import { cn, formatBytes, formatRelativeDate } from "@/lib/utils"
import { Checkbox } from "../ui/checkbox"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useState } from "react"
import { renderToString } from "react-dom/server"

// Helper function to check if file type is an image
function isImageFile(fileType: string): boolean {
  return fileType.toLowerCase().startsWith("image/")
}

// Helper function to render FileIcon to string for drag preview
function renderFileIconToString(type: string, isFolder: boolean) {
  const iconType = isFolder ? "folder" : type
  const iconElement = <FileIcon type={iconType} size="sm" />
  return renderToString(iconElement)
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
  const moveFile = useMutation(api.files.moveFile)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/json", JSON.stringify({
      fileId: file._id,
      fileName: file.name,
      isFolder: file.isFolder
    }))
    e.dataTransfer.effectAllowed = "move"
    setIsDragging(true)

    // Create custom drag preview
    const dragPreview = document.createElement("div")
    dragPreview.style.cssText = `
      position: fixed;
      top: -1000px;
      left: -1000px;
      background: hsl(var(--background));
      border: 1px solid hsl(var(--border));
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 14px;
      color: hsl(var(--foreground));
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
      z-index: 9999;
      pointer-events: none;
      user-select: none;
      white-space: nowrap;
      max-width: 250px;
      overflow: hidden;
      text-overflow: ellipsis;
      backdrop-filter: blur(8px);
      border: 1px solid hsl(var(--border) / 0.2);
    `

    // Use FileIcon component instead of hardcoded SVG
    const iconHtml = renderFileIconToString(file.type, file.isFolder)

    dragPreview.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        ${iconHtml}
        <span style="overflow: hidden; text-overflow: ellipsis; font-weight: 500;">${file.name}</span>
      </div>
    `

    document.body.appendChild(dragPreview)
    e.dataTransfer.setDragImage(dragPreview, 0, 0)

    // Clean up the preview element after a short delay
    setTimeout(() => {
      if (document.body.contains(dragPreview)) {
        document.body.removeChild(dragPreview)
      }
    }, 100)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (file.isFolder) {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
      setIsDragOver(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (!file.isFolder || !team) return

    try {
      const data = e.dataTransfer.getData("application/json")
      if (!data) return

      const { fileId } = JSON.parse(data)

      // Don't allow dropping a file onto itself
      if (fileId === file._id) return

      await moveFile({
        fileId,
        newParentId: file._id,
        teamId: team._id
      })
    } catch (error) {
      console.error("Failed to move file:", error)
      // You might want to show a toast notification here
    }
  }

  return (
    <div
      data-state={state}
      className={cn(
        "relative flex flex-col gap-2 rounded-md text-center group",
        isDragging && "opacity-50"
      )}
    >
      <div
        data-state={state}
        className="absolute top-2 right-2 flex gap-2 justify-between items-center opacity-0 group-hover:opacity-100 data-[state=selected]:opacity-100 max-md:opacity-100 transition-opacity"
      >
        <Checkbox
          checked={state === "selected"}
          onCheckedChange={toggleChecked}
          className="text-primary-foreground size-7 rounded-md border-foreground/70"
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
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "cursor-pointer border grid place-items-center h-40 sm:h-52 p-3 rounded-md bg-card data-[state=selected]:bg-muted",
          file.isFolder && isDragOver && "ring-2 ring-primary ring-offset-1 bg-muted/50"
        )}
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
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
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
