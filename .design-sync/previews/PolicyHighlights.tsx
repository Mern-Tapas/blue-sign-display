import { PolicyHighlights } from "@bluesigns/ui";

export const Electronics = () => (
  <div style={{ maxWidth: 600 }}>
    <PolicyHighlights warranty="1 year warranty" />
  </div>
);

export const NonReturnable = () => (
  <div style={{ maxWidth: 520 }}>
    <PolicyHighlights returnable={false} cod={false} />
  </div>
);

export const Apparel = () => (
  <div style={{ maxWidth: 520 }}>
    <PolicyHighlights returnDays={30} />
  </div>
);

export const Narrow = () => (
  <div style={{ maxWidth: 360 }}>
    <PolicyHighlights returnDays={7} exchange={false} warranty="6 months warranty" genuine={false} />
  </div>
);
