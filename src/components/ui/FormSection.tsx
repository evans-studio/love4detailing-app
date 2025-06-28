import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const formSectionVariants = cva(
  "space-y-4 p-responsive rounded-lg border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        card: "bg-card border-border shadow-sm hover:shadow-md",
        glass: "bg-background/80 backdrop-blur-sm border-[var(--purple-200)]",
        highlight: "bg-[var(--purple-50)] border-[var(--color-primary)]",
      },
      spacing: {
        compact: "space-y-2 p-4",
        default: "space-y-4 p-responsive",
        loose: "space-y-6 p-responsive-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      spacing: "default",
    },
  }
)

interface FormSectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formSectionVariants> {
  title?: string
  description?: string
  required?: boolean
  error?: string
  children: React.ReactNode
  titleLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ 
    className,
    variant,
    spacing,
    title,
    description,
    required,
    error,
    children,
    titleLevel = 'h3',
    ...props 
  }, ref) => {
    const TitleComponent = titleLevel
    const sectionId = `section-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <section
        ref={ref}
        className={cn(formSectionVariants({ variant, spacing }), className)}
        aria-labelledby={title ? `${sectionId}-title` : undefined}
        aria-describedby={description ? `${sectionId}-description` : undefined}
        {...props}
      >
        {title && (
          <div className="space-y-1">
            <TitleComponent
              id={`${sectionId}-title`}
              className={cn(
                "font-semibold text-[var(--color-text)]",
                "text-responsive-lg",
                required && "after:content-['*'] after:ml-1 after:text-[var(--color-error)]"
              )}
            >
              {title}
            </TitleComponent>
            
            {description && (
              <p
                id={`${sectionId}-description`}
                className="text-sm text-muted-foreground leading-relaxed"
              >
                {description}
              </p>
            )}
            
            {error && (
              <p
                className="text-sm text-[var(--color-error)] font-medium"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
        )}
        
        <div className="space-y-4">
          {children}
        </div>
      </section>
    )
  }
)

FormSection.displayName = "FormSection"

export { FormSection, formSectionVariants } 