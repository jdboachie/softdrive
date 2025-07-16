import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton rounded-md z-[-1]", className)}
      {...props}
    />
  )
}

export { Skeleton }
