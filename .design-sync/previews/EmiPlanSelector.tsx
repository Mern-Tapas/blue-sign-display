import { EmiPlanSelector, sampleData, toast } from "@bluesigns/ui";

const { banks, emiPlans } = sampleData;

// EmiPlanSelector takes banks with their plans: join sampleData.emiPlans with bank names.
const emiBanks = Object.entries(emiPlans).map(([id, plans]) => ({ id, name: banks.find((b) => b.id === id)?.name ?? id, plans }));

const onContinue = async ({ bankId, months }: { bankId: string; months: number }) => {
  toast({ title: "Continue to card details", description: `${months} months · ${bankId.toUpperCase()}`, tone: "info" });
};

export const HdfcPlans = () => (
  <div style={{ maxWidth: 560 }}>
    <EmiPlanSelector banks={emiBanks} amount={12999} onContinue={onContinue} />
  </div>
);

export const AxisInterestPlans = () => (
  <div style={{ maxWidth: 560 }}>
    <EmiPlanSelector banks={[emiBanks[2]!, emiBanks[0]!, emiBanks[1]!]} amount={21596} onContinue={onContinue} />
  </div>
);

export const BelowMinimum = () => (
  <div style={{ maxWidth: 560 }}>
    <EmiPlanSelector banks={emiBanks} amount={2499} onContinue={onContinue} />
  </div>
);
