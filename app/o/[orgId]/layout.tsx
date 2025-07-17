import UploadButton from "@/components/upload-button"
import TitleBlock from "@/components/layout/title-block"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header />
      <TitleBlock>
        <UploadButton />
      </TitleBlock>
      <div className="containor mx-auto min-h-[calc(100dvh-244px)] grid sm:p-6 p-3">{children}</div>
      <Footer />
    </>
  )
}
