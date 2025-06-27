import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'search' | 'minimal'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: "bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-[#8A2B85] focus:ring-[#8A2B85]/20",
      search: "bg-muted/50 border-muted text-foreground placeholder:text-muted-foreground focus:bg-background focus:border-[#8A2B85]",
      minimal: "bg-transparent border-transparent text-foreground placeholder:text-muted-foreground focus:border-[#8A2B85] focus:bg-muted/20 border-b-2 rounded-none"
    }
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 sm:h-11 lg:h-12 w-full rounded-[0.75rem] border px-3 sm:px-4 py-2 text-base sm:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 touch-manipulation",
          variantClasses[variant],
          className
        )}
        ref={ref}
        style={{
          fontSize: '16px', // Prevent zoom on iOS
          ...props.style
        }}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input } 