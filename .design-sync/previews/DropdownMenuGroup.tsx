import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  icons,
} from "@bluesigns/ui";

const {
  ChevronDown,
  FileDown,
  Heart,
  HelpCircle,
  LogOut,
  MessageCircle,
  Package,
  PackageX,
  RotateCcw,
  Settings,
  Truck,
  User,
} = icons;

export const OrderActions = () => (
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
