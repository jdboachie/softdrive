'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  // BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

const capitalize = (s: string) =>
  s.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

const Breadcrumbs = () => {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const current = segments[2] ?? "files" // fallback to "files" if undefined

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage className="text-3xl font-medium">
            {capitalize(current)}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default Breadcrumbs