"use client"

import { useEffect } from "react"
import { useTeam } from "@/hooks/use-team"
import { useRouter, useSearchParams } from "next/navigation"
import { HeaderSkeleton } from "@/components/layout/header"
import { TitleBlockSkeleton } from "@/components/layout/title-block"
import { DataTableSkeleton } from "@/components/file-table/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useFileView } from "@/components/file-view"
import { ExplorerGridViewSkeleton } from "@/components/explorer-grid-view"

function Page() {
  const router = useRouter()
  const { team } = useTeam()
  const { view: savedView } = useFileView()
  const view = useSearchParams().get("view") || savedView || "list"

  useEffect(() => {
    if (team) router.push(`/t/${team._id}`)
  }, [team, router])

  return (
    <>
      <HeaderSkeleton />
      <TitleBlockSkeleton />
      <div className="flex flex-col gap-6 p-3 sm:p-6">
        <Skeleton className="h-9 w-full max-w-md rounded-md" />
        {view === "list" ? <DataTableSkeleton /> : <ExplorerGridViewSkeleton />}
      </div>
    </>
  )
}

export default Page
