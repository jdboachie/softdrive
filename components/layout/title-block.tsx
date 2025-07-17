import Breadcrumbs from "./breadcrumbs"

export default function TitleBlock({
  title,
  children,
}: {
  title?: string
  children?: React.ReactNode
  }) {
  return (
    <div className="border-b">
      <div className="flex items-center justify-between p-6 containor mx-auto">
        {title && <h1 className="text-3xl font-medium">{title}</h1>}
        <Breadcrumbs />
        {children && children}
      </div>
    </div>
  )
}
