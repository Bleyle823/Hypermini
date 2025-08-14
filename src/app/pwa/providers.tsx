"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { HyperliquidProvider } from "@/providers/hyperliquid-provider";

export function PwaProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <HyperliquidProvider>{children}</HyperliquidProvider>
    </ThemeProvider>
  );
}
