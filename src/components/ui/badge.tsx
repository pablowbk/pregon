import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200",
        success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300",
        warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
        error: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
        // Categorías de mensajes
        general: "bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300",
        residuos: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        vacunacion: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
        seguridad: "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
        eventos: "bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300",
        emergencia: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

