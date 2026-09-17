"use client";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextButton } from "@/components/ui/text-button";
import { emiAmount as defaultEmiAmount } from "@/lib/data/india";
import { formatPrice } from "@/lib/format";
import type { EmiBank } from "@/lib/emi";

export type { EmiBank };

export type EmiOptionsDialogProps = {
  price: number;
  banks: EmiBank[];
  /** Instalment formula (reducing balance by default). */
  emiAmount?: (amount: number, months: number, annualRate: number) => number;
  trigger?: React.ReactElement;
  demo?: boolean;
};

/**
 * EMI plans by bank: tenure, monthly amount, interest and total, with no-cost plans marked and
 * explained (interest is given back as an upfront discount, so the total equals the price).
 */
export function EmiOptionsDialog({ price, banks, emiAmount = defaultEmiAmount, trigger, demo = false }: EmiOptionsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <TextButton>View plans</TextButton>
        )}
      </DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader title="EMI options" description={`For ${formatPrice(price)} · credit card EMI`} />
        <DialogBody className="flex flex-col gap-4">
          <Tabs defaultValue={banks[0]?.id}>
            <TabsList>
              {banks.map((b) => (
                <TabsTrigger key={b.id} value={b.id}>
                  {b.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {banks.map((b) => (
              <TabsContent key={b.id} value={b.id}>
                <TableContainer>
                  <Table className="min-w-[28rem]">
                    <caption className="sr-only">{b.name} EMI plans</caption>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead scope="col">Tenure</TableHead>
                        <TableHead scope="col">Monthly EMI</TableHead>
                        <TableHead scope="col">Interest</TableHead>
                        <TableHead scope="col">Total cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {b.plans.map((p) => {
                        const monthly = emiAmount(price, p.months, p.interestRate);
                        const total = p.noCost ? price : monthly * p.months;
                        return (
                          <TableRow key={p.months}>
                            <th scope="row" className="h-row-lg px-4 text-left align-middle font-medium figures">
                              <span className="flex flex-wrap items-center gap-2">
                                {p.months} months
                                {p.noCost && (
                                  <Badge tone="success" size="sm">
                                    No cost
                                  </Badge>
                                )}
                              </span>
                            </th>
                            <TableCell className="h-row-lg text-fg figures">{formatPrice(monthly)}</TableCell>
                            <TableCell className="h-row-lg text-fg-muted figures">{p.noCost ? "₹0" : `${p.interestRate}% p.a.`}</TableCell>
                            <TableCell className="h-row-lg text-fg-muted figures">{formatPrice(total)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabsContent>
            ))}
          </Tabs>
          <ul className="flex list-disc flex-col gap-1 pl-4 text-caption text-fg-muted">
            <li>No-cost EMI: the bank’s interest is given to you as an upfront discount, so you pay the product price in total.</li>
            <li>Banks may charge a processing fee and GST on interest. Choose EMI at payment.</li>
            {demo && <li>Plans shown are demo data.</li>}
          </ul>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
