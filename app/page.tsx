import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-300 relative overflow-hidden">
      {/* Decorative gradient shapes */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/30 to-blue-600/10 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-300/20 to-blue-500/10 rounded-full blur-2xl z-0" />
      <section className="relative z-10 flex flex-col items-center text-center px-6 py-24 gap-8 max-w-2xl">
        <h1 className="text-5xl sm:text-6xl font-bold text-blue-900 drop-shadow-lg leading-tight">
          Welcome to <span className="text-blue-600">Softdrive</span>
        </h1>
        <p className="text-lg sm:text-xl text-blue-800/90 mt-2 font-medium">
          Your personal drive in the cloud. Effortlessly store, organize, and access your files from anywhere, on any device. <br className="hidden sm:inline" />
          <span className="text-blue-700 font-semibold">Fast. Secure. Limitless.</span>
        </p>
        <ul className="text-blue-900/80 text-base sm:text-lg space-y-2 mt-4 mb-6">
          <li>• <span className="font-semibold">Lightning-fast uploads</span> and instant previews</li>
          <li>• <span className="font-semibold">Organize</span> with folders, search, and favorites</li>
          <li>• <span className="font-semibold">Access anywhere</span> — desktop, tablet, or mobile</li>
          <li>• <span className="font-semibold">Enterprise-grade security</span> for your peace of mind</li>
        </ul>
        <Link href={"/t"} className={buttonVariants({ size: "lg", className: "px-8 py-4 text-lg font-semibold shadow-xl bg-blue-600 hover:bg-blue-700 text-white transition" })}>
          Get Started
        </Link>
      </section>
      <footer className="absolute bottom-4 w-full text-center text-xs text-blue-900/60 z-10">
        &copy; {new Date().getFullYear()} Softdrive. All rights reserved.
      </footer>
    </main>
  )
}
