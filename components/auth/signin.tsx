"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { Button } from "../ui/button"

export function SignInButton() {
  const { signIn } = useAuthActions()
  return (
    <Button
      size={"sm"}
      variant={"outline"}
      onClick={() => void signIn("google")}
    >
      Sign in with Google
    </Button>
  )
}
