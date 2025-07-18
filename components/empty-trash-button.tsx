"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { TrashIcon } from "@phosphor-icons/react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useTeam } from "@/hooks/use-team"

export default function EmptyTrashButton() {
  const { team, loading } = useTeam()
  const emptyTrash = useMutation(api.files.deleteAllTrashedFiles)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={loading} variant={"outline"}>
          <TrashIcon weight="bold" /> Empty Trash
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all trashed files from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              if (!team) return
              await emptyTrash({ teamId: team._id })
            }}
          >Empty trash</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
