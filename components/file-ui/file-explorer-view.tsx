"use client"

import { useTeam } from "@/hooks/use-team"
import { api } from "@/convex/_generated/api"
import { stringToMimeType } from "@/lib/utils"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { columns, trashColumns } from "@/components/file-table/columns"
import { DataTable, DataTableSkeleton } from "@/components/file-table/table"
import { useStableQuery } from "@/hooks/use-stable-query"
import { useFileExplorer } from "@/hooks/use-file-explorer"

// const PAGE_SIZE = 50

export default function FileExplorerView({
  folderId,
  trash,
  starred
}: {
  folderId?: Id<"files">
  trash?: boolean
  starred?: boolean
}) {
  const { team } = useTeam()
  const { typeFilter } = useFileExplorer()

  const resolvedColumns = trash ? trashColumns : columns
  let endpoint
  if (trash) endpoint = api.files.getTrashedFiles
  else if (starred) endpoint = api.files.getFiles
  else endpoint = api.files.getFiles

  const files = useStableQuery(
    endpoint,
    team
      ? {
          teamId: team._id,
          ...(!trash && { parentId: folderId }),
          ...(!trash && typeFilter && { type: stringToMimeType(typeFilter) }),
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
