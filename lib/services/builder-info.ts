import axios from "@/lib/config/axios";

export async function fetchBuilderInfo(address: string) {
  try {
    const response = await axios.post(`/info`, { type: "builderInfo", user: address });
    if (!response.data) {
      throw new Error("No data received from server");
    }
    return response.data?.builderFee ?? 0;
  } catch (error) {
    return Promise.reject(error);
  }
}


