"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { ChevronDownIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"

type Action = {
  label: string
  icon?: ReactNode
  disabled?: boolean
  onClick: () => void
}

type SplitButtonProps = {
  children: ReactNode
  onClick: () => void
  actions?: Action[]
  className?: string
  disabled?: boolean
} & VariantProps<typeof buttonVariants>

export function SplitButton({
  children,
  onClick,
  actions,
  className,
  disabled,
  size = "default",
  variant = "default",
}: SplitButtonProps) {
  const hasActions = actions && actions.length > 0

  return (
    <div className={cn("inline-flex", className)}>
      <button
        disabled={disabled ?? false}
        onClick={onClick}
        className={cn(
          buttonVariants({ variant, size }),
          hasActions ? "rounded-r-none grow" : "w-full",
        )}
      >
        {children}
      </button>

      {hasActions && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={disabled ?? false}>
            <button
              disabled={disabled ?? false}
              className={cn(
                buttonVariants({ variant, size }),
                "rounded-l-none px-2 max-w-10 w-full flex justify-center",
              )}
            >
              <ChevronDownIcon />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {actions.map((action, i) => (
              <DropdownMenuItem
                key={i}
                onClick={action.onClick}
                disabled={action.disabled ?? false}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
