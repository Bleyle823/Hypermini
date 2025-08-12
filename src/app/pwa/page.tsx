import { PwaBottomNavbar, bottomNavHeight } from "@/app/pwa/components/bottom-navbar";
import { PwaSafeArea } from "@/app/pwa/components/safe-area";
import { PwaTopNavbar, topNavHeight } from "@/app/pwa/components/top-navbar";
import { Panel } from "@/app/pwa/components/ui/panel";
import { Button } from "@/app/pwa/components/ui/button";
import { ChevronDown, MinusIcon, PlusIcon } from "lucide-react";

export default function HomePage() {
  return (
    <PwaSafeArea {...{ topNavHeight, bottomNavHeight }}>
      <PwaTopNavbar />
      <main className="grid grid-rows-[auto_1fr] gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 px-2 sm:px-0">
          <Button size="sm">Deposit</Button>
          <Button size="sm" variant="secondary">
            Withdraw
          </Button>
          <Button size="sm" variant="ghost">
            Transfers
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.15fr_0.85fr] sm:gap-4">
          <Panel title="BTC-PERP • 24,102.5" right={<SymbolActions />}> 
            <div className="aspect-[16/9] w-full rounded-lg bg-gradient-to-b from-zinc-900/10 to-zinc-900/20 dark:from-zinc-100/5 dark:to-zinc-100/10" />
          </Panel>
          <div className="grid grid-rows-[auto_auto_1fr] gap-3 sm:gap-4">
            <Panel title="Order Entry" right={<OrderTypeSelector />}>
              <OrderEntry />
            </Panel>
            <Panel title="Orderbook">
              <Orderbook />
            </Panel>
            <Panel title="Positions">
              <Positions />
            </Panel>
          </div>
        </div>
      </main>
      <PwaBottomNavbar />
    </PwaSafeArea>
  );
}

function SymbolActions() {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="secondary">
        1m
      </Button>
      <Button size="sm" variant="secondary">
        Indicators
      </Button>
      <Button size="sm" variant="secondary">
        <ChevronDown className="size-4" />
      </Button>
    </div>
  );
}

function OrderTypeSelector() {
  return (
    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
      <Button size="sm" variant="ghost" className="rounded-full px-3">
        Market
      </Button>
      <Button size="sm" variant="primary" className="rounded-full px-3">
        Limit
      </Button>
      <Button size="sm" variant="ghost" className="rounded-full px-3">
        Stop
      </Button>
    </div>
  );
}

function OrderEntry() {
  return (
    <div className="grid gap-3">
      <LabelRow label="Size">
        <div className="flex items-center gap-2">
          <button className="rounded-full border px-2 py-1 text-xs">
            25%
          </button>
          <button className="rounded-full border px-2 py-1 text-xs">
            50%
          </button>
          <button className="rounded-full border px-2 py-1 text-xs">
            75%
          </button>
          <button className="rounded-full border px-2 py-1 text-xs">Max</button>
        </div>
      </LabelRow>
      <LabelRow label="Price">
        <div className="flex items-center gap-2">
          <button className="rounded-full border p-2">
            <MinusIcon className="size-4" />
          </button>
          <input
            className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none ring-0"
            placeholder="Limit price"
          />
          <button className="rounded-full border p-2">
            <PlusIcon className="size-4" />
          </button>
        </div>
      </LabelRow>
      <LabelRow label="Leverage">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={25}
            defaultValue={10}
            className="w-full"
          />
          <div className="text-xs text-muted-foreground">10x</div>
        </div>
      </LabelRow>
      <div className="grid grid-cols-2 gap-2">
        <Button className="w-full" variant="success">
          Long
        </Button>
        <Button className="w-full" variant="danger">
          Short
        </Button>
      </div>
    </div>
  );
}

function Orderbook() {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="grid gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`ask-${i}`} className="flex items-center justify-between">
            <span className="text-rose-500">24,103.{i}</span>
            <span className="text-muted-foreground">12.3</span>
          </div>
        ))}
      </div>
      <div className="grid gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`bid-${i}`} className="flex items-center justify-between">
            <span className="text-emerald-500">24,102.{i}</span>
            <span className="text-muted-foreground">9.{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Positions() {
  return (
    <div className="text-xs text-muted-foreground">No open positions</div>
  );
}

function LabelRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <div className="text-[11px] font-medium text-muted-foreground">
        {label}
      </div>
      {children}
    </div>
  );
}
