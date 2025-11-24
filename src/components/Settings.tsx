"use client";

import { useAccount, useDisconnect } from "wagmi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LogOut, Wallet, Network, Settings as SettingsIcon } from "lucide-react";
import NetworkSwitcher from "@/components/NetworkSwitcher";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: "Wallet disconnected",
      description: "You have been disconnected from your wallet",
    });
  };

  return (
    <div className="w-[400px] space-y-4">
      {/* Wallet Management */}
      {isConnected && (
        <>
          <NetworkSwitcher />
          <Separator />
        </>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            <CardTitle>Settings</CardTitle>
          </div>
          <CardDescription>Manage your trading preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet Settings
            </Label>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  // @ts-ignore
                  document.querySelector("appkit-button")?.click();
                }}
              >
                Change Wallet
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  // @ts-ignore
                  document.querySelector("appkit-account-button")?.click();
                }}
              >
                Wallet Details
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base font-medium">Trading Settings</Label>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Slippage Tolerance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Gas Price Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Default Order Size
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base font-medium">Notifications</Label>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Price Alerts
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Trade Confirmations
              </Button>
              <Button variant="outline" className="w-full justify-start">
                System Updates
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-base font-medium">Security</Label>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Transaction Signing
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Session Management
              </Button>
            </div>
          </div>

          {isConnected && (
            <>
              <Separator />
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDisconnect}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect Wallet
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
