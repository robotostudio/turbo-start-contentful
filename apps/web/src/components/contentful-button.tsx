import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import type { ComponentProps } from "react";

import type { TypeButton } from "@/lib/contentful/types";
import { getButtonUrl } from "@/lib/contentful-utils";

type ContentfulButtonProps = {
  button: TypeButton<"WITHOUT_UNRESOLVABLE_LINKS", string>;
  className?: string;
  size?: "sm" | "lg" | "default" | "icon" | null | undefined;
} & Omit<ComponentProps<typeof Button>, "variant" | "asChild">;

export function ContentfulButton({
  button,
  className,
  size,
  ...props
}: ContentfulButtonProps) {
  if (!button?.fields) {
    console.warn("Button has no fields:", button);
    return null;
  }

  const { label, variant, href } = button.fields;
  const url = getButtonUrl(button);

  if (!url || !label) {
    console.warn("Button missing required fields:", { label, url, button });
    return null;
  }

  const isExternal = href && (href.startsWith("http") || href.startsWith("//"));

  return (
    <Button
      variant={variant as "default" | "secondary" | "outline" | "link"}
      size={size}
      {...props}
      asChild
      className={cn("rounded-[10px]", className)}
    >
      <Link
        href={url}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noopener noreferrer" : undefined}
        aria-label={`Navigate to ${label}`}
        title={`Click to visit ${label}`}
      >
        {label}
      </Link>
    </Button>
  );
}

type ContentfulButtonsProps = {
  buttons:
    | (TypeButton<"WITHOUT_UNRESOLVABLE_LINKS", string> | undefined)[]
    | null
    | undefined;
  className?: string;
  buttonClassName?: string;
  size?: "sm" | "lg" | "default" | "icon" | null | undefined;
};

export function ContentfulButtons({
  buttons,
  className,
  buttonClassName,
  size,
}: ContentfulButtonsProps) {
  if (!buttons?.length) return null;

  // Filter out undefined entries (unresolvable links)
  const validButtons = buttons.filter(
    (button): button is TypeButton<"WITHOUT_UNRESOLVABLE_LINKS", string> =>
      button !== undefined && button?.fields !== undefined,
  );

  if (!validButtons.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {validButtons.map((button) => (
        <ContentfulButton
          key={button.sys.id}
          button={button}
          className={buttonClassName}
          size={size}
        />
      ))}
    </div>
  );
}
