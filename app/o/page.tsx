"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useOrganization } from "@/hooks/use-organization"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function Page() {
  const router = useRouter()
  const { organization } = useOrganization()

  useEffect(() => {
    if (organization)
    router.push(`/o/${organization._id}`)
  }, [organization, router]);

  return <Skeleton className="h-screen w-full" />
}

export default Page