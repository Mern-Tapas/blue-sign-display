import { Button, EmptyState, StatusDot, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, formatPrice, icons, sampleData } from "@bluesigns/ui";

const { PackageSearch } = icons;
const { adminReturns } = sampleData;

export const ReturnsQueue = () => (
  <div style={{ width: 640 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Return</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead className="text-right">Refund</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["RT-4102", "Aura Wireless Headphones", "warning", "Pickup scheduled", 12999],
            ["RT-4101", "Velocity Runner · UK 8", "info", "Quality check", 5499],
            ["RT-4099", "Heavyweight Tee · M", "success", "Refunded", 1299],
          ].map(([id, item, tone, stage, amt]) => (
            <TableRow key={id as string}>
              <TableCell className="font-medium figures">{id}</TableCell>
              <TableCell>{item}</TableCell>
              <TableCell>
                <StatusDot tone={tone as "warning" | "info" | "success"}>{stage}</StatusDot>
              </TableCell>
              <TableCell className="text-right figures">{formatPrice(amt as number)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export const EmptyBody = () => (
  <div style={{ width: 640 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Return</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead className="text-right">Refund</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={4} className="h-auto whitespace-normal">
              <EmptyState compact
                icon={<PackageSearch aria-hidden />}
                title="No returns to review"
                description={`${adminReturns.length} returns handled this month. New requests appear here.`}
                action={
                  <Button size="sm" variant="secondary">
                    View all returns
                  </Button>
                }
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);
