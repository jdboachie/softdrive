"use client"

import { SignInButton } from "@/components/auth/signin"

export default function SignIn() {

  return (
    <div className="flex flex-col gap-8 w-96 mx-auto h-screen justify-center items-center">
      <SignInButton />
    </div>
  )
}
