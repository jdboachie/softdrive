"use client"

import Breadcrumbs from "./breadcrumbs"
import { Skeleton } from "../ui/skeleton"
import { capitalize } from "@/lib/utils"
import { usePathname } from "next/navigation"

export default function TitleBlock({
  title,
  children,
}: {
  title?: string
  children?: React.ReactNode
}) {
  const pathname = usePathname()
  const isTeamPath = pathname.startsWith("/t/")
  const isAppPath = pathname.startsWith("/account")

  const segments = pathname.split('/')

  return (
    <div className="border-b">
      <div className="w-full flex max-sm:flex-col gap-6 items-center justify-start sm:justify-between p-6 px-3 md:px-6 containor mx-auto">
        {title ? (
          <h1 className="text-3xl font-medium max-sm:w-full text-left">
            {title}
          </h1>
        ) : isTeamPath ? (
          <Breadcrumbs />
        ) : isAppPath ? (
          <h1 className="text-3xl font-medium max-sm:w-full text-left">
            {capitalize(segments[segments.length-1])}
          </h1>
        ) : null}
        {children && isTeamPath && (
          <div className="flex items-center gap-2 max-sm:w-full max-sm:grid max-sm:grid-flow-col">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export function TitleBlockSkeleton() {
  return (
    <div className="border-b">
      <div className="flex items-center justify-between p-6 containor mx-auto">
        <Skeleton className="h-10 w-52" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  )
}
