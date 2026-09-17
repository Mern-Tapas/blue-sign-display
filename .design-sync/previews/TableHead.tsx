import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, formatPrice, icons, sampleData } from "@bluesigns/ui";

const { ArrowDown, ChevronsUpDown } = icons;
const { adminCustomers } = sampleData;

export const SortableHeadings = () => (
  <div style={{ width: 640 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>
              <span className="inline-flex items-center gap-1">
                Customer
                <ChevronsUpDown aria-hidden className="size-3.5" />
              </span>
            </TableHead>
            <TableHead>City</TableHead>
            <TableHead className="text-right" aria-sort="descending">
              <span className="inline-flex items-center gap-1 text-fg">
                Lifetime spend
                <ArrowDown aria-hidden className="size-3.5" />
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...adminCustomers]
            .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
            .slice(0, 4)
            .map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-fg-muted">{c.city}</TableCell>
                <TableCell className="text-right figures">{formatPrice(c.lifetimeValue)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export const OverlineLabels = () => (
  <div style={{ width: 520 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Courier</TableHead>
            <TableHead className="text-right">Shipments</TableHead>
            <TableHead className="text-right">On-time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["Delhivery", "412", "96.2%"],
            ["Blue Dart", "268", "98.1%"],
            ["Ekart", "190", "93.4%"],
          ].map(([c, n, p]) => (
            <TableRow key={c}>
              <TableCell className="font-medium">{c}</TableCell>
              <TableCell className="text-right figures">{n}</TableCell>
              <TableCell className="text-right figures">{p}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);
