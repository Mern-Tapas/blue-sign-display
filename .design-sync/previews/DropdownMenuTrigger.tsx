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
  IconButton,
  icons,
} from "@bluesigns/ui";

const {
  ArrowUpDown,
  Copy,
  Heart,
  HelpCircle,
  LogOut,
  MoreHorizontal,
  Package,
  Pencil,
  Settings,
  Share2,
  User,
} = icons;

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

export const ButtonTrigger = () => (
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

export const IconButtonTrigger = () => <RowActionsMenu />;

export const LabelledTrigger = () => <SortByMenu />;
