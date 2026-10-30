export interface TicketQueueEntry {
  id: string;
  fanId: string;
  fanName: string;
  ticketValue: string | number | null;
  joinedQueueAt: string;
  eventStartsAt: string;
  status: string;
  loyaltyPoints?: number | null;
  upgradesLast30Days?: number | null;
  membership?: string | null;
  phoneNumber?: string | null;
  deviceId?: string | null;
  paymentAccount?: string | null;
}

export interface RankedEntry {
  entry: TicketQueueEntry;
  score: number;
  reasons: string[];
}

export interface FanGroup {
  id: string;
  entries: TicketQueueEntry[];
  representative: RankedEntry | null;
  connectionReasons: string[];
}

export interface ExcludedEntry {
  entry: TicketQueueEntry;
  reason: string;
}

export interface FrontRowUpgradeResult {
  winner: RankedEntry | null;
  topCandidates: RankedEntry[];
  fanGroups: FanGroup[];
  excludedEntries: ExcludedEntry[];
}

export interface FrontRowUpgradeQuery {
  now?: string;
  rushHour?: boolean;
  vipHour?: boolean;
  fairQueue?: boolean;
}
