"use client"

// import { SignOutButton } from "@/components/auth/signout"
import Component from "./component"

export default function Home() {
  return (
    <div className={`flex flex-col min-h-screen p-6`}>
      <h1 className="text-xl font-bold">Your files</h1>
      {/* <SignOutButton /> */}
      <Component />
    </div>
  )
}
