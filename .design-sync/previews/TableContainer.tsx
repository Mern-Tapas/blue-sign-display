import { Card, CardHeader, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, TextButton, formatPrice, sampleData } from "@bluesigns/ui";

const { adminOrders } = sampleData;

export const Default = () => (
  <div style={{ width: 560 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminOrders.slice(0, 4).map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium figures">{o.id}</TableCell>
              <TableCell>{o.customerName}</TableCell>
              <TableCell className="text-right figures">{formatPrice(o.total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export const HorizontalScroll = () => (
  <div style={{ width: 420 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Courier</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminOrders.slice(0, 4).map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium figures">{o.id}</TableCell>
              <TableCell>{o.customerName}</TableCell>
              <TableCell className="text-fg-muted">{o.city}</TableCell>
              <TableCell>{o.payment}</TableCell>
              <TableCell className="text-fg-muted">{o.courier ?? "Not assigned"}</TableCell>
              <TableCell className="text-right figures">{formatPrice(o.total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export const InsideCard = () => (
  <div style={{ width: 600 }}>
    <Card>
      <CardHeader title="Recent orders" description="Last 24 hours" action={<TextButton size="sm">View all</TextButton>} />
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Order</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminOrders.slice(0, 3).map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium figures">{o.id}</TableCell>
                <TableCell className="text-fg-muted">{o.city}</TableCell>
                <TableCell className="text-right figures">{formatPrice(o.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  </div>
);
