import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-all duration-300 touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)] hover:bg-[var(--purple-600)] text-white shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)]",
        destructive: "bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90",
        outline: "border border-[var(--color-primary)] bg-transparent hover:bg-[var(--purple-50)] text-[var(--color-primary)]",
        secondary: "bg-[var(--color-secondary)] text-[var(--color-accent)] border border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white",
        ghost: "hover:bg-[var(--purple-100)] text-[var(--color-primary)]",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
        success: "bg-[var(--color-success)] text-white hover:bg-[var(--color-success)]/90",
        warning: "bg-[var(--color-warning)] text-white hover:bg-[var(--color-warning)]/90",
      },
      size: {
        default: "h-12 px-6 text-base min-h-[48px]",
        sm: "h-10 px-4 text-sm min-h-[44px]", 
        lg: "h-14 px-8 text-lg min-h-[56px]",
        xl: "h-16 px-10 text-xl min-h-[64px]",
        icon: "h-12 w-12 min-h-[48px] min-w-[48px]",
        "icon-sm": "h-10 w-10 min-h-[44px] min-w-[44px]",
        "icon-lg": "h-14 w-14 min-h-[56px] min-w-[56px]",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
      loading: {
        true: "cursor-wait",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
      loading: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    asChild = false, 
    disabled,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const isDisabled = disabled || loading
    const displayText = loading && loadingText ? loadingText : children
    
    return (
      <Comp
        className={cn(buttonVariants({ 
          variant, 
          size, 
          fullWidth, 
          loading: loading ? true : false,
          className 
        }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <svg 
            className="mr-2 h-4 w-4 animate-spin" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="mr-2 flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className="truncate">{displayText}</span>
        {!loading && rightIcon && (
          <span className="ml-2 flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
