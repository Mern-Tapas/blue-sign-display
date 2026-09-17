import { useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  icons,
} from "@bluesigns/ui";

const { Columns3, Copy, MoreHorizontal, Pencil, Share2 } = icons;

function RowActionsMenu() {
  const [density, setDensity] = useState("comfortable");
  const [showSold, setShowSold] = useState(true);
  return (
    <div className="flex justify-end" style={{ width: 260 }}>
      <DropdownMenu defaultOpen>
        <DropdownMenuTrigger asChild>
          <IconButton label="More actions">
            <MoreHorizontal aria-hidden />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52">
          <DropdownMenuItem>
            <Pencil aria-hidden /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Copy aria-hidden /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share2 aria-hidden /> Share
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Density</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={density} onValueChange={setDensity}>
            <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={showSold} onCheckedChange={setShowSold}>
            Show sold out
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ColumnsMenuDemo() {
  const [cols, setCols] = useState({ sku: true, stock: true, price: true, sales: false });
  const toggle = (key: keyof typeof cols) => (checked: boolean) => setCols((c) => ({ ...c, [key]: checked }));
  return (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" leadingIcon={<Columns3 aria-hidden />}>
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Show columns</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked disabled>
          Product
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={cols.sku} onCheckedChange={toggle("sku")}>
          SKU
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={cols.stock} onCheckedChange={toggle("stock")}>
          Stock
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={cols.price} onCheckedChange={toggle("price")}>
          Price
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={cols.sales} onCheckedChange={toggle("sales")}>
          Sales (30 days)
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const ColumnsMenu = () => <ColumnsMenuDemo />;

export const RowActions = () => <RowActionsMenu />;
