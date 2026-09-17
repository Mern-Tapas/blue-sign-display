import { SalesTrendChart, sampleData } from "@bluesigns/ui";

const { dailySales } = sampleData;
const last30 = dailySales.slice(-30);
const previous30 = dailySales.slice(-60, -30);

export const Last30Days = () => (
  <div style={{ width: 640 }}>
    <SalesTrendChart days={last30} previous={previous30} compare={false} scope="All channels" />
  </div>
);

export const ComparedWithPrevious = () => (
  <div style={{ width: 640 }}>
    <SalesTrendChart days={last30} previous={previous30} compare scope="All channels" />
  </div>
);

export const Refreshing = () => (
  <div style={{ width: 640 }}>
    <SalesTrendChart days={dailySales.slice(-7)} previous={dailySales.slice(-14, -7)} compare={false} scope="Website" refreshing />
  </div>
);

export const RangeTooShort = () => (
  <div style={{ width: 640 }}>
    <SalesTrendChart days={dailySales.slice(-1)} previous={null} compare={false} scope="All channels · Today" />
  </div>
);
