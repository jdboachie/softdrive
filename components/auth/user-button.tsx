"use client"

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useQuery } from "convex/react"
import { SignOutButton } from "./signout"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import UserImage from "../user-image"
import { Skeleton } from "../ui/skeleton"
import { GearFineIcon } from "@phosphor-icons/react"


export default function UserButton() {
  const user = useQuery(api.users.getCurrentUser)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full shadow-none size-9 p-px">
          {user ? <UserImage src={user?.image} /> : <Skeleton className="rounded-full" />}

        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="pb-0">{user?.name}</DropdownMenuLabel>
        <DropdownMenuLabel className="pt-0 text-muted-foreground font-normal">{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem><GearFineIcon weight='bold' />Settings</DropdownMenuItem>
          <DropdownMenuItem variant="destructive"> <SignOutButton /></DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
