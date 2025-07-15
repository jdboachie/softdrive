import React from "react"

export default function TitleBlock({
  title,
  children,
}: {
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between p-6 sm:py-8 border-b">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children && children}
    </div>
  )
}
