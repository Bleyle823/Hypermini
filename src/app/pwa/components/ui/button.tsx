"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,background,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 active:translate-y-[0.5px] disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-indigo-500 to-blue-600 text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_24px_-8px_rgba(37,99,235,0.5)] hover:from-indigo-400 hover:to-blue-500",
        secondary:
          "bg-secondary text-secondary-foreground border border-border hover:bg-accent hover:text-accent-foreground",
        ghost:
          "bg-transparent hover:bg-muted text-foreground",
        destructive:
          "bg-destructive text-white hover:opacity-90",
        success:
          "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_24px_-8px_rgba(16,185,129,0.5)] hover:from-emerald-400 hover:to-emerald-500",
        danger:
          "bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_24px_-8px_rgba(244,63,94,0.5)] hover:from-rose-400 hover:to-rose-500",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-10 px-5",
        lg: "h-11 px-6 text-[0.95rem]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };


