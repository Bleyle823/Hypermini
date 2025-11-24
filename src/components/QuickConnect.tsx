"use client";

import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from "lucide-react";
import { useDisconnect } from "wagmi";
import WalletStatus from "@/components/WalletStatus";

/**
 * Quick connect/disconnect button component
 * Can be used anywhere in the app for quick wallet access
 */
export default function QuickConnect() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <Button
        onClick={() => {
          // @ts-ignore
          document.querySelector("appkit-button")?.click();
        }}
        className="flex items-center gap-2"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <WalletStatus compact />
      <Button
        variant="outline"
        size="sm"
        onClick={() => disconnect()}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Disconnect
      </Button>
    </div>
  );
}

