"use client"

import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { useDebouncedCallback } from "use-debounce"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { useRouter, useSearchParams } from "next/navigation" //
// import { Button } from "./ui/button"

export default function FileSearch({ placeholder }: { placeholder?: string }) {
  const router = useRouter()
  const searchQuery = useSearchParams().get("q")

  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = useDebouncedCallback(() => {
    router.push(`?q=${inputRef.current?.value}`)
  }, 500)

  return (
    <div className="max-w-md relative rounded-md bg-background">
      <MagnifyingGlassIcon className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
      <Input
        className="!px-8 !bg-transparent"
        placeholder={placeholder ?? "Search files..."}
        ref={inputRef}
        onChange={handleSearch}
        defaultValue={searchQuery ?? undefined}
      />
    </div>
  )
}
