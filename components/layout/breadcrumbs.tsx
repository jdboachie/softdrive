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
import { SlashIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowElbowUpLeftIcon } from "@phosphor-icons/react"
import { useStableQuery } from "@/hooks/use-stable-query"

const capitalize = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())

const Breadcrumbs = () => {
  const router = useRouter()
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const isFolder = segments[2] === "f"
  const folderId = isFolder ? segments[3] : null
  const folder = useStableQuery(
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
    : capitalize(segments[2] ?? "Drive")

  return (
    <div className="flex flex-col gap-2 max-md:w-full">
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
        <div
          onClick={() => {
            router.back()
          }}
          className="w-fit flex items-center gap-1.5 text-muted-foreground text-xs hover:text-foreground cursor-pointer"
        >
          <ArrowElbowUpLeftIcon />
          Back
        </div>
      )}
      {segments[2] === "my-drive" && (
        <span className="text-xs text-muted-foreground">
          These are your personal files
        </span>
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
