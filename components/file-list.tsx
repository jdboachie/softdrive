"use client"

import {
  DotsThreeIcon,
  DownloadSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "./ui/skeleton"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { FileDashedIcon } from "@phosphor-icons/react"
import { useOrganization } from "@/hooks/use-organization"

export default function FileList() {
  const { organization } = useOrganization()

  const trashFile = useMutation(api.files.trashFile)

  const files = useQuery(
    api.files.getFiles,
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
            className={`justify-between flex items-center p-2 pl-3 h-9 rounded-sm odd:bg-accent/70 odd:dark:bg-accent/30 even:bg-transparent hover:bg-background dark:hover:bg-accent/50 transition-all duration-150 ease-in-out`}
          >
            <span className="text-medium text-sm truncate">{file.name}</span>
            <div className="flex items-center justify-between gap-3 w-fit h-full">
              <span className="text-muted-foreground text-mono text-sm max-md:hidden">
                {new Date(file._creationTime).toDateString()}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size={"icon"} variant={"ghost"} className="!size-6">
                    <DotsThreeIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      toast.success("Download file")
                    }}
                  >
                    <DownloadSimpleIcon weight="bold" />
                    Download file
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => {
                      if (!organization) return
                      trashFile({ orgId: organization._id, fileId: file._id })
                    }}
                  >
                    <TrashIcon weight="bold" />
                    Move to trash
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
        {(!files || files.length === 0) && (
          <div className="text-muted-foreground grid place-items-center gap-4 sm:p-24">
            <FileDashedIcon size={56} weight={"thin"} />
            <p className="text-sm text-muted-foreground text-center">
              No files in {organization?.name}
            </p>
          </div>
        )}
      </ul>
    </>
  )
}
