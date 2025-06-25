import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-[#8A2B85] text-white hover:bg-[#8A2B85]/90 shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-[#8A2B85] to-[#BA0C2F] text-white hover:from-[#BA0C2F] hover:to-[#8A2B85] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
        theme: "bg-[#8A2B85] text-white hover:bg-[#8A2B85]/90 shadow-sm hover:shadow-md transition-all duration-200",
        themeSecondary: "border-2 border-[#8A2B85] bg-transparent text-[#8A2B85] hover:bg-[#8A2B85] hover:text-white transition-all duration-200", 
        themeGhost: "text-[#C7C7C7] hover:bg-[#8A2B85]/10 hover:text-[#F8F4EB] transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[40px]",
        sm: "h-8 sm:h-9 rounded-md px-3 sm:px-4 text-xs sm:text-sm min-h-[36px]",
        lg: "h-12 sm:h-12 lg:h-14 rounded-md px-6 sm:px-8 lg:px-10 text-sm sm:text-base lg:text-lg min-h-[48px]",
        icon: "h-10 w-10 min-h-[40px] min-w-[40px]",
        xs: "h-8 px-3 text-xs rounded min-h-[32px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
