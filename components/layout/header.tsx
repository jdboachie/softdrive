import { SlashIcon } from "lucide-react"
import UserButton from "@/components/auth/user-button"
import { TabsIcon } from "@phosphor-icons/react/dist/ssr"
import OrganizationButton from "@/components/auth/organization-button"
import { SignOutButton } from "../auth/signout"

export default function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm">
      <div className="size-full max-w-screen-2xl mx-auto flex justify-between gap-3 items-center p-3 px-4">
        <div className="flex items-center w-fit gap-2">
          <TabsIcon size={32} weight="fill" className="mr-3" />
          <SlashIcon className="text-muted-foreground stroke-1 size-4" />
          <OrganizationButton />
        </div>
        <div className="flex items-center w-fit gap-2">
          <SignOutButton />
          <UserButton />
        </div>
      </div>
    </header>
  )
}
