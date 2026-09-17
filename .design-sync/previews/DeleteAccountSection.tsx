import { DeleteAccountSection, formatPrice, sampleData, toast } from "@bluesigns/ui";

const { rewards, giftCards } = sampleData;
const del = async () => {
  await new Promise((r) => setTimeout(r, 700));
};
const exportData = () => toast({ title: "We’ll email your data within 48 hours", tone: "success" });

export const BlockedByOpenOrders = () => (
  <div style={{ maxWidth: 640 }}>
    <DeleteAccountSection
      openOrders={2}
      points={rewards.points}
      giftCardBalance={formatPrice(giftCards.reduce((n, g) => n + g.balance, 0))}
      onExportData={exportData}
      onDelete={del}
    />
  </div>
);

export const ReadyToDelete = () => (
  <div style={{ maxWidth: 640 }}>
    <DeleteAccountSection openOrders={0} points={420} onExportData={exportData} onDelete={del} />
  </div>
);

export const Minimal = () => (
  <div style={{ maxWidth: 640 }}>
    <DeleteAccountSection openOrders={0} onDelete={del} />
  </div>
);
