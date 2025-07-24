"use client"

import { useRouter } from "next/navigation"
import { useConvexAuth } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { SignOutIcon } from "@phosphor-icons/react"

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
          className="size-full flex items-center"
        >
          <SignOutIcon className="mr-2" weight="bold" />
          Sign out
        </span>
      )}
    </>
  )
}
