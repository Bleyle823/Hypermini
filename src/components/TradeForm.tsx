"use client";

import { useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { fetchTokenDetails } from "@/lib/services/token-details";
import { fetchMidPrice } from "@/lib/services/mid-price";
import { fetchBalances } from "@/lib/services/balances";
import { constructOrder, submitMarketOrder } from "@/lib/services/market-order";
import useUserStore from "@/lib/store";
import { toast } from "@/hooks/use-toast";

interface TradeFormProps {
  type: "buy" | "sell";
}

export default function TradeForm({ type }: TradeFormProps) {
  // Constants
  const isBuy = type === "buy";
  const actionText = isBuy ? "Buy" : "Sell";
  const DEFAULT_SLIPPAGE = 0;

  // Hooks
  const { address } = useAccount();
  const user = useUserStore((state) => state.user);
  const formRef = useRef<HTMLFormElement>(null);
  const queryClient = useQueryClient();

  // Local State
  const [formState, setFormState] = useState<{
    amount: string;
    slippage: number;
  }>({
    amount: "",
    slippage: DEFAULT_SLIPPAGE,
  });
  const [totalAmount, setTotalAmount] = useState(0);

  // Queries
  const { data: balanceData } = useQuery({
    queryKey: ["balances", address],
    queryFn: () => (address ? fetchBalances(address) : null),
    enabled: !!address,
  });

  const { data: midPriceData = 0 } = useQuery({
    queryKey: ["midPrice", "@1035"],
    queryFn: () => fetchMidPrice("@1035"),
  });

  const { data: tokenDetails } = useQuery({
    queryKey: ["tokenDetails", "0x7317beb7cceed72ef0b346074cc8e7ab"],
    queryFn: () => fetchTokenDetails("0x7317beb7cceed72ef0b346074cc8e7ab"),
  });

  // Mutation
  const { mutate: submitOrder, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!midPriceData || !user?.agent?.privateKey || !tokenDetails) {
        throw new Error("Missing required data");
      }

      const amount = formData.get("amount") as string;
      const slippage =
        parseFloat(formData.get("slippage") as string) / 100 || 0;

      // Validate amount
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }

      // Validate USDC balance for buy orders
      if (isBuy && parseFloat(amount) > (userBalances.usdc || 0)) {
        throw new Error(`Insufficient USDC balance. You have ${userBalances.usdc || 0} USDC`);
      }

      // Validate HYPE balance for sell orders
      if (!isBuy && parseFloat(amount) > (userBalances.hype || 0)) {
        throw new Error(`Insufficient HYPE balance. You have ${userBalances.hype || 0} HYPE`);
      }

      console.log("Submitting order with:", {
        amount,
        isBuy,
        slippage,
        midPrice: midPriceData,
        tokenDecimals: tokenDetails.szDecimals,
        userBalances
      });

      const order = constructOrder({
        amount,
        isBuy,
        slippage,
        midPrice: midPriceData,
        tokenDecimals: tokenDetails.szDecimals,
      });

      console.log("Constructed order:", order);

      return submitMarketOrder(order, user.agent.privateKey);
    },
    onSuccess: async (res) => {
      console.log("Order submission response:", res);
      
      if (res?.status === "ok") {
        const statuses: { [key: string]: string }[] =
          res?.response?.data?.statuses;

        if (statuses && statuses.length > 0) {
          statuses.forEach(async (status) => {
            if (status?.error) {
              toast({
                title: "Order Error",
                description: status.error,
                variant: "destructive",
              });
            } else if (status?.filled) {
              toast({
                title: "Success",
                description: "Order submitted successfully",
              });

              // Reset form
              formRef.current?.reset();
              setFormState({ amount: "", slippage: DEFAULT_SLIPPAGE });
              setTotalAmount(0);

              // Revalidate queries
              await Promise.all([
                queryClient.invalidateQueries({
                  queryKey: ["balances", address],
                }),
                queryClient.invalidateQueries({
                  queryKey: ["midPrice", "@1035"],
                }),
                queryClient.invalidateQueries({
                  queryKey: [
                    "tokenDetails",
                    "0x7317beb7cceed72ef0b346074cc8e7ab",
                  ],
                }),
              ]);
            }
          });
        } else {
          toast({
            title: "Success",
            description: "Order submitted successfully",
          });
          
          // Reset form
          formRef.current?.reset();
          setFormState({ amount: "", slippage: DEFAULT_SLIPPAGE });
          setTotalAmount(0);
        }
      } else {
        console.error("Order submission failed:", res);
        const errorMessage = res?.response?.data?.error || res?.error || "Failed to submit order";
        toast({
          title: "Order Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Error submitting order:", error);
      
      let errorMessage = "Failed to submit order";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      }
      
      toast({
        title: "Order Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  // Derived State
  const userBalances = {
    usdc: Number(
      balanceData?.balances?.find((balance) => balance.coin === "USDC")
        ?.total ?? 0
    ),
    hype: Number(
      balanceData?.balances?.find((balance) => balance.coin === "HYPE")
        ?.total ?? 0
    ),
  };

  // Handlers
  const calculateTotalAmount = (amount: string) => {
    if (!midPriceData || !amount) return 0;
    return isBuy
      ? Math.floor(
          (parseFloat(amount) / midPriceData) *
            Math.pow(10, tokenDetails?.szDecimals || 6)
        ) / Math.pow(10, tokenDetails?.szDecimals || 6)
      : parseFloat(amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    setFormState((prev) => ({ ...prev, amount }));
    setTotalAmount(calculateTotalAmount(amount));
  };

  const orderValue = midPriceData
    ? `${(totalAmount * midPriceData).toFixed(2)} USDC`
    : "Calculating...";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!address || !user?.agent?.privateKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet and approve your agent first",
        variant: "destructive",
      });
      return;
    }

    // Additional validation
    if (!midPriceData || midPriceData <= 0) {
      toast({
        title: "Error",
        description: "Unable to fetch current market price. Please try again.",
        variant: "destructive",
      });
      return;
    }

    if (!tokenDetails) {
      toast({
        title: "Error",
        description: "Unable to fetch token details. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    const amount = formData.get("amount") as string;
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    // Check if user has completed all prerequisites
    if (!user.builderFee) {
      toast({
        title: "Prerequisite Required",
        description: "Please approve builder fees before trading",
        variant: "destructive",
      });
      return;
    }

    submitOrder(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-4">
          {isBuy ? "Buy $HYPE" : "Sell $HYPE"}
        </CardTitle>
        <CardDescription>
          <dl className="grid grid-cols-2 gap-y-1">
            <dt className="text-sm font-medium leading-none">USDC Balance</dt>
            <dd className="text-sm text-muted-foreground text-right">
              {userBalances.usdc} USDC
            </dd>
            <dt className="text-sm font-medium leading-none">HYPE Balance</dt>
            <dd className="text-sm text-muted-foreground text-right">
              {userBalances.hype} HYPE
            </dd>
          </dl>
        </CardDescription>
        
        {/* Helpful trading guide */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Trading Guide:</strong> Ensure you have sufficient balance and the current market price is available. 
            Minimum order size is 0.001 HYPE. Check the console (F12) for detailed error information if orders fail.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="space-y-1">
              <Label htmlFor="amount">
                Amount to {actionText} (in {isBuy ? "USDC" : "HYPE"})
              </Label>
              <Input
                id="amount"
                name="amount"
                onChange={handleAmountChange}
                value={formState.amount}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="slippage">Slippage</Label>
              <Input
                id="slippage"
                name="slippage"
                defaultValue={DEFAULT_SLIPPAGE}
              />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-y-1 mt-6">
            <dt className="text-sm font-medium leading-none">Market Value</dt>
            <dd className="text-sm text-muted-foreground text-right">
              1 HYPE = {midPriceData} USDC
            </dd>

            <dt className="text-sm font-medium leading-none">
              Estimated {isBuy ? "HYPE to buy" : "USDC to receive"}
            </dt>
            <dd className="text-sm text-muted-foreground text-right">
              {isBuy
                ? totalAmount.toFixed(tokenDetails?.szDecimals || 6)
                : (totalAmount * midPriceData).toFixed(2)}
            </dd>

            <dt className="text-sm font-medium leading-none">Order Value</dt>
            <dd className="text-sm text-muted-foreground text-right">
              {orderValue}
            </dd>
          </dl>

          <Separator className="mt-4" />

          <Button type="submit" className="w-full mt-4" disabled={isPending}>
            {isPending ? "Submitting..." : `${actionText} HYPE`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
