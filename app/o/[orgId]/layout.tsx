import UploadButton from '@/components/upload-button'
import TitleBlock from '@/components/layout/title-block'

export default function Layout({children}: {children?: React.ReactNode}) {
  return (
    <>
      <TitleBlock title="Your files">
        <UploadButton />
      </TitleBlock>
      {children}
    </>
  )
}
