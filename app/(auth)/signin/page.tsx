"use client"

import { Button } from "@/components/ui/button"
import { useAuthActions } from "@convex-dev/auth/react"

export default function SignIn() {
  const { signIn } = useAuthActions()

  return (
    <div className="flex flex-col gap-8 w-96 mx-auto h-screen justify-center items-center">
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
    </div>
  )
}
