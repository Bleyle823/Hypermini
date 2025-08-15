"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useUserStore from "@/lib/store";

export default function Profile() {
  const { authenticated, user: privyUser, logout } = usePrivy();
  const { wallets } = useWallets();
  const user = useUserStore((state) => state.user);
  
  const address = wallets.find(wallet => wallet.walletClientType === 'privy')?.address || 
                  wallets[0]?.address;

  if (!authenticated) {
    return (
      <div className="w-[400px]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Connect your wallet to view profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-[400px] space-y-4">
      {/* Farcaster Profile Card */}
      {user?.farcasterUser && (
        <Card>
          <CardHeader>
            <CardTitle>Farcaster Profile</CardTitle>
            <CardDescription>Your connected Farcaster account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              {user.farcasterUser.pfp && (
                <img 
                  src={user.farcasterUser.pfp} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-medium">
                  {user.farcasterUser.displayName || user.farcasterUser.username}
                </p>
                <p className="text-sm text-muted-foreground">
                  @{user.farcasterUser.username}
                </p>
                <p className="text-xs text-muted-foreground">
                  FID: {user.farcasterUser.fid}
                </p>
              </div>
            </div>
            
            {user.farcasterUser.bio && (
              <div>
                <label className="text-sm font-medium">Bio</label>
                <p className="text-sm text-muted-foreground">
                  {user.farcasterUser.bio}
                </p>
              </div>
            )}
            
            <div className="flex space-x-4 text-sm">
              <span>
                <strong>{user.farcasterUser.followerCount}</strong> followers
              </span>
              <span>
                <strong>{user.farcasterUser.followingCount}</strong> following
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trading Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Profile</CardTitle>
          <CardDescription>Your Hyperliquid account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Wallet Address</label>
            <p className="text-sm text-muted-foreground font-mono">
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"}
            </p>
          </div>
          
          {user && (
            <>
              <div>
                <label className="text-sm font-medium">Builder Fee Status</label>
                <p className="text-sm text-muted-foreground">
                  {user.builderFee ? "✅ Approved" : "❌ Not Approved"}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Agent Status</label>
                <p className="text-sm text-muted-foreground">
                  {user.agent ? "✅ Approved" : "❌ Not Approved"}
                </p>
              </div>
            </>
          )}
          
          <Button 
            variant="outline" 
            onClick={logout}
            className="w-full"
          >
            Disconnect
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
