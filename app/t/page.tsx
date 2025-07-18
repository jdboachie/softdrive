"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useTeam } from "@/hooks/use-team"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function Page() {
  const router = useRouter()
  const { team } = useTeam()

  useEffect(() => {
    if (team)
    router.push(`/t/${team._id}`)
  }, [team, router]);

  return <Skeleton className="h-screen w-full !rounded-none" />
}

export default Page