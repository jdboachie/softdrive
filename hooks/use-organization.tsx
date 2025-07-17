"use client"

import * as React from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { usePathname } from "next/navigation"

type Organization = {
  _id: Id<"organizations">
  name: string
  image?: string
}

type OrganizationContextType = {
  organization: Organization | null
  loading: boolean
}

const OrganizationContext = React.createContext<OrganizationContextType>({
  organization: null,
  loading: true,
})

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const orgId =
    pathname === "/o"
      ? undefined
      : pathname.startsWith("/o/")
        ? ((pathname.split("/")[2] ?? undefined) as Id<"organizations">)
        : undefined

  const organization = useQuery(api.organizations.getCurrentOrg, { orgId })
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    if (organization !== undefined) {
      setLoading(false)
    }
  }, [organization])

  return (
    <OrganizationContext.Provider
      value={{ organization: organization ?? null, loading }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  return React.useContext(OrganizationContext)
}
