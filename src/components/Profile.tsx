"use client";

import { useAccount } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useUserStore from "@/lib/store";

export default function Profile() {
  const { address, isConnected } = useAccount();
  const user = useUserStore((state) => state.user);

  if (!isConnected) {
    return (
      <div className="w-[400px]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Connect your wallet to view profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-[400px] space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your Hyperliquid account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Wallet Address</label>
            <p className="text-sm text-muted-foreground font-mono">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
            </p>
          </div>
          
          {user && (
            <>
              <div>
                <label className="text-sm font-medium">Builder Fee Status</label>
                <p className="text-sm text-muted-foreground">
                  {user.builderFee ? "✅ Approved" : "❌ Not Approved"}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Agent Status</label>
                <p className="text-sm text-muted-foreground">
                  {user.agent ? "✅ Approved" : "❌ Not Approved"}
                </p>
              </div>
            </>
          )}
          
          <Button variant="outline" className="w-full">
            View Full Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
