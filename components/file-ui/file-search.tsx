"use client"

import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
} from "@/components/ui/command"
import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useDebouncedCallback } from "use-debounce"
import { api } from "@/convex/_generated/api"
import { useTeam } from "@/hooks/use-team"
import { useStableQuery } from "@/hooks/use-stable-query"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
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

  useHotkeys("f", (e) => {
    e.preventDefault()
    setOpen(true)
  })

  const handleSelect = useDebouncedCallback((file: Doc<"files">) => {
    setOpen(false)
    if (!team) return
    if (file.isFolder) router.push(`/t/${team._id}/f/${file._id}`)
    else if (file.url) router.push(file.url)
  }, 200)

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
        className="shadow-none rounded-full visible md:hidden"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon className="size-4" />
      </Button>
      <span
        onClick={() => setOpen(true)}
        className="flex max-md:hidden items-center space-x-2 rounded-lg border px-3 pr-2 py-1.5 text-sm text-muted-foreground transition"
      >
        <MagnifyingGlassIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground pr-4 ">Search…</span>
        <kbd className="ml-auto">
          F
        </kbd>
      </span>

      <CommandDialog open={open} onOpenChange={setOpen} showCloseButton={false}>
        <div className="grid relative w-full">
          <CommandInput
            placeholder="Search files..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <kbd className="absolute top-3 right-3">Esc</kbd>
        </div>
        <div className="scroll-py-1 overflow-x-hidden !max-h-92 overflow-y-auto p-1">
          {files?.map((file: Doc<"files">) => (
            <div
              key={file._id}
              onSelect={() => handleSelect(file)}
              className="group hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm p-2 py-2.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="flex items-center gap-2 truncate max-w-[85%]">
                  <FileIcon size="sm" type={file.isFolder ? "folder" : file.type} />
                  <span className="truncate">{file.name}</span>
                </span>
                <div
                  className="absolute right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <FileActions file={file} buttonVariant="outline" />
                </div>
              </div>
            </div>
          ))}
          {!files ||
            (files.length === 0 && (
              <CommandEmpty>
                No files found. Try searching for something else
              </CommandEmpty>
            ))}
        </div>
      </CommandDialog>
    </>
  )
}
