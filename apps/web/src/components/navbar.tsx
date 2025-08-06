import type { GlobalSettings } from "@/lib/contentful/query";
import { getGlobalSettings } from "@/lib/contentful/query";
import { safeAsync } from "@/safe-async";

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
  return <NavbarClient settingsData={navbarData} />;
}

export function NavbarSkeleton() {
  return <NavbarSkeletonResponsive />;
}
