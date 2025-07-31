"use client"

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { XIcon } from "@phosphor-icons/react"
import { useFileExplorer } from "@/hooks/use-file-explorer"

const FILE_TYPES = [
  { value: "application/pdf", label: "pdf" },
  { value: "text/csv", label: "csv" },
  { value: "text/json", label: "json" },
  {
    value:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    label: "Word Document",
  },
  { value: "image/jpeg", label: "image" },
  { value: "folder", label: "folder" },
]

export default function FileFilters() {
  const { typeFilter, setTypeFilter } = useFileExplorer()

  return (
    <div className="relative flex items-center w-fit">
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger
          className={`!w-fit max-w-56 bg-background ${typeFilter && "pr-9"}`}
        >
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          {FILE_TYPES.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {typeFilter && (
        <button
          type="button"
          aria-label="Clear type filter"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent"
          onClick={() => setTypeFilter("")}
        >
          <XIcon size={16} weight="bold" className="text-primary" />
        </button>
      )}
    </div>
  )
}
