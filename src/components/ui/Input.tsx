import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass' | 'premium'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: "bg-deep-black border-mid-purple/30 text-white placeholder:text-gray-400 focus:border-accent-purple focus:ring-accent-purple/20",
      glass: "glass-effect text-white placeholder:text-gray-400 focus:border-accent-purple/50 focus:ring-accent-purple/20",
      premium: "bg-gradient-to-r from-deep-black to-overlay-purple-black border-accent-purple/40 text-white placeholder:text-gray-300 focus:border-accent-purple focus:ring-accent-purple/30 focus:from-overlay-purple-black focus:to-deep-black"
    }
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border px-4 py-3 text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-deep-black disabled:cursor-not-allowed disabled:opacity-50 transform translateZ(0) will-change-transform",
          variantClasses[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input } 