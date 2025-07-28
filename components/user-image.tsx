import Image from "next/image"
import { Skeleton } from "./ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserIcon } from "@phosphor-icons/react"

export default function UserImage({ src }: { src: string | undefined }) {
  return (
    <>
      {src ? (
        <Avatar>
          <AvatarImage asChild>
            <Image
              alt="recommender image"
              src={src}
              width={500}
              height={500}
              className="rounded-full"
            />
          </AvatarImage>
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Skeleton className="w-full h-full rounded-full" />
      )}
    </>
  )
}
