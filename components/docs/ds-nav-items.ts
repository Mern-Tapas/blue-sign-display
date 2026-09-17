import {
  Accessibility,
  AreaChart,
  Gauge,
  PanelLeft,
  Table2,
  MonitorCog,
  Bell,
  Blocks,
  CircleUserRound,
  Compass,
  CreditCard,
  Heart,
  KeyRound,
  Layers,
  LayoutGrid,
  LifeBuoy,
  ListChecks,
  MessageSquareText,
  MousePointerClick,
  Navigation,
  PackageOpen,
  Palette,
  Rows3,
  Ruler,
  Shapes,
  SquareStack,
  Store,
  TextCursorInput,
  Truck,
  Type,
  Wallet,
  Waypoints,
  BoxSelect,
  type LucideIcon,
} from "lucide-react";

export type DsNavItem = { href: string; label: string; description: string; icon: LucideIcon; count: number };
export type DsNavGroup = { label: string; items: DsNavItem[] };

export const dsNavGroups: DsNavGroup[] = [
  {
    label: "Foundations",
    items: [
      { href: "/design-system", label: "Overview", description: "Principles, conventions and inventory", icon: LayoutGrid, count: 0 },
      { href: "/design-system/color", label: "Color", description: "Surfaces, text, lines, accent, status, palette", icon: Palette, count: 0 },
      { href: "/design-system/typography", label: "Typography", description: "Type scale, hierarchy, figures and prices", icon: Type, count: 0 },
      { href: "/design-system/spacing", label: "Layout & spacing", description: "Containers, spacing, control and row heights, layering", icon: Ruler, count: 0 },
      { href: "/design-system/elevation", label: "Radius & elevation", description: "Radius scale, nesting, elevation tiers", icon: BoxSelect, count: 0 },
      { href: "/design-system/motion", label: "Motion", description: "Durations, easing, animations, reduced motion", icon: Waypoints, count: 0 },
      { href: "/design-system/accessibility", label: "Interaction & a11y", description: "Focus, state layer, disabled, selection, contrast", icon: Accessibility, count: 0 },
      { href: "/design-system/iconography", label: "Iconography", description: "Icon sizes, icon tiles, labelling", icon: Shapes, count: 0 },
    ],
  },
  {
    label: "Components",
    items: [
      { href: "/design-system/buttons", label: "Buttons", description: "Button, IconButton, TextButton, SegmentedControl, Copy, Share", icon: MousePointerClick, count: 6 },
      { href: "/design-system/forms", label: "Forms", description: "Field, inputs, number, money, tags, select, combobox, dates, upload", icon: TextCursorInput, count: 28 },
      { href: "/design-system/form-patterns", label: "Form patterns", description: "useForm, validation, slug, repeatable rows, media, option sets", icon: ListChecks, count: 10 },
      { href: "/design-system/data-display", label: "Data display", description: "Card, Inset, IconTile, Badge, Table, Steps, Carousel", icon: SquareStack, count: 20 },
      { href: "/design-system/feedback", label: "Feedback", description: "Alert, Toast, Progress, Skeleton, EmptyState", icon: Blocks, count: 6 },
      { href: "/design-system/overlays", label: "Overlays", description: "Dialog, AlertDialog, Sheet, Menu, HoverCard", icon: Layers, count: 8 },
      { href: "/design-system/navigation", label: "Navigation", description: "Navbar, Tabs, Pagination, LoadMore, Footer", icon: Navigation, count: 12 },
    ],
  },
  {
    label: "Commerce journeys",
    items: [
      { href: "/design-system/auth", label: "Authentication", description: "OTP, email, social sign-in, recovery, login prompt", icon: KeyRound, count: 10 },
      { href: "/design-system/discovery", label: "Navigation & search", description: "Bottom nav, account menu, search overlay, delivery PIN", icon: Compass, count: 10 },
      { href: "/design-system/merchandising", label: "Home & merchandising", description: "Hero, deals, rails, categories, brands, offers, promos", icon: Store, count: 12 },
      { href: "/design-system/listing", label: "Listing & search", description: "Product card, filters, mobile filters, quick view, compare", icon: Rows3, count: 20 },
      { href: "/design-system/product", label: "Product detail", description: "Gallery, sizes, delivery check, offers, coupons, specs, Q&A", icon: PackageOpen, count: 20 },
      { href: "/design-system/reviews", label: "Reviews & ratings", description: "Summary, write review, photos, filters, helpful votes", icon: MessageSquareText, count: 9 },
      { href: "/design-system/wishlist-bag", label: "Wishlist & bag", description: "Wishlist, cart drawer, bag items, coupons, price details", icon: Heart, count: 14 },
      { href: "/design-system/checkout", label: "Checkout", description: "Addresses, PIN auto-fill, delivery slots, confirmation", icon: CreditCard, count: 12 },
      { href: "/design-system/payments", label: "Payments", description: "UPI, cards, net banking, wallets, EMI, COD", icon: Wallet, count: 14 },
      { href: "/design-system/orders", label: "Orders & returns", description: "History, tracking, cancel, return / exchange, refunds", icon: Truck, count: 13 },
      { href: "/design-system/account", label: "Account & profile", description: "Profile, security, addresses, payments, points", icon: CircleUserRound, count: 13 },
      { href: "/design-system/notifications", label: "Notifications", description: "Bell, notification center, read state, push opt-in", icon: Bell, count: 5 },
      { href: "/design-system/support", label: "Support & system states", description: "Help center, contact, chat, errors, 404, offline, consent, skeletons", icon: LifeBuoy, count: 8 },
    ],
  },
  {
    label: "Admin & dashboards",
    items: [
      { href: "/design-system/admin-shell", label: "Admin shell", description: "Sidebar, top bar, page header, command palette", icon: PanelLeft, count: 5 },
      { href: "/design-system/data-tables", label: "Data tables & filters", description: "DataTable, bulk actions, FilterBar, date range, detail panel", icon: Table2, count: 6 },
      { href: "/design-system/charts", label: "Charts", description: "Validated palette, line, bar, share, donut, funnel, heatmap", icon: AreaChart, count: 9 },
      { href: "/design-system/metrics", label: "Metrics & activity", description: "KPI tiles, deltas, meters, activity feed, settings", icon: Gauge, count: 7 },
      { href: "/design-system/admin-screens", label: "Admin screens", description: "Orders, returns, catalog, customers, payouts, reports, settings", icon: MonitorCog, count: 14 },
    ],
  },
];



/** Flat list (kept for existing imports). */
export const dsNavItems: DsNavItem[] = dsNavGroups.flatMap((g) => g.items);
