"use client";

import { type ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/config/wagmi";
import { hypeEvmTestnet } from "@/lib/config/chains";
import { arbitrumSepolia } from "viem/chains";

const queryClient = new QueryClient();

export const ContextProvider = ({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) => {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        // Configure Farcaster as the primary login method
        appearance: {
          loginMethods: ['farcaster', 'wallet'],
          theme: 'dark',
          accentColor: '#6366f1',
        },
        // Configure supported chains
        supportedChains: [hypeEvmTestnet, arbitrumSepolia],
        defaultChain: hypeEvmTestnet,
        // Enable embedded wallet creation
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};
