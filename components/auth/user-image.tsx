import Image from "next/image"
import { Skeleton } from "../ui/skeleton"
import { cn } from "@/lib/utils"

export default function UserImage({
  src,
  className,
}: {
  src: string | undefined
  className?: string
}) {
  if (src === undefined) {
    return <Skeleton className={`rounded-full size-full`} />
  }
  return (
    <Image
      alt="recommender image"
      src={src}
      className={cn(`rounded-full`, className)}
      width={"500"}
      height={"500"}
    />
  )
}
