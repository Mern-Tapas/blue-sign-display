import { StockCell } from "@bluesigns/ui";

export const States = () => (
  <div className="flex flex-wrap items-center gap-6">
    <StockCell stock={48} reorderPoint={10} />
    <StockCell stock={6} reorderPoint={10} />
    <StockCell stock={0} reorderPoint={10} />
  </div>
);

export const WithSuffix = () => (
  <div className="flex flex-col items-start gap-2 text-body">
    <StockCell stock={28} reorderPoint={10} suffix="in stock" />
    <StockCell stock={3} reorderPoint={5} suffix="in stock" />
  </div>
);
