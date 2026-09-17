import { ProductImage, sampleData, ScrollArea } from "@bluesigns/ui";

export const Vertical = () => (
  <div style={{ maxWidth: 320 }}>
    <ScrollArea type="always" aria-label="States and union territories" className="h-56 rounded-lg bg-surface-sunken shadow-flat" fade>
      <ul className="flex flex-col p-2">
        {sampleData.INDIAN_STATES.map((s) => (
          <li key={s} className="rounded-md px-3 py-2 text-body">
            {s}
          </li>
        ))}
      </ul>
    </ScrollArea>
  </div>
);

export const Horizontal = () => (
  <div style={{ maxWidth: 360 }}>
    <ScrollArea type="always" orientation="horizontal" aria-label="Sizes" className="w-full rounded-xl">
      <div className="flex w-max gap-2 pb-3">
        {["UK 5", "UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12", "UK 13"].map((s) => (
          <span key={s} className="flex h-control-md items-center rounded-pill border border-border px-4 text-body figures">
            {s}
          </span>
        ))}
      </div>
    </ScrollArea>
  </div>
);

export const InPanelList = () => (
  <div className="rounded-xl bg-surface p-2 shadow-popover" style={{ maxWidth: 340 }}>
    <p className="px-3 pt-2 pb-1 text-caption text-fg-muted">Recent orders</p>
    <ScrollArea type="always" aria-label="Recent orders" className="h-64">
      <ul className="flex flex-col">
        {sampleData.products.slice(0, 10).map((p, i) => (
          <li key={p.id} className="flex items-center gap-3 rounded-md px-3 py-2">
            <ProductImage src={p.images[0]!} alt="" sizes="40px" wrapperClassName="size-10 shrink-0 rounded-md" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="line-clamp-1 text-body">{p.name}</span>
              <span className="text-caption text-fg-muted figures">LM-1002{40 + i}</span>
            </span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  </div>
);
