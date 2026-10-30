import api from "@/lib/axios";
import type {
  FrontRowUpgradeQuery,
  FrontRowUpgradeResult,
  TicketQueueEntry,
} from "@/types/frontRow";
import type { IResponse } from "@/types/response";

export async function getFrontRowUpgradeResult(
  params: FrontRowUpgradeQuery,
  signal?: AbortSignal,
): Promise<FrontRowUpgradeResult> {
  const { data } = await api.get<IResponse<FrontRowUpgradeResult>>(
    "/ticket-queue-entries/front-row-upgrade-result",
    { params, signal },
  );
  if (!data.status) {
    throw new Error(data.message || "Failed to load upgrade queue");
  }
  return data.data;
}

export async function updateLoyaltyPoints(
  id: string,
  loyaltyPoints: number,
): Promise<TicketQueueEntry> {
  const { data } = await api.patch<IResponse<TicketQueueEntry>>(
    `/ticket-queue-entries/${id}`,
    { loyaltyPoints },
  );
  if (!data.status) {
    throw new Error(data.message || "Failed to update loyalty points");
  }
  return data.data;
}
