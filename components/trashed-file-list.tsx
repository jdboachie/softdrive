"use client"

import { useQuery } from "convex/react"
import { Skeleton } from "./ui/skeleton"
import { api } from "@/convex/_generated/api"
import { useOrganization } from "@/hooks/use-organization"
import { TrashIcon } from "@phosphor-icons/react"
import FileItem from "./file-item"
import { useSearchParams } from "next/navigation"

export default function TrashedFileList() {
  const { organization } = useOrganization()
  const query = useSearchParams().get('q')

  const files = useQuery(
    api.files.getTrashedFiles,
    organization
      ? {
        orgId: organization._id,
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
          <TrashIcon size={56} weight={"thin"} />
          <p className="text-sm text-muted-foreground text-center">
            No trashed files {query ? 'found' : `in ${organization?.name}`}
          </p>
        </div>
      )}
    </>
  )
}
