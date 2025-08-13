"use client";

import {
  PwaBottomNavbar,
  bottomNavHeight,
} from "@/app/pwa/components/bottom-navbar";
import { PwaSafeArea } from "@/app/pwa/components/safe-area";
import { PwaTopNavbar, topNavHeight } from "@/app/pwa/components/top-navbar";
import { Panel } from "@/app/pwa/components/ui/panel";
import { Button } from "@/app/pwa/components/ui/button";
import Link from "next/link";
import { useHyperliquid } from "@/providers/hyperliquid-provider";
import * as React from "react";

export default function Page() {
  const {
    setPrivateKey,
    setWalletAddress,
    setTestnet,
    setBuilderAddress,
    setReferrerCode,
    connect,
    disconnect,
    approveBuilderFee,
    setReferrer,
    isConnected,
    isWebSocketConnected,
    testnet,
    error,
  } = useHyperliquid();

  const [localPk, setLocalPk] = React.useState("");
  const [localWallet, setLocalWallet] = React.useState("");
  const [localBuilder, setLocalBuilder] = React.useState("");
  const [localRef, setLocalRef] = React.useState("");
  const [fee, setFee] = React.useState(10);

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

        <Panel title="Hyperliquid Connection">
          <div className="grid gap-3 text-sm">
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Private key (TESTNET ONLY)</label>
              <input
                value={localPk}
                onChange={(e) => setLocalPk(e.target.value)}
                placeholder="0x..."
                className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
              />
              <div className="text-xs text-muted-foreground">Do not use mainnet private keys in the browser.</div>
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Wallet address (optional for API Agent)</label>
              <input
                value={localWallet}
                onChange={(e) => setLocalWallet(e.target.value)}
                placeholder="0x..."
                className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={testnet ? "primary" : "secondary"}
                onClick={() => setTestnet(true)}
              >
                Testnet
              </Button>
              <Button
                size="sm"
                variant={!testnet ? "primary" : "secondary"}
                onClick={() => setTestnet(false)}
              >
                Mainnet
              </Button>
              <Button
                size="sm"
                onClick={async () => {
                  setPrivateKey(localPk || null);
                  setWalletAddress(localWallet || null);
                  await connect();
                }}
              >
                {isConnected ? "Reconnect" : "Connect"}
              </Button>
              {isConnected && (
                <Button size="sm" variant="secondary" onClick={disconnect}>
                  Disconnect
                </Button>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Status: {isConnected ? "Connected" : "Disconnected"} • WS: {isWebSocketConnected ? "On" : "Off"}
              {error ? ` • ${error}` : ""}
            </div>
          </div>
        </Panel>

        <Panel title="Builder & Referrer">
          <div className="grid gap-3 text-sm">
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Builder address</label>
              <input
                value={localBuilder}
                onChange={(e) => setLocalBuilder(e.target.value)}
                placeholder="0x..."
                className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Max builder fee (tenths of a basis point)</label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="h-10 w-40 rounded-xl border bg-background px-3 text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={async () => {
                  setBuilderAddress(localBuilder || null);
                  await approveBuilderFee(fee);
                }}
              >
                Approve Builder Fee
              </Button>
            </div>
            <div className="grid gap-1">
              <label className="text-xs text-muted-foreground">Referrer code</label>
              <input
                value={localRef}
                onChange={(e) => setLocalRef(e.target.value)}
                placeholder="your-code"
                className="h-10 rounded-xl border bg-background px-3 text-sm outline-none"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setReferrerCode(localRef || null)}
                >
                  Set Code (local)
                </Button>
                <Button
                  size="sm"
                  onClick={async () => {
                    await setReferrer(localRef);
                  }}
                >
                  Send SetReferrer
                </Button>
              </div>
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
