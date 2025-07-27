"use client"

import { useTeam } from "@/hooks/use-team"
import { useQuery } from "convex/react" //usePaginatedQuery,
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { DataTable, DataTableSkeleton } from "@/components/file-table/table"
import { columns, trashColumns } from "@/components/file-table/columns"
import { useSearchParams } from "next/navigation"
import FileSearch from "@/components/file-search"
import { FileViewSelector, useFileView } from "./file-view"
import { ExplorerGridView, ExplorerGridViewSkeleton } from "./explorer-grid-view"

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
  const view = useSearchParams().get("view") || savedView || "list"
  const query = useSearchParams().get("q") || undefined

  // const {
  //   results: files,
  //   status,
  //   // loadMore,
  //   // isLoadingMore,
  // } = usePaginatedQuery(
  //   api.files.getFilesPaginated,
  //   team
  //     ? {
  //         teamId: team._id,
  //       }
  //     : "skip",
  //   { initialNumItems: PAGE_SIZE },
  // )

  const resolvedColumns = trash ? trashColumns : columns
  const endpoint = trash ? api.files.getTrashedFiles : api.files.getFiles

  const files = useQuery(
    endpoint,
    team
      ? {
          teamId: team._id,
          ...(!trash && { parentId: folderId }),
          searchQuery: query,
        }
      : "skip",
  )

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between gap-2 max-sm:mt-2 max-sm:mb-1">
        <FileSearch />
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
