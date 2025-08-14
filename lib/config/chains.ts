import { defineChain } from "viem";

export const hypeEvmTestnet = /*#__PURE__*/ defineChain({
  id: 998,
  name: "Hype EVM Testnet",
  nativeCurrency: { name: "Hype", symbol: "HYPE", decimals: 18 },
  rpcUrls: {
    default: {
      http: ["https://api.hyperliquid-testnet.xyz/evm"],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://hyperevm-explorer.vercel.app",
      apiUrl: "https://api.hyperliquid-testnet.xyz",
    },
  },
});


