import type { Metadata } from "next";
import { ChartFrame } from "@/components/charts/chart-frame";
import { Heatmap } from "@/components/charts/heatmap";
import { Donut, Funnel, ShareBar, Sparkline } from "@/components/charts/small-charts";
import { GroupedBarDemo, LineChartDemo } from "@/components/docs/demos/admin-demos";
import { DsDoDont, DsTokenTable } from "@/components/docs/ds-foundations";
import { DsGrid, DsPageHeader, DsPreview, DsProps, DsSection, DsSubsection } from "@/components/docs/ds-section";
import { conversionFunnel, dailySales, hours, ordersHeatmap, paymentMix, weekdays } from "@/lib/data/admin";
import { formatNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Charts" };

const payment = paymentMix.map((p) => ({ ...p, value: Math.round(p.value * 1000) }));

export default function ChartsDocsPage() {
  return (
    <>
      <DsPageHeader
        title="Charts"
        muted="that say one thing"
        description="In-house SVG charts on BlueSigns tokens, built with the dataviz method: pick the form first, colour by job, validate the palette, thin marks, one axis, and a table view for every chart. All figures on this page are demo data."
      />

      <DsSection title="Palette" description="Validated with the dataviz six-checks in both themes: lightness band, chroma floor, adjacent CVD ΔE ≥ 9.2, normal-vision ΔE ≥ 19.3, and slots 1–3 also pass all-pairs. Slots 2, 5 and 6 sit below 3:1 on white, so charts using them always carry labels or the table view.">
        <DsSubsection title="Categorical (fixed order, never cycled)">
          <DsTokenTable
            caption="Categorical chart tokens"
            rows={[
              { token: "chart-1", utility: "slot 0", usage: "First series; single-series charts", swatch: true },
              { token: "chart-2", utility: "slot 1", usage: "Second series (comparison period)", swatch: true },
              { token: "chart-3", utility: "slot 2", usage: "Third series", swatch: true },
              { token: "chart-4", utility: "slot 3", usage: "Fourth series — direct labels mandatory", swatch: true },
              { token: "chart-5", utility: "slot 4", usage: "Fifth series — legend or small multiples", swatch: true },
              { token: "chart-6", utility: "slot 5", usage: "Sixth series — fold anything beyond into Other", swatch: true },
              { token: "chart-other", utility: "CHART_OTHER", usage: "De-emphasis, Other, sparkline history", swatch: true },
            ]}
          />
        </DsSubsection>
        <DsSubsection title="Ordinal, sequential & chrome">
          <DsTokenTable
            caption="Ramp and chrome tokens"
            rows={[
              { token: "chart-ord-1", usage: "Funnel / tier — lightest step (≥2:1 on surface)", swatch: true },
              { token: "chart-ord-5", usage: "Funnel / tier — darkest step", swatch: true },
              { token: "chart-seq-1", usage: "Heatmap — near zero recedes to the surface", swatch: true },
              { token: "chart-seq-7", usage: "Heatmap — maximum", swatch: true },
              { token: "chart-div-neg", usage: "Diverging — below baseline", swatch: true },
              { token: "chart-div-mid", usage: "Diverging — neutral midpoint", swatch: true },
              { token: "chart-grid", usage: "Solid hairline gridlines", swatch: true },
              { token: "chart-axis", usage: "Baseline / zero line / crosshair", swatch: true },
            ]}
          />
        </DsSubsection>
      </DsSection>

      <DsSection title="Line & area" description="Trend over time. 2px line, 10% wash under a single series, end label, a crosshair that snaps to the nearest day, and the same readout on keyboard focus (focus the chart, then ← →). Switching metric swaps the chart, never adds a second axis.">
        <LineChartDemo />
      </DsSection>

      <DsSection title="Bars" description="Bars at most 24px with a 4px rounded data end, square at the baseline, and a 2px surface gap between neighbours and stack segments. Each bar is its own hover and focus target.">
        <GroupedBarDemo />
      </DsSection>

      <DsSection title="Part-to-whole">
        <DsGrid>
          <DsPreview label="ShareBar · default for part-to-whole" className="block">
            <ShareBar label="Payment mix" segments={payment} showValues={false} />
          </DsPreview>
          <DsPreview label="Donut · ≤5 segments, at a glance only" className="block">
            <Donut label="Payment mix" segments={payment} centerValue="9,140" centerLabel="orders" showValues={false} />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Funnel, heatmap & sparkline">
        <DsGrid>
          <ChartFrame title="Conversion funnel" description="Ordinal ramp; counts and step conversion always visible" table={{ columns: ["Stage", "Count"], rows: conversionFunnel.map((s) => [s.label, formatNumber(s.value)]) }}>
            <Funnel label="Conversion funnel" stages={conversionFunnel} format="compact" />
          </ChartFrame>
          <DsPreview label="Sparkline · history de-emphasised, current point in accent" className="flex-col items-start gap-3">
            <Sparkline values={dailySales.slice(-14).map((d) => d.revenue)} width={160} height={40} />
            <p className="text-caption text-fg-muted">Decorative: the value and delta beside it carry the meaning.</p>
          </DsPreview>
        </DsGrid>
        <ChartFrame className="mt-5" title="Orders by weekday and hour" description="Sequential ramp with a scale legend; the grid is keyboard navigable" table={{ columns: ["Day", ...hours], rows: weekdays.map((d, i) => [d, ...ordersHeatmap[i]!.map(String)]) }}>
          <Heatmap rows={weekdays} columns={hours} values={ordersHeatmap} label="Orders by weekday and hour" />
        </ChartFrame>
      </DsSection>

      <DsSection title="Guidance">
        <DsDoDont
          items={[
            {
              do: { example: <p className="text-body text-fg-muted">Two measures → two charts, or index both to 100.</p>, text: "keep one y-axis per chart." },
              dont: { example: <p className="text-body text-fg-muted">Revenue (₹0–₹6L) and orders (0–150) on twin axes.</p>, text: "build dual-axis charts; the scale alignment invents a correlation." },
            },
            {
              do: { example: <p className="text-body text-fg-muted">One series → every bar in slot 1, no legend box.</p>, text: "colour identity, not magnitude, and keep a series' slot when filters change." },
              dont: { example: <p className="text-body text-fg-muted">Each product bar a different hue, darker when bigger.</p>, text: "use a rainbow or a value ramp on nominal categories." },
            },
          ]}
        />
      </DsSection>

      <DsSection title="Props">
        <DsProps
          component="Charts"
          rows={[
            { name: "title · description · action · legend · table · refreshing · empty · footer", type: "ChartFrame", description: "Chart / table toggle; holds the previous render at 50% while refreshing." },
            { name: "labels · series[{id,label,slot,values}] · area · format · height · summary · endLabels", type: "LineChart", description: "Crosshair tooltip, ← → / Home / End on focus." },
            { name: "categories · series · stacked · orientation · format · height · summary · valueLabels", type: "BarChart", description: "Grouped, stacked, vertical or horizontal." },
            { name: "segments[{id,label,value,slot}] · label · format · showValues", type: "ShareBar · Donut", description: "Donut throws above 5 segments." },
            { name: "stages · label · format", type: "Funnel", description: "Ordinal ramp, step conversion %." },
            { name: "rows · columns · values · format · label · columnLabelEvery", type: "Heatmap", description: "Roving arrow-key grid, scale legend." },
            { name: "values · width · height", type: "Sparkline", description: "aria-hidden; pair with a value." },
          ]}
        />
      </DsSection>
    </>
  );
}
