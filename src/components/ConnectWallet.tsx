import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ConnectWallet() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Hyperliquid Trading</CardTitle>
        <CardDescription>
          Connect your wallet to start trading on Hyperliquid
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        {/* @ts-ignore */}
        <appkit-button />
      </CardContent>
    </Card>
  );
}
