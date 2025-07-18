"use client"

import { usePathname } from "next/navigation"
import UploadButton from "../upload-button"
import EmptyTrashButton from "../empty-trash-button"

export default function TitleBlockActions() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const current = segments[2] ?? "files"

  if (current === "files") return <UploadButton />
  if (current === "trash")
    return <EmptyTrashButton />
  else return undefined
}
