import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputGroupVariants = cva(
  "space-y-1",
  {
    variants: {
      layout: {
        default: "space-y-1",
        inline: "flex items-center space-x-3 space-y-0",
        grid: "grid gap-4",
        responsive: "space-y-4 sm:space-y-0 sm:grid sm:gap-4",
      },
      columns: {
        1: "grid-cols-1",
        2: "sm:grid-cols-2",
        3: "sm:grid-cols-2 lg:grid-cols-3",
        4: "sm:grid-cols-2 lg:grid-cols-4",
      },
      spacing: {
        compact: "space-y-1 gap-2",
        default: "space-y-1 gap-4",
        loose: "space-y-2 gap-6",
      },
    },
    defaultVariants: {
      layout: "default",
      columns: 1,
      spacing: "default",
    },
  }
)

interface InputGroupProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    VariantProps<typeof inputGroupVariants> {
  children: React.ReactNode
  label?: string
  description?: string
  required?: boolean
  error?: string
  disabled?: boolean
}

const InputGroup = React.forwardRef<HTMLFieldSetElement, InputGroupProps>(
  ({
    className,
    layout,
    columns,
    spacing,
    children,
    label,
    description,
    required,
    error,
    disabled,
    ...props
  }, ref) => {
    const groupId = `input-group-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <fieldset
        ref={ref}
        className={cn(
          "space-y-3",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        disabled={disabled}
        aria-labelledby={label ? `${groupId}-legend` : undefined}
        aria-describedby={
          description ? `${groupId}-description` :
          error ? `${groupId}-error` :
          undefined
        }
        {...props}
      >
        {label && (
          <legend
            id={`${groupId}-legend`}
            className={cn(
              "text-sm font-medium text-[var(--color-text)] mb-2",
              required && "after:content-['*'] after:ml-0.5 after:text-[var(--color-error)]"
            )}
          >
            {label}
          </legend>
        )}
        
        {description && (
          <p
            id={`${groupId}-description`}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            {description}
          </p>
        )}
        
        {error && (
          <p
            id={`${groupId}-error`}
            className="text-sm text-[var(--color-error)] font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
        
        <div
          className={cn(
            inputGroupVariants({ layout, columns, spacing }),
            layout === "grid" || layout === "responsive" ? 
              inputGroupVariants({ columns }) : ""
          )}
        >
          {children}
        </div>
      </fieldset>
    )
  }
)

InputGroup.displayName = "InputGroup"

export { InputGroup, inputGroupVariants } 