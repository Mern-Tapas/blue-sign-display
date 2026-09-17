import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, formatDate, formatPrice, sampleData } from "@bluesigns/ui";

const { adminOrders } = sampleData;

export const SunkenHeaderBand = () => (
  <div style={{ width: 640 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Order</TableHead>
            <TableHead>Placed</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminOrders.slice(0, 4).map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium figures">{o.id}</TableCell>
              <TableCell className="text-fg-muted">{formatDate(o.placedAt, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</TableCell>
              <TableCell>{o.payment}</TableCell>
              <TableCell className="text-right figures">{formatPrice(o.total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export const StickyInScrollArea = () => (
  <div style={{ width: 520 }}>
    <TableContainer className="overflow-y-auto" style={{ maxHeight: 256 }}>
      <Table>
        <TableHeader className="sticky top-0">
          <TableRow className="hover:bg-transparent">
            <TableHead>Order</TableHead>
            <TableHead>City</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminOrders.slice(0, 8).map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium figures">{o.id}</TableCell>
              <TableCell className="text-fg-muted">{o.city}</TableCell>
              <TableCell className="text-right figures">{formatPrice(o.total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);
