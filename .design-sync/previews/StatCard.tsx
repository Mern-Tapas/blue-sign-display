import { IconButton, icons, PriceDisplay, Progress, StatCard } from "@bluesigns/ui";

const { ArrowUpRight, IndianRupee, Package, Wallet } = icons;

export const AccountHome = () => (
  <div className="grid grid-cols-2 gap-4" style={{ maxWidth: 720 }}>
    <StatCard label="Total spent" icon={<IndianRupee aria-hidden />} value={<PriceDisplay amount={42805} size="xl" />} trend={12.4} caption="this year" />
    <StatCard label="BlueSigns points" icon={<Package aria-hidden />} value="1,840">
      <div className="flex flex-col gap-2">
        <Progress value={1840} max={2500} track="hatch" aria-label="Points to next tier" />
        <p className="text-caption text-fg-muted">660 points to Gold</p>
      </div>
    </StatCard>
  </div>
);

export const Variants = () => (
  <div className="grid grid-cols-3 gap-4" style={{ maxWidth: 860 }}>
    <StatCard label="Orders this month" value="14" trend={8.2} caption="vs August" />
    <StatCard
      variant="accent"
      label="Wallet balance"
      icon={<Wallet aria-hidden />}
      value="₹1,240"
      trend={-3.1}
      caption="since last week"
      action={
        <IconButton label="Open wallet" size="sm" variant="contrast">
          <ArrowUpRight aria-hidden />
        </IconButton>
      }
    />
    <StatCard variant="contrast" label="Saved on MRP" value="₹7,049" trend={21} caption="this year" />
  </div>
);

export const ValueOnly = () => (
  <div style={{ maxWidth: 280 }}>
    <StatCard label="Returns in progress" value="1" />
  </div>
);
