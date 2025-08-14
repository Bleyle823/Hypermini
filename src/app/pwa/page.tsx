"use client";

import { PwaBottomNavbar, bottomNavHeight } from "@/app/pwa/components/bottom-navbar";
import { PwaSafeArea } from "@/app/pwa/components/safe-area";
import { PwaTopNavbar, topNavHeight } from "@/app/pwa/components/top-navbar";
import { Panel } from "@/app/pwa/components/ui/panel";
import { Button } from "@/app/pwa/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useHyperliquid } from "@/providers/hyperliquid-provider";
import * as React from "react";

export default function HomePage() {
  const { getSpotPrice, placeSpotOrder, cancelAllOrders, connect, isConnected } = useHyperliquid();
  const [symbol, setSymbol] = React.useState<string>("HYPE");
  const [price, setPrice] = React.useState<string>("");
  const [size, setSize] = React.useState<string>("");
  const [isLimit, setIsLimit] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [priceData, setPriceData] = React.useState<{
    price: number;
    dayChangePct: string;
    volume: string;
  } | null>(null);

  React.useEffect(() => {
    if (!isConnected) {
      void connect();
    }
  }, [isConnected, connect]);

  return (
    <PwaSafeArea {...{ topNavHeight, bottomNavHeight }}>
      <PwaTopNavbar />
      <main className="grid grid-rows-[auto_1fr] gap-3 sm:gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1.15fr_0.85fr] sm:gap-4">
          <Panel
            title={`${symbol.toUpperCase()}-SPOT ${priceData ? `• ${priceData.price.toFixed(4)} USDC` : ""}`}
            right={
              <div className="flex items-center gap-2">
                <input
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  className="h-9 w-28 rounded-xl border bg-background px-3 text-xs outline-none"
                  placeholder="HYPE"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const data = await getSpotPrice(symbol);
                      setPriceData(data);
                      if (!isLimit) {
                        setPrice("");
                      } else {
                        setPrice(String(data.price.toFixed(4)));
                      }
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {loading ? "Loading..." : "Get Price"}
                </Button>
              </div>
            }
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Last Price</div>
                <div className="mt-1 text-base font-semibold">
                  {priceData ? `${priceData.price.toFixed(4)} USDC` : "-"}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">24h Change</div>
                <div className="mt-1 text-base font-semibold">
                  {priceData ? `${priceData.dayChangePct}%` : "-"}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">24h Volume</div>
                <div className="mt-1 text-base font-semibold">
                  {priceData ? `${priceData.volume} USDC` : "-"}
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-muted-foreground">Actions</div>
                <div className="mt-1 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setIsLimit(false)}>
                    Market
                  </Button>
                  <Button size="sm" onClick={() => setIsLimit(true)}>
                    Limit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={async () => void cancelAllOrders()}>
                    Cancel All
                  </Button>
                </div>
              </div>
            </div>
          </Panel>
          <div className="grid grid-rows-[auto_auto_1fr] gap-3 sm:gap-4">
            <Panel title="Order Entry">
              <OrderEntry
                isLimit={isLimit}
                price={price}
                size={size}
                setPrice={setPrice}
                setSize={setSize}
                onLong={async () => {
                  const sz = Number(size || "0.1");
                  await placeSpotOrder({
                    coin: symbol,
                    isBuy: true,
                    size: sz,
                    limitPx: isLimit ? Number(price || "0") : null,
                  });
                }}
                onShort={async () => {
                  const sz = Number(size || "0.1");
                  await placeSpotOrder({
                    coin: symbol,
                    isBuy: false,
                    size: sz,
                    limitPx: isLimit ? Number(price || "0") : null,
                  });
                }}
              />
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

// removed extra UI components not used in spot-only flow

function OrderEntry({
  isLimit,
  price,
  size,
  setPrice,
  setSize,
  onLong,
  onShort,
}: {
  isLimit: boolean;
  price: string;
  size: string;
  setPrice: (v: string) => void;
  setSize: (v: string) => void;
  onLong: () => Promise<void>;
  onShort: () => Promise<void>;
}) {
  return (
    <div className="grid gap-3">
      {isLimit && (
        <LabelRow label="Price (USDC)">
          <div className="flex items-center gap-2">
            <button className="rounded-full border p-2" onClick={() => setPrice((p) => String(Math.max(0, Number(p || 0) - 0.01)))}>
              <MinusIcon className="size-4" />
            </button>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none ring-0"
              placeholder="Limit price"
            />
            <button className="rounded-full border p-2" onClick={() => setPrice((p) => String(Number(p || 0) + 0.01))}>
              <PlusIcon className="size-4" />
            </button>
          </div>
        </LabelRow>
      )}
      <LabelRow label="Size">
        <input
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none ring-0"
          placeholder="Order size"
        />
      </LabelRow>
      <div className="grid grid-cols-2 gap-2">
        <Button className="w-full" variant="success" onClick={onLong}>
          Buy
        </Button>
        <Button className="w-full" variant="danger" onClick={onShort}>
          Sell
        </Button>
      </div>
    </div>
  );
}

// removed orderbook mock for simplicity

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
