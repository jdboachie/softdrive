"use client"

import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useQuery } from "convex/react"
import { SlashIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowElbowUpLeftIcon } from "@phosphor-icons/react"

const capitalize = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

const Breadcrumbs = () => {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const isFolder = segments[2] === "f"
  const folderId = isFolder ? segments[3] : null
  const folder = useQuery(
    api.files.getFileById,
    folderId ? { id: folderId as Id<"files"> } : "skip",
  )

  const label = isFolder
    ? folder?.name || (
        <div className="flex flex-col gap-2.5">
          <Skeleton className="w-52 h-9" />
          <Skeleton className="w-36 h-3.5" />
        </div>
      )
    : capitalize(segments[2] ?? "Home")

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumb>
        <BreadcrumbList>
          {folder?.parentId &&
            (() => {
              const chips = folder.path.split("/")
              const pathDepth = chips.length
              const parentFolder = chips[pathDepth - 2]
              return (
                <>
                  <BreadcrumbItem className="text-3xl font-medium">
                    <BreadcrumbLink asChild>
                      <Link
                        prefetch
                        href={`/t/${segments[1]}/f/${folder.parentId}`}
                      >
                        {parentFolder}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="[&>svg]:size-6">
                    <SlashIcon className="text-muted-foreground stroke-[1.5]" />
                  </BreadcrumbSeparator>
                </>
              )
            })()}
          <BreadcrumbItem>
            <BreadcrumbPage className="text-3xl font-medium">
              {label}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {isFolder && folder && (
        <Link
          prefetch
          href={`/t/${segments[1]}`}
          className="flex items-center gap-1.5 text-muted-foreground text-xs hover:text-foreground"
        >
          <ArrowElbowUpLeftIcon />
          Go back to files
        </Link>
      )}
    </div>
  )
}

export default Breadcrumbs
