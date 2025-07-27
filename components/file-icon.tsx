import {
  BracketsCurlyIcon,
  FileCsvIcon,
  FilePdfIcon,
  ImageSquareIcon,
  MicrosoftWordLogoIcon,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface FileIconProps {
  type: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function FileIcon({ type, size = "md", className }: FileIconProps) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-6",
    lg: "size-32",
  }

  const iconSize = {
    sm: 16,
    md: 24,
    lg: 128,
  }

  const weight = size === "md" ? "bold" : size === "sm" ? "regular" : "thin"

  const baseClasses = cn("shrink-0", sizeClasses[size], className)

  if (!type) {
    return <div className={cn("bg-accent rounded-sm", baseClasses)} />
  }

  if (type === "application/pdf") {
    return (
      <FilePdfIcon
        size={iconSize[size]}
        weight={weight}
        className={baseClasses}
      />
    )
  }

  if (type === "text/csv") {
    return (
      <FileCsvIcon
        size={iconSize[size]}
        weight={weight}
        className={baseClasses}
      />
    )
  }

  if (type === "application/json") {
    return (
      <BracketsCurlyIcon
        size={iconSize[size]}
        weight={weight}
        className={baseClasses}
      />
    )
  }

  if (type === "image/jpeg" || type === "image/png") {
    return (
      <ImageSquareIcon
        size={iconSize[size]}
        weight={weight}
        className={baseClasses}
      />
    )
  }

  if (
    type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return (
      <MicrosoftWordLogoIcon
        size={iconSize[size]}
        weight={weight}
        className={cn(baseClasses, "text-blue-500")}
      />
    )
  }

  return <div className={cn("rounded-sm bg-accent", baseClasses)} />
}
