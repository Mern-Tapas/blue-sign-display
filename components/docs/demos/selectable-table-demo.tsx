"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { IconButton } from "@/components/ui/icon-button";
import { StatusDot, type StatusTone } from "@/components/ui/status-dot";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, formatPrice } from "@/lib/format";

const rows: { id: string; activity: string; price: number; status: [StatusTone, string]; date: string }[] = [
  { id: "INV_000076", activity: "Aura Wireless Headphones", price: 249, status: ["success", "Completed"], date: "2026-04-17T15:45:00Z" },
  { id: "INV_000075", activity: "Field Jacket", price: 210, status: ["danger", "Pending"], date: "2026-04-15T11:30:00Z" },
  { id: "INV_000074", activity: "Velocity Runner", price: 139, status: ["success", "Completed"], date: "2026-04-15T12:00:00Z" },
  { id: "INV_000073", activity: "Heavyweight Tee ×2", price: 76, status: ["warning", "In progress"], date: "2026-04-14T21:15:00Z" },
  { id: "INV_000072", activity: "Orbit Table Lamp", price: 145, status: ["success", "Completed"], date: "2026-04-12T06:00:00Z" },
];

export function SelectableTableDemo() {
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
              <TableHead>Order ID</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Price</TableHead>
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
                <TableCell className="font-medium">{r.activity}</TableCell>
                <TableCell className="text-right figures">{formatPrice(r.price)}</TableCell>
                <TableCell>
                  <StatusDot tone={r.status[0]}>{r.status[1]}</StatusDot>
                </TableCell>
                <TableCell className="text-fg-muted">
                  {formatDate(r.date, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </TableCell>
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
  );
}
