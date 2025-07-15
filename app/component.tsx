"use client"

import { api } from "@/convex/_generated/api"
import { buttonVariants } from "@/components/ui/button"
import { useQuery } from "convex/react"
import { useOrganization } from "@/hooks/use-organization"

export default function Component() {
  const { organization } = useOrganization()

  const files = useQuery(
    api.files.getFiles,
    organization
      ? {
          orgId: organization._id,
        }
      : "skip",
  )

  return (
    <div className="gap-6 pt-3 flex w-full">
      <ul className="flex flex-col grow divide-y p-1 rounded-lg w-full">
        {files?.map((file) => (
          <li
            key={file._id}
            className={`${buttonVariants({ variant: "ghost", size: "lg" })} !justify-between !text-base !rounded-none`}
          >
            <span className="text-medium text-sm">{file.name}</span>
            <span className="text-muted-foreground text-mono text-sm">
              {new Date(file._creationTime).toDateString()}
            </span>
          </li>
        ))}
        {(!files || files.length === 0) && (
          <span className="self-center text-muted-foreground text-center text-sm">
            No files in {organization?.name}
          </span>
        )}
      </ul>
    </div>
  )
}
