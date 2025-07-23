import { Button } from "./ui/button"
import { FolderPlusIcon } from "@phosphor-icons/react/dist/ssr"

export default function NewFolderButton() {
  return (
    <Button variant={"outline"} size={"lg"}>
      <FolderPlusIcon size={32} className="size-5" /> New folder
    </Button>
  )
}
