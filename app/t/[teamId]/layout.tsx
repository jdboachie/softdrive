import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import TitleBlock from "@/components/layout/title-block"
import TitleBlockActions from "@/components/layout/title-block-actions"

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header />
      <TitleBlock>
        <TitleBlockActions />
      </TitleBlock>
      <div className="containor mx-auto min-h-[calc(100dvh-244px)] grid sm:p-6 p-3">
        {children}
      </div>
      <Footer />
    </>
  )
}
