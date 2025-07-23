"use client"

import { SignInButton } from "@/components/auth/signin"

export default function SignIn() {

  return (
    <div className="grid place-items-center h-screen">
      <div className="grid place-items-center gap-2">
        <h3 className="text-xl font-semibold">Welcome back</h3>
        <SignInButton />
      </div>
    </div>
  )
}
