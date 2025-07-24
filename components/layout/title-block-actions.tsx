"use client"

import { usePathname } from "next/navigation"
import UploadButton from "../upload-button"
import EmptyTrashButton from "../empty-trash-button"
import CreateFolderButton from "../create-folder-button"

export default function TitleBlockActions() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const current = segments[2] ?? "files"

  if (current === "files" || current === "f")
    return (
      <div className="flex items-center gap-2">
        <CreateFolderButton />
        <UploadButton />
      </div>
    )
  if (current === "trash") return <EmptyTrashButton />
  else return undefined
}
