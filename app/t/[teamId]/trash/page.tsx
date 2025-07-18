import TrashedFileList from "@/components/trashed-file-list"
import FileSearch from "@/components/file-search"

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <FileSearch placeholder="Search trash..." />
      <TrashedFileList />
    </div>
  )
}
