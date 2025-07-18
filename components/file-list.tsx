"use client"

import FileItem from "./file-item"
import { useQuery } from "convex/react"
import { Skeleton } from "./ui/skeleton"
import { api } from "@/convex/_generated/api"
import { FileIcon } from "@phosphor-icons/react"
import { useTeam } from "@/hooks/use-team"
import { useSearchParams } from "next/navigation"

export default function FileList() {
  const { team } = useTeam()
  const query = useSearchParams().get('q')

  const files = useQuery(
    api.files.getFiles,
    team
      ? {
        teamId: team._id,
        searchQuery: query ? query : undefined
        }
      : "skip",
  )

  if (files === undefined) {
    return (
      <div className="grid gap-11 h-fit">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="rounded-sm h-11 w-full" />
        ))}
      </div>
    )
  }
  if (files === null) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center h-full gap-2">
        <FileIcon size={56} weight={"thin"} />
        <p className="text-sm text-muted-foreground text-center">
          No files in {team?.name}
        </p>
      </div>
    )
  }
  return (
    <>
      {files && files.length > 0 && (
        <ul className="grid w-full h-fit">
          {files?.map((file) => (
            <FileItem key={file._id} file={file} />
          ))}
        </ul>
      )}
      {(files === null || (files && files.length === 0)) && (
        <div className="text-muted-foreground flex flex-col items-center justify-center h-full gap-2">
          <FileIcon size={56} weight={"thin"} />
          <p className="text-sm text-muted-foreground text-center">
            No files {query ? 'found' : `in ${team?.name}`}
          </p>
        </div>
      )}
    </>
  )
}
