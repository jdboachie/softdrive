"use client"

import Link from "next/link"
import * as React from "react"
import { usePathname } from "next/navigation"
import { SlashIcon } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { useStableQuery } from "@/hooks/use-stable-query"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { TreeViewIcon } from "@phosphor-icons/react"

const capitalize = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

const Breadcrumbs = () => {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const isFolder = segments[2] === "f"
  const folderId = isFolder ? segments[3] : null
  const folder = useStableQuery(
    api.files.getFileById,
    folderId ? { id: folderId as Id<"files"> } : "skip",
  )

  const label = isFolder
    ? folder?.name || <Skeleton className="w-52 h-9" />
    : capitalize(segments[2] ?? "Drive")

  const crumbs = folder?.breadcrumbs ?? []

  return (
    <div className="flex flex-col gap-2 max-md:w-full">
      <h1 className="text-3xl font-medium">{label}</h1>
      {segments[2] === "f" && segments.length >= 4 && (
        <div className="flex items-center justify-center w-fit h-fit gap-1.5">
          <TreeViewIcon className="text-muted-foreground size-3" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    prefetch
                    href={`/t/${segments[1]}`}
                    className="text-muted-foreground text-xs hover:text-foreground font-medium"
                  >
                    All files
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {crumbs.length > 0 && (
                <BreadcrumbSeparator>
                  <SlashIcon className="text-muted-foreground stroke-[1.5] size-3" />
                </BreadcrumbSeparator>
              )}

              {crumbs.map((crumb, index) => (
                <React.Fragment key={crumb.folderId}>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        prefetch
                        href={`/t/${segments[1]}/f/${crumb.folderId}`}
                        className="text-muted-foreground text-xs hover:text-foreground font-medium"
                      >
                        {crumb.folderName}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < crumbs.length - 1 && (
                    <BreadcrumbSeparator>
                      <SlashIcon className="text-muted-foreground stroke-[1.5] size-3" />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      {segments[2] === "trash" && (
        <span className="text-xs text-muted-foreground">
          Items in trash are deleted automatically after 30 days
        </span>
      )}
      {!segments[2] && (
        <span className="text-xs text-muted-foreground">
          Welcome to your softdrive
        </span>
      )}
    </div>
  )
}

export default Breadcrumbs
