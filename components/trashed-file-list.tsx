"use client"

import { useQuery } from "convex/react"
import { Skeleton } from "./ui/skeleton"
import { api } from "@/convex/_generated/api"
import { useOrganization } from "@/hooks/use-organization"
import { FileDashedIcon } from "@phosphor-icons/react"

export default function TrashedFileList() {
  const { organization } = useOrganization()

  const files = useQuery(
    api.files.getTrashedFiles,
    organization
      ? {
          orgId: organization._id,
        }
      : "skip",
  )

  return (
    <>
      {files === undefined && (
        <div className="grid gap-9">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="rounded-sm h-9 w-full" />
          ))}
        </div>
      )}
      <ul className="grid w-full">
        {files?.map((file) => (
          <li
            key={file._id}
            className={`justify-between flex items-center p-2 pl-3 rounded-sm odd:bg-accent/70 odd:dark:bg-accent/30 even:bg-transparent hover:bg-background dark:hover:bg-accent/50 transition-all duration-150 ease-in-out`}
          >
            <span className="text-medium text-sm truncate">{file.name}</span>
            <div className="flex items-center justify-between gap-3 w-fit h-full">
              <span className="text-muted-foreground text-mono text-sm max-md:hidden">
                {new Date(file._creationTime).toDateString()}
              </span>
            </div>
          </li>
        ))}
        {(!files || files.length === 0) && (
          <div className="text-muted-foreground grid place-items-center gap-4 sm:p-24">
            <FileDashedIcon size={56} weight={'thin'} />
            <p className="text-sm text-muted-foreground text-center">No trashed files in {organization?.name}</p>
          </div>
        )}
      </ul>
    </>
  )
}
