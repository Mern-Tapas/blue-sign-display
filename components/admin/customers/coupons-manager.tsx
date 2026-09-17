"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, MoreHorizontal, Pause, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADMIN_DEMO_NOTE, adminCoupons } from "@/lib/data/admin";
import { formatNumber, formatPrice } from "@/lib/format";
import { StatusPill } from "../admin-display";
import { FilterBar } from "../admin-parts";
import { DataTable, type DataColumn } from "../data-table";
import { PageHeader } from "../page-header";
import { CouponBuilder } from "./coupon-builder";
import {
  couponStatusMeta,
  couponStatusOrder,
  describeDiscount,
  statusFromDates,
  toCouponRecord,
  usageLabel,
  validityRange,
  type CouponRecord,
  type CouponStatus,
} from "./coupon-rules";

type BuilderState = { mode: "create" | "edit"; initial?: CouponRecord; key: number };

const emptyCopy: Record<CouponStatus, { title: string; description: string }> = {
  active: { title: "No active coupons", description: "Shoppers can’t redeem anything right now. Create a coupon, or resume a paused one." },
  scheduled: { title: "No scheduled coupons", description: "Set a future start date when you create a coupon to line it up ahead of a sale, like Diwali or Republic Day." },
  expired: { title: "No expired coupons", description: "Coupons move here after their end date, with their redemptions kept for reporting." },
  paused: { title: "No paused coupons", description: "Pause a coupon from its menu to stop redemptions without losing its rules." },
};

function nextCopyCode(code: string, taken: string[]) {
  const base = code.replace(/-\d+$/, "").slice(0, 12);
  let n = 2;
  while (taken.includes(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

/** /admin/coupons: coupons by status with row actions, and the coupon builder in a side sheet. */
export function CouponsManager({ initialOpen = false }: { initialOpen?: boolean }) {
  const router = useRouter();
  const [coupons, setCoupons] = useState<CouponRecord[]>(() => adminCoupons.map(toCouponRecord));
  const [tab, setTab] = useState<CouponStatus>("active");
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(initialOpen);
  const [builder, setBuilder] = useState<BuilderState>({ mode: "create", key: 0 });
  const [deleting, setDeleting] = useState<CouponRecord | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const codes = coupons.map((c) => c.code);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? coupons.filter((c) => c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) : coupons;
  }, [coupons, search]);

  const openBuilder = (mode: BuilderState["mode"], initial?: CouponRecord) => {
    setBuilder((b) => ({ mode, initial, key: b.key + 1 }));
    setSheetOpen(true);
  };

  const closeSheet = (open: boolean) => {
    setSheetOpen(open);
    if (!open && initialOpen) router.replace("/admin/coupons", { scroll: false });
  };

  function save(c: CouponRecord) {
    const editing = builder.mode === "edit";
    setCoupons((list) => (editing ? list.map((x) => (x.code === c.code ? c : x)) : [c, ...list]));
    setTab(c.status);
    closeSheet(false);
    toast({
      title: editing ? `${c.code} updated` : `${c.code} created`,
      description: `${couponStatusMeta[c.status].label} · ${validityRange(c)}`,
      tone: "success",
    });
  }

  function togglePause(c: CouponRecord) {
    const before = coupons;
    const next: CouponStatus = c.status === "paused" ? statusFromDates(c.startsAt, c.endsAt) : "paused";
    setCoupons((list) => list.map((x) => (x.code === c.code ? { ...x, status: next } : x)));
    toast({
      title: next === "paused" ? `${c.code} paused` : `${c.code} resumed`,
      description: next === "paused" ? "Shoppers who enter it see “This code isn’t active right now”." : `Now ${couponStatusMeta[next].label.toLowerCase()}.`,
      tone: next === "paused" ? "neutral" : "success",
      action: { label: "Undo", onClick: () => setCoupons(before) },
    });
  }

  function duplicate(c: CouponRecord) {
    openBuilder("create", { ...c, code: nextCopyCode(c.code, codes), used: 0, description: "" });
  }

  function remove() {
    if (!deleting) return;
    const before = coupons;
    const code = deleting.code;
    setCoupons((list) => list.filter((x) => x.code !== code));
    toast({ title: `${code} deleted`, tone: "neutral", action: { label: "Undo", onClick: () => setCoupons(before) } });
  }

  const usageCell = (c: CouponRecord) => {
    if (!c.usageLimit) return <span className="text-caption text-fg-muted figures">{usageLabel(c)}</span>;
    const ratio = c.used / c.usageLimit;
    return (
      <span className="flex w-36 flex-col gap-1.5">
        <span className="flex items-baseline justify-between gap-2 text-caption figures">
          <span className="text-fg">{usageLabel(c)}</span>
          <span className="text-fg-muted">{ratio >= 1 ? "Used up" : `${Math.round(ratio * 100)}%`}</span>
        </span>
        <Progress size="sm" value={c.used} max={c.usageLimit} tone={ratio >= 1 ? "neutral" : ratio >= 0.9 ? "warning" : "accent"} aria-label={`${c.code} usage: ${usageLabel(c)}`} />
      </span>
    );
  };

  const rowActions = (c: CouponRecord) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton label={`Actions for ${c.code}`} variant="ghost" size="sm">
          <MoreHorizontal aria-hidden />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => openBuilder("edit", c)}>
          <Pencil aria-hidden />
          Edit
        </DropdownMenuItem>
        {c.status !== "expired" && (
          <DropdownMenuItem onSelect={() => togglePause(c)}>
            {c.status === "paused" ? <Play aria-hidden /> : <Pause aria-hidden />}
            {c.status === "paused" ? "Resume" : "Pause"}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => duplicate(c)}>
          <Copy aria-hidden />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          destructive
          onSelect={() => {
            setDeleting(c);
            setDeleteOpen(true);
          }}
        >
          <Trash2 aria-hidden />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const columns: DataColumn<CouponRecord>[] = [
    {
      id: "code",
      header: "Code",
      sortValue: (c) => c.code,
      cell: (c) => (
        <span className="-my-1 flex items-center gap-1">
          <span className="text-code">{c.code}</span>
          <CopyButton value={c.code} label="Copy code" size="xs" />
        </span>
      ),
    },
    { id: "description", header: "Description", hideBelow: "xl", hideable: true, cell: (c) => <span className="block max-w-64 truncate text-fg-muted">{c.description}</span> },
    { id: "discount", header: "Discount", sortValue: (c) => describeDiscount(c), cell: (c) => describeDiscount(c) },
    { id: "min", header: "Min order", align: "end", hideBelow: "lg", sortValue: (c) => c.minOrder, cell: (c) => (c.minOrder > 0 ? formatPrice(c.minOrder) : <span className="text-fg-muted">None</span>) },
    { id: "usage", header: "Usage", hideBelow: "md", sortValue: (c) => c.used, cell: usageCell },
    { id: "validity", header: "Validity", hideBelow: "lg", sortValue: (c) => c.startsAt, cell: (c) => <span className="figures">{validityRange(c)}</span> },
    { id: "status", header: "Status", sortValue: (c) => couponStatusOrder.indexOf(c.status), cell: (c) => <StatusPill tone={couponStatusMeta[c.status].tone} label={couponStatusMeta[c.status].label} /> },
    { id: "actions", header: "Actions", align: "end", className: "w-14", cell: rowActions },
  ];

  const renderCard = (c: CouponRecord) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-code">{c.code}</span>
        <CopyButton value={c.code} label="Copy code" size="xs" />
        <StatusPill className="ml-auto" tone={couponStatusMeta[c.status].tone} label={couponStatusMeta[c.status].label} />
        {rowActions(c)}
      </div>
      <p className="text-body">
        {describeDiscount(c)}
        {c.minOrder > 0 && <span className="text-fg-muted"> · min {formatPrice(c.minOrder)}</span>}
      </p>
      <p className="text-caption text-fg-muted figures">
        {validityRange(c)} · {usageLabel(c)}
      </p>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Coupons"
        meta={
          <>
            <span>{formatNumber(coupons.filter((c) => c.status === "active").length)} active</span>
            <span aria-hidden>·</span>
            <span>{ADMIN_DEMO_NOTE}</span>
          </>
        }
        actions={
          <Button leadingIcon={<Plus aria-hidden />} onClick={() => openBuilder("create")}>
            Create coupon
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as CouponStatus)} className="gap-4">
        <TabsList variant="underline" aria-label="Coupon status" className="w-full">
          {couponStatusOrder.map((s) => (
            <TabsTrigger key={s} value={s} count={visible.filter((c) => c.status === s).length}>
              {couponStatusMeta[s].label}
            </TabsTrigger>
          ))}
        </TabsList>
        {couponStatusOrder.map((s) => (
          <TabsContent key={s} value={s}>
            <DataTable
              caption={`${couponStatusMeta[s].label} coupons`}
              columns={columns}
              rows={visible.filter((c) => c.status === s)}
              getRowId={(c) => c.code}
              defaultSort={{ id: "validity", direction: "desc" }}
              toolbar={<FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search code or description" />}
              empty={{
                ...(search ? { title: "No coupons match", description: `Nothing in ${couponStatusMeta[s].label.toLowerCase()} matches “${search}”. Codes are matched from any part, e.g. “FEST”.` } : emptyCopy[s]),
                action: search ? (
                  <Button variant="secondary" size="sm" onClick={() => setSearch("")}>
                    Clear search
                  </Button>
                ) : s === "expired" ? undefined : (
                  <Button variant="secondary" size="sm" leadingIcon={<Plus aria-hidden />} onClick={() => openBuilder("create")}>
                    Create coupon
                  </Button>
                ),
              }}
              renderCard={renderCard}
            />
          </TabsContent>
        ))}
      </Tabs>

      <Sheet open={sheetOpen} onOpenChange={closeSheet}>
        <SheetContent side="right" className="max-w-xl">
          <CouponBuilder key={builder.key} mode={builder.mode} initial={builder.initial} existingCodes={codes} onSave={save} onCancel={() => closeSheet(false)} />
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        tone="danger"
        icon={<Trash2 />}
        title={`Delete ${deleting?.code ?? "coupon"}?`}
        description={
          deleting
            ? `Shoppers who enter ${deleting.code} at checkout will be told the code isn’t valid.${deleting.used > 0 ? ` Its ${formatNumber(deleting.used)} past redemptions stay on their orders.` : ""} To stop it temporarily, pause it instead.`
            : undefined
        }
        confirmLabel="Delete coupon"
        onConfirm={remove}
      />
    </>
  );
}
