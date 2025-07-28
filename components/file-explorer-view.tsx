"use client"

import { useTeam } from "@/hooks/use-team"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { DataTable, DataTableSkeleton } from "@/components/file-table/table"
import { columns, trashColumns } from "@/components/file-table/columns"
import { useSearchParams } from "next/navigation"
import { FileViewSelector, useFileView } from "./file-view"
import { ExplorerGridView, ExplorerGridViewSkeleton } from "./explorer-grid-view"
import { useStableQuery } from "@/hooks/use-stable-query"
import FileFilters from "./file-filters"
import { stringToMimeType } from "@/lib/utils"

// const PAGE_SIZE = 50

export default function FileExplorerView({
  folderId,
  trash,
}: {
  folderId?: Id<"files">
  trash?: boolean
}) {
  const { team } = useTeam()
  const { view: savedView } = useFileView()
  const searchParams = useSearchParams()
  const view = searchParams.get("view") || savedView || "list"
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
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between gap-2 max-sm:mt-2 max-sm:mb-1">
        <FileFilters />
        <FileViewSelector />
      </div>
      {files ? (
        <>
          {
            view === "list" ? (
              <DataTable<Doc<"files">, unknown>
                columns={resolvedColumns}
                data={files}
              />
            ) : (
              <ExplorerGridView files={files} />
            )
          }
        </>
      ) : (
          <>
            {view === "list" ? (
              <DataTableSkeleton />
            ) : (
              <ExplorerGridViewSkeleton />
            )}
          </>
      )}
    </div>
  )
}
