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

const { ArrowUpDown, Copy, MoreHorizontal, Pencil, Share2 } = icons;

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

export const SortMenu = () => <SortByMenu />;

export const RowActions = () => <RowActionsMenu />;
