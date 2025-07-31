"use client"

import {
  CommandDialog,
  CommandInput,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command"
import { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { api } from "@/convex/_generated/api"
import { useTeam } from "@/hooks/use-team"
import { useStableQuery } from "@/hooks/use-stable-query"
import { MagnifyingGlassIcon, NavigationArrowIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { FileIcon } from "./file-icon"
import { FileActions } from "./file-actions"
import Link from "next/link"

export default function FileSearch({
  disabled,
  folderId,
  trash,
}: {
  disabled?: boolean
  folderId?: Id<"files">
  trash?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const { team } = useTeam()

  useHotkeys("f", (e) => {
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
        disabled={disabled ?? false}
        variant="outline"
        size="icon"
        className="shadow-none rounded-full visible md:hidden"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon className="size-4" />
      </Button>
      <span
        onClick={() => setOpen(true)}
        className="flex max-md:hidden items-center space-x-1.5 rounded-md border px-3 pr-1.5 py-1.5 text-sm text-muted-foreground transition"
      >
        <MagnifyingGlassIcon className="size-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground pr-4">Search…</span>
        <kbd className="ml-auto">F</kbd>
      </span>

      <CommandDialog open={open} onOpenChange={setOpen} showCloseButton={false}>
        <div className="grid relative w-full">
          <CommandInput
            placeholder="Find files..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <kbd className="absolute top-3 right-3">Esc</kbd>
        </div>
        <div className="scroll-py-1 overflow-x-hidden !max-h-92 overflow-y-auto p-1">
          {files?.map((file: Doc<"files">) => (
            <Link
              target={file.isFolder ? "_self" : "_blank"}
              href={
                file.isFolder && team
                  ? `/t/${team._id}/f/${file._id}`
                  : !file.isFolder && file.url
                    ? file.url
                    : "#"
              }
              key={file._id}
              onSelect={() => setOpen(false)}
              className="group hover:bg-accent data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm p-2 py-2.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            >
              <div className="flex items-center justify-between w-full gap-2">
                <span className="flex items-center gap-2 truncate max-w-[85%]">
                  <FileIcon
                    size="sm"
                    type={file.isFolder ? "folder" : file.type}
                  />
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
            </Link>
          ))}
          {!files ||
            (files.length === 0 && (
              <CommandEmpty>
                No files found. Try searching for something else
              </CommandEmpty>
            ))}
          <CommandItem className="!p-0 !py-0">
            <Link
              href={"/account"}
              onClick={() => setOpen(false)}
              className="size-full flex items-center gap-1 p-2 py-2.5"
            >
              <NavigationArrowIcon weight="bold" className="size-4" />
              Account{" "}
              <span className="text-xs text-muted-foreground">/account</span>
            </Link>
          </CommandItem>
          <CommandItem className="!p-0 !py-0">
            <Link
              href={"/account/settings"}
              onClick={() => setOpen(false)}
              className="size-full flex items-center gap-1 p-2 py-2.5"
            >
              <NavigationArrowIcon weight="bold" className="size-4" />
              Settings{" "}
              <span className="text-xs text-muted-foreground">
                /account/settings
              </span>
            </Link>
          </CommandItem>
        </div>
      </CommandDialog>
    </>
  )
}
