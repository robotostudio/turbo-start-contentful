"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerPopup,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  DrawerViewport,
} from "@workspace/ui/components/base-drawer";
import { Button } from "@workspace/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@workspace/ui/components/navigation-menu";
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query";
import { cn } from "@workspace/ui/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import type { GlobalSettings } from "@/lib/contentful/query";
import type {
  TypeNavbarColumnLink,
  TypeNavbarLink,
} from "@/lib/contentful/types";

import { ContentfulButtons } from "./contentful-button";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";

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
type NavbarLinkType = NonNullable<NavbarColumnLink["fields"]["links"]>[number];

const FOCUS_RING =
  "outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset";

const TRIGGER_CLASS =
  "h-auto bg-transparent px-3 py-2 text-foreground hover:bg-transparent hover:text-foreground focus:bg-transparent focus:text-foreground data-popup-open:bg-transparent data-popup-open:text-foreground";

const TABLET_QUERY = "(min-width: 768px) and (max-width: 1024px)";

const VIEWPORT_ANCHOR = {
  bottom: "items-end justify-center",
  right: "items-stretch justify-end",
} as const;

const POPUP_SLIDE = {
  bottom:
    "h-[90dvh] border-t origin-bottom [transform:translateY(var(--drawer-swipe-movement-y,0px))] data-starting-style:[transform:translateY(100%)] data-ending-style:[transform:translateY(100%)]",
  right:
    "h-dvh max-w-md border-s origin-right [transform:translateX(var(--drawer-swipe-movement-x,0px))] data-starting-style:[transform:translateX(100%)] data-ending-style:[transform:translateX(100%)]",
} as const;

function getColumnLayoutClass(itemCount: number) {
  if (itemCount <= 4) return "w-80";
  if (itemCount <= 8) return "grid grid-cols-2 gap-2 w-[500px]";
  return "grid grid-cols-3 gap-2 w-[700px]";
}

function DesktopColumn({ column }: { column: NavbarColumnLink }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className={TRIGGER_CLASS}>
        {column.fields.label}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul
          className={cn(
            "p-1",
            getColumnLayoutClass(column.fields.links?.length ?? 0),
          )}
        >
          {column.fields.links?.map((item: NavbarLinkType) => {
            if (!item?.fields) return null;
            return (
              <li key={item.sys.id}>
                <NavigationMenuLink
                  className="group items-center gap-3 rounded-lg p-3 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-inset focus-visible:ring-offset-0"
                  closeOnClick
                  render={
                    <Link
                      aria-label={`Link to ${item.fields.label ?? item.fields.href}`}
                      href={item.fields.href ?? "/"}
                    />
                  }
                >
                  <span className="font-medium text-sm leading-none">
                    {item.fields.label}
                  </span>
                </NavigationMenuLink>
              </li>
            );
          })}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function DesktopColumnLink({ column }: { column: NavbarLinkItem }) {
  if (!column.fields.href) return null;
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        className="h-auto items-center rounded-md px-3 py-2 font-medium text-sm text-foreground transition-colors hover:text-foreground"
        render={
          <Link
            aria-label={`Link to ${column.fields.label ?? column.fields.href}`}
            href={column.fields.href}
          />
        }
      >
        {column.fields.label}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function DesktopNavbar({ settingsData }: { settingsData: GlobalSettings }) {
  const { columns, buttons } = settingsData?.fields?.navbar?.fields ?? {};

  return (
    <>
      <NavigationMenu
        aria-label="Main"
        className="hidden lg:flex"
        closeDelay={150}
        viewport
      >
        <NavigationMenuList>
          {columns?.map((column) => {
            if (!column) return null;
            if (column.sys.contentType.sys.id === "navbarColumnLink") {
              return (
                <DesktopColumn
                  column={column as NavbarColumnLink}
                  key={column.sys.id}
                />
              );
            }
            return (
              <DesktopColumnLink
                column={column as NavbarLinkItem}
                key={column.sys.id}
              />
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden items-center gap-4 lg:flex">
        <ContentfulButtons
          buttons={buttons}
          buttonClassName="rounded-[10px]"
          className="flex items-center gap-4"
        />
        <ModeToggle />
      </div>
    </>
  );
}

function MobileNavbar({ settingsData }: { settingsData: GlobalSettings }) {
  const { siteTitle, logo } = settingsData?.fields ?? {};
  const { columns, buttons } = settingsData?.fields?.navbar?.fields ?? {};

  const [isOpen, setIsOpen] = useState(false);
  const isTablet = useMediaQuery(TABLET_QUERY);
  const liveSide = isTablet ? "right" : "bottom";
  // Freeze the anchor at open-time and keep it for the whole session, so crossing
  // the breakpoint (e.g. a tablet rotation) or closing never re-anchors a visible
  // panel — re-anchoring on close would jump the sheet mid-exit-animation.
  const [side, setSide] = useState<"bottom" | "right">(liveSide);

  const path = usePathname();
  const [prevPath, setPrevPath] = useState(path);

  if (path !== prevPath) {
    setPrevPath(path);
    setIsOpen(false);
  }

  function handleOpenChange(next: boolean) {
    if (next) {
      setSide(liveSide);
    }
    setIsOpen(next);
  }

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="flex items-center gap-2 lg:hidden">
      <ModeToggle />
      <Drawer
        onOpenChange={handleOpenChange}
        open={isOpen}
        swipeDirection={side === "right" ? "right" : "down"}
      >
        <DrawerTrigger
          render={
            <Button size="icon" variant="outline">
              <Menu className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          }
        />

        <DrawerPortal>
          <DrawerBackdrop />
          <DrawerViewport className={VIEWPORT_ANCHOR[side]}>
            <DrawerPopup
              className={cn(
                "w-full pb-[env(safe-area-inset-bottom)]",
                POPUP_SLIDE[side],
              )}
            >
              <DrawerContent>
                <div className="flex flex-row items-center justify-between border-b px-6 py-4">
                  <DrawerTitle className={logo ? "sr-only" : "font-semibold"}>
                    {siteTitle || "Menu"}
                  </DrawerTitle>
                  {logo ? <Logo alt={siteTitle} logo={logo} /> : null}
                  <DrawerClose
                    className={cn(
                      "rounded-sm opacity-70 transition-opacity hover:opacity-100",
                      FOCUS_RING,
                    )}
                  >
                    <X className="size-5" />
                    <span className="sr-only">Close</span>
                  </DrawerClose>
                </div>

                <nav
                  aria-label="Main"
                  className="grid flex-1 content-start gap-1 overflow-y-auto px-6 pt-4"
                >
                  <Accordion multiple={false}>
                    {columns?.map((column) => {
                      if (!column) return null;

                      if (column.sys.contentType.sys.id === "navbarLink") {
                        const linkItem = column as NavbarLinkItem;
                        if (!linkItem.fields.href) return null;
                        return (
                          <Link
                            className={cn(
                              "-mx-3 flex items-center rounded-md px-3 py-3 font-medium text-sm transition-colors hover:text-primary",
                              FOCUS_RING,
                            )}
                            href={linkItem.fields.href}
                            key={linkItem.sys.id}
                            onClick={closeMenu}
                          >
                            {linkItem.fields.label}
                          </Link>
                        );
                      }

                      const columnItem = column as NavbarColumnLink;
                      return (
                        <AccordionItem
                          className="border-b-0"
                          key={columnItem.sys.id}
                          value={columnItem.sys.id}
                        >
                          <AccordionTrigger className="-mx-3 rounded-md px-3 py-3 hover:no-underline">
                            {columnItem.fields.label}
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="ml-1 grid gap-1 border-border border-l-2 pl-4">
                              {columnItem.fields.links?.map(
                                (item: NavbarLinkType) => {
                                  if (!item?.fields) return null;
                                  return (
                                    <Link
                                      className={cn(
                                        "rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                        FOCUS_RING,
                                      )}
                                      href={item.fields.href ?? "/"}
                                      key={item.sys.id}
                                      onClick={closeMenu}
                                    >
                                      {item.fields.label}
                                    </Link>
                                  );
                                },
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </nav>

                {buttons?.length ? (
                  <div className="mt-auto grid gap-2 border-t p-4">
                    <ContentfulButtons
                      buttonClassName="w-full justify-center"
                      buttons={buttons}
                      className="grid gap-3"
                    />
                  </div>
                ) : null}
              </DrawerContent>
            </DrawerPopup>
          </DrawerViewport>
        </DrawerPortal>
      </Drawer>
    </div>
  );
}

const ClientSideNavbar = ({
  settingsData,
}: {
  settingsData: GlobalSettings;
}) => {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      setIsScrolled(current > 0.01);
    }
  });

  const { logo, siteTitle } = settingsData?.fields ?? {};

  return (
    <motion.section
      className={cn(
        "py-3 z-20 fixed top-0 inset-x-0 transition-colors duration-300",
        isScrolled && "border bg-background",
      )}
    >
      <div className="container">
        <div className="flex h-12 items-center justify-between gap-4">
          <Logo alt={siteTitle} logo={logo} />
          <DesktopNavbar settingsData={settingsData} />
          <MobileNavbar settingsData={settingsData} />
        </div>
      </div>
    </motion.section>
  );
};

function SkeletonMobileNavbar() {
  return (
    <div className="lg:hidden flex items-center gap-2">
      <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
      <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
    </div>
  );
}

function SkeletonDesktopNavbar() {
  return (
    <div className="hidden lg:flex items-center gap-8">
      <div className="justify-center flex max-w-max flex-1 items-center gap-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`nav-item-skeleton-${index.toString()}`}
            className="h-9 w-24 rounded bg-muted animate-pulse"
          />
        ))}
      </div>
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-[10px] bg-muted animate-pulse" />
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={`nav-button-skeleton-${index.toString()}`}
            className="h-10 w-28 rounded-[10px] bg-muted animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export function NavbarSkeletonResponsive() {
  return (
    <motion.section className="py-3 z-20 fixed top-0 inset-x-0">
      <div className="container">
        <nav className="flex h-12 items-center justify-between gap-4">
          <div className="h-8 w-[167px] rounded animate-pulse bg-muted" />
          <SkeletonDesktopNavbar />
          <SkeletonMobileNavbar />
        </nav>
      </div>
    </motion.section>
  );
}

export const NavbarClient = dynamic(() => Promise.resolve(ClientSideNavbar), {
  ssr: false,
  loading: () => <NavbarSkeletonResponsive />,
});
