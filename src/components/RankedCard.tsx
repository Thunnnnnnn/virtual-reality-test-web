import { Card, Flex, Tag, Typography } from "antd";
import type { RankedEntry } from "@/types/frontRow";

interface Props {
  ranked: RankedEntry;
  rank?: number;
  highlight?: boolean;
}

export default function RankedCard({ ranked, rank, highlight }: Props) {
  const { entry, score, reasons } = ranked;
  return (
    <Card
      size="small"
      style={highlight ? { borderColor: "#52c41a", borderWidth: 2 } : undefined}
      title={
        <Flex gap={8} align="center" wrap>
          {rank && <Tag>#{rank}</Tag>}
          <Typography.Text strong>{entry.fanName}</Typography.Text>
          <Typography.Text type="secondary">{entry.id}</Typography.Text>
          {entry.membership === "vip" && <Tag color="purple">VIP</Tag>}
          <Tag color="green">Score {score}</Tag>
        </Flex>
      }
    >
      <Typography.Text strong>Why</Typography.Text>
      <ul style={{ margin: "4px 0 0", paddingLeft: 20 }}>
        {reasons.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </Card>
  );
}
