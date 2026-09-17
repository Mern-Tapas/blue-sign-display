"use client";

import { useMemo, useState } from "react";
import { BadgePercent, Boxes, History, Rows3, SearchX, Settings, ShoppingBag, Wallet, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { adminDateShort, adminDateTime } from "@/lib/admin-format";
import { ADMIN_DEMO_NOTE, ADMIN_TODAY } from "@/lib/data/admin";
import { formatNumber } from "@/lib/format";
import { ActivityFeed } from "../admin-display";
import { FilterBar, type FilterValues } from "../admin-parts";
import { DataTable, type DataColumn } from "../data-table";
import { PageHeader } from "../page-header";
import { auditTypeLabels, fullAuditLog, type AuditEntry, type AuditType } from "./settings-data";

const typeIcon: Record<AuditType, React.ReactNode> = {
  orders: <ShoppingBag aria-hidden />,
  returns: <RotateCcw aria-hidden />,
  catalog: <Boxes aria-hidden />,
  payouts: <Wallet aria-hidden />,
  marketing: <BadgePercent aria-hidden />,
  settings: <Settings aria-hidden />,
};

const dayKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const todayKey = dayKey(ADMIN_TODAY.toISOString());
const yesterdayKey = dayKey(new Date(ADMIN_TODAY.getFullYear(), ADMIN_TODAY.getMonth(), ADMIN_TODAY.getDate() - 1).toISOString());
const dayTitle = (key: string) => (key === todayKey ? `Today · ${adminDateShort(key)}` : key === yesterdayKey ? `Yesterday · ${adminDateShort(key)}` : adminDateShort(key));
const timeOnly = (iso: string) => adminDateTime(iso).split(", ")[1] ?? "";

const actors = [...new Set(fullAuditLog.map((a) => a.actor))].sort();
const filterDefs = [
  { id: "actor", label: "Actor", options: actors.map((a) => ({ value: a, label: a, count: fullAuditLog.filter((x) => x.actor === a).length })) },
  { id: "type", label: "Type", options: (Object.keys(auditTypeLabels) as AuditType[]).map((t) => ({ value: t, label: auditTypeLabels[t], count: fullAuditLog.filter((x) => x.type === t).length })) },
];

const columns: DataColumn<AuditEntry>[] = [
  { id: "at", header: "When", cell: (a) => <span className="figures">{adminDateTime(a.at)}</span>, sortValue: (a) => a.at },
  { id: "actor", header: "Actor", cell: (a) => <span className="text-body-strong">{a.actor}</span>, sortValue: (a) => a.actor },
  { id: "action", header: "Action", cell: (a) => a.action, className: "min-w-80 whitespace-normal" },
  { id: "type", header: "Type", cell: (a) => <Badge>{auditTypeLabels[a.type]}</Badge>, sortValue: (a) => auditTypeLabels[a.type], hideBelow: "lg" },
];

/** Everything staff, systems and partners changed in the store, searchable and filterable, as a timeline or a table. */
export function AuditLogScreen() {
  const [search, setSearch] = useState("");
  const [values, setValues] = useState<FilterValues>({});
  const [view, setView] = useState<"timeline" | "table">("timeline");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return fullAuditLog.filter(
      (a) =>
        (!values.actor?.length || values.actor.includes(a.actor)) &&
        (!values.type?.length || values.type.includes(a.type)) &&
        (!q || `${a.actor} ${a.action}`.toLowerCase().includes(q)),
    );
  }, [search, values]);

  // Type counts ignore the type filter itself, so choosing a type never zeroes the others.
  const byTypeBase = fullAuditLog.filter((a) => (!values.actor?.length || values.actor.includes(a.actor)) && (!search.trim() || `${a.actor} ${a.action}`.toLowerCase().includes(search.trim().toLowerCase())));

  const days = rows.reduce<{ key: string; items: AuditEntry[] }[]>((groups, a) => {
    const key = dayKey(a.at);
    const last = groups[groups.length - 1];
    return last?.key === key ? [...groups.slice(0, -1), { key, items: [...last.items, a] }] : [...groups, { key, items: [a] }];
  }, []);

  const filtered = search !== "" || Object.values(values).some((v) => v.length > 0);
  const clear = () => {
    setSearch("");
    setValues({});
  };

  return (
    <>
      <PageHeader
        title="Audit log"
        breadcrumbs={[{ label: "Settings", href: "/admin/settings" }, { label: "Audit log" }]}
        meta={
          <>
            <span>Kept for 180 days</span>
            <span aria-hidden>·</span>
            <span>{ADMIN_DEMO_NOTE}</span>
          </>
        }
      >
        <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search actions" filters={filterDefs} values={values} onValuesChange={setValues}>
          <SegmentedControl
            aria-label="View"
            value={view}
            onValueChange={(v) => setView(v as "timeline" | "table")}
            className="sm:ml-auto"
            options={[
              { value: "timeline", label: "Timeline", icon: <History aria-hidden /> },
              { value: "table", label: "Table", icon: <Rows3 aria-hidden /> },
            ]}
          />
        </FilterBar>
      </PageHeader>

      <p aria-live="polite" className="-mt-2 text-caption text-fg-muted">
        {filtered ? `${formatNumber(rows.length)} of ${formatNumber(fullAuditLog.length)} events` : `${formatNumber(fullAuditLog.length)} events in the last 9 days`}
      </p>

      {view === "table" ? (
        <DataTable
          caption="Audit log"
          columns={columns}
          rows={rows}
          getRowId={(a) => a.id}
          defaultSort={{ id: "at", direction: "desc" }}
          pageSize={12}
          density="compact"
          toolbar={<p className="text-caption text-fg-muted">Newest first. Sort by any column.</p>}
          empty={{ title: "No events match", description: "Try another actor or type, or clear the search.", action: <Button variant="secondary" size="sm" onClick={clear}>Clear filters</Button> }}
          renderCard={(a) => (
            <div className="flex flex-col gap-1">
              <p className="text-body">
                <span className="text-body-strong">{a.actor}</span> {a.action}
              </p>
              <p className="text-caption text-fg-muted figures">
                {adminDateTime(a.at)} · {auditTypeLabels[a.type]}
              </p>
            </div>
          )}
        />
      ) : days.length === 0 ? (
        <Card padding="md">
          <EmptyState
            compact
            icon={<SearchX aria-hidden />}
            title="No events match"
            description="Every change made by staff, the system and payment partners is recorded here. Try another actor or type."
            action={
              <Button variant="secondary" size="sm" onClick={clear}>
                Clear filters
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="flex min-w-0 flex-col gap-4">
            {days.map((day) => (
              <Card key={day.key} padding="md" asChild>
                <section aria-labelledby={`day-${day.key}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 id={`day-${day.key}`} className="text-title">
                      {dayTitle(day.key)}
                    </h2>
                    <span className="text-caption text-fg-muted figures">
                      {day.items.length} {day.items.length === 1 ? "event" : "events"}
                    </span>
                  </div>
                  <ActivityFeed items={day.items.map((a) => ({ ...a, icon: typeIcon[a.type] }))} formatTime={(iso) => timeOnly(iso)} />
                </section>
              </Card>
            ))}
          </div>
          <Card padding="md" className="max-xl:hidden xl:sticky xl:top-[calc(var(--nav-h)+1.5rem)]" asChild>
            <aside aria-labelledby="audit-by-type">
              <h2 id="audit-by-type" className="text-title">
                Events by type
              </h2>
              <ul className="-mx-2 flex flex-col">
                {(Object.keys(auditTypeLabels) as AuditType[]).map((t) => {
                  const count = byTypeBase.filter((a) => a.type === t).length;
                  const on = values.type?.includes(t) ?? false;
                  return (
                    <li key={t}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setValues({ ...values, type: on ? (values.type ?? []).filter((x) => x !== t) : [...(values.type ?? []), t] })}
                        className="state-layer focus-ring-row relative flex h-row-sm w-full items-center gap-3 rounded-md px-2 text-left text-body aria-pressed:bg-selected [&_svg]:size-icon-md [&_svg]:text-fg-muted"
                      >
                        {typeIcon[t]}
                        <span className="min-w-0 flex-1 truncate">{auditTypeLabels[t]}</span>
                        <span className="text-caption text-fg-muted figures">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="text-caption text-fg-muted">Counts follow the search and actor filter. Select types to narrow the log.</p>
            </aside>
          </Card>
        </div>
      )}
    </>
  );
}
