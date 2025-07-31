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
import UserImage from "./user-image"
import { Skeleton } from "../ui/skeleton"
import { useRouter } from "next/navigation"
import { UserIcon, UsersIcon, TabsIcon } from "@phosphor-icons/react"
import { CogIcon } from "lucide-react"
import ThemeToggle from "../theme/theme-toggle"
import { useTeam } from "@/hooks/use-team"

export default function UserButton() {
  const router = useRouter()
  const { team } = useTeam()
  const user = useQuery(api.users.getCurrentUser)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full shadow-none size-9 p-px"
        >
          {user ? (
            <UserImage src={user?.image} />
          ) : (
            <Skeleton className="rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-center gap-2 px-2">
          <UserImage src={user?.image} className="size-9" />
          <span>
            <DropdownMenuLabel className="pb-0">{user?.name}</DropdownMenuLabel>
            <DropdownMenuLabel className="pt-0 text-muted-foreground font-normal">
              {user?.email}
            </DropdownMenuLabel>
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={`!justify-between`}
            onClick={() => router.push("/t")}
          >
            Drive
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`!justify-between`}
            onClick={() => {
              if (team) router.push(`/t/${team._id}/team`)
            }}
          >
            Team
            <UsersIcon weight="bold" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`!justify-between`}
            onClick={() => router.push("/account")}
          >
            Account
            <UserIcon weight="bold" />
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`!justify-between`}
            onClick={() => router.push("/account/settings")}
          >
            Settings
            <CogIcon />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={`!justify-between`}>
          Find <kbd>F</kbd>
        </DropdownMenuItem>
        <span className="w-full p-2 text-sm flex items-center justify-between">
          Theme <ThemeToggle />
        </span>
        <DropdownMenuSeparator />
        <DropdownMenuItem className={`!justify-between`}>
          Home page <TabsIcon weight="fill" />
        </DropdownMenuItem>
        <DropdownMenuItem variant={"destructive"}>
          <SignOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
