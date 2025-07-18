"use client"

import * as React from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { usePathname } from "next/navigation"

type Team = {
  _id: Id<"teams">
  name: string
  image?: string
}

type TeamContextType = {
  team: Team | null
  loading: boolean
}

const TeamContext = React.createContext<TeamContextType>({
  team: null,
  loading: true,
})

export function TeamProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const teamId =
    pathname === "/t"
      ? undefined
      : pathname.startsWith("/t/")
        ? ((pathname.split("/")[2] ?? undefined) as Id<"teams">)
        : undefined

  const team = useQuery(api.teams.getCurrentTeam, { teamId })
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (team !== undefined) {
      setLoading(false)
    }
  }, [team])

  return (
    <TeamContext.Provider
      value={{ team: team ?? null, loading }}
    >
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  return React.useContext(TeamContext)
}
