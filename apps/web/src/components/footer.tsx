import Link from "next/link";

import type { GlobalSettings } from "@/lib/contentful/query";
import { getGlobalSettings } from "@/lib/contentful/query";
import type {
  TypeNavbarColumnLink,
  TypeNavbarLink,
} from "@/lib/contentful/types";
import { safeAsync } from "@/safe-async";

import { Logo } from "./logo";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "./social-icons";

// Type definitions for footer columns
type FooterColumn = TypeNavbarColumnLink<"WITHOUT_UNRESOLVABLE_LINKS">;
type FooterLinkType = NonNullable<FooterColumn["fields"]["links"]>[number];

export async function FooterServer() {
  const result = await safeAsync(getGlobalSettings());

  if (!result.success) {
    return <div>Error: {result.error.message}</div>;
  }

  const footerData = result.data;

  if (!footerData?.fields) {
    return <FooterSkeleton />;
  }

  return <Footer settingsData={footerData} />;
}

function SocialLinks({ settingsData }: { settingsData: GlobalSettings }) {
  const { twitter, linkedin } = settingsData.fields;

  const socialLinks = [
    {
      url: twitter,
      Icon: XIcon,
      label: "Follow us on Twitter",
    },
    {
      url: linkedin,
      Icon: LinkedinIcon,
      label: "Follow us on LinkedIn",
    },
  ].filter((link) => link.url);

  if (socialLinks.length === 0) return null;

  return (
    <ul className="flex items-center space-x-6 text-muted-foreground">
      {socialLinks.map(({ url, Icon, label }, index) => (
        <li
          key={`social-link-${url}-${index.toString()}`}
          className="font-medium hover:text-primary"
        >
          <Link
            href={url ?? "#"}
            target="_blank"
            prefetch={false}
            rel="noopener noreferrer"
            aria-label={label}
          >
            <Icon className="fill-muted-foreground hover:fill-primary/80 dark:fill-zinc-400 dark:hover:fill-primary" />
            <span className="sr-only">{label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function FooterSkeleton() {
  return (
    <section className="mt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <footer className="h-[500px] lg:h-auto">
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">
                  <div className="h-[40px] w-[80px] bg-muted rounded animate-pulse" />
                </span>
                <div className="mt-6 h-16 w-full bg-muted rounded animate-pulse" />
              </div>
              <div className="flex items-center space-x-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-6 bg-muted rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 lg:gap-20">
              {[1, 2, 3].map((col) => (
                <div key={col}>
                  <div className="mb-6 h-6 w-24 bg-muted rounded animate-pulse" />
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="h-4 w-full bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 flex flex-col justify-between gap-4 border-t pt-8 text-center lg:flex-row lg:items-center lg:text-left">
            <div className="h-4 w-48 bg-muted rounded animate-pulse" />
            <div className="flex justify-center gap-4 lg:justify-start">
              <div className="h-4 w-32 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

function Footer({ settingsData }: { settingsData: GlobalSettings }) {
  const { label: footerLabel, columns } =
    settingsData.fields.footer?.fields ?? {};
  const { siteTitle, logo } = settingsData.fields;
  const year = new Date().getFullYear();

  return (
    <section className="mt-20 pb-8">
      <div className="container mx-auto">
        <footer className="h-[500px] lg:h-auto">
          <div className="flex flex-col items-center justify-between gap-10 text-center lg:flex-row lg:text-left mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex w-full max-w-96 shrink flex-col items-center justify-between gap-6 md:gap-8 lg:items-start">
              <div>
                <span className="flex items-center justify-center gap-4 lg:justify-start">
                  <Logo logo={logo} alt={siteTitle} />
                </span>
                {footerLabel && (
                  <p className="mt-6 text-sm text-muted-foreground dark:text-zinc-400">
                    {footerLabel}
                  </p>
                )}
              </div>
              <SocialLinks settingsData={settingsData} />
            </div>
            {Array.isArray(columns) && columns?.length > 0 && (
              <div className="grid grid-cols-3 gap-6 lg:gap-28 lg:mr-20">
                {columns.map((column, index) => {
                  if (!column?.fields) return null;
                  return (
                    <div key={`column-${column.sys.id}-${index}`}>
                      <h3 className="mb-6 font-semibold">
                        {column.fields.label}
                      </h3>
                      {column.fields.links &&
                        column.fields.links.length > 0 && (
                          <ul className="space-y-4 text-sm text-muted-foreground dark:text-zinc-400">
                            {column.fields.links.map(
                              (link: FooterLinkType, linkIndex) => {
                                if (!link?.fields) return null;
                                return (
                                  <li
                                    key={`${link.sys.id}-${linkIndex}-column-${column.sys.id}`}
                                    className="font-medium hover:text-primary"
                                  >
                                    <Link
                                      href={link.fields.href ?? "#"}
                                      target={
                                        link.fields.internal
                                          ? undefined
                                          : "_blank"
                                      }
                                      rel={
                                        link.fields.internal
                                          ? undefined
                                          : "noopener noreferrer"
                                      }
                                    >
                                      {link.fields.label}
                                    </Link>
                                  </li>
                                );
                              },
                            )}
                          </ul>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="mt-20 border-t pt-8">
            <div className="flex flex-col justify-between gap-4  text-center text-sm font-normal text-muted-foreground lg:flex-row lg:items-center lg:text-left mx-auto max-w-7xl px-4 md:px-6">
              <p>
                © {year} {siteTitle}. All rights reserved.
              </p>
              <ul className="flex justify-center gap-4 lg:justify-start">
                <li className="hover:text-primary">
                  <Link href="/terms">Terms and Conditions</Link>
                </li>
                <li className="hover:text-primary">
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
