import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-deep-black transform translateZ(0) will-change-transform",
  {
    variants: {
      variant: {
        default:
          "gradient-brand text-white glow-purple hover:shadow-lg hover:shadow-accent-purple/40",
        secondary:
          "bg-mid-purple/30 text-gray-300 hover:bg-mid-purple/50 hover:text-white",
        alert:
          "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/30",
        muted:
          "bg-deep-black/50 text-gray-400 border border-mid-purple/20 hover:border-accent-purple/30",
        outline: 
          "border border-accent-purple text-accent-purple bg-transparent hover:gradient-brand hover:text-white glow-purple",
        success:
          "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800",
        glass:
          "glass-effect text-white hover:bg-accent-purple/20 hover:border-accent-purple/40",
        premium:
          "gradient-brand-reverse text-white glow-purple-strong hover:shadow-xl hover:shadow-accent-purple/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
