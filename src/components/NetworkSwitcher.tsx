"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Network, Check } from "lucide-react";
import { useChainId } from "wagmi";
import { hypeEvmTestnet } from "@/lib/config/chains";
import { arbitrumSepolia } from "@reown/appkit/networks";
import { useToast } from "@/hooks/use-toast";

const networks = [
  {
    id: hypeEvmTestnet.id,
    name: hypeEvmTestnet.name,
    symbol: hypeEvmTestnet.nativeCurrency.symbol,
  },
  {
    id: arbitrumSepolia.id,
    name: arbitrumSepolia.name,
    symbol: arbitrumSepolia.nativeCurrency.symbol,
  },
];

export default function NetworkSwitcher() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const { toast } = useToast();

  if (!isConnected) {
    return null;
  }

  const handleSwitchChain = async (targetChainId: number) => {
    if (chainId === targetChainId) {
      toast({
        title: "Already on this network",
        description: `You are already connected to ${networks.find(n => n.id === targetChainId)?.name}`,
      });
      return;
    }

    try {
      switchChain({ chainId: targetChainId });
      toast({
        title: "Switching network",
        description: `Switching to ${networks.find(n => n.id === targetChainId)?.name}...`,
      });
    } catch (error) {
      toast({
        title: "Failed to switch network",
        description: "Please switch the network manually in your wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          <CardTitle>Network</CardTitle>
        </div>
        <CardDescription>Switch between supported networks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {networks.map((network) => {
          const isActive = chainId === network.id;
          return (
            <Button
              key={network.id}
              variant={isActive ? "default" : "outline"}
              className="w-full justify-between"
              onClick={() => handleSwitchChain(network.id)}
              disabled={isPending || isActive}
            >
              <div className="flex items-center gap-2">
                <span>{network.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({network.symbol})
                </span>
              </div>
              {isActive && <Check className="h-4 w-4" />}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

