"use client"

import { useRef } from "react"
import { Input } from "@/components/ui/input"
import { useDebouncedCallback } from "use-debounce"
import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { useSearchParams } from "next/navigation" // useRouter,
import { Button } from "./ui/button"

export default function FileSearch({ placeholder }: { placeholder?: string }) {
  // const router = useRouter()
  const searchQuery = useSearchParams().get("q")

  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = useDebouncedCallback(() => {
    // router.push  (`?q=${inputRef.current?.value}`)
  }, 500)

  return (
    <>
      <div className="max-w-md relative rounded-md max-sm:hidden">
        <MagnifyingGlassIcon className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
        <Input
          type="search"
          className="!px-8 shadow-none"
          placeholder={placeholder ?? "Search files..."}
          ref={inputRef}
          onChange={handleSearch}
          defaultValue={searchQuery ?? undefined}
        />
      </div>
      <Button
        size={"icon"}
        variant={"outline"}
        className="sm:hidden shadow-none rounded-full bg-transparent"
      >
        <MagnifyingGlassIcon />
      </Button>
    </>
  )
}
