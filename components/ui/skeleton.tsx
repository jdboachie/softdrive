import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton rounded-sm z-[-1] bg-muted dark:bg-background", className)}
      {...props}
    />
  )
}

export { Skeleton }
