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
import { TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";

export default function Portfolio() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="w-[400px]">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio</CardTitle>
            <CardDescription>Connect your wallet to view portfolio</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Mock data for demonstration
  const portfolioData = {
    totalValue: "$12,450.32",
    dayChange: "+2.4%",
    dayChangeValue: "+$292.18",
    isPositive: true,
  };

  const positions = [
    { symbol: "USDC", amount: "8,450.32", value: "$8,450.32", change: "+0.0%" },
    { symbol: "ETH", amount: "1.2456", value: "$3,200.00", change: "+3.2%" },
    { symbol: "BTC", amount: "0.0123", value: "$800.00", change: "-1.1%" },
  ];

  return (
    <div className="w-[400px] space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet size={20} />
            Portfolio Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{portfolioData.totalValue}</div>
            <div className={`flex items-center justify-center gap-1 text-sm ${
              portfolioData.isPositive ? "text-green-500" : "text-red-500"
            }`}>
              {portfolioData.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {portfolioData.dayChange} ({portfolioData.dayChangeValue})
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Holdings</h3>
            <div className="space-y-3">
              {positions.map((position, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                  <div>
                    <div className="font-semibold">{position.symbol}</div>
                    <div className="text-sm text-muted-foreground">{position.amount}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{position.value}</div>
                    <div className={`text-sm ${
                      position.change.startsWith('+') ? "text-green-500" : 
                      position.change.startsWith('-') ? "text-red-500" : "text-muted-foreground"
                    }`}>
                      {position.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Button className="w-full">
              <DollarSign size={16} className="mr-2" />
              Deposit Funds
            </Button>
            <Button variant="outline" className="w-full">
              View Transaction History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
