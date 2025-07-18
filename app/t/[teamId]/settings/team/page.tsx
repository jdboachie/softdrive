'use client'

import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { useTeam } from "@/hooks/use-team"
import { useMutation } from "convex/react"

export default function SettingsPage() {
  const { team } = useTeam()
  const createInvite = useMutation(api.invites.createInvite)

  const handleClick = async () => {
    if (!team) return
    await createInvite({
      teamId: team._id,
      role: "read",
      inviteeEmail: "jdboachie@gmail.com",
    })
  }

  return (
    <div className="w-full">
      <div className="border rounded-lg w-full p-5 bg-background flex flex-col gap-5">
        <h2 className="text-xl font-medium">Invites</h2>
        <div className="">
          <Button onClick={handleClick}>Create invite</Button>
        </div>
      </div>
    </div>
  )
}
