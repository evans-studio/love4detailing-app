import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-purple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform translateZ(0) will-change-transform",
  {
    variants: {
      variant: {
        default: "bg-deep-purple text-primary-text hover:bg-rich-crimson hover:shadow-lg hover:shadow-deep-purple/30 hover:-translate-y-0.5 active:translate-y-0",
        destructive: "bg-gradient-to-r from-red-600 to-red-700 text-primary-text hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/30",
        outline: "border-2 border-deep-purple bg-transparent text-primary-text hover:bg-deep-purple/20 hover:shadow-lg hover:shadow-deep-purple/20",
        secondary: "bg-sidebar-bg text-primary-text hover:bg-rich-crimson/20 hover:shadow-lg hover:shadow-rich-crimson/30",
        ghost: "text-primary-text hover:bg-deep-purple/10 hover:text-deep-purple",
        link: "text-deep-purple underline-offset-4 hover:underline hover:text-primary-text transition-colors",
        premium: "bg-gradient-to-r from-deep-purple to-rich-crimson text-primary-text hover:shadow-xl hover:shadow-deep-purple/40 hover:-translate-y-1 active:translate-y-0 relative overflow-hidden",
        glass: "bg-true-black/80 backdrop-blur-sm border border-deep-purple/30 text-primary-text hover:bg-deep-purple/20 hover:border-deep-purple/40 hover:shadow-lg hover:shadow-deep-purple/20"
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-14 rounded-lg px-8 text-base",
        xl: "h-16 rounded-xl px-10 text-lg",
        icon: "h-10 w-10 rounded-lg",
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
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // For premium variant with asChild, we can't add the shimmer effect as it would create
    // multiple children for the Slot component. Instead, we'll apply the shimmer via CSS only.
    const shimmerClass = variant === "premium" ? "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:-skew-x-12 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:pointer-events-none" : ""
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), shimmerClass, className)}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
