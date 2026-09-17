"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, Columns3, RefreshCw, SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Pagination } from "@/components/ui/pagination";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";
import { formatNumber } from "@/lib/format";

export type DataColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  /** Enables sorting on this column. */
  sortValue?: (row: T) => string | number;
  align?: "start" | "end";
  /** Hide below a breakpoint on the table layout (the card layout shows `cardPrimary` columns only). */
  hideBelow?: "md" | "lg" | "xl";
  /** Can be switched off in the column menu. */
  hideable?: boolean;
  defaultHidden?: boolean;
  className?: string;
};

export type DataTableProps<T> = {
  /** Accessible caption (also the column menu label). */
  caption: string;
  columns: DataColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** Row selection with a bulk bar; `bulkActions` receives the selected rows. */
  selectable?: boolean;
  bulkActions?: (selected: T[], clear: () => void) => React.ReactNode;
  /** Whole-row link (the first column becomes the link; other interactive cells stay reachable). */
  rowHref?: (row: T) => string;
  /** Open a record in place (e.g. a DetailPanel). The first cell becomes a stretched button. Ignored when rowHref is set. */
  onRowClick?: (row: T) => void;
  /** Marks one row as the open record (aria-current + selected fill). */
  activeRowId?: string;
  defaultSort?: { id: string; direction: "asc" | "desc" };
  pageSize?: number;
  density?: "comfortable" | "compact";
  /** Toolbar content left of the density / column controls (search, filters). */
  toolbar?: React.ReactNode;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  empty?: { title: string; description?: string; action?: React.ReactNode };
  /** Phone layout: rows become stacked cards rendered by this function. */
  renderCard?: (row: T) => React.ReactNode;
  className?: string;
};

type Sort = { id: string; direction: "asc" | "desc" } | null;

/**
 * Admin data table: real <table> semantics, sortable headers with aria-sort, row selection with a
 * sticky bulk action bar, column visibility, density, pagination, loading / empty / error states and
 * a card layout on phones.
 */
export function DataTable<T>({
  caption,
  columns,
  rows,
  getRowId,
  selectable = false,
  bulkActions,
  rowHref,
  onRowClick,
  activeRowId,
  defaultSort,
  pageSize = 10,
  density: densityProp = "comfortable",
  toolbar,
  loading = false,
  error,
  onRetry,
  empty,
  renderCard,
  className,
}: DataTableProps<T>) {
  const id = useId();
  const [sort, setSort] = useState<Sort>(defaultSort ?? null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [density, setDensity] = useState(densityProp);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(columns.filter((c) => c.defaultHidden).map((c) => c.id)));

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.id === sort.id);
    if (!col?.sortValue) return rows;
    const dir = sort.direction === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      return (typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "en-IN", { numeric: true })) * dir;
    });
  }, [rows, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount);
  const pageRows = sorted.slice((current - 1) * pageSize, current * pageSize);
  const visible = columns.filter((c) => !hidden.has(c.id));
  const pageIds = pageRows.map(getRowId);
  const allOnPage = pageIds.length > 0 && pageIds.every((r) => selected.has(r));
  const someOnPage = pageIds.some((r) => selected.has(r)) && !allOnPage;
  const selectedRows = rows.filter((r) => selected.has(getRowId(r)));
  const clear = () => setSelected(new Set());
  const cellY = density === "compact" ? "h-row-sm" : "h-row-xl";

  const toggleSort = (colId: string) =>
    setSort((s) => (s?.id !== colId ? { id: colId, direction: "asc" } : s.direction === "asc" ? { id: colId, direction: "desc" } : null));

  const hideClass = (c: DataColumn<T>) => (c.hideBelow === "md" ? "max-md:hidden" : c.hideBelow === "lg" ? "max-lg:hidden" : c.hideBelow === "xl" ? "max-xl:hidden" : "");

  const status = error ? (
    <EmptyState
      compact
      icon={<RefreshCw aria-hidden />}
      title="Couldn’t load this list"
      description={error}
      action={onRetry && <Button variant="secondary" size="sm" onClick={onRetry} leadingIcon={<RefreshCw aria-hidden />}>Try again</Button>}
    />
  ) : !loading && rows.length === 0 ? (
    <EmptyState compact icon={<SearchX aria-hidden />} title={empty?.title ?? "Nothing here yet"} description={empty?.description} action={empty?.action} />
  ) : null;

  return (
    <Card variant="outline" padding="none" className={cn("min-w-0 overflow-clip", className)} data-slot="data-table">
      <div className="flex flex-wrap items-center gap-2 border-b border-border-subtle p-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{toolbar}</div>
        <SegmentedControl
          aria-label="Row density"
          size="sm"
          value={density}
          onValueChange={(v) => setDensity(v as "comfortable" | "compact")}
          className="max-md:hidden"
          options={[
            { value: "comfortable", label: "Comfortable" },
            { value: "compact", label: "Compact" },
          ]}
        />
        {columns.some((c) => c.hideable) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton label="Choose columns" variant="secondary" size="sm" className="max-md:hidden">
                <Columns3 aria-hidden />
              </IconButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              {columns
                .filter((c) => c.hideable)
                .map((c) => (
                  <DropdownMenuCheckboxItem
                    key={c.id}
                    checked={!hidden.has(c.id)}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(on) =>
                      setHidden((h) => {
                        const next = new Set(h);
                        if (on) next.delete(c.id);
                        else next.add(c.id);
                        return next;
                      })
                    }
                  >
                    {c.header}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {status ?? (
        <>
          {/* Phone card layout */}
          {renderCard && (
            <ul className="divide-y divide-border-subtle md:hidden" aria-label={caption}>
              {(loading ? [] : pageRows).map((row) => (
                <li key={getRowId(row)} className="relative flex items-start gap-3 p-4">
                  {selectable && (
                    <Checkbox
                      aria-label={`Select ${getRowId(row)}`}
                      checked={selected.has(getRowId(row))}
                      onCheckedChange={(on) => setSelected((s) => { const n = new Set(s); if (on) n.add(getRowId(row)); else n.delete(getRowId(row)); return n; })}
                      className="relative z-10 mt-0.5"
                    />
                  )}
                  <div className="min-w-0 flex-1">{renderCard(row)}</div>
                </li>
              ))}
              {loading && Array.from({ length: 4 }, (_, i) => <li key={i} className="p-4"><Skeleton className="h-12 w-full rounded-lg" /></li>)}
            </ul>
          )}

          <div className={cn("overflow-x-auto", renderCard && "max-md:hidden")}>
            <table className="w-full caption-bottom text-left text-body" aria-busy={loading || undefined}>
              <caption className="sr-only">{caption}</caption>
              <thead className="bg-surface-sunken">
                <tr className="border-b border-border-subtle">
                  {selectable && (
                    <th scope="col" className="w-12 px-4">
                      <Checkbox
                        aria-label={allOnPage ? "Deselect all rows on this page" : "Select all rows on this page"}
                        checked={allOnPage ? true : someOnPage ? "indeterminate" : false}
                        onCheckedChange={() =>
                          setSelected((s) => {
                            const n = new Set(s);
                            pageIds.forEach((r) => (allOnPage ? n.delete(r) : n.add(r)));
                            return n;
                          })
                        }
                      />
                    </th>
                  )}
                  {visible.map((c) => {
                    const dir = sort?.id === c.id ? sort.direction : null;
                    return (
                      <th
                        key={c.id}
                        scope="col"
                        aria-sort={c.sortValue ? (dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none") : undefined}
                        className={cn("h-row-md px-4 text-overline whitespace-nowrap text-fg-muted", c.align === "end" && "text-right", hideClass(c))}
                      >
                        {c.sortValue ? (
                          <button
                            type="button"
                            onClick={() => toggleSort(c.id)}
                            className={cn("state-layer relative -mx-2 inline-flex h-control-xs items-center gap-1 rounded-pill px-2 hover:text-fg", dir && "text-fg", c.align === "end" && "flex-row-reverse")}
                          >
                            {c.header}
                            {dir === "asc" ? <ArrowUp aria-hidden className="size-icon-sm" /> : dir === "desc" ? <ArrowDown aria-hidden className="size-icon-sm" /> : <ArrowUpDown aria-hidden className="size-icon-sm opacity-60" />}
                          </button>
                        ) : (
                          c.header
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: Math.min(pageSize, 6) }, (_, i) => (
                      <tr key={i} className="border-b border-border-subtle last:border-0">
                        {selectable && <td className="px-4"><Skeleton className="size-4 rounded-xs" /></td>}
                        {visible.map((c) => (
                          <td key={c.id} className={cn(cellY, "px-4", hideClass(c))}>
                            <Skeleton className={cn("h-3.5 rounded-pill", c.align === "end" ? "ml-auto w-16" : "w-3/4")} />
                          </td>
                        ))}
                      </tr>
                    ))
                  : pageRows.map((row) => {
                      const rid = getRowId(row);
                      const isSel = selected.has(rid);
                      const href = rowHref?.(row);
                      const clickable = !href && !!onRowClick;
                      const isActive = activeRowId === rid;
                      return (
                        <tr
                          key={rid}
                          data-state={isSel || isActive ? "selected" : undefined}
                          aria-current={isActive || undefined}
                          className={cn("group border-b border-border-subtle transition-colors duration-(--dur-instant) last:border-0 hover:bg-highlight data-[state=selected]:bg-selected", (href || clickable) && "relative")}
                        >
                          {selectable && (
                            <td className="relative z-10 w-12 px-4">
                              <Checkbox
                                aria-label={`Select ${rid}`}
                                checked={isSel}
                                onCheckedChange={(on) => setSelected((s) => { const n = new Set(s); if (on) n.add(rid); else n.delete(rid); return n; })}
                              />
                            </td>
                          )}
                          {visible.map((c, ci) => (
                            <td key={c.id} className={cn(cellY, "px-4 whitespace-nowrap", c.align === "end" && "text-right figures", hideClass(c), c.className)}>
                              {href && ci === 0 ? (
                                <Link href={href} className="focus-ring-card [--focus-card-radius:var(--radius-xs)] after:absolute after:inset-0">
                                  {c.cell(row)}
                                </Link>
                              ) : clickable && ci === 0 ? (
                                <button type="button" onClick={() => onRowClick!(row)} className="focus-ring-card text-left [--focus-card-radius:var(--radius-xs)] after:absolute after:inset-0">
                                  {c.cell(row)}
                                </button>
                              ) : (
                                <span className={cn((href || clickable) && "relative z-10")}>{c.cell(row)}</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-border-subtle p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-label text-fg-muted" aria-live="polite">
              {rows.length === 0 ? "" : `Showing ${formatNumber((current - 1) * pageSize + 1)}–${formatNumber(Math.min(current * pageSize, sorted.length))} of ${formatNumber(sorted.length)}`}
            </p>
            <Pagination page={current} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </>
      )}

      {selectable && selectedRows.length > 0 && (
        <div
          role="region"
          aria-label="Bulk actions"
          id={`${id}-bulk`}
          className="sticky bottom-4 z-(--z-sticky) mx-3 mb-3 flex flex-wrap items-center gap-2 rounded-pill bg-surface-inverse py-1.5 pr-1.5 pl-4 text-fg-inverse shadow-popover motion-safe:animate-slide-up"
        >
          <p className="text-label" aria-live="polite">
            {selectedRows.length} selected
          </p>
          <div className="ml-auto flex flex-wrap items-center gap-1.5 [&_[data-slot=button]]:h-control-sm">{bulkActions?.(selectedRows, clear)}</div>
          <IconButton label="Clear selection" variant="ghost" size="sm" onClick={clear} className="text-fg-inverse hover:text-fg-inverse">
            <X aria-hidden />
          </IconButton>
        </div>
      )}
    </Card>
  );
}
