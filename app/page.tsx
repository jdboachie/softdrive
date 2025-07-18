import { LinkIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function Home() {
  return (
    <div className={`flex flex-col place-items-center min-h-screen p-6`}>
      <Link href={'/t'} className="flex gap-2">App <LinkIcon /></Link>
    </div>
  )
}
