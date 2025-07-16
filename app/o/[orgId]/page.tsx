import FileList from "@/components/file-list"

export default async function Page({
  params,
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params
  return (
    <div className="min-h-[calc(100dvh-239px)] p-6">
      <span className="sr-only"> My org ID: {orgId}</span>
      <FileList />
    </div>
  )
}