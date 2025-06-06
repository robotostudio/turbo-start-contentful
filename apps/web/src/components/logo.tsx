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
      width={170}
      height={40}
      className="w-[170px] h-[40px] dark:invert"
      loading="eager"
      decoding="sync"
      priority
    />
  );
}
