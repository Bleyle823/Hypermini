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
    connect,
    disconnect,
    isConnected,
    testnet,
    error,
  } = useHyperliquid();

  const [localPk, setLocalPk] = React.useState("");
  const [localWallet, setLocalWallet] = React.useState("");


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
            <div className="text-xs text-muted-foreground">Status: {isConnected ? "Connected" : "Disconnected"}{error ? ` • ${error}` : ""}</div>
          </div>
        </Panel>

        {/* Builder/referrer controls removed for minimal non-agent app */}

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
