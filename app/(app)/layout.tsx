import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import TitleBlock from "@/components/layout/title-block"
import TitleBlockActions from "@/components/layout/title-block-actions"
import { FileExplorerProvider } from "@/hooks/use-file-explorer"

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <FileExplorerProvider>
      <Header />
      <TitleBlock>
        <TitleBlockActions />
      </TitleBlock>
      <div className="containor mx-auto min-h-[calc(100dvh-248px)] grid sm:p-6 p-4 pb-12">
        {children}
      </div>
      <Footer />
    </FileExplorerProvider>
  )
}
