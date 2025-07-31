// @/hooks/use-file-explorer.ts
"use client"

import * as React from "react"

type ViewType = "list" | "grid"
type FileTypeFilter =
  | ""
  | "application/pdf"
  | "text/csv"
  | "text/json"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "image/jpeg"
  | "folder"

const VIEWS: ViewType[] = ["list", "grid"]
const LOCAL_STORAGE_KEY = "file-view"

interface FileExplorerContextValue {
  view: ViewType
  changeView: (value: ViewType) => void
  typeFilter: FileTypeFilter
  setTypeFilter: (value: FileTypeFilter) => void
}

const FileExplorerContext = React.createContext<FileExplorerContextValue | undefined>(undefined)

export function FileExplorerProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = React.useState<ViewType>("list")
  const [typeFilter, setTypeFilter] = React.useState<FileTypeFilter>("")

  React.useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved && VIEWS.includes(saved as ViewType)) {
      setView(saved as ViewType)
    }
  }, [])

  const changeView = (value: ViewType) => {
    setView(value)
    localStorage.setItem(LOCAL_STORAGE_KEY, value)
  }

  return (
    <FileExplorerContext.Provider
      value={{ view, changeView, typeFilter, setTypeFilter }}
    >
      {children}
    </FileExplorerContext.Provider>
  )
}

export function useFileExplorer() {
  const context = React.useContext(FileExplorerContext)
  if (!context) throw new Error("useFileExplorer must be used within FileExplorerProvider")
  return context
}
