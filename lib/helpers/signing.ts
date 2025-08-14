import { encode } from "@msgpack/msgpack";
import { PrivateKeyAccount } from "viem/accounts";
import { Hex, keccak256 } from "viem";
import { Signature as SplitSignature } from "ethers";

import { isMainnet } from "@/lib/config";
import { Signature } from "@/lib/types/signature";
import { AGENT } from "@/lib/types/typed-data";

export const signStandardL1Action = async (
  action: unknown,
  wallet: PrivateKeyAccount,
  vaultAddress: string | null,
  nonce: number
): Promise<Signature> => {
  const phantomAgent = {
    source: isMainnet ? "a" : "b",
    connectionId: hashAction(action, vaultAddress, nonce),
  };
  const payloadToSign = {
    domain: {
      name: "Exchange",
      version: "1",
      chainId: 1337,
      verifyingContract: "0x0000000000000000000000000000000000000000" as const,
    },
    types: {
      Agent: [
        { name: "source", type: "string" },
        { name: "connectionId", type: "bytes32" },
      ],
    },
    primaryType: AGENT,
    message: phantomAgent,
  } as const;

  const signedAgent = await wallet.signTypedData(payloadToSign);
  return SplitSignature.from(signedAgent);
};

export const hashAction = (action: unknown, vaultAddress: string | null, nonce: number): Hex => {
  const msgPackBytes = encode(action);
  const additionalBytesLength = vaultAddress === null ? 9 : 29;
  const data = new Uint8Array(msgPackBytes.length + additionalBytesLength);
  data.set(msgPackBytes);
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  view.setBigUint64(msgPackBytes.length, BigInt(nonce));
  if (vaultAddress === null) {
    view.setUint8(msgPackBytes.length + 8, 0);
  } else {
    view.setUint8(msgPackBytes.length + 8, 1);
    data.set(addressToBytes(vaultAddress), msgPackBytes.length + 9);
  }
  return keccak256(data);
};

export const addressToBytes = (address: string): Uint8Array => {
  const hex = (address.startsWith("0x") ? address.substring(2) : address).toLowerCase();
  const length = hex.length / 2;
  const out = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    out[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return out;
};


