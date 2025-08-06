import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@workspace/ui/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[8px] border px-3 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 relative",
  {
    variants: {
      variant: {
        default:
          "text-primary bg-white dark:before:bg-black/90 bg-[url('/badge-bg.png')] bg-cover bg-center before:content-[''] before:absolute before:inset-[0.75px] before:bg-white/90 before:rounded-[7px] before:pointer-events-none",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      <span className="relative z-5">{children}</span>
    </div>
  );
}

export { Badge, badgeVariants };
