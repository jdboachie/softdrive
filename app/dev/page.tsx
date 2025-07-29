"use client"

import { toast } from "sonner"
import {
  GoogleDriveLogoIcon,
  UploadSimpleIcon,
  FolderOpenIcon,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
  import { ChevronDownIcon } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"
import { Button, buttonVariants } from "@/components/ui/button"

const baseClasses = "inline-flex items-center justify-center"

export default function Page() {
  const { signIn, signOut } = useAuthActions()

  return (
    <div className="p-3">
      <Button onClick={() => signIn("anonymous", { redirectTo: "/t" })}>
        Sign in as guest
      </Button>
      <Button onClick={() => signOut()}>Sign out</Button>
      <span className="flex flex-col gap-3 bg-primary-foreground rounded-md p-3">
        <p className="font-medium">Button with dropdown</p>
        <div
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            "px-0 py-0 gap-0 w-fit hover:bg-transparent divide-x divide-blue-700/50 dark:divide-blue-400/50",
          )}
        >
          <button
            onClick={() => toast.info("Primary action")}
            className={cn(
              baseClasses,
              "px-4 py-2 gap-2 size-full bg-primary text-primary-foreground rounded-l-sm hover:bg-primary/90 hover:text-primary-foreground",
            )}
          >
            <UploadSimpleIcon weight="bold" /> Upload file
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  baseClasses,
                  "bg-primary text-primary-foreground rounded-r-sm size-10 min-w-10 hover:bg-primary/90 hover:text-primary-foreground",
                )}
              >
                <ChevronDownIcon />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FolderOpenIcon /> Upload folder
              </DropdownMenuItem>
              <DropdownMenuItem>
                <GoogleDriveLogoIcon /> Import from Google drive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </span>
    </div>
  )
}
