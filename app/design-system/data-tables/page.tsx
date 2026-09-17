import type { Metadata } from "next";
import { StatusPill } from "@/components/admin/admin-display";
import { DataTableDemo, DetailPanelDemo } from "@/components/docs/demos/admin-demos";
import { DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";

export const metadata: Metadata = { title: "Data tables & filters" };

export default function DataTablesDocsPage() {
  return (
    <>
      <DsPageHeader
        title="Data tables"
        muted="& filters"
        description="Dense lists the store runs on: orders, products, customers, settlements. Real table semantics, sortable headers, selection with a bulk bar, density and column choice, and a card layout on phones. Filters sit in one row above what they scope."
      />

      <DsSection title="DataTable" description="Sort a header (aria-sort updates), select rows to reveal the bulk action bar, switch density, hide columns, and switch the preview state. Resize below 768px to see the card layout. Demo orders.">
        <DataTableDemo />
      </DsSection>

      <DsSection title="Master–detail" description="Open a record without losing the list: an inline side panel from 1024px, a sheet below.">
        <DsPreview label="DetailPanel" align="start" className="block">
          <DetailPanelDemo />
        </DsPreview>
      </DsSection>

      <DsSection title="Status" description="Dot plus words; the colour never carries the meaning alone. Live states pulse (paused under reduced motion).">
        <DsPreview label="StatusPill" className="gap-2">
          <StatusPill tone="warning" label="Payment pending" />
          <StatusPill tone="info" label="To pack" />
          <StatusPill tone="accent" label="Out for delivery" live />
          <StatusPill tone="success" label="Delivered" />
          <StatusPill tone="danger" label="RTO" />
          <StatusPill tone="neutral" label="Cancelled" />
        </DsPreview>
      </DsSection>

      <DsSection title="Props">
        <div className="flex flex-col gap-5">
          <DsProps
            component="DataTable<T>"
            rows={[
              { name: "caption", type: "string", description: "Accessible caption and column-menu label." },
              { name: "columns", type: "DataColumn<T>[]", description: "id, header, cell, sortValue, align, hideBelow, hideable, defaultHidden." },
              { name: "rows · getRowId", type: "T[] · (row) => string", description: "Data and stable ids." },
              { name: "selectable · bulkActions", type: "boolean · (selected, clear) => ReactNode", description: "Checkbox column and the sticky bulk bar." },
              { name: "rowHref", type: "(row) => string", description: "First cell becomes a stretched link; other cells stay interactive." },
              { name: "defaultSort · pageSize · density", type: "…", default: "— · 10 · comfortable", description: "Initial table state." },
              { name: "toolbar", type: "ReactNode", description: "Usually a FilterBar." },
              { name: "loading · error · onRetry · empty", type: "…", description: "Skeleton rows, retry state and teaching empty state." },
              { name: "renderCard", type: "(row) => ReactNode", description: "Phone layout below 768px." },
            ]}
          />
          <DsProps
            component="FilterBar · DateRangePicker · DetailPanel"
            rows={[
              { name: "search · onSearchChange · filters · values · onValuesChange · children", type: "FilterBar", description: "Filter menus with counts, removable active chips, clear all." },
              { name: "value · onValueChange · today · comparable", type: "DateRangePicker", description: "Preset rows, custom range, compare to previous period (lib/date-range)." },
              { name: "open · onOpenChange · title · description · footer", type: "DetailPanel", description: "Inline aside ≥1024px, Sheet below." },
            ]}
          />
        </div>
      </DsSection>
    </>
  );
}
