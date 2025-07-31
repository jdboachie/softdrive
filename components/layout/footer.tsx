import Link from "next/link"
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="p-3 px-6 flex justify-between items-center containor">
        <span className="text-muted-foreground font-medium text-sm">
          &copy; 2025 Softdrive
        </span>
        <span className="text-sm">
          Built by Jude Boachie{" "}
          <Link href="https://www.github.com/jdboachie/softdrive">
            <GithubLogoIcon /> View the code
          </Link>
        </span>
      </div>
    </footer>
  )
}
