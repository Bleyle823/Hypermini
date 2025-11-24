"use client";

import { useState } from "react";
import { useAccount, useBalance, useDisconnect, useChainId } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Wallet,
  Copy,
  Check,
  ExternalLink,
  LogOut,
  Network,
} from "lucide-react";
import { formatEther } from "viem";
import { useToast } from "@/hooks/use-toast";

export default function WalletInfo() {
  const { address, isConnected, connector } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getExplorerUrl = () => {
    if (chainId === 998) {
      return `https://hyperevm-explorer.vercel.app/address/${address}`;
    }
    if (chainId === 421614) {
      return `https://sepolia-explorer.arbitrum.io/address/${address}`;
    }
    return `https://etherscan.io/address/${address}`;
  };

  const getNetworkName = () => {
    if (chainId === 998) return "Hype EVM Testnet";
    if (chainId === 421614) return "Arbitrum Sepolia";
    return `Chain ${chainId}`;
  };

  const getWalletName = () => {
    if (!connector) return "Unknown Wallet";
    return connector.name || "Connected Wallet";
  };

  if (!isConnected || !address) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle>Wallet Connected</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => disconnect()}
            className="text-destructive hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Disconnect
          </Button>
        </div>
        <CardDescription>{getWalletName()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Address */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Address</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-7 px-2"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(getExplorerUrl(), "_blank")}
                className="h-7 px-2"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <code className="text-sm font-mono flex-1 break-all">
              {address}
            </code>
          </div>
        </div>

        <Separator />

        {/* Network Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Network className="h-4 w-4" />
              Network
            </span>
          </div>
          <div className="p-2 bg-muted rounded-md">
            <span className="text-sm">{getNetworkName()}</span>
            <span className="text-xs text-muted-foreground ml-2">
              (Chain ID: {chainId})
            </span>
          </div>
        </div>

        <Separator />

        {/* Balance */}
        {balance && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Balance</span>
            <div className="p-2 bg-muted rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {parseFloat(formatEther(balance.value)).toFixed(6)}{" "}
                  {balance.symbol}
                </span>
                <span className="text-xs text-muted-foreground">
                  ≈ ${(parseFloat(formatEther(balance.value)) * 2000).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

