"use client"

import { useEffect, useState } from "react"
import { useTeam } from "@/hooks/use-team"
import { useRouter } from "next/navigation"
import { DataTableSkeleton } from "@/components/file-table/table"
import { TitleBlockSkeleton } from "@/components/layout/title-block"

function Page() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { team } = useTeam()

  useEffect(() => {
    setMounted(true)
    if (team) router.push(`/t/${team._id}`)
  }, [team, router])

  return (
    <>
      <TitleBlockSkeleton />
      {mounted && <DataTableSkeleton />}
    </>
  )
}

export default Page
