import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, formatPrice, sampleData } from "@bluesigns/ui";

const { adminProducts } = sampleData;
const items = adminProducts.slice(0, 5);

export const SelectedRows = () => (
  <div style={{ width: 640 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox aria-label="Select all" checked="indeterminate" />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((p, i) => {
            const selected = i === 1 || i === 2;
            return (
              <TableRow key={p.id} data-state={selected ? "selected" : undefined}>
                <TableCell>
                  <Checkbox aria-label={`Select ${p.name}`} defaultChecked={selected} />
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-fg-muted figures">{p.sku}</TableCell>
                <TableCell className="text-right figures">{formatPrice(p.price)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export const PlainRows = () => (
  <div style={{ width: 520 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead className="text-right">Sold (30d)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.slice(0, 4).map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell className="text-right figures">{p.stock}</TableCell>
              <TableCell className="text-right figures">{p.sold30d}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);
