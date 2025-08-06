"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useIsMobile } from "@/hooks/use-is-mobile";
import type { GlobalSettings } from "@/lib/contentful/query";
import type {
  TypeNavbarColumnLink,
  TypeNavbarLink,
} from "@/lib/contentful/types";

import { ContentfulButtons } from "./contentful-button";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
// import { SanityIcon } from "./sanity-icon";

interface MenuItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}

// Type definitions for navbar columns
type NavbarColumn =
  | TypeNavbarColumnLink<"WITHOUT_UNRESOLVABLE_LINKS">
  | TypeNavbarLink<"WITHOUT_UNRESOLVABLE_LINKS">;
type NavbarColumnLink = Extract<
  NavbarColumn,
  { sys: { contentType: { sys: { id: "navbarColumnLink" } } } }
>;
type NavbarLinkItem = Extract<
  NavbarColumn,
  { sys: { contentType: { sys: { id: "navbarLink" } } } }
>;

// Extract the links from navbar column
type NavbarLinkType = NonNullable<NavbarColumnLink["fields"]["links"]>[number];

function MenuItemLink({
  item,
  setIsOpen,
}: {
  item: MenuItem;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  return (
    <Link
      className={cn(
        "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground items-center focus:bg-accent focus:text-accent-foreground",
      )}
      aria-label={`Link to ${item.title ?? item.href}`}
      onClick={() => setIsOpen?.(false)}
      href={item.href ?? "/"}
    >
      {item.icon}
      <div className="">
        <div className="text-sm font-semibold">{item.title}</div>
        <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

function MobileNavbarAccordionColumn({
  column,
  setIsOpen,
}: {
  column: NavbarColumnLink;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <AccordionItem
      value={column.fields.label ?? column.sys.id}
      className="border-b-0"
    >
      <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline hover:bg-accent hover:text-accent-foreground pr-2 rounded-md">
        <div
          className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
        >
          {column.fields.label}
        </div>
      </AccordionTrigger>
      <AccordionContent className="mt-2">
        {column.fields.links?.map((item: NavbarLinkType) => {
          if (!item?.fields) return null;
          return (
            <MenuItemLink
              key={item.sys.id}
              setIsOpen={setIsOpen}
              item={{
                description: item.fields.label ?? "",
                href: item.fields.href ?? "",
                // icon: <SanityIcon icon={null} className="size-5 shrink-0" />,
                icon: null,
                title: item.fields.label ?? "",
              }}
            />
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}

function MobileNavbar({ settingsData }: { settingsData: GlobalSettings }) {
  const { siteTitle, logo } = settingsData?.fields ?? {};
  const { columns, buttons } = settingsData?.fields?.navbar?.fields ?? {};
  const [isOpen, setIsOpen] = useState(false);

  const path = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: This is intentional
  useEffect(() => {
    setIsOpen(false);
  }, [path]);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-end">
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {logo && <Logo alt={siteTitle} logo={logo} />}
          </SheetTitle>
        </SheetHeader>

        <div className="mb-8 mt-8 flex flex-col gap-4">
          {columns?.map((item) => {
            if (!item) return null;

            if (item.sys.contentType.sys.id === "navbarLink") {
              const linkItem = item as NavbarLinkItem;
              return (
                <Link
                  key={`column-link-${linkItem.fields.label}-${linkItem.sys.id}`}
                  href={linkItem.fields.href ?? ""}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start",
                  )}
                >
                  {linkItem.fields.label}
                </Link>
              );
            }

            if (item.sys.contentType.sys.id === "navbarColumnLink") {
              const columnItem = item as NavbarColumnLink;
              return (
                <Accordion
                  type="single"
                  collapsible
                  className="w-full"
                  key={columnItem.sys.id}
                >
                  <MobileNavbarAccordionColumn
                    column={columnItem}
                    setIsOpen={setIsOpen}
                  />
                </Accordion>
              );
            }

            return null;
          })}
        </div>

        <div className="border-t pt-4">
          <ContentfulButtons
            buttons={buttons ?? []}
            buttonClassName="w-full"
            className="flex mt-2 flex-col gap-3"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NavbarColumnLink({ column }: { column: NavbarLinkItem }) {
  return (
    <Link
      aria-label={`Link to ${column.fields.label ?? column.fields.href}`}
      href={column.fields.href ?? ""}
      legacyBehavior
      passHref
    >
      <NavigationMenuLink
        className={cn(
          navigationMenuTriggerStyle(),
          "text-zinc-700 dark:text-zinc-300",
        )}
      >
        {column.fields.label}
      </NavigationMenuLink>
    </Link>
  );
}

function getColumnLayoutClass(itemCount: number) {
  if (itemCount <= 4) return "w-80";
  if (itemCount <= 8) return "grid grid-cols-2 gap-2 w-[500px]";
  return "grid grid-cols-3 gap-2 w-[700px]";
}

export function NavbarColumn({ column }: { column: NavbarColumnLink }) {
  const layoutClass = useMemo(
    () => getColumnLayoutClass(column.fields.links?.length ?? 0),
    [column.fields.links?.length],
  );

  return (
    <NavigationMenuList>
      <NavigationMenuItem className="text-zinc-700 dark:text-zinc-300">
        <NavigationMenuTrigger>{column.fields.label}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className={cn("p-3", layoutClass)}>
            {column.fields.links?.map((item: NavbarLinkType) => {
              if (!item?.fields) return null;
              return (
                <li key={item.sys.id}>
                  <MenuItemLink
                    item={{
                      title: item.fields.label ?? "",
                      description: item.fields.label ?? "",
                      href: item.fields.href ?? "",
                      icon: null,
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
}

export function DesktopNavbar({
  settingsData,
}: {
  settingsData: GlobalSettings;
}) {
  const { columns, buttons } = settingsData?.fields?.navbar?.fields ?? {};

  return (
    <>
      <NavigationMenu className="">
        {columns?.map((column) =>
          column?.sys.contentType.sys.id === "navbarColumnLink" ? (
            <NavbarColumn
              key={`nav-${column.sys.id}`}
              column={column as NavbarColumnLink}
            />
          ) : (
            <NavbarColumnLink
              key={`nav-${column?.sys.id}`}
              column={column as NavbarLinkItem}
            />
          ),
        )}
      </NavigationMenu>

      <div className="justify-self-end flex items-center gap-4">
        <ContentfulButtons
          buttons={buttons}
          className="flex items-center gap-4"
          buttonClassName="rounded-[10px]"
        />
        <ModeToggle />
      </div>
    </>
  );
}

const ClientSideNavbar = ({
  settingsData,
}: {
  settingsData: GlobalSettings;
}) => {
  const isMobile = useIsMobile();

  if (isMobile === undefined) {
    return null; // Return null on initial render to avoid hydration mismatch
  }

  return isMobile ? (
    <MobileNavbar settingsData={settingsData} />
  ) : (
    <DesktopNavbar settingsData={settingsData} />
  );
};

function SkeletonMobileNavbar() {
  return (
    <div className="md:hidden">
      <div className="flex justify-end">
        <div className="h-12 w-12 rounded-md bg-muted animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonDesktopNavbar() {
  return (
    <div className="hidden md:grid grid-cols-[1fr_auto] items-center gap-8 w-full">
      <div className="justify-center flex max-w-max flex-1 items-center gap-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`nav-item-skeleton-${index.toString()}`}
            className="h-12 w-32 rounded bg-muted animate-pulse"
          />
        ))}
      </div>

      <div className="justify-self-end">
        <div className="flex items-center gap-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`nav-button-skeleton-${index.toString()}`}
              className="h-12 w-32 rounded-[10px] bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function NavbarSkeletonResponsive() {
  return (
    <>
      <SkeletonMobileNavbar />
      <SkeletonDesktopNavbar />
    </>
  );
}

// Dynamically import the navbar with no SSR to avoid hydration issues
export const NavbarClient = dynamic(() => Promise.resolve(ClientSideNavbar), {
  ssr: false,
  loading: () => <NavbarSkeletonResponsive />,
});
