import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-[0.5rem] font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 touch-manipulation shadow-sm hover:shadow-md transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-deep-purple hover:bg-deep-purple/90 text-canvas-white",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-deep-purple bg-background hover:bg-deep-purple/10 hover:text-deep-purple",
        secondary:
          "bg-true-black text-canvas-white border border-deep-purple hover:bg-deep-purple hover:text-canvas-white",
        ghost: "hover:bg-deep-purple/10 hover:text-deep-purple",
        link: "text-deep-purple underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 sm:h-12 lg:h-14 px-6 sm:px-8 lg:px-10 text-sm sm:text-base lg:text-lg min-h-[48px]",
        sm: "h-10 px-4 text-sm min-h-[44px]",
        lg: "h-14 px-8 text-lg min-h-[56px]",
        icon: "h-12 w-12 min-h-[48px] min-w-[48px]",
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
