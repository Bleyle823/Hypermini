"use client";

import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useWallets } from "@privy-io/react-auth";
import useUserStore from "@/lib/store";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { authenticated, user: privyUser, ready } = usePrivy();
  const { wallets } = useWallets();
  const user = useUserStore((state) => state.user);
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);

  // Get the primary wallet address
  const address = wallets.find(wallet => wallet.walletClientType === 'privy')?.address || 
                  wallets[0]?.address;

  useEffect(() => {
    if (!ready) return;
    
    if (authenticated && address && privyUser) {
      const storedUser = localStorage.getItem(`test_spot_trader.user_${address}`);
      const userData = storedUser ? JSON.parse(storedUser) : null;

      login({
        address,
        farcasterUser: privyUser.farcaster,
        persistTradingConnection: userData?.persistTradingConnection
          ? userData?.persistTradingConnection === "true"
          : false,
        builderFee: userData?.builderFee ? Number(userData?.builderFee) : 0,
        agent: userData?.agent ? userData?.agent : null,
      });
    } else {
      logout();
    }
  }, [authenticated, address, privyUser, ready, login, logout]);

  useEffect(() => {
    console.log({ user, privyUser, authenticated, address });
  }, [user, privyUser, authenticated, address]);

  return <>{children}</>;
}
