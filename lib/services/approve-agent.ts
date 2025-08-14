import { toHex } from "viem";
import { signTypedData } from "@wagmi/core";
import { Signature } from "ethers";
import { config as wagmiConfig } from "@/contexts/miniapp-wallet-context";
import { isMainnet } from "@/lib/config";
import { Signature as SplitSignature } from "@/lib/types/signature";
import type { SignTypedDataReturnType } from "@wagmi/core";
import axios from "@/lib/config/axios";

type ApproveAgentAction = {
  type: "approveAgent";
  signatureChainId: `0x${string}`;
  hyperliquidChain: "Mainnet" | "Testnet";
  agentAddress: `0x${string}`;
  agentName: string;
  nonce: number;
};

export async function approveAgent({
  chain,
  agentAddress,
  address,
  agentName = "test_spot_trader",
}: {
  chain: { id: number };
  agentAddress: `0x${string}`;
  address?: string;
  agentName?: string;
}) {
  if (!chain) {
    throw new Error("Missing chain");
  }

  const nonce = Date.now();
  const signatureChainId = toHex(chain?.id || 421614);
  const hyperliquidChain = isMainnet ? "Mainnet" : "Testnet";

  const action: ApproveAgentAction = {
    type: "approveAgent",
    signatureChainId,
    hyperliquidChain,
    agentAddress,
    agentName,
    nonce,
  };

  const data = {
    domain: {
      name: "HyperliquidSignTransaction",
      version: "1",
      chainId: chain?.id || 421614,
      verifyingContract: "0x0000000000000000000000000000000000000000",
    },
    types: {
      "HyperliquidTransaction:ApproveAgent": [
        { name: "hyperliquidChain", type: "string" },
        { name: "agentAddress", type: "address" },
        { name: "agentName", type: "string" },
        { name: "nonce", type: "uint64" },
      ],
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
    },
    primaryType: "HyperliquidTransaction:ApproveAgent",
    message: action,
  };

  let eip712Signature: SignTypedDataReturnType;
  const eth = (typeof window !== "undefined" && (window as any).ethereum) || null;
  if (eth?.request && address) {
    const { domain, types, primaryType, message } = data as any;
    const typedDataJson = JSON.stringify({ domain, types, primaryType, message });
    eip712Signature = await eth.request({ method: "eth_signTypedData_v4", params: [address, typedDataJson] });
  } else {
    eip712Signature = await signTypedData(
      wagmiConfig,
      // @ts-expect-error ignore type
      data
    );
  }

  const signature: SplitSignature = Signature.from(eip712Signature);

  const response = await axios.post("/exchange", { action: action, nonce: nonce, signature });

  return response.data;
}


