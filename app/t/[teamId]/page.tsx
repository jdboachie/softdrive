"use client"

import { useTeam } from "@/hooks/use-team"
import { usePaginatedQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { DataTable } from "@/components/file-table/table"
import { columns } from "@/components/file-table/columns"

const PAGE_SIZE = 50

export default function Page() {
  const { team } = useTeam()

  const {
    results: files,
    status,
    // loadMore,
    // isLoadingMore,
  } = usePaginatedQuery(
    api.files.getFilesPaginated,
    team
      ? {
          teamId: team._id,
        }
      : "skip",
    { initialNumItems: PAGE_SIZE },
  )

  return (
    <div className="flex flex-col gap-6">
      {status !== "LoadingFirstPage" && (
        <DataTable<Doc<"files">, unknown> columns={columns} data={files} />
      )}
    </div>
  )
}
