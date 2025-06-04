import { Logo } from "./logo";
import { NavbarClient, NavbarSkeletonResponsive } from "./navbar-client";

export async function NavbarServer() {
  const [navbarData, settingsData] = await Promise.all([
    Promise.resolve({ data: {} }),
    Promise.resolve({ data: {} }),
  ]);
  return (
    <Navbar navbarData={navbarData.data} settingsData={settingsData.data} />
  );
}

export function Navbar({
  navbarData,
  settingsData,
}: {
  navbarData: any;
  settingsData: any;
}) {
  const { siteTitle: settingsSiteTitle, logo } = settingsData ?? {};
  return (
    <section className="py-3 md:border-b">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="grid grid-cols-[auto_1fr] items-center gap-4">
          {logo && <Logo alt={settingsSiteTitle} priority image={logo} />}

          <NavbarClient navbarData={navbarData} settingsData={settingsData} />
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
