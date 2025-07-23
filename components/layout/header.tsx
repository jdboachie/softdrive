import { SlashIcon } from "lucide-react"
import UserButton from "@/components/auth/user-button"
import { TabsIcon } from "@phosphor-icons/react/dist/ssr"
import TeamButton from "@/components/auth/team-button"
import TopNav from "./topnav"
import { Skeleton } from "@/components/ui/skeleton"
import FileSearch from "../file-search"

export default function Header() {
  return (
    <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
      <div className="size-full containor mx-auto flex justify-between gap-3 items-center p-4 px-5 pb-2">
        <div className="flex items-center w-fit gap-2">
          <TabsIcon size={32} weight="fill" className="mr-3" />
          <SlashIcon className="text-muted-foreground stroke-1 size-4" />
          <TeamButton />
        </div>
        <div className="flex items-center w-fit gap-2">
          <FileSearch />
          <UserButton />
        </div>
      </div>
      <TopNav />
    </header>
  )
}

export function HeaderSkeleton() {
  return (
    <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-sm w-full">
      <div className="size-full containor mx-auto flex justify-between gap-3 items-center p-4 px-5 pb-2">
        <div className="flex items-center w-fit gap-2">
          <TabsIcon weight="fill" size={32} className="mr-3" />
          <SlashIcon className="text-muted-foreground stroke-1 size-4" />
          <Skeleton className="w-56 h-8" />
        </div>
        <div className="flex items-center w-fit gap-2">
          <Skeleton className="rounded-full size-9 bg-accent" />
        </div>
      </div>
      <div className="containor mx-auto">
        <nav className="flex p-2 gap-1">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-20" />
        </nav>
      </div>
    </header>
  )
}
