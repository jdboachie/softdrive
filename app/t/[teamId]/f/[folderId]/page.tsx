import { Id } from "@/convex/_generated/dataModel"
import FileExplorerView from "@/components/file-explorer-view"

export default async function Page({
  params,
}: {
  params: Promise<{ folderId: string; teamId: string }>
}) {
  const folderId = (await params).folderId as Id<"files"> | undefined
  return <FileExplorerView folderId={folderId} />
}
