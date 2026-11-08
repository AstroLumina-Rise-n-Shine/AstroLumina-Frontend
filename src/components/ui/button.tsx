"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { variants } from "clsx"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "luxury" | "gold"
  size?: "default" | "sm" | "lg"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer"

    const variants = {
      default: "bg-cosmic-500 text-white shadow-glow-purple hover:bg-cosmic-400 hover:shadow-glow-lg",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-white/20 bg-white/5 hover:bg-white/10 text-white",
      ghost: "hover:bg-white/10 hover:text-white",
      luxury: "bg-linear-to-r from-cosmic-600 via-cosmic-500 to-cosmic-600 text-white shadow-luxury-purple hover:shadow-luxury-purple hover:from-cosmic-500 hover:to-cosmic-500",
      gold: "bg-linear-to-r from-gold-600 via-gold-400 to-gold-600 text-white shadow-glow-gold hover:from-gold-400 hover:to-gold-500",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-sm",
      lg: "h-11 px-8 text-lg",
    }

    return (
      <Comp className={cn(baseStyles, variants[variant], sizes[size], className)} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button }
