"use client";

import { MiniAppProvider } from "@/contexts/miniapp-context";
import { UserProvider } from "@/contexts/user-context";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "react-error-boundary";

const ErudaProvider = dynamic(
  () => import("../components/Eruda").then((c) => c.ErudaProvider),
  { ssr: false }
);

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 max-w-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">
          {error.message.includes("mini app") || error.message.includes("SDK") 
            ? "This app works best within Farcaster, but you can still explore the basic features." 
            : error.message}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Continue anyway
        </button>
      </div>
    </div>
  );
}

function SafeMiniAppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error) => console.warn("MiniApp provider error (non-critical):", error)}
    >
      <MiniAppProvider addMiniAppOnLoad={false}>
        {children}
      </MiniAppProvider>
    </ErrorBoundary>
  );
}

function SafeUserProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary 
      FallbackComponent={({ children: fallbackChildren }) => <>{fallbackChildren}</>}
      onError={(error) => console.warn("User provider error (non-critical):", error)}
    >
      <UserProvider autoSignIn={false}>{children}</UserProvider>
    </ErrorBoundary>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErudaProvider>
      <SafeMiniAppProvider>
        <SafeUserProvider>
          {children}
        </SafeUserProvider>
      </SafeMiniAppProvider>
    </ErudaProvider>
  );
}
