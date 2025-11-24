"use client";

import { useAccount, useBalance, useChainId, useDisconnect } from "wagmi";
import { formatEther } from "viem";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for wallet connection status and basic info
 */
export function useWallet() {
  const { address, isConnected, connector, isConnecting, isDisconnected } =
    useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  const getWalletName = () => {
    if (!connector) return "Unknown Wallet";
    return connector.name || "Connected Wallet";
  };

  const getNetworkName = () => {
    if (chainId === 998) return "Hype EVM Testnet";
    if (chainId === 421614) return "Arbitrum Sepolia";
    return `Chain ${chainId}`;
  };

  const disconnectWallet = () => {
    disconnect();
    toast({
      title: "Wallet disconnected",
      description: "You have been disconnected from your wallet",
    });
  };

  return {
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    connector,
    chainId,
    walletName: getWalletName(),
    networkName: getNetworkName(),
    disconnect: disconnectWallet,
  };
}

/**
 * Hook for wallet balance
 */
export function useWalletBalance() {
  const { address } = useAccount();
  const { data: balance, isLoading, error } = useBalance({
    address,
  });

  const formattedBalance = balance
    ? parseFloat(formatEther(balance.value)).toFixed(6)
    : "0.000000";

  const symbol = balance?.symbol || "ETH";

  return {
    balance,
    formattedBalance,
    symbol,
    isLoading,
    error,
    hasBalance: balance ? balance.value > 0n : false,
  };
}

/**
 * Hook for copying wallet address to clipboard
 */
export function useCopyAddress() {
  const { address } = useAccount();
  const { toast } = useToast();

  const copyAddress = async () => {
    if (!address) {
      toast({
        title: "No address",
        description: "Wallet is not connected",
        variant: "destructive",
      });
      return false;
    }

    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
      });
      return true;
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy address to clipboard",
        variant: "destructive",
      });
      return false;
    }
  };

  return { copyAddress, address };
}

/**
 * Hook for getting explorer URL
 */
export function useExplorerUrl() {
  const { address } = useAccount();
  const chainId = useChainId();

  const getExplorerUrl = (type: "address" | "tx" = "address", hash?: string) => {
    const target = hash || address;
    if (!target) return null;

    if (chainId === 998) {
      return `https://hyperevm-explorer.vercel.app/${type}/${target}`;
    }
    if (chainId === 421614) {
      return `https://sepolia-explorer.arbitrum.io/${type}/${target}`;
    }
    return `https://etherscan.io/${type}/${target}`;
  };

  const openExplorer = (type: "address" | "tx" = "address", hash?: string) => {
    const url = getExplorerUrl(type, hash);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return { getExplorerUrl, openExplorer };
}

