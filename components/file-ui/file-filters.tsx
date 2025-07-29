"use client"

import { useSearchParams, useRouter } from "next/navigation"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { XIcon } from "@phosphor-icons/react"

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
  const searchParams = useSearchParams()
  const router = useRouter()
  const typeFilter = searchParams.get("type") || ""

  const handleChange = (value: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (value) {
      params.set("type", value)
    } else {
      params.delete("type")
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="relative flex items-center w-fit">
      <Select value={typeFilter} onValueChange={handleChange}>
        <SelectTrigger className={`!w-fit max-w-56 bg-background ${typeFilter && 'pr-9'}`}>
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          {/* <SelectItem value="">All Types</SelectItem> */}
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
          onClick={() => handleChange("")}
        >
          <XIcon size={16} weight="bold" className="text-primary" />
        </button>
      )}
    </div>
  )
}
