import type { GlobalSettings } from "@/lib/contentful/query";
import { getGlobalSettings } from "@/lib/contentful/query";
import { safeAsync } from "@/safe-async";

import { Logo } from "./logo";
import { NavbarClient, NavbarSkeletonResponsive } from "./navbar-client";

export async function NavbarServer() {
  const result = await safeAsync(getGlobalSettings());
  if (!result.success) {
    return <div>Error: {result.error.message}</div>;
  }
  const navbarData = result.data;

  if (!navbarData?.fields) {
    return <NavbarSkeleton />;
  }

  return <Navbar navbarData={navbarData} />;
}

export function Navbar({ navbarData }: { navbarData?: GlobalSettings }) {
  if (!navbarData) {
    return <NavbarSkeleton />;
  }
  const { logo, siteTitle } = navbarData?.fields ?? {};
  return (
    <section className="py-3 md:border-b">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="grid grid-cols-[auto_1fr] items-center gap-4">
          <Logo logo={logo} alt={siteTitle} />
          <NavbarClient settingsData={navbarData} />
        </nav>
      </div>
    </section>
  );
}

export function NavbarSkeleton() {
  return (
    <header className="h-[75px] py-4 md:border-b">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="grid grid-cols-[auto_1fr] items-center gap-4">
          <div className="h-[40px] w-[170px] rounded animate-pulse bg-muted" />
          <NavbarSkeletonResponsive />
        </nav>
      </div>
    </header>
  );
}
