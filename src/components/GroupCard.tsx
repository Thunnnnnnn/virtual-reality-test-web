import { Alert, Button, Card, Flex, InputNumber, Tag, Typography } from "antd";
import { useState } from "react";
import { updateLoyaltyPoints } from "@/services/frontRowService";
import type { FanGroup, TicketQueueEntry } from "@/types/frontRow";

function LoyaltyEditor({
  entry,
  onSaved,
}: {
  entry: TicketQueueEntry;
  onSaved: () => void;
}) {
  const current = entry.loyaltyPoints ?? 0;
  const [value, setValue] = useState<number | null>(current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = value !== null && Number.isInteger(value) && value >= 0;

  async function save() {
    if (value === null) return;
    setSaving(true);
    setError(null);
    try {
      await updateLoyaltyPoints(entry.id, value);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Flex gap={8} align="center" wrap>
      <Typography.Text>Loyalty points</Typography.Text>
      <InputNumber
        min={0}
        precision={0}
        value={value}
        status={valid ? undefined : "error"}
        onChange={setValue}
        aria-label={`Loyalty points for ${entry.fanName}`}
      />
      <Button
        type="primary"
        loading={saving}
        disabled={!valid || value === current}
        onClick={save}
      >
        Save
      </Button>
      {error && <Alert type="error" title={error} showIcon />}
    </Flex>
  );
}

export default function GroupCard({
  group,
  onSaved,
}: {
  group: FanGroup;
  onSaved: () => void;
}) {
  const linked = group.entries.length > 1;
  return (
    <Card
      size="small"
      title={
        <Flex gap={8} align="center" wrap>
          <Typography.Text strong>{group.id}</Typography.Text>
          <Tag>{group.entries.length} account(s)</Tag>
          {group.representative && (
            <Tag color="blue">
              Representative: {group.representative.entry.fanName} (
              {group.representative.score})
            </Tag>
          )}
        </Flex>
      }
    >
      {linked ? (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {group.connectionReasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      ) : (
        <Typography.Text type="secondary">
          Not linked to any other account
        </Typography.Text>
      )}
      <Flex vertical gap={12} style={{ marginTop: 16 }}>
        {group.entries.map((e) => (
          <Flex key={e.id} gap={16} align="center" wrap>
            <Typography.Text style={{ minWidth: 200 }}>
              {e.fanName}{" "}
              <Typography.Text type="secondary">({e.id})</Typography.Text>
            </Typography.Text>
            <LoyaltyEditor
              key={e.loyaltyPoints ?? 0}
              entry={e}
              onSaved={onSaved}
            />
          </Flex>
        ))}
      </Flex>
    </Card>
  );
}
