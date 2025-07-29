"use client"

import { useTeam } from "@/hooks/use-team"
import { api } from "@/convex/_generated/api"
import { stringToMimeType } from "@/lib/utils"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { columns, trashColumns } from "@/components/file-table/columns"
import { DataTable, DataTableSkeleton } from "@/components/file-table/table"
import { useSearchParams } from "next/navigation"
import { useStableQuery } from "@/hooks/use-stable-query"

// const PAGE_SIZE = 50

export default function FileExplorerView({
  folderId,
  trash,
}: {
  folderId?: Id<"files">
  trash?: boolean
}) {
  const { team } = useTeam()
  const searchParams = useSearchParams()
  const typeParam = searchParams.get("type") || ""

  const resolvedColumns = trash ? trashColumns : columns
  const endpoint = trash ? api.files.getTrashedFiles : api.files.getFiles

  const files = useStableQuery(
    endpoint,
    team
      ? {
          teamId: team._id,
          ...(!trash && { parentId: folderId }),
          ...(!trash && typeParam && { type: stringToMimeType(typeParam) }),
        }
      : "skip",
  )

  return (
    <>
      {files ? (
        <>
          <DataTable<Doc<"files">, unknown>
            columns={resolvedColumns}
            data={files}
          />
        </>
      ) : (
        <DataTableSkeleton />
      )}
    </>
  )
}
