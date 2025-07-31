"use client"

import { useRouter } from "next/navigation"
import { useConvexAuth } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { LogOutIcon } from "lucide-react"

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth()
  const { signOut } = useAuthActions()
  const router = useRouter()

  return (
    <>
      {isAuthenticated && (
        <span
          onClick={() =>
            void signOut().then(() => {
              router.push("/signin")
            })
          }
          className="size-full flex items-center justify-between"
        >
          Sign out
          <LogOutIcon className="text-destructive" />
        </span>
      )}
    </>
  )
}
