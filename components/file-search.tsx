"use client"

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command"
import { useHotkeys } from "react-hotkeys-hook"
import { useStableQuery } from "@/hooks/use-stable-query"
import { api } from "@/convex/_generated/api"
import { useTeam } from "@/hooks/use-team"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { FileIcon } from "./file-icon"
import { FileActions } from "./file-actions"

export default function FileSearch({
  folderId,
  trash,
}: {
  folderId?: Id<"files">
  trash?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const router = useRouter()
  const { team } = useTeam()

  useHotkeys("ctrl+f,cmd+f", (e) => {
    e.preventDefault()
    setOpen(true)
  })

  const files = useStableQuery(
    api.files.getFiles,
    team
      ? {
          teamId: team._id,
          ...(!trash && { parentId: folderId }),
          searchQuery: searchQuery ?? "",
        }
      : "skip",
  )

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="shadow-none rounded-full"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon className="size-4" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search files..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList className="!max-h-92 overflow-y-auto p-1">
          {files?.map((file: Doc<"files">) => (
            <CommandItem
              key={file._id}
              onSelect={() => {
                setOpen(false)
                if (!team) return
                if (file.isFolder) router.push(`/t/${team._id}/f/${file._id}`)
                else if (file.url) router.push(file.url)
              }}
              className="relative group"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="flex items-center gap-2 truncate max-w-[70%]">
                  <FileIcon type={file.isFolder ? "folder" : file.type} />
                  <span className="truncate">{file.name}</span>
                </span>
                <div
                  className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <FileActions file={file} buttonVariant="outline" />
                </div>
              </div>
            </CommandItem>
          ))}
          {!files || files.length === 0 && (
            <CommandEmpty>
              No files found. Try searching for something else
            </CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
