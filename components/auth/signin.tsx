"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import { useAuthActions } from "@convex-dev/auth/react"

export function SignInButton() {
  const { signIn } = useAuthActions()
  return (
    <Button
      size={"lg"}
      variant={"outline"}
      onClick={() => void signIn("google", { redirectTo: "/o" })}
    >
      <Image
        src={'/google.webp'}
        alt="Google Icon"
        height={'500'}
        width={'500'}
        className="size-4"
      />
      Sign in with Google
    </Button>
  )
}
