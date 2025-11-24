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
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import useUserStore from "@/lib/store";
import WalletInfo from "@/components/WalletInfo";

export default function Profile() {
  const { isConnected } = useAccount();
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
      {/* Wallet Information */}
      <WalletInfo />

      {/* Trading Account Details */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Account</CardTitle>
          <CardDescription>Your Hyperliquid trading permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <>
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Builder Fee Status</span>
                </div>
                <div className="flex items-center gap-2">
                  {user.builderFee ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Approved</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-destructive">Not Approved</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Agent Status</span>
                </div>
                <div className="flex items-center gap-2">
                  {user.agent ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Approved</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-destructive">Not Approved</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
          
          <Separator />
          
          <Button variant="outline" className="w-full" asChild>
            <a
              href="https://hyperliquid.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <span>View on Hyperliquid</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
