import Link from "next/link"
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="font-medium px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
        <span>&copy; 2025 Softdrive</span>
        <div className="flex items-center gap-1">
          by Jude.
          <Link
            href="https://www.github.com/jdboachie/softdrive"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}View code
            <GithubLogoIcon weight="fill" className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
