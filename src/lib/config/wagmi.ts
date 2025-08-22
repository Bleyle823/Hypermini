import { createConfig, http } from 'wagmi'
import { arbitrumSepolia } from 'viem/chains'
import { hypeEvmTestnet } from "./chains";

export const projectId = "02b218a0fae412edcdb5e5bff9441a94";

export const networks = [hypeEvmTestnet, arbitrumSepolia];

// Create Wagmi config for Privy
export const config = createConfig({
  chains: [hypeEvmTestnet, arbitrumSepolia],
  transports: {
    [hypeEvmTestnet.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

// Minimal adapter shape expected by callers
export const wagmiAdapter = {
  wagmiConfig: config,
};