import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const stepHeaderVariants = cva(
  "flex flex-col space-y-2 mb-6",
  {
    variants: {
      variant: {
        default: "",
        compact: "mb-4 space-y-1",
        prominent: "mb-8 space-y-3",
      },
      alignment: {
        left: "text-left",
        center: "text-center items-center",
        right: "text-right items-end",
      },
    },
    defaultVariants: {
      variant: "default",
      alignment: "left",
    },
  }
)

const stepIndicatorVariants = cva(
  "flex items-center space-x-2 mb-4",
  {
    variants: {
      variant: {
        default: "",
        minimal: "mb-2",
        prominent: "mb-6",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface StepHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepHeaderVariants> {
  title: string
  description?: string
  currentStep?: number
  totalSteps?: number
  showStepIndicator?: boolean
  showProgress?: boolean
  onBack?: () => void
  backText?: string
  titleLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const StepHeader = React.forwardRef<HTMLDivElement, StepHeaderProps>(
  ({
    className,
    variant,
    alignment,
    title,
    description,
    currentStep = 1,
    totalSteps = 1,
    showStepIndicator = true,
    showProgress = true,
    onBack,
    backText = "Back",
    titleLevel = 'h2',
    ...props
  }, ref) => {
    const TitleComponent = titleLevel
    const progressPercentage = (currentStep / totalSteps) * 100
    
    return (
      <div
        ref={ref}
        className={cn(stepHeaderVariants({ variant, alignment }), className)}
        {...props}
      >
        {/* Back button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center text-sm text-[var(--color-primary)] hover:text-[var(--purple-600)] transition-colors mb-4 self-start"
            aria-label="Go back to previous step"
          >
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            {backText}
          </button>
        )}
        
        {/* Step indicator */}
        {showStepIndicator && totalSteps > 1 && (
          <div className={stepIndicatorVariants({ 
            variant: variant === "compact" ? "minimal" : variant === "prominent" ? "prominent" : "default" 
          })}>
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
            
            {/* Step dots */}
            <div className="flex space-x-1 ml-4">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index < currentStep
                      ? "bg-[var(--color-success)]"
                      : index === currentStep - 1
                      ? "bg-[var(--color-primary)]"
                      : "bg-muted"
                  )}
                  aria-label={`Step ${index + 1}${
                    index < currentStep 
                      ? ' completed' 
                      : index === currentStep - 1 
                      ? ' current' 
                      : ' pending'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Progress bar */}
        {showProgress && totalSteps > 1 && (
          <div className="w-full bg-muted rounded-full h-1 mb-4">
            <div
              className="bg-[var(--color-primary)] h-1 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={currentStep}
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-label={`Step ${currentStep} of ${totalSteps}`}
            />
          </div>
        )}
        
        {/* Title and description */}
        <div className="space-y-2">
          <TitleComponent className="font-bold text-[var(--color-text)] text-responsive-xl">
            {title}
          </TitleComponent>
          
          {description && (
            <p className="text-muted-foreground text-responsive-base leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
    )
  }
)

StepHeader.displayName = "StepHeader"

export { StepHeader, stepHeaderVariants, stepIndicatorVariants } 