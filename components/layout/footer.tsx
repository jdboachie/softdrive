import Link from "next/link"
import {
  DotIcon,
  CopyrightIcon,
  GithubLogoIcon,
  ArrowSquareOutIcon,
} from "@phosphor-icons/react/dist/ssr"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="font-medium px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
        <span>
          <CopyrightIcon weight="bold" className="size-3" /> 2025 Softdrive
        </span>
        <div className="flex items-center gap-1">
          A project by{" "}
          <Link
            href={"https://jude.vercel.app"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
          >
            Jude <ArrowSquareOutIcon className="size-3" />
          </Link>
          <DotIcon weight='fill' className="size-3" />
          <Link
            href="https://www.github.com/jdboachie/softdrive"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            View code
            <GithubLogoIcon weight="fill" className="size-3" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
