import { FileViewProvider } from "@/hooks/use-file-view"

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <FileViewProvider>
          {children}
      </FileViewProvider>
    </>
  )
}
