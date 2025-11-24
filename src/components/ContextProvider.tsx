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
  name: "appkit-example",
  description: "AppKit Example",
  url: "https://appkitexampleapp.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// Create the modal with enhanced wallet support
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [hypeEvmTestnet, arbitrumSepolia],
  defaultNetwork: hypeEvmTestnet,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  // Explicitly include Rainbow Wallet and other popular wallets
  wallets: {
    includeWalletIds: [
      "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
      "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369", // Rainbow Wallet
      "4622a2b2d6af1c984494a1eea759b4c24dab8afe5aa55c0b0e5b3e0e0c0c0c0", // WalletConnect
      "ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18", // Coinbase Wallet
      "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa", // Trust Wallet
      "225affb176778569276e484e1fa9262c0d0d8b3a0b3c0d0e0f0a0b0c0d0e0f0a", // Zerion
      "c03dfee351b6fcc421b4494ea33b350d00201e1b0c0c0c0c0c0c0c0c0c0c0c0c", // Ledger
    ],
    excludeWalletIds: [],
  },
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
