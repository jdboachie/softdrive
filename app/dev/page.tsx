"use client"

import { toast } from "sonner"
import { FilePlusIcon } from "@phosphor-icons/react"
import { SplitButton } from "@/components/ui/split-button"

export default function Page() {
  return (
    <div className="h-screen grid place-items-center">
      <SplitButton size={"lg"} onClick={() => toast.info("Primary action")}>
        <FilePlusIcon weight="bold" className="!size-4.5" />
        Upload file
      </SplitButton>
    </div>
  )
}
