"use client"

import { usePathname } from "next/navigation"
import UploadButton from "../action-buttons/upload-button"
import EmptyTrashButton from "../action-buttons/empty-trash-button"
import NewFolderButton from "../action-buttons/new-folder-button"

export default function TitleBlockActions() {
  const pathname = usePathname()

  if (!pathname.startsWith("/t")) {
    return undefined
  }

  const segments = pathname.split("/").filter(Boolean)
  const current = segments[2] ?? "files"

  if (current === "files" || current === "f" || current === "my-drive")
    return (
      <>
        <NewFolderButton />
        <UploadButton />
      </>
    )
  if (current === "trash") return <EmptyTrashButton />
  else return undefined
}
