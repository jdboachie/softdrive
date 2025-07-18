import Link from "next/link";

export default function Home() {
  return (
    <div className={`flex flex-col place-items-center min-h-screen p-6 gap-12`}>
      <Link href={'/t'} className="flex gap-2">go to app -{">"}</Link>
    </div>
  )
}
