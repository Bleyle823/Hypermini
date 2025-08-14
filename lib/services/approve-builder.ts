import { isAddress, toHex } from "viem";
import { signTypedData } from "@wagmi/core";
import { Signature } from "ethers";
import { wagmiAdapter } from "@/lib/config/wagmi";
import { config, isMainnet, builderPointsToPercent } from "@/lib/config";
import { Signature as SplitSignature } from "@/lib/types/signature";
import { approveBuilderFeeTypedData, APPROVE_BUILDER_FEE as PRIMARY_TYPE } from "@/lib/types/typed-data";
import type { SignTypedDataReturnType } from "@wagmi/core";
import axios from "@/lib/config/axios";

export type HyperliquidChain = "Mainnet" | "Testnet";

export type ApproveBuilderFeeAction = {
  maxFeeRate: string;
  builder: `0x${string}`;
  nonce: number;
  type: "approveBuilderFee";
  signatureChainId: `0x${string}`;
  hyperliquidChain: HyperliquidChain;
};

export async function approveBuilder({
  chain,
  address,
}: {
  address: string;
  chain: { id: number };
}) {
  if (!chain) {
    throw new Error("Missing chain");
  }

  const nonce = Date.now();
  const builder = config.builderAddress;
  if (!builder || !isAddress(builder)) {
    throw new Error("Invalid or missing builder address. Set NEXT_PUBLIC_BUILDER_ADDRESS to a valid 0x address.");
  }
  const builderLower = builder.toLowerCase() as `0x${string}`;
  const signatureChainId = toHex(chain?.id || 421614);
  const hyperliquidChain = isMainnet ? "Mainnet" : "Testnet";
  const maxFeeRate = builderPointsToPercent(config.builderFeePercent);

  const action: ApproveBuilderFeeAction = {
    type: "approveBuilderFee",
    nonce,
    maxFeeRate,
    builder: builderLower,
    signatureChainId,
    hyperliquidChain,
  };

  const data = {
    domain: {
      name: "HyperliquidSignTransaction",
      version: "1",
      chainId: chain?.id || 421614,
      verifyingContract: "0x0000000000000000000000000000000000000000",
    },
    types: approveBuilderFeeTypedData,
    primaryType: PRIMARY_TYPE,
    message: action,
  };

  let eip712Signature: SignTypedDataReturnType;
  try {
    eip712Signature = await signTypedData(
      wagmiAdapter.wagmiConfig,
      // @ts-expect-error ignore lint
      data
    );
  } catch (err) {
    const eth = (typeof window !== "undefined" && (window as any).ethereum) || null;
    if (!eth?.request || !address) throw err;
    const { domain, types, primaryType, message } = data as any;
    const typedDataJson = JSON.stringify({ domain, types, primaryType, message });
    eip712Signature = await eth.request({ method: "eth_signTypedData_v4", params: [address, typedDataJson] });
  }

  const signature: SplitSignature = Signature.from(eip712Signature);

  try {
    const approveBuilderResult = await axios.post("/exchange", { action: action, nonce: nonce, signature });
    return { status: "ok", data: approveBuilderResult.data } as const;
  } catch (error: any) {
    const status = error?.response?.status;
    const data = error?.response?.data;
    console.error("approveBuilder /exchange error", { status, data });
    throw new Error(`Exchange rejected builder approval${status ? ` (status ${status})` : ""}`);
  }
}


