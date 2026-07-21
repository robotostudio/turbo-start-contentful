import type { Asset } from "contentful";
import Image from "next/image";
import Link from "next/link";

export function Logo({
  logo,
  alt,
}: {
  logo: Asset<"WITHOUT_UNRESOLVABLE_LINKS", string> | undefined;
  alt?: string;
}) {
  if (!logo?.fields?.file?.url) {
    return null;
  }
  return (
    <Link
      className="inline-block rounded-md outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href="/"
    >
      <Image
        src={`https:${logo?.fields?.file?.url}`}
        alt={alt ?? "logo"}
        width={167}
        height={32}
        className="h-[32px] dark:invert"
        loading="eager"
        decoding="sync"
        priority
      />
    </Link>
  );
}
