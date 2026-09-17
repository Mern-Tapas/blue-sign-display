"use client";

import { useState } from "react";
import { EyeOff, Inbox, SearchX } from "lucide-react";
import { BarChart } from "@/components/charts/bar-chart";
import { ChartFrame } from "@/components/charts/chart-frame";
import { toast } from "@/components/providers/toast-store";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from "@/lib/format";
import { FilterBar, type FilterValues } from "../admin-parts";
import type { ModerationReview, ModerationStatus } from "./catalog-data";
import { ModerationReviewCard } from "./moderation-review-card";

const tabs: { value: ModerationStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "published", label: "Published" },
  { value: "hidden", label: "Hidden" },
];

const hideReasons = ["Spam or advertising", "Offensive or abusive language", "Personal information (phone, address)", "About delivery, not the product", "Not about this product"];

const reasonForFlag = (flag?: string) =>
  !flag ? undefined : /phone|address/i.test(flag) ? hideReasons[2] : /advert|store/i.test(flag) ? hideReasons[0] : undefined;

const ratingBands = [
  { value: "positive", label: "4–5 stars", test: (r: number) => r >= 4 },
  { value: "mixed", label: "3 stars", test: (r: number) => r === 3 },
  { value: "negative", label: "1–2 stars", test: (r: number) => r <= 2 },
];

const emptyCopy: Record<ModerationStatus, { title: string; description: string }> = {
  pending: { title: "You’re all caught up", description: "New reviews wait here before they go live. Reviews with phone numbers or links to other stores are flagged for a closer look." },
  published: { title: "No published reviews", description: "Reviews you publish appear on product pages with the verified-buyer mark when it applies." },
  hidden: { title: "Nothing hidden", description: "Hidden reviews stay here with the reason, so you can publish them again if you change your mind." },
};

/** Review moderation: status tabs, flagged content first, publish / hide with a reason / reply, and the rating mix. */
export function ReviewsModeration({ initialReviews }: { initialReviews: ModerationReview[] }) {
  const [items, setItems] = useState(initialReviews);
  const [tab, setTab] = useState<ModerationStatus>("pending");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hideIds, setHideIds] = useState<string[] | null>(null);
  const [hideReason, setHideReason] = useState<string>("");

  const q = search.trim().toLowerCase();
  const bands = filters.rating ?? [];
  const inTab = items
    .filter((r) => r.status === tab)
    .filter((r) => !q || [r.title, r.body, r.author, r.productName].some((s) => s.toLowerCase().includes(q)))
    .filter((r) => bands.length === 0 || ratingBands.some((b) => bands.includes(b.value) && b.test(r.rating)))
    .sort((a, b) => (tab === "pending" ? Number(Boolean(b.flag)) - Number(Boolean(a.flag)) : 0) || b.date.localeCompare(a.date));
  const counts = Object.fromEntries(tabs.map((t) => [t.value, items.filter((r) => r.status === t.value).length])) as Record<ModerationStatus, number>;
  const selectedInTab = inTab.filter((r) => selected.has(r.id));
  const allSelected = inTab.length > 0 && selectedInTab.length === inTab.length;
  const filtered = Boolean(q) || bands.length > 0;

  const plural = (n: number) => `${n} ${n === 1 ? "review" : "reviews"}`;

  function update(ids: string[], patch: (r: ModerationReview) => ModerationReview, title: string) {
    const before = items;
    setItems((list) => list.map((r) => (ids.includes(r.id) ? patch(r) : r)));
    setSelected((s) => new Set([...s].filter((id) => !ids.includes(id))));
    toast({ tone: "success", title, description: "Demo: changes stay in this tab.", action: { label: "Undo", onClick: () => setItems(before) } });
  }

  const publish = (ids: string[]) => update(ids, (r) => ({ ...r, status: "published", hiddenReason: undefined }), `Published ${plural(ids.length)}`);

  function askHide(ids: string[]) {
    const flagged = items.find((r) => ids.includes(r.id) && r.flag);
    setHideReason(reasonForFlag(flagged?.flag) ?? "");
    setHideIds(ids);
  }

  // Rating mix across every review in the queue (all statuses).
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: items.filter((r) => r.rating === stars).length }));
  const average = items.reduce((s, r) => s + r.rating, 0) / Math.max(1, items.length);
  const published = items.filter((r) => r.status === "published");
  const replied = published.filter((r) => r.reply).length;

  const list = (
    <Card variant="outline" padding="none" className="min-w-0 overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-border-subtle p-3">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search reviews or products"
          filters={[{ id: "rating", label: "Rating", options: ratingBands.map((b) => ({ value: b.value, label: b.label, count: items.filter((r) => r.status === tab && b.test(r.rating)).length })) }]}
          values={filters}
          onValuesChange={setFilters}
        />
        {inTab.length > 0 && (
          <div className="flex min-h-control-sm flex-wrap items-center gap-2 px-1">
            <Checkbox
              label={selectedInTab.length ? `${selectedInTab.length} selected` : `Select all ${plural(inTab.length)}`}
              checked={allSelected ? true : selectedInTab.length ? "indeterminate" : false}
              onCheckedChange={() => setSelected((s) => (allSelected ? new Set([...s].filter((id) => !inTab.some((r) => r.id === id))) : new Set([...s, ...inTab.map((r) => r.id)])))}
            />
            {selectedInTab.length > 0 && (
              <div className="ml-auto flex flex-wrap gap-2" role="group" aria-label="Bulk actions">
                {tab !== "published" && (
                  <Button variant="secondary" size="sm" onClick={() => publish(selectedInTab.map((r) => r.id))}>
                    Publish {selectedInTab.length}
                  </Button>
                )}
                {tab !== "hidden" && (
                  <Button variant="ghost" size="sm" onClick={() => askHide(selectedInTab.map((r) => r.id))}>
                    Hide {selectedInTab.length}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {inTab.length === 0 ? (
        filtered ? (
          <EmptyState
            compact
            icon={<SearchX aria-hidden />}
            title="No reviews match"
            description="Try another word or rating, or clear the filters."
            action={
              <Button variant="secondary" size="sm" onClick={() => { setSearch(""); setFilters({}); }}>
                Clear search and filters
              </Button>
            }
          />
        ) : (
          <EmptyState compact icon={tab === "hidden" ? <EyeOff aria-hidden /> : <Inbox aria-hidden />} title={emptyCopy[tab].title} description={emptyCopy[tab].description} />
        )
      ) : (
        <ul className="divide-y divide-border-subtle" aria-label={`${tabs.find((t) => t.value === tab)!.label} reviews`}>
          {inTab.map((r) => (
            <li key={r.id}>
              <ModerationReviewCard
                review={r}
                selected={selected.has(r.id)}
                onSelectedChange={(on) => setSelected((s) => { const n = new Set(s); if (on) n.add(r.id); else n.delete(r.id); return n; })}
                onPublish={() => publish([r.id])}
                onHide={() => askHide([r.id])}
                onReply={(reply) => update([r.id], (x) => ({ ...x, reply }), r.reply ? "Reply updated" : `Reply saved${r.status === "published" ? " and visible on the product page" : ""}`)}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
      <Tabs value={tab} onValueChange={(v) => setTab(v as ModerationStatus)} className="min-w-0 gap-4">
        <TabsList variant="underline" aria-label="Review status">
          {tabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value} count={counts[t.value]}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent key={t.value} value={t.value} className="min-w-0">
            {t.value === tab && list}
          </TabsContent>
        ))}
      </Tabs>

      <ChartFrame
        className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)] lg:mt-15"
        title="Rating mix"
        description={`${plural(items.length)} in the queue · average ${formatNumber(average, { maximumFractionDigits: 1 })} out of 5`}
        table={{ columns: ["Rating", "Reviews", "Share"], rows: distribution.map((d) => [`${d.stars} ${d.stars === 1 ? "star" : "stars"}`, formatNumber(d.count), `${Math.round((d.count / Math.max(1, items.length)) * 100)}%`]) }}
        footer={
          <dl className="grid grid-cols-2 gap-3 border-t border-border-subtle pt-4">
            <div>
              <dt className="text-caption text-fg-muted">Awaiting review</dt>
              <dd className="text-body-strong figures">{formatNumber(counts.pending)}</dd>
            </div>
            <div>
              <dt className="text-caption text-fg-muted">Published with a reply</dt>
              <dd className="text-body-strong figures">
                {formatNumber(replied)} of {formatNumber(published.length)}
              </dd>
            </div>
          </dl>
        }
      >
        <BarChart
          orientation="horizontal"
          categories={distribution.map((d) => `${d.stars} ${d.stars === 1 ? "star" : "stars"}`)}
          series={[{ id: "reviews", label: "Reviews", slot: 0, values: distribution.map((d) => d.count) }]}
          valueLabels
          summary={`Rating mix of ${items.length} reviews: ${distribution.map((d) => `${d.stars} stars ${d.count}`).join(", ")}.`}
        />
      </ChartFrame>

      <ConfirmDialog
        open={hideIds !== null}
        onOpenChange={(o) => !o && setHideIds(null)}
        tone="danger"
        icon={<EyeOff aria-hidden />}
        title={hideIds && hideIds.length > 1 ? `Hide ${plural(hideIds.length)}?` : "Hide this review?"}
        description="Shoppers won’t see it on the product page and it stops counting towards the product rating. It stays in Hidden, where you can publish it again."
        confirmLabel="Hide review"
        confirmDisabled={!hideReason}
        body={
          <Field label="Reason" required hint="Saved with the review for your team; the customer isn’t notified.">
            <Select value={hideReason} onValueChange={setHideReason} placeholder="Choose a reason" options={hideReasons.map((r) => ({ value: r, label: r }))} />
          </Field>
        }
        onConfirm={() => {
          const ids = hideIds ?? [];
          update(ids, (r) => ({ ...r, status: "hidden", hiddenReason: hideReason }), `Hid ${plural(ids.length)}`);
        }}
      />
    </div>
  );
}
