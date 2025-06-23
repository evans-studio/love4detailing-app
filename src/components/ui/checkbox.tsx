"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Base styles
      "peer h-5 w-5 shrink-0 rounded-md border-2 border-border bg-background",
      // Focus styles
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      // Hover styles
      "hover:border-primary/80 hover:bg-primary/5",
      // Checked styles
      "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
      // Disabled styles
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border disabled:hover:bg-background",
      // Transition
      "transition-all duration-200 ease-in-out",
      // Shadow
      "shadow-sm hover:shadow-md data-[state=checked]:shadow-md",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex items-center justify-center text-current",
        "data-[state=checked]:animate-in data-[state=checked]:zoom-in-50 data-[state=checked]:duration-200"
      )}
    >
      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
