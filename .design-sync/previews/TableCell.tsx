import { Badge, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow, formatPrice, icons, sampleData } from "@bluesigns/ui";

const { Pencil } = icons;
const { adminProducts } = sampleData;

const statusTone = { active: "success", draft: "neutral", archived: "warning" } as const;

export const RichCells = () => (
  <div style={{ width: 760 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">MRP</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminProducts.slice(0, 4).map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img src={p.image} alt="" className="size-10 rounded-md object-cover" />
                  <div className="flex flex-col">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-caption text-fg-muted">{p.brand}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge tone={statusTone[p.status]} size="sm">
                  {p.status[0]!.toUpperCase() + p.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-fg-muted figures">
                {p.mrp > p.price ? <span className="line-through">{formatPrice(p.mrp)}</span> : "—"}
              </TableCell>
              <TableCell className="text-right font-medium figures">{formatPrice(p.price)}</TableCell>
              <TableCell>
                <IconButton label={`Edit ${p.name}`} variant="ghost" size="sm">
                  <Pencil aria-hidden />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

export const NumericAlignment = () => (
  <div style={{ width: 480 }}>
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>HSN</TableHead>
            <TableHead className="text-right">GST</TableHead>
            <TableHead className="text-right">Taxable value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {adminProducts.slice(0, 4).map((p) => (
            <TableRow key={p.id}>
              <TableCell className="figures">{p.hsn}</TableCell>
              <TableCell className="text-right figures">{p.gstRate}%</TableCell>
              <TableCell className="text-right figures">{formatPrice(Math.round(p.price / (1 + p.gstRate / 100)))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);
