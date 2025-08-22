import axios from "@/lib/config/axios";
import { privateKeyToAccount } from "viem/accounts";
import { signStandardL1Action } from "@/lib/helpers/signing";
import { config } from "@/lib/config";
import {
  OrderRequest,
  orderWiresToOrderAction,
  orderRequestToOrderWire,
} from "@/lib/types/order";
import { Signature } from "@/lib/types/signature";

type Order = {
  baseToken: string;
  quoteToken: string;
  order: OrderRequest;
};

export async function submitMarketOrder(orderDto: Order, pk: `0x${string}`) {
  try {
    console.log("Starting order submission:", { orderDto, pk: pk.slice(0, 10) + "..." });
    
    const pairIndex = await requestAssetId(
      orderDto.baseToken,
      orderDto.quoteToken
    );

    console.log("Pair index result:", pairIndex);

    if (pairIndex > -1) {
      const nonce = Date.now();
      const account = privateKeyToAccount(pk);

      const calculatedAssetId = 10000 + pairIndex;
      console.log("Calculated asset ID:", calculatedAssetId);
      
      const orderWire = orderRequestToOrderWire(
        orderDto.order,
        calculatedAssetId
      );
      const orderAction = orderWiresToOrderAction([orderWire]);

      console.log("Order wire:", orderWire);
      console.log("Order action:", orderAction);

      const signature: Signature = await signStandardL1Action(
        orderAction,
        account,
        null,
        nonce
      );

      console.log("Signature generated:", signature);

      const orderRequest = {
        action: {
          type: "order",
          orders: [
            {
              a: calculatedAssetId,
              b: orderDto.order.is_buy,
              p: orderDto.order.limit_px.toString(),
              s: orderDto.order.sz.toString(),
              r: false,
              t: {
                limit: {
                  tif: "Ioc",
                },
              },
            },
          ],
          grouping: "na",
          builder: {
            b: config.builderAddress.toLowerCase(),
            f: 1,
          },
        },
        nonce: nonce,
        signature: signature,
        vaultAddress: null,
      };

      console.log("Submitting order request:", orderRequest);

      const result = await axios.post("/exchange", orderRequest);

      console.log("API response:", result);

      if (result.data) {
        return result.data;
      } else {
        throw new Error("No data received from API");
      }
    } else {
      throw new Error(`Failed to get valid pair index for ${orderDto.baseToken}/${orderDto.quoteToken}`);
    }
  } catch (e) {
    console.error("Error submitting market order:", e);
    
    // Provide more specific error messages
    if (e instanceof Error) {
      if (e.message.includes("Failed to get valid pair index")) {
        throw new Error(`Trading pair ${orderDto.baseToken}/${orderDto.quoteToken} not found`);
      } else if (e.message.includes("No data received from API")) {
        throw new Error("API returned no response data");
      } else if (e.message.includes("Network Error")) {
        throw new Error("Network error - please check your connection");
      } else if (e.message.includes("timeout")) {
        throw new Error("Request timed out - please try again");
      } else if (e.message.includes("401") || e.message.includes("403")) {
        throw new Error("Authentication failed - please reconnect your wallet");
      } else if (e.message.includes("500")) {
        throw new Error("Server error - please try again later");
      }
    }
    
    throw e;
  }
}

type SpotMetaResponse = {
  universe: Array<{
    tokens: [number, number];
    name: string;
    index: number;
    isCanonical: boolean;
  }>;
  tokens: Array<{
    name: string;
    szDecimals: number;
    weiDecimals: number;
    index: number;
    tokenId: string;
    isCanonical: boolean;
  }>;
};

async function requestAssetId(
  baseToken: string,
  quoteToken: string
): Promise<number> {
  try {
    console.log(`Requesting asset ID for ${baseToken}/${quoteToken}`);
    
    const response = await axios.post(`/info`, {
      type: "spotMeta",
    });

    console.log("Spot meta response:", response.data);

    if (response.data) {
      const data: SpotMetaResponse = response.data;
      const base = data.tokens.find((token) => token.name == baseToken);
      const quote = data.tokens.find((token) => token.name == quoteToken);

      console.log("Found tokens:", { base, quote });

      if (base && quote) {
        const pair = data.universe.find((pair) => {
          const [baseIndex, quoteIndex] = pair.tokens;
          return baseIndex === base.index && quoteIndex === quote.index;
        });

        console.log("Found trading pair:", pair);

        if (pair) {
          return pair.index;
        } else {
          console.error(`No trading pair found for ${baseToken}/${quoteToken}`);
          return -1;
        }
      } else {
        console.error(`Token not found: base=${baseToken}, quote=${quoteToken}`);
        if (!base) console.error(`Base token ${baseToken} not found in available tokens`);
        if (!quote) console.error(`Quote token ${quoteToken} not found in available tokens`);
        return -1;
      }
    } else {
      console.error("No data received from spotMeta request");
      return -1;
    }
  } catch (error) {
    console.error("Error requesting asset ID:", error);
    throw new Error(`Failed to fetch trading pair information: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

interface ConstructOrderParams {
  amount: string;
  isBuy: boolean;
  slippage: number;
  midPrice: number;
  tokenDecimals: number;
}

export function constructOrder({
  amount,
  isBuy,
  slippage,
  midPrice,
  tokenDecimals,
}: ConstructOrderParams) {
  // Validate inputs
  if (!amount || parseFloat(amount) <= 0) {
    throw new Error("Amount must be greater than 0");
  }

  if (midPrice <= 0) {
    throw new Error("Invalid mid price");
  }

  if (slippage < 0 || slippage > 1) {
    throw new Error("Slippage must be between 0 and 100%");
  }

  const priceWithSlippage = calculateSlippagePrice(
    midPrice,
    isBuy,
    slippage,
    true
  );

  console.log({ midPrice, priceWithSlippage, slippage });

  // Calculate size based on direction
  let size = isBuy ? parseFloat(amount) / midPrice : parseFloat(amount);

  // Validate minimum order size (0.001 HYPE)
  const minSize = 0.001;
  if (size < minSize) {
    throw new Error(`Order size too small. Minimum size is ${minSize} HYPE`);
  }

  // Adjust size precision based on token decimals
  size =
    Math.floor(size * Math.pow(10, tokenDecimals)) /
    Math.pow(10, tokenDecimals);

  // Ensure size is not zero after precision adjustment
  if (size <= 0) {
    throw new Error("Order size became zero after precision adjustment");
  }

  console.log("Order size calculation:", {
    originalAmount: amount,
    calculatedSize: size,
    tokenDecimals,
    midPrice,
    isBuy
  });

  const orderRequest: OrderRequest = {
    coin: "HYPE",
    is_buy: isBuy,
    sz: size,
    limit_px: parseFloat(priceWithSlippage),
    reduce_only: false,
    order_type: {
      limit: { tif: "Ioc" },
    },
  };

  console.log("Constructed order request:", orderRequest);

  return {
    baseToken: "HYPE",
    quoteToken: "USDC",
    order: orderRequest,
  };
}

export const calculateSlippagePrice = (
  price: number,
  isBuy: boolean,
  slippage: number,
  isSpot: boolean
): string => {
  // Calculate price with slippage
  const adjustedPrice = price * (isBuy ? 1 + slippage : 1 - slippage);

  // Convert to string with 5 significant figures
  const roundedPrice = Number(adjustedPrice.toPrecision(5));

  // Round to appropriate decimal places (8 for spot, 6 for perps)
  const decimalPlaces = isSpot ? 8 : 6;
  return roundedPrice.toFixed(decimalPlaces);
};
