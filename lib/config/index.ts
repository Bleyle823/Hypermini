export const MAINNET_API_URL = "https://api.hyperliquid.xyz";
export const TESTNET_API_URL = "https://api.hyperliquid-testnet.xyz";

export const builderPointsToPercent = (bps: number): string => {
  const safeBps = Number.isFinite(bps) ? bps : 0;
  return (safeBps * 0.01).toString() + "%";
};

interface Config {
  env: string;
  rpcUrl: string;
  builderAddress: `0x${string}`;
  builderFee: number;
  builderFeePercent: number;
}

export const config: Config = {
  env: process.env.NEXT_PUBLIC_NODE_ENV || "development",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "",
  builderAddress: process.env.NEXT_PUBLIC_BUILDER_ADDRESS as `0x${string}`,
  builderFee: Number(process.env.NEXT_PUBLIC_BUILDER_FEE ?? 0),
  builderFeePercent: Number(process.env.NEXT_PUBLIC_BUILDER_FEE ?? 0),
};

export const isMainnet = config.env === "production";


