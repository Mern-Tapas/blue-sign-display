import { useState } from "react";
import {
  Card,
  Checkbox,
  IconButton,
  StatusDot,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  formatDate,
  formatPrice,
  icons,
  sampleData,
} from "@bluesigns/ui";

const { MoreHorizontal } = icons;
const { adminOrders, orderStatusMeta } = sampleData;

type Tone = "success" | "warning" | "danger";
const rows: { id: string; item: string; price: number; status: [Tone, string]; date: string }[] = [
  { id: "INV_000076", item: "Aura Wireless Headphones", price: 12999, status: ["success", "Completed"], date: "2026-09-12T15:45:00Z" },
  { id: "INV_000075", item: "Meridian Classic Watch", price: 9499, status: ["danger", "Pending"], date: "2026-09-11T11:30:00Z" },
  { id: "INV_000074", item: "Studio Over-Ear", price: 8999, status: ["success", "Completed"], date: "2026-09-10T12:00:00Z" },
  { id: "INV_000073", item: "Pulse Smart Watch ×2", price: 25998, status: ["warning", "In progress"], date: "2026-09-09T21:15:00Z" },
];

function SelectableTable() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["INV_000073"]));
  const all = selected.size === rows.length;
  const some = selected.size > 0 && !all;
  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return (
    <div style={{ width: 860 }}>
      <Card variant="outline" padding="sm">
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12">
                  <Checkbox
                    aria-label="Select all"
                    checked={all ? true : some ? "indeterminate" : false}
                    onCheckedChange={() => setSelected(all ? new Set() : new Set(rows.map((r) => r.id)))}
                  />
                </TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} data-state={selected.has(r.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox aria-label={`Select ${r.id}`} checked={selected.has(r.id)} onCheckedChange={() => toggle(r.id)} />
                  </TableCell>
                  <TableCell className="text-fg-muted figures">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.item}</TableCell>
                  <TableCell className="text-right figures">{formatPrice(r.price)}</TableCell>
                  <TableCell>
                    <StatusDot tone={r.status[0]}>{r.status[1]}</StatusDot>
                  </TableCell>
                  <TableCell className="text-fg-muted">{formatDate(r.date, { day: "numeric", month: "short", year: "numeric" })}</TableCell>
                  <TableCell>
                    <IconButton label={`Actions for ${r.id}`} variant="ghost" size="sm">
                      <MoreHorizontal aria-hidden />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
}

export const SelectableRows = () => <SelectableTable />;

export const RecentOrders = () => (
  <div style={{ width: 720 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminOrders.slice(0, 5).map((o) => {
            const meta = orderStatusMeta[o.status];
            return (
              <TableRow key={o.id}>
                <TableCell className="font-medium figures">{o.id}</TableCell>
                <TableCell>{o.customerName}</TableCell>
                <TableCell className="text-fg-muted">{o.city}</TableCell>
                <TableCell>
                  <StatusDot tone={meta.tone === "accent" || meta.tone === "info" ? "info" : meta.tone} pulse={meta.live}>
                    {meta.label}
                  </StatusDot>
                </TableCell>
                <TableCell className="text-right figures">{formatPrice(o.total)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export const Compact = () => (
  <div style={{ width: 420 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Chest (in)</TableHead>
            <TableHead className="text-right">Length (in)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["S", "38", "27"],
            ["M", "40", "28"],
            ["L", "42", "29"],
            ["XL", "44", "30"],
          ].map(([s, c, l]) => (
            <TableRow key={s}>
              <TableCell className="h-10 font-medium">{s}</TableCell>
              <TableCell className="h-10 text-right figures">{c}</TableCell>
              <TableCell className="h-10 text-right figures">{l}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);
