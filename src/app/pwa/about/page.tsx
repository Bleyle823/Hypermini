import { PwaSafeArea } from "@/app/pwa/components/safe-area";
import { PwaTopNavbar, topNavHeight } from "@/app/pwa/components/top-navbar";
import { PwaBottomNavbar, bottomNavHeight } from "@/app/pwa/components/bottom-navbar";
import { Panel } from "@/app/pwa/components/ui/panel";
import { Button } from "@/app/pwa/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <PwaSafeArea {...{ topNavHeight, bottomNavHeight }}>
      <PwaTopNavbar />
      <main className="grid gap-3 sm:gap-4">
        <Panel title="About Hypermini">
          <div className="grid gap-3 text-sm text-muted-foreground">
            <p>
              Hypermini is a minimal trading UI inspired by
              {" "}
              <a
                className="underline decoration-dotted underline-offset-4 hover:text-foreground"
                href="https://app.hyperliquid.xyz/trade"
                target="_blank"
                rel="noreferrer"
              >
                Hyperliquid
              </a>
              . This demo showcases a chart area, order entry, orderbook, and
              positions panel with a clean mobile-first layout.
            </p>
            <div className="flex items-center gap-2">
              <Link href="/pwa">
                <Button size="sm">Open Trading</Button>
              </Link>
              <Link href="/pwa/settings">
                <Button size="sm" variant="secondary">
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </Panel>

        <Panel title="Links">
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            <li>
              <a
                className="underline decoration-dotted underline-offset-4 hover:text-foreground"
                href="https://app.hyperliquid.xyz/trade"
                target="_blank"
                rel="noreferrer"
              >
                Hyperliquid Trade Page
              </a>
            </li>
            <li>
              <Link
                className="underline decoration-dotted underline-offset-4 hover:text-foreground"
                href="/pwa/profile"
              >
                Profile
              </Link>
            </li>
          </ul>
        </Panel>
      </main>
      <PwaBottomNavbar />
    </PwaSafeArea>
  );
}
