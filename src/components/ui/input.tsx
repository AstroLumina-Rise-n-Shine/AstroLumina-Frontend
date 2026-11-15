import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-cosmic-300/30 focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:border-cosmic-500 transition-all duration-300 cursor-pointer",
      className
    )}
    ref={ref}
    {...props}
  />
))
Input.displayName = "Input"

export { Input }
