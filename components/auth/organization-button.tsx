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
import { useOrganization } from "@/hooks/use-organization"
import CreateOrganizationButton from "./create-organization-button"

export default function OrganizationButton() {
  const router = useRouter()
  const { organization, loading } = useOrganization()
  const organizations = useQuery(api.organizations.getUserOrganizations)

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string | null | undefined>(
    loading ? undefined : (organization?.name ?? null),
  )

  React.useEffect(() => {
    if (organization) setValue(organization.name)
  }, [organization])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="ghost"
          aria-expanded={open}
          className="min-w-[200px] justify-start px-1.5"
        >
          {value && <Avatar name={organization?.name ?? undefined} />}
          {value === undefined ? (
            <div>loading...</div>
          ) : (
            <span className="w-full justify-between flex items-center gap-1.5">
              {value
                ? organizations?.find((org) => org.name === value)?.name
                : "Select organization..."}
              <ChevronsUpDown className="opacity-50" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[150px] p-0">
        <Command>
          <CommandInput placeholder="Search organizations..." className="h-9" />
          <CommandList>
            <CommandEmpty>No organizations found.</CommandEmpty>
            <CommandGroup>
              {organizations?.map((org) => (
                <CommandItem
                  key={org._id}
                  value={org.name}
                  onSelect={(selectedName) => {
                    setValue(selectedName === value ? "" : selectedName)
                    const selectedOrg = organizations?.find(
                      (o) => o.name === selectedName,
                    )
                    if (selectedOrg) {
                      router.push(`/o/${selectedOrg._id}`)
                    }
                    setOpen(false)
                  }}
                >
                  {org.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === org.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="grid px-1 pb-1">
          <CreateOrganizationButton />
        </div>
      </PopoverContent>
    </Popover>
  )
}
