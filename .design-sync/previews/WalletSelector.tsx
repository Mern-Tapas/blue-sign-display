import { WalletSelector, sampleData, toast } from "@bluesigns/ui";

const { wallets } = sampleData;

const onPay = async ({ walletId }: { walletId: string }) => {
  toast({ title: "Paying with wallet", description: wallets.find((w) => w.id === walletId)?.name, tone: "info" });
};

export const LinkedBalanceShort = () => (
  <div style={{ maxWidth: 480 }}>
    <WalletSelector wallets={wallets} amount={12999} onPay={onPay} />
  </div>
);

export const LinkedBalanceCovers = () => (
  <div style={{ maxWidth: 480 }}>
    <WalletSelector wallets={wallets} amount={999} onPay={onPay} />
  </div>
);

export const AllLinked = () => (
  <div style={{ maxWidth: 480 }}>
    <WalletSelector
      wallets={[
        { id: "paytm", name: "Paytm Wallet", balance: 4820, linked: true },
        { id: "amazonpay", name: "Amazon Pay Balance", balance: 2150, linked: true },
        { id: "mobikwik", name: "MobiKwik", balance: 310, linked: true },
      ]}
      amount={1899}
      onPay={onPay}
    />
  </div>
);
