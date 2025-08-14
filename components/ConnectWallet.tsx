"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect } from "wagmi";

export default function ConnectWallet() {
  const { connectors, connect, status, error } = useConnect();
  const { isConnecting } = useAccount();

  const primary = connectors[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hyperliquid Spot Boilerplate</CardTitle>
        <CardDescription>Connect your wallet to start using the app</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => primary && connect({ connector: primary })}
          disabled={!primary || isConnecting || status === "pending"}
        >
          {isConnecting || status === "pending" ? "Connecting..." : "Connect Wallet"}
        </Button>
        {error ? (
          <p className="text-sm text-red-500 mt-2">{error.message}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}


