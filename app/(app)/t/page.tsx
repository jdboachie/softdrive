"use client"

import { useEffect } from "react"
import { useTeam } from "@/hooks/use-team"
import { useRouter } from "next/navigation"

function Page() {
  const router = useRouter()
  const { team } = useTeam()

  useEffect(() => {
    if (team) router.push(`/t/${team._id}`)
  }, [team, router])

  return null
}

export default Page
