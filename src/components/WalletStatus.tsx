"use client";

import { useAccount, useBalance, useChainId } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle2, XCircle } from "lucide-react";
import { formatEther } from "viem";
import { cn } from "@/lib/utils";

interface WalletStatusProps {
  className?: string;
  showBalance?: boolean;
  compact?: boolean;
}

export default function WalletStatus({
  className,
  showBalance = false,
  compact = false,
}: WalletStatusProps) {
  const { address, isConnected, connector } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const chainId = useChainId();

  if (!isConnected) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <XCircle className="h-4 w-4 text-destructive" />
        {!compact && <span className="text-sm text-muted-foreground">Not Connected</span>}
      </div>
    );
  }

  const getNetworkName = () => {
    if (chainId === 998) return "Hype";
    if (chainId === 421614) return "Arb Sepolia";
    return `Chain ${chainId}`;
  };

  const getWalletName = () => {
    if (!connector) return "Wallet";
    const name = connector.name || "Wallet";
    // Shorten long wallet names
    if (name.length > 12) {
      return name.substring(0, 12) + "...";
    }
    return name;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CheckCircle2 className="h-4 w-4 text-green-500" />
      {!compact && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{getWalletName()}</span>
            <span className="text-xs text-muted-foreground">({getNetworkName()})</span>
          </div>
          {showBalance && balance && (
            <span className="text-sm text-muted-foreground">
              {parseFloat(formatEther(balance.value)).toFixed(4)} {balance.symbol}
            </span>
          )}
          {address && (
            <span className="text-xs text-muted-foreground font-mono">
              {address.slice(0, 4)}...{address.slice(-4)}
            </span>
          )}
        </>
      )}
    </div>
  );
}

