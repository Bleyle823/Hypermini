"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, Sparkles, Shield, Zap } from "lucide-react";

export default function ConnectWallet() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
        <CardDescription className="text-base">
          Connect with Rainbow, MetaMask, WalletConnect, or any compatible wallet to start trading on Hyperliquid
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Connection Button */}
        <div className="flex justify-center">
          {/* @ts-ignore */}
          <appkit-button />
        </div>

        {/* Features List */}
        <div className="pt-4 space-y-3 border-t">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Trade on Hyperliquid DEX</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span>Secure wallet connection</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            <span>Fast and efficient trading</span>
          </div>
        </div>

        {/* Supported Wallets Info */}
        <div className="pt-2">
          <p className="text-xs text-center text-muted-foreground">
            Supports: Rainbow, MetaMask, WalletConnect, Coinbase Wallet, Trust Wallet, and more
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
