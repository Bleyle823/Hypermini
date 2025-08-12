"use client";

import { useUser } from "@/contexts/user-context";
import Image from "next/image";
import { useAccount } from "wagmi";

export default function Home() {
  // Make user context optional to handle cases where it's not available
  let user, isLoading, error, signIn;
  try {
    const userContext = useUser();
    user = userContext.user;
    isLoading = userContext.isLoading;
    error = userContext.error;
    signIn = userContext.signIn;
  } catch (e) {
    // Handle case where user context is not available
    user = null;
    isLoading = false;
    error = null;
    signIn = () => {};
  }

  let address;
  try {
    const account = useAccount();
    address = account.address;
  } catch (e) {
    // Handle case where wallet is not connected
    address = null;
  }

  return (
    <div className="bg-white text-black flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl font-bold">Welcome to Mini-app Starter</h1>
        
        {/* Always visible content */}
        <div className="space-y-4">
          <p className="text-lg text-gray-600">
            This is a Farcaster mini-app starter template. You can explore the features below or sign in for a personalized experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🚀 Features</h3>
              <ul className="text-left text-gray-600 space-y-1">
                <li>• Next.js 14 with TypeScript</li>
                <li>• Farcaster Mini-app SDK</li>
                <li>• Wagmi for wallet integration</li>
                <li>• Tailwind CSS styling</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🛠️ Tech Stack</h3>
              <ul className="text-left text-gray-600 space-y-1">
                <li>• React Query for data fetching</li>
                <li>• JWT authentication</li>
                <li>• Redis for caching</li>
                <li>• Neynar API integration</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Authentication section */}
        <div className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-lg">
          {user?.data ? (
            <div className="space-y-4">
              <p className="text-lg text-green-600 font-medium">✅ You are signed in!</p>
              {user && (
                <div className="flex flex-col items-center space-y-2">
                  {user.isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400" />
                    </div>
                  ) : (
                    <>
                      <Image
                        src={user.data.pfp_url!}
                        alt="Profile"
                        className="w-20 h-20 rounded-full"
                        width={80}
                        height={80}
                      />
                      <div className="text-center">
                        <p className="font-semibold">{user.data.display_name}</p>
                        <p className="text-sm text-gray-500">
                          @{user.data.username}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
              {address && (
                <p className="text-sm text-gray-500">
                  Wallet: {address.substring(0, 6)}...{address.substring(address.length - 4)}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-gray-600">
                Want a personalized experience? Sign in with your Farcaster account!
              </p>
              <button
                onClick={signIn}
                disabled={isLoading}
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 min-w-[160px] min-h-[48px] mx-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign in with Farcaster"
                )}
              </button>
              {error && (
                <p className="text-sm text-red-500 mt-2">
                  Sign-in is only available within Farcaster
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
