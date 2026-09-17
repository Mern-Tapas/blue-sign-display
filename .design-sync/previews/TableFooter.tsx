import { Badge, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableHeader, TableRow, formatDate, formatNumber, formatPrice, sampleData } from "@bluesigns/ui";

const { settlements, products } = sampleData;
const recent = settlements.slice(0, 4);
const statusTone = { paid: "success", processing: "info", "on-hold": "warning" } as const;

export const SettlementTotals = () => (
  <div style={{ width: 720 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Settlement</TableHead>
            <TableHead>Period</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead className="text-right">Net payout</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recent.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium figures">{s.id}</TableCell>
              <TableCell className="text-fg-muted">
                {formatDate(s.periodFrom, { day: "numeric", month: "short" })} – {formatDate(s.periodTo, { day: "numeric", month: "short" })}
              </TableCell>
              <TableCell className="text-right figures">{s.orders}</TableCell>
              <TableCell className="text-right figures">{formatPrice(s.net)}</TableCell>
              <TableCell>
                <Badge tone={statusTone[s.status]} size="sm">
                  {s.status === "on-hold" ? "On hold" : s.status === "paid" ? "Paid" : "Processing"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={2}>Total (4 weeks)</TableCell>
            <TableCell className="text-right figures">{formatNumber(recent.reduce((n, s) => n + s.orders, 0))}</TableCell>
            <TableCell className="text-right figures">{formatPrice(recent.reduce((n, s) => n + s.net, 0))}</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  </div>
);

const lines = [
  { p: products[0]!, qty: 1 },
  { p: products[2]!, qty: 1 },
  { p: products[1]!, qty: 2 },
];
const subtotal = lines.reduce((n, l) => n + l.p.price * l.qty, 0);

export const InvoiceSummary = () => (
  <div style={{ width: 560 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.map(({ p, qty }) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell className="text-right figures">{qty}</TableCell>
              <TableCell className="text-right figures">{formatPrice(p.price * qty)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={2}>Subtotal (incl. GST)</TableCell>
            <TableCell className="text-right figures">{formatPrice(subtotal)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  </div>
);
