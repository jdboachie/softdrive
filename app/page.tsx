import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function Home() {
  return (
    <div className={`flex flex-col place-items-center min-h-screen gap-12`}>
      <Link href={"/t"} className={buttonVariants({ size: "sm" })}>
        Go to app
      </Link>
    </div>
  )
}
