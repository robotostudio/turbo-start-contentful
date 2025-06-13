import type { Asset } from "contentful";
import Image from "next/image";

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
    <Image
      src={`https:${logo?.fields?.file?.url}`}
      alt={alt ?? "logo"}
      width={167}
      height={32}
      className="w-[167px] h-[32px] dark:invert"
      loading="eager"
      decoding="sync"
      priority
    />
  );
}
