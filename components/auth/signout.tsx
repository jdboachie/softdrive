"use client"

import { useRouter } from "next/navigation"
import { useConvexAuth } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"

import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth()
  const { signOut } = useAuthActions()
  const router = useRouter()

  return (
    <>
      {isAuthenticated && (
        <Button
          variant={"secondary"}
          size={"sm"}
          onClick={() =>
            void signOut().then(() => {
              router.push("/signin")
            })
          }
        >
          Sign out
        </Button>
      )}
    </>
  )
}
