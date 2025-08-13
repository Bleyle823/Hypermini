"use client";

import * as React from "react";

type NullableString = string | null;

export type HyperliquidConnectionState = {
  sdk: any | null;
  isConnected: boolean;
  isWebSocketConnected: boolean;
  error: NullableString;
  testnet: boolean;
  walletAddress: NullableString;
  builderAddress: NullableString;
  referrerCode: NullableString;
};

export type HyperliquidContextValue = HyperliquidConnectionState & {
  setPrivateKey: (pk: string | null) => void;
  setWalletAddress: (addr: string | null) => void;
  setTestnet: (isTestnet: boolean) => void;
  setBuilderAddress: (addr: string | null) => void;
  setReferrerCode: (code: string | null) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  approveBuilderFee: (maxFeeRate: number) => Promise<unknown>;
  setReferrer: (code: string) => Promise<unknown>;
  placeOrderExample: (params: {
    coin: string;
    isBuy: boolean;
    size: number | string;
    limitPx: number | string;
  }) => Promise<unknown>;
};

const HyperliquidContext = React.createContext<HyperliquidContextValue | null>(
  null,
);

export function useHyperliquid() {
  const ctx = React.useContext(HyperliquidContext);
  if (ctx == null) {
    throw new Error("useHyperliquid must be used within HyperliquidProvider");
  }
  return ctx;
}

export function HyperliquidProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [privateKey, setPrivateKeyState] = React.useState<string | null>(null);
  const [walletAddress, setWalletAddress] = React.useState<NullableString>(
    null,
  );
  const [testnet, setTestnet] = React.useState<boolean>(true);
  const [builderAddress, setBuilderAddress] = React.useState<NullableString>(
    null,
  );
  const [referrerCode, setReferrerCode] = React.useState<NullableString>(null);
  const [sdk, setSdk] = React.useState<any | null>(null);
  const [error, setError] = React.useState<NullableString>(null);
  const [isConnected, setIsConnected] = React.useState<boolean>(false);
  const [isWebSocketConnected, setIsWebSocketConnected] =
    React.useState<boolean>(false);

  const connect = React.useCallback(async () => {
    try {
      setError(null);
      // Only construct SDK if we have a private key for authenticated methods
      // Dynamic import to avoid package.json browser export mismatch
      const { Hyperliquid } = await import("hyperliquid");
      const instance = new Hyperliquid({
        enableWs: true,
        privateKey: privateKey ?? undefined,
        testnet,
        walletAddress: walletAddress ?? undefined,
      });
      await instance.connect();
      setSdk(instance);
      setIsConnected(true);
      setIsWebSocketConnected(instance.isWebSocketConnected());
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      setIsConnected(false);
      setIsWebSocketConnected(false);
      setSdk(null);
    }
  }, [privateKey, testnet, walletAddress]);

  const disconnect = React.useCallback(() => {
    try {
      sdk?.disconnect();
    } finally {
      setIsConnected(false);
      setIsWebSocketConnected(false);
      setSdk(null);
    }
  }, [sdk]);

  const approveBuilderFee = React.useCallback(
    async (maxFeeRate: number) => {
      if (!sdk) throw new Error("SDK not initialized");
      if (builderAddress == null) throw new Error("Builder address required");
      if (!privateKey)
        throw new Error(
          "Private key required in browser for signing. Use testnet only.",
        );
      await sdk.connect();
      // Ensure ws is ready
      await new Promise((r) => setTimeout(r, 500));
      return sdk.wsPayloads.approveBuilderFee(builderAddress, maxFeeRate);
    },
    [sdk, builderAddress, privateKey],
  );

  const setReferrer = React.useCallback(
    async (code: string) => {
      if (!sdk) throw new Error("SDK not initialized");
      if (!privateKey)
        throw new Error(
          "Private key required in browser for signing. Use testnet only.",
        );
      await sdk.connect();
      await new Promise((r) => setTimeout(r, 500));
      return sdk.wsPayloads.setReferrer(code);
    },
    [sdk, privateKey],
  );

  const placeOrderExample = React.useCallback(
    async (params: {
      coin: string;
      isBuy: boolean;
      size: number | string;
      limitPx: number | string;
    }) => {
      if (!sdk) throw new Error("SDK not initialized");
      if (!privateKey)
        throw new Error(
          "Private key required in browser for signing. Use testnet only.",
        );
      await sdk.connect();
      await new Promise((r) => setTimeout(r, 500));
      return sdk.exchange.placeOrder({
        coin: params.coin,
        is_buy: params.isBuy,
        sz: params.size,
        limit_px: params.limitPx,
        order_type: { limit: { tif: "Gtc" } },
        reduce_only: false,
        ...(builderAddress
          ? {
              builder: {
                address: builderAddress,
                fee: 10, // example: 1 bp. Real fee subject to user's max approval
              },
            }
          : {}),
      });
    },
    [sdk, privateKey, builderAddress],
  );

  const value: HyperliquidContextValue = {
    sdk,
    isConnected,
    isWebSocketConnected,
    error,
    testnet,
    walletAddress,
    builderAddress,
    referrerCode,
    setPrivateKey: (pk) => setPrivateKeyState(pk),
    setWalletAddress: (addr) => setWalletAddress(addr),
    setTestnet: (isTestnet) => setTestnet(isTestnet),
    setBuilderAddress: (addr) => setBuilderAddress(addr),
    setReferrerCode: (code) => setReferrerCode(code),
    connect,
    disconnect,
    approveBuilderFee,
    setReferrer,
    placeOrderExample,
  };

  return (
    <HyperliquidContext.Provider value={value}>
      {children}
    </HyperliquidContext.Provider>
  );
}


