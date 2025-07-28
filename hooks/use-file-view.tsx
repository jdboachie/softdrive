"use client"

import * as React from "react"

type ViewType = "list" | "grid"
const VIEWS: ViewType[] = ["list", "grid"]
const LOCAL_STORAGE_KEY = "file-view"

interface FileViewContextValue {
  view: ViewType
  changeView: (value: ViewType) => void
}

const FileViewContext = React.createContext<FileViewContextValue | undefined>(undefined)

export function FileViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = React.useState<ViewType>("list")

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
    <FileViewContext.Provider value={{ view, changeView }}>
      {children}
    </FileViewContext.Provider>
  )
}

export function useFileView() {
  const context = React.useContext(FileViewContext)
  if (!context) throw new Error("useFileView must be used within FileViewProvider")
  return context
}
