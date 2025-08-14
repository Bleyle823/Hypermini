"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { generateAgentAccount } from "@/lib/helpers/generateAccount";
import { useMutation } from "@tanstack/react-query";
import { approveAgent } from "@/lib/services/approve-agent";
import { useAccount } from "wagmi";
import useUserStore from "@/lib/store";

export default function ApproveAgent() {
  const { chain, address } = useAccount();
  const updateAgent = useUserStore((state) => state.updateAgent);

  const { mutate: approveAgentMutation, isPending } = useMutation({
    mutationFn: async () => {
      const agent = generateAgentAccount();

      if (!agent.address || !agent.privateKey || !chain) {
        throw new Error("Missing address or chain");
      }

      const result = await approveAgent({ agentAddress: agent.address, chain, address });
      const isOk = result === "ok" || result?.status === "ok" || result?.ok === true || result?.result === "ok";
      if (!isOk) {
        console.log("approveAgent response:", result);
        throw new Error("Failed to sign builder fee");
      }

      updateAgent({ address: agent.address, privateKey: agent.privateKey });

      return result;
    },
    onError: (error) => {
      console.error("signBuilderFee error", error);
    },
  });

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Establish Connection with Agent</CardTitle>
        <CardDescription>
          This signature is gas-free to send. It opens a decentralized channel for gas-free and instantaneous
          trading.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="mt-4" onClick={() => approveAgentMutation()} disabled={isPending}>
          Approve Agent
        </Button>
      </CardContent>
    </Card>
  );
}


