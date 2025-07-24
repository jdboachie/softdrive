"use client"

import { useTeam } from "@/hooks/use-team"
import { useQuery } from "convex/react" //usePaginatedQuery,
import { api } from "@/convex/_generated/api"
import { Doc } from "@/convex/_generated/dataModel"
import { DataTable } from "@/components/file-table/table"
import { columns } from "@/components/file-table/columns"
import { useSearchParams } from "next/navigation"
import FileSearch from "@/components/file-search"

// const PAGE_SIZE = 50

export default function Page() {
  const { team } = useTeam()
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

  const files = useQuery(
    api.files.getFiles,
    team
      ? {
        teamId: team._id,
        searchQuery: query
        }
      : "skip",
  )

  return (
    <div className="flex flex-col gap-6">
      <FileSearch />
      {files && (
        <DataTable<Doc<"files">, unknown> columns={columns} data={files} />
      )}
    </div>
  )
}
