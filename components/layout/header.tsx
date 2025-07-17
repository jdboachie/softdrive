import { SlashIcon } from "lucide-react"
import UserButton from "@/components/auth/user-button"
import { TabsIcon } from "@phosphor-icons/react/dist/ssr"
import OrganizationButton from "@/components/auth/organization-button"
import TopNav from "./topnav"

export default function Header() {
  return (
    <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
      <div className="size-full containor mx-auto flex justify-between gap-3 items-center p-4 px-5 pb-2">
        <div className="flex items-center w-fit gap-2">
          <TabsIcon size={32} weight="fill" className="mr-3" />
          <SlashIcon className="text-muted-foreground stroke-1 size-4" />
          <OrganizationButton />
        </div>
        <div className="flex items-center w-fit gap-2">
          <UserButton />
        </div>
      </div>
      <TopNav />
    </header>
  )
}
