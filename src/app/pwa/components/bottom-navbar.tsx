"use client";

import { BottomNavbarWrapper } from "@/app/pwa/components/bottom-navbar-wrapper";
import { cn } from "@/lib/utils";
import { CircleUser, CogIcon, HomeIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navRoutes = [
  "/pwa",
  "/pwa/about",
  "/pwa/profile",
  "/pwa/settings",
] as const;

type NavRoutes = (typeof navRoutes)[number];

const navSetup: Record<
  NavRoutes,
  {
    name: string;
    isActive: string[];
    icon: React.ReactNode;
  }
> = {
  "/pwa": {
    name: "Home",
    isActive: ["/pwa"],
    icon: <HomeIcon className="size-6" />,
  },
  "/pwa/about": {
    name: "About",
    isActive: ["/pwa/about"],
    icon: <InfoIcon className="size-6" />,
  },
  "/pwa/profile": {
    name: "Profile",
    isActive: ["/pwa/profile"],
    icon: <CircleUser className="size-6" />,
  },
  "/pwa/settings": {
    name: "Settings",
    isActive: ["/pwa/settings"],
    icon: <CogIcon className="size-6" />,
  },
} as const;

export const bottomNavHeight = "calc(4rem + 1px)";

export function PwaBottomNavbar() {
  const pathname = usePathname();

  return (
    <BottomNavbarWrapper>
      <nav className="max-w-global flex h-full w-full items-center justify-evenly">
        {navRoutes.map((route, index) => {
          const activeRoutes = navSetup[route].isActive;

          const isActive = activeRoutes.includes(pathname);

          return (
            <Link
              key={`bottom-navbar-link-${route}-${index}`}
              href={route}
              className={cn(
                "group relative flex h-full flex-1 flex-col items-center justify-center overflow-hidden",
              )}
            >
              <div
                className={cn(
                  "rounded-full p-2 transition-colors group-hover:bg-muted",
                  isActive && "bg-muted",
                )}
              >
                {navSetup[route].icon}
              </div>
              <div
                className={cn(
                  "mt-1 text-[11px] text-muted-foreground transition-colors group-hover:text-foreground",
                  isActive && "text-foreground",
                )}
              >
                {navSetup[route].name}
              </div>
              {isActive && (
                <div className="absolute inset-x-5 bottom-[2px] h-[3px] rounded-full bg-indigo-500/80" />
              )}
            </Link>
          );
        })}
      </nav>
    </BottomNavbarWrapper>
  );
}
