import { Skeleton } from "../ui/skeleton"
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
      <div className="w-full flex max-sm:flex-col gap-6 items-center justify-start md:justify-between p-6 px-3 md:px-6 containor mx-auto">
        {title ? (
          <h1 className="text-3xl font-medium">{title}</h1>
        ) : (
          <Breadcrumbs />
        )}
        {children && (
          <div className="flex items-center gap-2 max-md:w-full max-md:grid max-md:grid-flow-col">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export function TitleBlockSkeleton() {
  return (
    <div className="border-b">
      <div className="flex items-center justify-between p-6 containor mx-auto">
        <Skeleton className="h-9 w-56" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    </div>
  )
}
