import api from "@/lib/axios";
import { IResponse } from "@/types/response";

export async function getExample(): Promise<{ status: string }[]> {
  const { data } = await api.get<IResponse<{ status: string }[]>>("/health");
  if (!data.status) {
    throw new Error(data.message || "Failed to fetch example data");
  }
  return data.data;
}