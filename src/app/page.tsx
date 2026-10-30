"use client";

import {
  Alert,
  Button,
  Card,
  Empty,
  Flex,
  Progress,
  Switch,
  Tag,
  Typography,
} from "antd";
import { useCallback, useState } from "react";
import GroupCard from "@/components/GroupCard";
import RankedCard from "@/components/RankedCard";
import { useFetch } from "@/hooks/useFetch";
import { getFrontRowUpgradeResult } from "@/services/frontRowService";
import type { FrontRowUpgradeResult } from "@/types/frontRow";

const MINUTE_MS = 60_000;
const TIME_STEPS = [
  { label: "+5 min", ms: 5 * MINUTE_MS },
  { label: "+15 min", ms: 15 * MINUTE_MS },
  { label: "+1 hour", ms: 60 * MINUTE_MS },
];

interface Snapshot {
  result: FrontRowUpgradeResult;
  now: string;
}

function formatOffset(ms: number) {
  if (ms === 0) return "Real time";
  const minutes = ms / MINUTE_MS;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `+${h ? `${h} h ` : ""}${m ? `${m} min` : ""}`.trim();
}

export default function FrontRowUpgradeQueuePage() {
  const [offsetMs, setOffsetMs] = useState(0);
  const [rushHour, setRushHour] = useState(false);
  const [vipHour, setVipHour] = useState(false);
  const [fairQueue, setFairQueue] = useState(false);

  // Date.now() is read inside the fetcher so it only runs in the browser
  const fetcher = useCallback(
    async (signal: AbortSignal): Promise<Snapshot> => {
      const now = new Date(Date.now() + offsetMs).toISOString();
      const result = await getFrontRowUpgradeResult(
        { now, rushHour, vipHour, fairQueue },
        signal,
      );
      return { result, now };
    },
    [offsetMs, rushHour, vipHour, fairQueue],
  );
  const { data, error, loading, refetch } = useFetch(fetcher);
  const result = data?.result;

  return (
    <main
      style={{ width: "100%", maxWidth: 1100, margin: "0 auto", padding: 32 }}
    >
      <Flex vertical gap={24}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          Front Row Upgrade Queue
        </Typography.Title>

        <Card size="small">
          <Flex vertical gap={16}>
            <Flex gap={8} align="center" wrap>
              <Typography.Text strong>Move time forward:</Typography.Text>
              {TIME_STEPS.map((step) => (
                <Button
                  key={step.label}
                  onClick={() => setOffsetMs((v) => v + step.ms)}
                >
                  {step.label}
                </Button>
              ))}
              <Button
                type="link"
                disabled={offsetMs === 0}
                onClick={() => setOffsetMs(0)}
              >
                Reset
              </Button>
              <Tag color="blue">{formatOffset(offsetMs)}</Tag>
              {data && (
                <Typography.Text type="secondary" suppressHydrationWarning>
                  {new Date(data.now).toLocaleString()}
                </Typography.Text>
              )}
            </Flex>
            <Flex gap={24} wrap>
              <Flex gap={8} align="center">
                <Switch
                  checked={rushHour}
                  onChange={setRushHour}
                  aria-label="Rush Hour"
                />
                Rush Hour
              </Flex>
              <Flex gap={8} align="center">
                <Switch
                  checked={vipHour}
                  onChange={setVipHour}
                  aria-label="VIP Hour"
                />
                VIP Hour
              </Flex>
              <Flex gap={8} align="center">
                <Switch
                  checked={fairQueue}
                  onChange={setFairQueue}
                  aria-label="Fair Queue"
                />
                Fair Queue
              </Flex>
            </Flex>
          </Flex>
        </Card>

        {loading && <Progress percent={100} status="active" showInfo={false} />}
        {error && <Alert type="error" title={error} showIcon />}

        {result && (
          <>
            <section>
              <Typography.Title level={4}>Current winner</Typography.Title>
              {result.winner ? (
                <RankedCard ranked={result.winner} highlight />
              ) : (
                <Alert
                  type="info"
                  title="No eligible entry can receive an upgrade."
                  showIcon
                />
              )}
            </section>

            <section>
              <Typography.Title level={4}>Top 3 candidates</Typography.Title>
              <Flex vertical gap={8}>
                {result.topCandidates.slice(0, 3).map((c, i) => (
                  <RankedCard key={c.entry.id} ranked={c} rank={i + 1} />
                ))}
                {result.topCandidates.length === 0 && (
                  <Empty description="No candidates" />
                )}
              </Flex>
            </section>

            <section>
              <Typography.Title level={4}>
                Fan groups ({result.fanGroups.length})
              </Typography.Title>
              <Flex vertical gap={8}>
                {result.fanGroups.map((g) => (
                  <GroupCard key={g.id} group={g} onSaved={refetch} />
                ))}
              </Flex>
            </section>

            <section>
              <Typography.Title level={4}>
                Excluded entries ({result.excludedEntries.length})
              </Typography.Title>
              <Flex vertical gap={8}>
                {result.excludedEntries.map(({ entry, reason }) => (
                  <Card key={entry.id} size="small">
                    <Flex gap={8} align="center" wrap>
                      <Typography.Text strong>{entry.fanName}</Typography.Text>
                      <Typography.Text type="secondary">
                        {entry.id}
                      </Typography.Text>
                      <Tag color="orange">{reason}</Tag>
                    </Flex>
                  </Card>
                ))}
                {result.excludedEntries.length === 0 && (
                  <Empty description="No excluded entries" />
                )}
              </Flex>
            </section>
          </>
        )}
      </Flex>
    </main>
  );
}
