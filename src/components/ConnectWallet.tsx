"use client";

import { usePrivy } from "@privy-io/react-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ConnectWallet() {
  const { login, authenticated, ready } = usePrivy();

  const handleConnect = () => {
    login();
  };

  if (!ready) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Hyperliquid Trading</CardTitle>
          <CardDescription>
            Loading authentication...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Hyperliquid Trading</CardTitle>
        <CardDescription>
          Connect via Farcaster to start trading on Hyperliquid
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        <Button 
          onClick={handleConnect}
          className="w-full"
          size="lg"
        >
          Connect with Farcaster
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Secure authentication powered by Farcaster
        </p>
      </CardContent>
    </Card>
  );
}
