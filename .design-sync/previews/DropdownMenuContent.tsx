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
  ChevronDown,
  Copy,
  FileDown,
  Heart,
  HelpCircle,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Package,
  PackageX,
  Pencil,
  RotateCcw,
  Settings,
  Share2,
  Truck,
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

export const AlignStart = () => (
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

export const AlignEnd = () => <RowActionsMenu />;

export const WithGroups = () => (
  <DropdownMenu defaultOpen>
    <DropdownMenuTrigger asChild>
      <Button variant="secondary" trailingIcon={<ChevronDown aria-hidden />}>
        Order actions
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-60">
      <DropdownMenuLabel>Order LM-100251</DropdownMenuLabel>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <Truck aria-hidden /> Track shipment
        </DropdownMenuItem>
        <DropdownMenuItem shortcut="⌘D">
          <FileDown aria-hidden /> Download invoice
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <RotateCcw aria-hidden /> Exchange (not eligible)
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <MessageCircle aria-hidden /> Get help
        </DropdownMenuItem>
        <DropdownMenuItem destructive>
          <PackageX aria-hidden /> Cancel order
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);
