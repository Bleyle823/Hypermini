"use client";

import { useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { sdk } from "@farcaster/miniapp-sdk";
import ConnectWallet from "@/components/ConnectWallet";
import Trade from "@/components/Trade";
import Profile from "@/components/Profile";
import Settings from "@/components/Settings";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import BottomNavigation from "@/components/BottomNavigation";

export default function Home() {
  const { authenticated, ready } = usePrivy();
  const [activeTab, setActiveTab] = useState("trade");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize Farcaster SDK
    const initFarcaster = async () => {
      try {
        // Signal that the app is ready
        await sdk.actions.ready();
        setIsReady(true);
      } catch (error) {
        console.log("Farcaster SDK not available, running in standalone mode");
        setIsReady(true);
      }
    };

    initFarcaster();
  }, []);

  const renderContent = () => {
    if (!ready || !authenticated) {
      return <ConnectWallet />;
    }

    switch (activeTab) {
      case "trade":
        return <Trade />;
      case "portfolio":
        return <Portfolio />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      case "about":
        return <About />;
      default:
        return <Trade />;
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Wallet Connection Section - Centered */}
      {!isConnected && (
        <div className="flex items-center justify-center pt-20 px-6">
          {renderContent()}
        </div>
      )}

      {/* Main Content */}
      {isConnected && (
        <>
          <div className="flex justify-center px-6 pt-6 pb-20">
            {renderContent()}
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </>
      )}
    </div>
  );
}
