import { useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  icons,
} from "@bluesigns/ui";

const { ArrowUpDown, Columns3, Heart, HelpCircle, LogOut, Package, Settings, User } = icons;

const sortOptions = [
  { value: "popular", label: "Popularity" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Customer rating" },
];

function SortByMenu() {
  const [sort, setSort] = useState("price-asc");
  const current = sortOptions.find((o) => o.value === sort)?.label;
  return (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" leadingIcon={<ArrowUpDown aria-hidden />}>
          Sort: {current}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          {sortOptions.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value}>
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
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

export const SortMenu = () => <SortByMenu />;

export const AccountMenu = () => (
  <DropdownMenu defaultOpen>
    <DropdownMenuTrigger asChild>
      <Button variant="secondary" leadingIcon={<User aria-hidden />}>
        Account
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-56">
      <DropdownMenuLabel>Sujon Ahmed</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <Package aria-hidden /> Orders
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Heart aria-hidden /> Wishlist
        </DropdownMenuItem>
        <DropdownMenuItem shortcut="⌘,">
          <Settings aria-hidden /> Settings
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <HelpCircle aria-hidden /> Help
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem>Shipping & delivery</DropdownMenuItem>
          <DropdownMenuItem>Returns & refunds</DropdownMenuItem>
          <DropdownMenuItem>Contact us</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem destructive>
        <LogOut aria-hidden /> Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export const ColumnsMenu = () => <ColumnsMenuDemo />;
