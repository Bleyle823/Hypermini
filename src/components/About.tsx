"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Github, Twitter } from "lucide-react";

export default function About() {
  return (
    <div className="w-[400px] space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>About Hyperliquid Trading</CardTitle>
          <CardDescription>
            A Farcaster mini app for seamless Hyperliquid spot trading
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">What is Hyperliquid?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hyperliquid is a high-performance decentralized exchange offering 
              perpetual futures and spot trading with deep liquidity and low fees. 
              This mini app brings trading capabilities directly to Farcaster.
            </p>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Features</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Spot trading with instant execution</li>
              <li>• Real-time price feeds</li>
              <li>• Portfolio management</li>
              <li>• Secure wallet integration</li>
              <li>• Native Farcaster experience</li>
            </ul>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Links</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://hyperliquid.xyz" target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} className="mr-2" />
                  Hyperliquid Website
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://docs.hyperliquid.xyz" target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} className="mr-2" />
                  Documentation
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="https://twitter.com/hyperliquid_xyz" target="_blank" rel="noopener noreferrer">
                  <Twitter size={16} className="mr-2" />
                  Follow on Twitter
                </a>
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Version 1.0.0 • Built for Farcaster
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
