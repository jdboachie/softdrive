"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Avatar from "boring-avatars"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { useTeam } from "@/hooks/use-team"
import CreateTeamButton from "./create-team-button"
import { Skeleton } from "../ui/skeleton"

export default function TeamButton() {
  const router = useRouter()
  const { team, loading } = useTeam()
  const userTeams = useQuery(api.teams.getUserTeams)

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string | null | undefined>(
    loading ? undefined : (team?.name ?? null),
  )

  React.useEffect(() => {
    if (team) setValue(team.name)
  }, [team])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="ghost"
          aria-expanded={open}
          className="min-w-[200px] justify-start px-1.5"
        >
          {value && <Avatar name={team?.name ?? undefined} />}
          {value === undefined ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <span className="w-full justify-between flex items-center gap-1.5">
              {value
                ? userTeams?.find((team) => team.name === value)?.name
                : "Select team..."}
              <ChevronsUpDown className="opacity-50" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!min-w-[100px] p-0">
        <Command>
          <CommandInput placeholder="Search teams..." className="h-9" />
          <CommandList>
            <CommandEmpty>No teams found.</CommandEmpty>
            <CommandGroup>
              {userTeams?.map((team) => (
                <CommandItem
                  key={team._id}
                  value={team.name}
                  onSelect={(selectedName) => {
                    setValue(selectedName === value ? "" : selectedName)
                    const selectedTeam = userTeams?.find(
                      (t) => t.name === selectedName,
                    )
                    if (selectedTeam) {
                      router.push(`/t/${selectedTeam._id}`)
                    }
                    setOpen(false)
                  }}
                >
                  {team.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === team.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="grid px-1 pb-1">
          <CreateTeamButton />
        </div>
      </PopoverContent>
    </Popover>
  )
}
