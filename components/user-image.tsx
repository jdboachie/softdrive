import Image from "next/image"
import { Skeleton } from "./ui/skeleton"

export default function UserImage ({ src }: { src: string | undefined }) {
  if (src === undefined) {
    return <Skeleton className={`rounded-full`} />
  }
  return (
    <Image
      alt="recommender image"
      src={src}
      className={`rounded-full`}
      width={"500"}
      height={"500"}
    />
  )
}