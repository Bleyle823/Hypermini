"use client";

import { TopNavbarWrapper } from "@/app/pwa/components/top-navbar-wrapper";

export const topNavHeight = "calc(4rem + 1px)";

export function PwaTopNavbar() {
  return (
    <TopNavbarWrapper>
      <div className="max-w-global z-50 flex h-full w-full items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-b from-indigo-500 to-blue-600" />
          <span className="text-sm font-semibold tracking-tight">Hypermini Trade</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            className="text-xs text-muted-foreground hover:text-foreground"
            href="/pwa/about"
          >
            About
          </a>
          <a
            className="text-xs text-muted-foreground hover:text-foreground"
            href="/pwa/settings"
          >
            Settings
          </a>
        </div>
      </div>
    </TopNavbarWrapper>
  );
}
