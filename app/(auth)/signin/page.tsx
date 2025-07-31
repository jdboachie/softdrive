"use client"

import { SignInButton } from "@/components/auth/signin"
import { HeaderSkeleton } from "@/components/layout/header"
import { TitleBlockSkeleton } from "@/components/layout/title-block"

export default function SignIn() {
  return (
    <div className="flex flex-col size-full relative">
      <HeaderSkeleton />
      <TitleBlockSkeleton />
      <div className="z-50 h-screen overflow-hidden w-screen absolute inset-0 grid place-items-center gap-2 backdrop-blur-md">
        <div className="flex max-sm:flex-col sm:items-center gap-4">
          Sign in to continue
          <SignInButton />
        </div>
      </div>
    </div>
  )
}
