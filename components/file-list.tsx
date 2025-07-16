"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Button } from "./ui/button"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useOrganization } from "@/hooks/use-organization"
import {
  DotsThreeIcon,
  DownloadSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react"

export default function FileList() {
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
    <ul className="grid w-full">
      {files?.map((file) => (
        <li
          key={file._id}
          className={`justify-between flex items-center p-2 pl-3 rounded-sm odd:bg-accent/70 odd:dark:bg-accent/30 even:bg-transparent hover:bg-background dark:hover:bg-accent/50 transition-all duration-150 ease-in-out`}
        >
          <span className="text-medium text-sm truncate">{file.name}</span>
          <div className="flex items-center justify-between gap-3 w-fit h-full">
            <span className="text-muted-foreground text-mono text-sm">
              {new Date(file._creationTime).toDateString()}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger>
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
                  onClick={() => {
                    toast.info("This will delete a file", {
                      description: "Only do this if you're sure",
                    })
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
        <span className="self-center text-muted-foreground text-center text-sm">
          No files in {organization?.name}
        </span>
      )}
    </ul>
  )
}
