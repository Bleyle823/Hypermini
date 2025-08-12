import {
  PwaBottomNavbar,
  bottomNavHeight,
} from "@/app/pwa/components/bottom-navbar";
import { PwaSafeArea } from "@/app/pwa/components/safe-area";
import { PwaTopNavbar, topNavHeight } from "@/app/pwa/components/top-navbar";
import { Panel } from "@/app/pwa/components/ui/panel";
import { Button } from "@/app/pwa/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <PwaSafeArea {...{ topNavHeight, bottomNavHeight }}>
      <PwaTopNavbar />
      <main className="grid gap-3 sm:gap-4">
        <Panel title="Preferences">
          <div className="grid gap-4 text-sm">
            <div className="flex items-center justify-between">
              <div className="grid">
                <span>Theme</span>
                <span className="text-xs text-muted-foreground">Light / Dark / System</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary">
                  Light
                </Button>
                <Button size="sm" variant="secondary">
                  Dark
                </Button>
                <Button size="sm">System</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="grid">
                <span>Confirm orders</span>
                <span className="text-xs text-muted-foreground">Ask before placing</span>
              </div>
              <Button size="sm" variant="secondary">
                Toggle
              </Button>
            </div>
          </div>
        </Panel>

        <Panel title="Links">
          <div className="flex items-center gap-2">
            <Link href="/pwa">
              <Button size="sm" variant="ghost">
                Trade
              </Button>
            </Link>
            <Link href="/pwa/about">
              <Button size="sm" variant="secondary">
                About
              </Button>
            </Link>
          </div>
        </Panel>
      </main>
      <PwaBottomNavbar />
    </PwaSafeArea>
  );
}
