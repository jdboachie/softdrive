import FileList from "@/components/file-list"
import TrashedFileList from "@/components/trashed-file-list"

export default async function Page({
  params,
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params
  return (
    <div className="min-h-[calc(100dvh-239px)] p-6">
      <p className="mb-4">All files</p>
      <span className="sr-only"> My org ID: {orgId}</span>
      <FileList />
      <p className="mt-8 mb-4">Trashed files</p>
      <TrashedFileList />
    </div>
  )
}