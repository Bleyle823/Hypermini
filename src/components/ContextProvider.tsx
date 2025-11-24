"use client";

import { type ReactNode } from "react";
import { createAppKit } from "@reown/appkit/react";
import { arbitrumSepolia } from "@reown/appkit/networks";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { wagmiAdapter, projectId } from "@/lib/config/wagmi";
import { hypeEvmTestnet } from "@/lib/config/chains";

const queryClient = new QueryClient();

// Set up metadata
const metadata = {
  name: "Hyperliquid Trading",
  description: "Trade on Hyperliquid DEX directly from Farcaster",
  url: typeof window !== "undefined" ? window.location.origin : "https://hyperliquid.xyz",
  icons: ["https://hyperliquid.xyz/favicon.ico"],
};

// Create the modal with enhanced wallet support
// AppKit automatically includes Rainbow Wallet, MetaMask, WalletConnect, and other compatible wallets
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [hypeEvmTestnet, arbitrumSepolia],
  defaultNetwork: hypeEvmTestnet,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  // AppKit includes Rainbow Wallet by default through WalletConnect
  // All compatible wallets are automatically available
});

export const ContextProvider = ({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) => {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
