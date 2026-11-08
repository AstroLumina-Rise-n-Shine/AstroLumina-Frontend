"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={cn(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/20 bg-white/5 p-6 shadow-lg rounded-2xl backdrop-blur-sm focus:outline-none sm:rounded-xl",
      className
    )}
    {...props}
  />
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Header>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Header>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Header
    ref={ref}
    className={cn("grid gap-1.5 text-center sm:text-left", className)}
    {...props}
  />
))
DialogHeader.displayName = DialogPrimitive.Header.displayName

const DialogFooter = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Footer>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Footer>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Footer
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
))
DialogFooter.displayName = DialogPrimitive.Footer.displayName

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-2xl font-semibold font-display tracking-tight text-white", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-cosmic-300/70", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

const DialogClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-full p-1.5 text-white/50 ring-offset-background focus:outline-none focus:ring-2 focus:ring-cosmic-500 focus:ring-offset-8 disabled:pointer-events-none",
      className
    )}
    {...props}
  />
))
DialogClose.displayName = DialogPrimitive.Close.displayName

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
}
