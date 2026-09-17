import type { Metadata } from "next";
import { Heart, Package, Search, ShoppingBag, Truck, Wallet } from "lucide-react";
import { DsDoDont } from "@/components/docs/ds-foundations";
import { DsPageHeader, DsPreview, DsSection } from "@/components/docs/ds-section";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { IconTile } from "@/components/ui/icon-tile";

export const metadata: Metadata = { title: "Iconography" };

const sizes = [
  { cls: "size-icon-sm", name: "icon-sm", px: 14, use: "Small buttons, chips, captions" },
  { cls: "size-icon-md", name: "icon-md", px: 16, use: "Default buttons, fields, menu rows" },
  { cls: "size-icon-base", name: "icon-base", px: 18, use: "Large buttons, 40px icon buttons, alerts" },
  { cls: "size-icon-lg", name: "icon-lg", px: 20, use: "48px icon buttons, empty states" },
];

export default function IconographyPage() {
  return (
    <>
      <DsPageHeader
        title="Iconography"
        muted="in lucide"
        description="lucide-react outline icons at stroke 1.75, so they sit at the weight of Geist text. Sizes come from four tokens; icons are decorative (aria-hidden) and the adjacent text or label carries the meaning."
      />

      <DsSection title="Sizes">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {sizes.map((s) => (
            <div key={s.name} className="flex flex-col gap-3 rounded-2xl bg-surface p-5 shadow-flat">
              <div className="flex h-16 items-center justify-center gap-3 rounded-lg bg-surface-sunken text-fg">
                <ShoppingBag aria-hidden className={s.cls} />
                <Truck aria-hidden className={s.cls} />
                <Heart aria-hidden className={s.cls} />
              </div>
              <div>
                <p className="font-mono text-caption">size-{s.name}</p>
                <p className="text-caption text-fg-muted">
                  {s.px}px · {s.use}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DsSection>

      <DsSection title="In components" description="Buttons, icon buttons and fields size their icons automatically — pass the icon without a size class.">
        <DsPreview label="Automatic sizing" className="gap-3">
          <Button size="sm" leadingIcon={<Search aria-hidden />}>Search</Button>
          <Button leadingIcon={<ShoppingBag aria-hidden />}>Add to bag</Button>
          <Button size="lg" leadingIcon={<ShoppingBag aria-hidden />}>Add to bag</Button>
          <IconButton label="Save to wishlist" size="sm"><Heart aria-hidden /></IconButton>
          <IconButton label="Save to wishlist"><Heart aria-hidden /></IconButton>
          <IconButton label="Save to wishlist" size="lg"><Heart aria-hidden /></IconButton>
        </DsPreview>
      </DsSection>

      <DsSection title="Icon tiles" description="Round containers beside titles, in empty states and dialogs. Tone follows meaning; neutral is the default.">
        <DsPreview label="IconTile" className="gap-3">
          <IconTile size="sm"><Package /></IconTile>
          <IconTile><Wallet /></IconTile>
          <IconTile tone="accent"><ShoppingBag /></IconTile>
          <IconTile size="lg" tone="success"><Truck /></IconTile>
          <IconTile size="xl" tone="muted"><Search /></IconTile>
        </DsPreview>
      </DsSection>

      <DsSection title="Guidance">
        <DsDoDont
          items={[
            {
              do: {
                example: <IconButton label="Save to wishlist" variant="secondary"><Heart aria-hidden /></IconButton>,
                text: "give icon-only buttons a label (IconButton requires one); it becomes aria-label and a tooltip title.",
              },
              dont: {
                example: (
                  <span className="flex size-control-md items-center justify-center rounded-pill bg-surface shadow-flat">
                    <Heart aria-hidden className="size-6" strokeWidth={2.5} />
                  </span>
                ),
                text: "hand-roll icon buttons with custom sizes or heavier strokes — they drift from the scale and lose their name.",
              },
            },
          ]}
        />
      </DsSection>
    </>
  );
}
