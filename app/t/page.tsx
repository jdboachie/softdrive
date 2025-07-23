"use client"

import { useEffect } from "react"
import { useTeam } from "@/hooks/use-team"
import { useRouter } from "next/navigation"
import { HeaderSkeleton } from "@/components/layout/header"
import { TitleBlockSkeleton } from "@/components/layout/title-block"

function Page() {
  const router = useRouter()
  const { team } = useTeam()

  useEffect(() => {
    if (team)
    router.push(`/t/${team._id}`)
  }, [team, router]);

  return(
    <>
      <HeaderSkeleton />
      <TitleBlockSkeleton />
    </>
  )
}

export default Page