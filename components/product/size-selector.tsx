"use client";

import { useId, useState } from "react";
import { RadioGroup } from "radix-ui";
import { Ruler } from "lucide-react";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextButton } from "@/components/ui/text-button";
import { cn } from "@/lib/cn";

export type SizeOption = { value: string; label?: string; /** Units left; 0 = out of stock. */ stock?: number };

export type SizeChart = {
  columns: readonly string[];
  rows: readonly (readonly (string | number)[])[];
  /** Columns (by index) holding inch measurements that the cm toggle converts. */
  measureColumns?: number[];
  baseUnit?: "in" | "cm";
};

/* ---------- Size chart ---------- */

export type SizeChartDialogProps = {
  chart: SizeChart;
  title?: string;
  /** Fit note, e.g. "Regular fit. Size up for a relaxed look." */
  fitNote?: string;
  howToMeasure?: { label: string; text: string }[];
  trigger?: React.ReactElement;
};

const defaultMeasure = [
  { label: "Chest", text: "Measure around the fullest part of your chest, keeping the tape level under your arms." },
  { label: "Length", text: "From the highest point of the shoulder down to the hem." },
  { label: "Shoulder", text: "From one shoulder seam straight across to the other." },
];

/** Size table with an inch / cm toggle and how-to-measure guidance. */
export function SizeChartDialog({ chart, title = "Size chart", fitNote, howToMeasure = defaultMeasure, trigger }: SizeChartDialogProps) {
  const [unit, setUnit] = useState<"in" | "cm">(chart.baseUnit ?? "in");
  const convert = (v: string | number, col: number) => {
    if (typeof v !== "number" || !chart.measureColumns?.includes(col) || unit === (chart.baseUnit ?? "in")) return v;
    return unit === "cm" ? Math.round(v * 2.54 * 10) / 10 : Math.round((v / 2.54) * 10) / 10;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <TextButton>
            <Ruler aria-hidden className="size-icon-sm" />
            Size chart
          </TextButton>
        )}
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader title={title} description={fitNote} />
        <DialogBody>
          <Tabs defaultValue="chart">
            <TabsList>
              <TabsTrigger value="chart">Size chart</TabsTrigger>
              <TabsTrigger value="measure">How to measure</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="flex flex-col gap-4">
              {chart.measureColumns?.length ? (
                <SegmentedControl
                  aria-label="Units"
                  size="sm"
                  value={unit}
                  onValueChange={(v) => setUnit(v as "in" | "cm")}
                  options={[
                    { value: "in", label: "Inches" },
                    { value: "cm", label: "Centimetres" },
                  ]}
                />
              ) : null}
              <TableContainer>
                <Table className="min-w-[24rem]">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      {chart.columns.map((c, i) => (
                        <TableHead key={c} scope="col">
                          {c}
                          {chart.measureColumns?.includes(i) && <span className="font-normal"> ({unit})</span>}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chart.rows.map((row) => (
                      <TableRow key={String(row[0])}>
                        {row.map((v, i) =>
                          i === 0 ? (
                            <th key={i} scope="row" className="h-row-md px-4 text-left align-middle font-medium text-fg figures">
                              {v}
                            </th>
                          ) : (
                            <TableCell key={i} className="h-row-md text-fg-muted figures">
                              {convert(v, i)}
                            </TableCell>
                          ),
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabsContent>
            <TabsContent value="measure">
              <dl className="flex flex-col gap-4">
                {howToMeasure.map((m) => (
                  <div key={m.label} className="flex flex-col gap-0.5">
                    <dt className="text-title">{m.label}</dt>
                    <dd className="text-body text-fg-muted">{m.text}</dd>
                  </div>
                ))}
              </dl>
            </TabsContent>
          </Tabs>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Size selector ---------- */

export type SizeSelectorProps = {
  sizes: SizeOption[];
  value?: string;
  onValueChange: (size: string) => void;
  label?: string;
  /** Shown when the shopper tries to add without a size. */
  error?: string;
  chart?: SizeChart;
  fitNote?: string;
  /** Warn when a size has this many or fewer units. */
  lowStockAt?: number;
  id?: string;
  className?: string;
};

/**
 * Size radios with per-size stock hints ("2 left"), struck-through sold-out sizes, the size
 * chart link and an error line wired to the group when a size is required.
 */
export function SizeSelector({ sizes, value, onValueChange, label = "Select size", error, chart, fitNote, lowStockAt = 3, id, className }: SizeSelectorProps) {
  const uid = useId();
  const groupId = id ?? `size-${uid}`;
  const errorId = `${groupId}-error`;
  const selected = sizes.find((s) => s.value === value);

  return (
    <div data-slot="size-selector" className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <p id={`${groupId}-label`} className="text-label">
          {label}
          {selected && <span className="ml-1.5 font-normal text-fg-muted">{selected.label ?? selected.value}</span>}
        </p>
        {chart && <SizeChartDialog chart={chart} fitNote={fitNote} />}
      </div>
      <RadioGroup.Root
        id={groupId}
        aria-labelledby={`${groupId}-label`}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? true : undefined}
        aria-required
        value={value ?? ""}
        onValueChange={onValueChange}
        orientation="horizontal"
        className="flex flex-wrap gap-x-2 gap-y-5"
      >
        {sizes.map((s) => {
          const out = s.stock === 0;
          const low = !out && s.stock !== undefined && s.stock <= lowStockAt;
          return (
            <span key={s.value} className="relative flex flex-col items-center">
              <RadioGroup.Item
                value={s.value}
                disabled={out}
                aria-label={`${s.label ?? s.value}${out ? ", sold out" : low ? `, only ${s.stock} left` : ""}`}
                className={cn(
                  "press relative flex h-control-lg min-w-14 items-center justify-center overflow-hidden rounded-pill border border-border bg-surface px-4 text-label text-fg figures",
                  "transition-[color,background-color,border-color,transform] duration-(--dur-fast)",
                  "hover:border-border-strong data-[state=checked]:border-surface-inverse data-[state=checked]:bg-surface-inverse data-[state=checked]:text-fg-inverse",
                  "disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled disabled:text-disabled-fg disabled:line-through",
                )}
              >
                {s.label ?? s.value}
              </RadioGroup.Item>
              {low && (
                <span aria-hidden className="absolute -bottom-4.5 text-caption whitespace-nowrap text-warning-fg figures">
                  {s.stock} left
                </span>
              )}
            </span>
          );
        })}
      </RadioGroup.Root>
      {error && (
        <p id={errorId} role="alert" className="text-caption text-danger-fg">
          {error}
        </p>
      )}
    </div>
  );
}
