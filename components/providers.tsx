"use client";

import { MiniAppProvider } from "@/contexts/miniapp-context";
import UserProvider from "@/components/UserProvider";
import dynamic from "next/dynamic";

const ErudaProvider = dynamic(
  () => import("../components/Eruda").then((c) => c.ErudaProvider),
  { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErudaProvider>
      <MiniAppProvider addMiniAppOnLoad={true}>
        <UserProvider>{children}</UserProvider>
      </MiniAppProvider>
    </ErudaProvider>
  );
}
