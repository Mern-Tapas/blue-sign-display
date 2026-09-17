import type { Metadata } from "next";
import { ActivityFeed, SettingsSection } from "@/components/admin/admin-display";
import { KpiRow, KpiTile, Meter, MetricDelta } from "@/components/admin/metrics";
import { StatCard } from "@/components/commerce/stat-card";
import { FormActionsDemo } from "@/components/docs/demos/admin-demos";
import { DsDoDont } from "@/components/docs/ds-foundations";
import { DsGrid, DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { Switch } from "@/components/ui/switch";
import { adminRelative } from "@/lib/admin-format";
import { ADMIN_TODAY, auditLog, dailySales } from "@/lib/data/admin";

export const metadata: Metadata = { title: "Metrics & activity" };

export default function MetricsDocsPage() {
  return (
    <>
      <DsPageHeader
        title="Metrics"
        muted="& activity"
        description="Headline numbers with honest context, limits that warn before they bite, a readable audit trail, and settings that only save when something changed. Figures are demo data."
      />

      <DsSection title="KPI tiles" description="Label, one value (proportional figures), change vs a named period coloured by whether the direction is good, and an optional 14-point sparkline. The whole tile can link to its report.">
        <KpiRow>
          <KpiTile label="Net sales" value="₹1.01Cr" delta={{ value: 9.1, period: "vs previous 30 days" }} trend={dailySales.slice(-14).map((d) => d.revenue)} href="/admin/reports" />
          <KpiTile label="Orders" value="3,810" delta={{ value: 7.7, period: "vs previous 30 days" }} trend={dailySales.slice(-14).map((d) => d.orders)} />
          <KpiTile label="Return rate" value="6.4%" delta={{ value: 1.2, period: "vs previous 30 days", goodDirection: "down" }} note="rise is worse" />
          <KpiTile label="RTO (COD)" value="8.9%" delta={{ value: -2.1, period: "vs previous 30 days", goodDirection: "down" }} />
        </KpiRow>
      </DsSection>

      <DsSection title="Deltas & meters">
        <DsGrid>
          <DsPreview label="MetricDelta" className="flex-col items-start gap-2">
            <MetricDelta value={12.4} period="vs last week" />
            <MetricDelta value={-3.1} period="vs last week" />
            <MetricDelta value={4.2} period="return rate" goodDirection="down" />
            <MetricDelta value={0} period="vs last week" />
          </DsPreview>
          <DsPreview label="Meter · same-ramp track, severity in words" className="flex-col items-stretch gap-5">
            <Meter label="COD exposure today" value={38400} max={100000} valueLabel="₹38,400 of ₹1,00,000" />
            <Meter label="Shipping credits used" value={8200} max={10000} valueLabel="8,200 of 10,000" />
            <Meter label="Coupon BLUESIGNS20 redemptions" value={4720} max={5000} valueLabel="4,720 of 5,000" />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Activity feed" description="Actor first, then what happened, then when. Tone marks the kind of event; the sentence carries the meaning.">
        <DsPreview label="ActivityFeed" className="block">
          <ActivityFeed items={auditLog.slice(0, 5)} formatTime={(iso) => adminRelative(iso, ADMIN_TODAY)} className="max-w-xl" />
        </DsPreview>
      </DsSection>

      <DsSection title="Settings" description="Explanation on the left, controls on the right from 1024px. Editors show a sticky unsaved-changes bar only when the draft differs.">
        <div className="flex flex-col gap-8">
          <SettingsSection title="Order notifications" description="Who hears about new orders and when.">
            <Switch label="Email me for every new order" description="Sent to sujon@bluesigns.shop" defaultChecked />
            <Switch label="WhatsApp alert for orders above ₹10,000" />
          </SettingsSection>
          <DsPreview label="FormActionsBar + useDraft" className="block">
            <FormActionsDemo />
          </DsPreview>
        </div>
      </DsSection>

      <DsSection title="Guidance">
        <DsDoDont
          items={[
            {
              do: { example: <KpiTile label="Return rate" value="6.4%" delta={{ value: 1.2, period: "vs last month", goodDirection: "down" }} className="w-56" />, text: "say which direction is good; a rising return rate is red even though the number went up." },
              dont: { example: <div className="flex w-56 flex-col gap-1 rounded-2xl bg-surface p-4 shadow-card"><p className="text-caption text-fg-muted">Return rate</p><p className="text-figure-lg">6.4%</p><p className="text-caption text-success-fg">▲ 1.2%</p></div>, text: "colour every increase green, or show a delta without the period it compares to." },
            },
          ]}
        />
      </DsSection>

      <DsSection title="Legacy StatCard" description="The storefront's dashboard-style tile stays exported for compatibility. New admin screens use KpiTile.">
        <DsPreview label="StatCard" className="block">
          <div className="max-w-xs">
            <StatCard label="Total spent" value="₹42,805" trend={12.4} caption="this year" />
          </div>
        </DsPreview>
      </DsSection>

      <DsSection title="Props">
        <DsProps
          component="KpiTile · MetricDelta · Meter · ActivityFeed · SettingsSection · FormActionsBar"
          rows={[
            { name: "label · value · delta · trend · href · note", type: "KpiTile", description: "Server-safe; KpiRow lays out 1 → 2 → 4 columns." },
            { name: "value · period · goodDirection", type: "MetricDelta", description: "Arrow + signed % + '(better/worse)' for screen readers." },
            { name: "label · value · max · valueLabel · thresholds", type: "Meter", description: "role=meter with aria-valuetext." },
            { name: "items[{id,actor,action,at,icon,tone}] · formatTime", type: "ActivityFeed", description: "Pass a deterministic formatter (lib/admin-format)." },
            { name: "title · description · children", type: "SettingsSection", description: "Two-column settings row." },
            { name: "dirty · saving · onDiscard · saveLabel", type: "FormActionsBar", description: "Place inside the form; Save is type=submit. useDraft(initial) tracks dirty state." },
          ]}
        />
      </DsSection>
    </>
  );
}
