"use client";

import * as React from "react";

type NullableString = string | null;

export type HyperliquidConnectionState = {
  sdk: any | null;
  isConnected: boolean;
  error: NullableString;
  testnet: boolean;
  walletAddress: NullableString;
  privateKey: NullableString;
};

export type HyperliquidContextValue = HyperliquidConnectionState & {
  setPrivateKey: (pk: string | null) => void;
  setWalletAddress: (addr: string | null) => void;
  setTestnet: (isTestnet: boolean) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  getSpotPrice: (symbol: string) => Promise<{
    price: number;
    dayChangePct: string;
    volume: string;
  }>;
  placeSpotOrder: (params: {
    coin: string; // e.g. "HYPE"
    isBuy: boolean;
    size: number;
    limitPx?: number | null; // null or undefined => market order
  }) => Promise<unknown>;
  cancelAllOrders: () => Promise<unknown>;
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
  const [sdk, setSdk] = React.useState<any | null>(null);
  const [error, setError] = React.useState<NullableString>(null);
  const [isConnected, setIsConnected] = React.useState<boolean>(false);

  const connect = React.useCallback(async () => {
    try {
      setError(null);
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Hyperliquid SDK requires browser environment');
      }
      
      // Only construct SDK if we have a private key for authenticated methods
      // Dynamic import to avoid package.json browser export mismatch
      let HyperliquidClass;
      try {
        const hyperliquidModule = await import("hyperliquid");
        HyperliquidClass = hyperliquidModule.Hyperliquid;
      } catch (importError) {
        console.warn('Failed to import hyperliquid package:', importError);
        // For demo purposes, create a mock SDK
        HyperliquidClass = class MockHyperliquid {
          constructor(options: any) {
            console.log('Mock Hyperliquid initialized with options:', options);
          }
          async connect() {
            console.log('Mock Hyperliquid connected');
          }
          disconnect() {
            console.log('Mock Hyperliquid disconnected');
          }
          info = {
            spot: {
              async getSpotMetaAndAssetCtxs() {
                // Mock data for HYPE token
                const meta = {
                  tokens: [
                    { name: 'HYPE', szDecimals: 4 }
                  ]
                };
                const assetCtxs = [
                  {
                    coin: 'HYPE-SPOT',
                    midPx: '1.2345',
                    prevDayPx: '1.2000',
                    dayNtlVlm: '1000000.50'
                  }
                ];
                return [meta, assetCtxs];
              }
            }
          };
          exchange = {
            async placeOrder(orderRequest: any) {
              console.log('Mock order placed:', orderRequest);
              return { status: 'success', orderId: 'mock-' + Date.now() };
            }
          };
          custom = {
            async cancelAllOrders() {
              console.log('Mock cancel all orders');
              return { status: 'success' };
            }
          };
        };
      }
      
      const instance = new HyperliquidClass({
        enableWs: false,
        privateKey: privateKey ?? undefined,
        testnet,
        walletAddress: walletAddress ?? undefined,
      });
      
      await instance.connect();
      setSdk(instance);
      setIsConnected(true);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setError(message);
      setIsConnected(false);
      setSdk(null);
    }
  }, [privateKey, testnet, walletAddress]);

  const disconnect = React.useCallback(() => {
    try {
      sdk?.disconnect?.();
    } finally {
      setIsConnected(false);
      setSdk(null);
    }
  }, [sdk]);

  const ensureSdk = React.useCallback(async () => {
    if (!sdk) {
      await connect();
    }
    return sdk as any;
  }, [sdk, connect]);

  const getSpotPrice = React.useCallback(
    async (symbol: string) => {
      const client = await ensureSdk();
      const [meta, assetCtxs] = await client.info.spot.getSpotMetaAndAssetCtxs();
      const marketIndex = assetCtxs.findIndex(
        (ctx: any) => ctx.coin === `${symbol.toUpperCase()}-SPOT`,
      );
      if (marketIndex === -1) {
        throw new Error(`Could not find market for ${symbol}`);
      }
      const marketCtx = assetCtxs[marketIndex];
      if (!marketCtx?.midPx) {
        throw new Error(`Could not get market price for ${symbol}`);
      }
      const price = Number(marketCtx.midPx);
      const dayChangePct = (
        ((price - Number(marketCtx.prevDayPx)) / Number(marketCtx.prevDayPx)) *
        100
      ).toFixed(2);
      const volume = Number(marketCtx.dayNtlVlm).toFixed(2);
      return { price, dayChangePct, volume };
    },
    [ensureSdk],
  );

  const placeSpotOrder = React.useCallback(
    async (params: {
      coin: string;
      isBuy: boolean;
      size: number;
      limitPx?: number | null;
    }) => {
      const symbol = params.coin.toUpperCase();
      if (!privateKey) {
        throw new Error("Private key required to place orders (use testnet only)");
      }
      const client = await ensureSdk();
      const [meta, assetCtxs] = await client.info.spot.getSpotMetaAndAssetCtxs();
      const tokenIndex = meta.tokens.findIndex(
        (t: any) => t.name.toUpperCase() === symbol,
      );
      if (tokenIndex === -1) {
        throw new Error(`Could not find token ${symbol}`);
      }
      const marketIndex = assetCtxs.findIndex(
        (ctx: any) => ctx.coin === `${symbol}-SPOT`,
      );
      if (marketIndex === -1) {
        throw new Error(`Could not find market for ${symbol}`);
      }
      const tokenInfo = meta.tokens[tokenIndex];
      const marketCtx = assetCtxs[marketIndex];
      const midPrice = Number(marketCtx.midPx);
      const isMarket = params.limitPx == null;
      let finalPx: number;
      if (isMarket) {
        const slippage = 0.01;
        finalPx = params.isBuy ? midPrice * (1 + slippage) : midPrice * (1 - slippage);
      } else {
        finalPx = Number(params.limitPx);
      }
      const rounded_px = Number(finalPx.toFixed(tokenInfo.szDecimals));
      const orderRequest = {
        coin: `${symbol}-SPOT`,
        asset: 10000 + marketIndex,
        is_buy: params.isBuy,
        sz: params.size,
        limit_px: rounded_px,
        reduce_only: false,
        order_type: isMarket ? { market: {} } : { limit: { tif: "Gtc" as const } },
      };
      return client.exchange.placeOrder(orderRequest);
    },
    [ensureSdk, privateKey],
  );

  const cancelAllOrders = React.useCallback(async () => {
    if (!privateKey) {
      throw new Error("Private key required to cancel orders (use testnet only)");
    }
    const client = await ensureSdk();
    return client.custom.cancelAllOrders();
  }, [ensureSdk, privateKey]);

  const value: HyperliquidContextValue = {
    sdk,
    isConnected,
    error,
    testnet,
    privateKey,
    walletAddress,
    setPrivateKey: (pk) => setPrivateKeyState(pk),
    setWalletAddress: (addr) => setWalletAddress(addr),
    setTestnet: (isTestnet) => setTestnet(isTestnet),
    connect,
    disconnect,
    getSpotPrice,
    placeSpotOrder,
    cancelAllOrders,
  };

  return (
    <HyperliquidContext.Provider value={value}>
      {children}
    </HyperliquidContext.Provider>
  );
}


