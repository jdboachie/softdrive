"use client"

import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { useMutation } from "convex/react"
import { useOrganization } from "@/hooks/use-organization"
import { CloudArrowUpIcon } from "@phosphor-icons/react"

export default function UploadButton() {
  const { organization } = useOrganization()
  const createFile = useMutation(api.files.createFile)

  return (
    <Button
      onClick={() => {
        if (!organization) return
        createFile({ name: "Test file", orgId: organization._id })
      }}
    >
      <CloudArrowUpIcon weight='duotone' size={32} />
      Upload file
    </Button>
  )
}
