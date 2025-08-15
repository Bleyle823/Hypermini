"use client";

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

export default function Settings() {
  return (
    <div className="w-[400px] space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your trading preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
          
          <Separator />
          
          <Button variant="destructive" className="w-full">
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
