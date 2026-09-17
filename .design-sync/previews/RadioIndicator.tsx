import { Badge, RadioIndicator } from "@bluesigns/ui";

// RadioIndicator reads selection from the nearest `group` ancestor
// (data-state="checked", aria-checked or aria-pressed).
const cards = [
  { id: "hdfc", bank: "HDFC Bank •••• 4821", meta: "Visa · expires 08/28", selected: true },
  { id: "icici", bank: "ICICI Bank •••• 1190", meta: "RuPay · expires 11/26", selected: false, soon: true },
];

export const CustomCards = () => (
  <div className="flex flex-col gap-2" role="radiogroup" aria-label="Saved cards" style={{ maxWidth: 420 }}>
    {cards.map((c) => (
      <button
        key={c.id}
        type="button"
        role="radio"
        aria-checked={c.selected}
        className="group flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left aria-checked:selected aria-checked:border-transparent"
      >
        <RadioIndicator />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-body-strong">{c.bank}</span>
          <span className="text-caption text-fg-muted">{c.meta}</span>
        </span>
        {c.soon && (
          <Badge tone="warning" size="sm">
            Expires soon
          </Badge>
        )}
      </button>
    ))}
  </div>
);

export const States = () => (
  <div className="flex items-center gap-6">
    <span className="group flex items-center gap-2 text-label" data-state="checked">
      <RadioIndicator /> Selected
    </span>
    <span className="group flex items-center gap-2 text-label" data-state="unchecked">
      <RadioIndicator /> Unselected
    </span>
  </div>
);
