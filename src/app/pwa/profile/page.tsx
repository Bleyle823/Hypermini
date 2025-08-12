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
        <Panel title="Profile">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-gradient-to-b from-indigo-500 to-blue-600" />
            <div className="grid">
              <div className="text-sm font-semibold">Trader</div>
              <div className="text-xs text-muted-foreground">@you</div>
            </div>
          </div>
        </Panel>

        <Panel title="Account">
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Balances</span>
              <div className="text-foreground">0.00</div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm">Deposit</Button>
              <Button size="sm" variant="secondary">
                Withdraw
              </Button>
              <Link href="/pwa">
                <Button size="sm" variant="ghost">
                  Trade
                </Button>
              </Link>
            </div>
          </div>
        </Panel>
      </main>
      <PwaBottomNavbar />
    </PwaSafeArea>
  );
}
