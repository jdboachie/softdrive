
import { Doc } from "@/convex/_generated/dataModel"
import FileCard from "./file-card"

export function ExplorerGridView({ files }: { files: Doc<"files">[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-7 space-y-8">
      {files.map((file: Doc<"files">) => (
        <FileCard key={file._id} file={file} />
      ))}
      {files.length === 0 && (
        <div className="col-span-full text-center text-sm text-muted-foreground">
          No files found.
        </div>
      )}
    </div>
  )
}