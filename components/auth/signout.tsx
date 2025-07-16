"use client"

import { useRouter } from "next/navigation"
import { useConvexAuth } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"

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
          className="size-full"
        >
          Sign out
        </span>
      )}
    </>
  )
}
