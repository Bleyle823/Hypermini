"use client";

import { useAccount } from "wagmi";
import WalletStatus from "@/components/WalletStatus";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function Header() {
  const { isConnected } = useAccount();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-center">
        <div className="w-[400px] flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Hyperliquid</h1>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <WalletStatus compact />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // @ts-ignore
                  document.querySelector("appkit-button")?.click();
                }}
              >
                Connect
              </Button>
            )}
            {/* Account Button */}
            {isConnected && (
              <div>
                {/* @ts-ignore */}
                <appkit-account-button />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

