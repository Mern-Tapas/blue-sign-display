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
  IconButton,
  icons,
} from "@bluesigns/ui";

const {
  Bell,
  ChevronDown,
  FileDown,
  Heart,
  HelpCircle,
  Link2,
  LogOut,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Package,
  PackageX,
  RotateCcw,
  Settings,
  Share2,
  Truck,
  User,
} = icons;

export const IconsShortcutsDisabled = () => (
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

export const DestructiveItem = () => (
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

export const PlainItems = () => (
  <DropdownMenu defaultOpen>
    <DropdownMenuTrigger asChild>
      <IconButton label="Product actions">
        <MoreHorizontal aria-hidden />
      </IconButton>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-52">
      <DropdownMenuItem>
        <Heart aria-hidden /> Save to wishlist
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Bell aria-hidden /> Notify on price drop
      </DropdownMenuItem>
      <DropdownMenuSub open>
        <DropdownMenuSubTrigger>
          <Share2 aria-hidden /> Share
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="w-48">
          <DropdownMenuItem>
            <MessageCircle aria-hidden /> WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail aria-hidden /> Email
          </DropdownMenuItem>
          <DropdownMenuItem shortcut="⌘C">
            <Link2 aria-hidden /> Copy link
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuContent>
  </DropdownMenu>
);
