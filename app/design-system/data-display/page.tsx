import type { Metadata } from "next";
import { ArrowUpRight, Package, Wallet } from "lucide-react";
import { SelectableTableDemo } from "@/components/docs/demos/selectable-table-demo";
import { CarouselDemo, CountdownDemo } from "@/components/docs/demos/display-extras-demo";
import { StepsDemo } from "@/components/docs/demos/structure-demo";
import { CopyButton } from "@/components/ui/copy-button";
import { DescriptionList } from "@/components/ui/description-list";
import { DsGrid, DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { PriceDisplay } from "@/components/commerce/price-display";
import { RatingStars } from "@/components/commerce/rating-stars";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardInset } from "@/components/ui/card";
import { CountBadge } from "@/components/ui/count-badge";
import { IconTile } from "@/components/ui/icon-tile";
import { Inset } from "@/components/ui/inset";
import { Divider } from "@/components/ui/divider";
import { IconButton } from "@/components/ui/icon-button";
import { StatusDot } from "@/components/ui/status-dot";
import { TrendChip } from "@/components/ui/trend-chip";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { TextLink } from "@/components/ui/text-link";
import { avatars } from "@/lib/data/images";

export const metadata: Metadata = { title: "Data display" };

const people = [
  { name: "Maria Jones", src: avatars.maria },
  { name: "James Carter", src: avatars.james },
  { name: "Aisha Rahman", src: avatars.aisha },
  { name: "Leo Martins", src: avatars.leo },
  { name: "Sofia Chen", src: avatars.sofia },
  { name: "Noah Kim", src: avatars.noah },
];

export default function DataDisplayPage() {
  return (
    <>
      <DsPageHeader
        title="Data"
        muted="display"
        description="Cards, figures, badges and tables. Structure comes from nested surfaces rather than borders."
      />

      <DsSection title="Cards" description="Five variants. CardInset creates the grey nested panel used for wallets and summaries.">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHeader
              title="Total revenue"
              description="Last 30 days"
              action={
                <IconButton label="Open report" size="sm">
                  <ArrowUpRight aria-hidden />
                </IconButton>
              }
            />
            <PriceDisplay amount={32678.9} size="2xl" />
            <TrendChip value={12.8} caption="vs last month" />
          </Card>

          <Card variant="accent">
            <CardHeader title="Orders today" description="Updated 2 min ago" icon={<Package className="text-fg" />} />
            <p className="text-figure-xl figures">1,284</p>
            <TrendChip value={7} variant="solid" />
          </Card>

          <Card variant="contrast">
            <CardHeader title="Available payout" description="Next transfer Friday" />
            <p className="text-figure-xl figures">
              <span className="text-fg-on-contrast-muted">₹</span>2,14,390<span className="text-fg-on-contrast-muted">.00</span>
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="inverse">
                Payout now
              </Button>
              <IconButton label="Open" variant="contrast" size="sm">
                <ArrowUpRight aria-hidden />
              </IconButton>
            </div>
          </Card>

          <Card>
            <CardHeader title="Wallets" description="3 currencies" icon={<Wallet />} />
            <div className="grid grid-cols-2 gap-2">
              <CardInset>
                <p className="text-caption text-fg-muted">INR</p>
                <p className="text-heading-sm figures">₹2,26,780</p>
                <p className="mt-1 text-caption text-success-fg">Active</p>
              </CardInset>
              <CardInset>
                <p className="text-caption text-fg-muted">EUR</p>
                <p className="text-heading-sm figures">€18,345</p>
                <p className="mt-1 text-caption text-danger-fg">Inactive</p>
              </CardInset>
            </div>
          </Card>

          <Card variant="sunken">
            <CardHeader title="Sunken card" description="For grouping on a white surface" />
            <CardContent>
              <p className="text-body text-fg-muted">Use inside a surface card or as a quiet section background.</p>
            </CardContent>
          </Card>

          <Card variant="outline" interactive>
            <CardHeader title="Interactive outline" />
            <CardDescription>Hover lifts the card with the popover shadow.</CardDescription>
            <CardFooter>
              <Button size="sm" variant="secondary">
                Details
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DsSection>

      <DsSection title="Surfaces inside cards" description="One nesting language: Card (2xl, 20→24px padding) holds Inset panels (lg radius, with a hairline). Tinted insets carry status without adding borders. Card variant danger marks destructive zones.">
        <DsGrid>
          <DsPreview label="Inset tones" className="grid grid-cols-2 gap-3">
            <Inset>Sunken — totals, notes</Inset>
            <Inset tone="accent">Accent — savings</Inset>
            <Inset tone="success" size="sm">Success · sm</Inset>
            <Inset tone="warning" size="sm">Warning · sm</Inset>
          </DsPreview>
          <DsPreview label="Card · danger" surface="sunken" className="block">
            <Card variant="danger" padding="md">
              <p className="text-title">Delete account</p>
              <p className="text-body text-fg-muted">Removes orders history, addresses and saved cards.</p>
            </Card>
          </DsPreview>
          <DsPreview label="IconTile · sizes & tones" className="gap-3">
            <IconTile size="sm"><Package /></IconTile>
            <IconTile tone="accent"><Wallet /></IconTile>
            <IconTile size="lg" tone="success"><Package /></IconTile>
            <IconTile size="lg" tone="warning"><Wallet /></IconTile>
            <IconTile size="xl" tone="muted"><Package /></IconTile>
          </DsPreview>
          <DsPreview label="CountBadge · tones" className="gap-3">
            <CountBadge count={3} />
            <CountBadge count={12} tone="accent" />
            <CountBadge count={128} tone="inverse" />
            <CountBadge count={2} tone="danger" size="sm" />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Badges, status & trends">
        <DsGrid>
          <DsPreview label="Badge tones">
            <Badge>Neutral</Badge>
            <Badge tone="accent">New</Badge>
            <Badge tone="success">In stock</Badge>
            <Badge tone="warning">Low stock</Badge>
            <Badge tone="danger">-20%</Badge>
            <Badge tone="info">Pre-order</Badge>
            <Badge tone="solid">Bestseller</Badge>
            <Badge tone="inverse">Limited</Badge>
            <Badge tone="outline">Unsent</Badge>
          </DsPreview>
          <DsPreview label="Badge sizes">
            <Badge size="sm" tone="accent">Small</Badge>
            <Badge size="md" tone="accent">Medium</Badge>
            <Badge size="lg" tone="accent">Large</Badge>
          </DsPreview>
          <DsPreview label="Status dot">
            <StatusDot tone="success">Completed</StatusDot>
            <StatusDot tone="danger">Pending</StatusDot>
            <StatusDot tone="warning" pulse>In progress</StatusDot>
            <StatusDot tone="success" pill>Successful</StatusDot>
          </DsPreview>
          <DsPreview label="Trend chip">
            <TrendChip value={12.8} />
            <TrendChip value={-5.2} />
            <TrendChip value={17.8} variant="solid" />
            <TrendChip value={2.4} variant="plain" caption="from last month" />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Figures, prices & ratings">
        <DsGrid>
          <DsPreview label="Price display · INR" className="flex-col items-start">
            <PriceDisplay amount={2499} size="sm" />
            <PriceDisplay amount={2499} compareAt={3999} showDiscount />
            <PriceDisplay amount={12999} compareAt={16999} size="xl" showDiscount discountStyle="pill" mrpLabel taxNote />
            <PriceDisplay amount={1789.5} size="lg" />
            <PriceDisplay amount={124999} size="2xl" />
          </DsPreview>
          <DsPreview label="Rating stars" className="flex-col items-start">
            <RatingStars value={4.7} count={1284} size="sm" />
            <RatingStars value={3.5} showValue />
            <RatingStars value={4.2} showValue count={318} size="lg" />
          </DsPreview>
        </DsGrid>
        <div className="mt-5">
          <DsProps
            component="PriceDisplay"
            rows={[
              { name: "amount", type: "number", description: "Selling price, inclusive of taxes. Paise render only when non-zero." },
              { name: "compareAt", type: "number", description: "MRP. Struck through when higher than amount." },
              { name: "showDiscount", type: "boolean", default: "false", description: "Percentage off MRP, rounded down so it never overstates the saving." },
              { name: "discountStyle", type: `"text" | "pill"`, default: `"text"`, description: "Inline listing style or a soft success chip." },
              { name: "mrpLabel", type: "boolean", default: "false", description: `Prefix the struck price with "MRP" (product pages).` },
              { name: "taxNote", type: "boolean", default: "false", description: `Adds "Inclusive of all taxes" on its own line.` },
              { name: "size", type: `"sm" | "md" | "lg" | "xl" | "2xl"`, default: `"md"`, description: "Type role for the selling price." },
              { name: "currency", type: "string", default: `"INR"`, description: "ISO currency code, formatted in en-IN." },
            ]}
          />
        </div>
        <div className="mt-5 flex flex-col gap-5">
          <DsProps
            component="DescriptionList"
            rows={[
              { name: "items", type: "{ term, description, action?, emphasis? }[]", description: "Rows rendered as <dt>/<dd> pairs; emphasis for totals." },
              { name: "layout", type: '"rows" | "table" | "stacked" | "grid"', default: '"rows"', description: "Value right-aligned, fixed term column, term above value, or 2-column stacked." },
              { name: "dividers · size", type: 'boolean · "sm" | "md"', default: 'false · "md"', description: "Hairline separators and caption / body text." },
            ]}
          />
          <DsProps
            component="Steps"
            rows={[
              { name: "steps", type: "{ id, label, description?, meta?, status?, icon? }[]", description: "status overrides the derived state (e.g. error)." },
              { name: "current", type: "number", description: "Index of the current step; earlier steps are complete." },
              { name: "orientation · size", type: '"horizontal" | "vertical" · "sm" | "md"', default: '"horizontal" · "md"', description: "Vertical suits timelines with meta per step." },
            ]}
          />
          <DsProps
            component="Carousel"
            rows={[
              { name: "aria-label", type: "string", description: "Required name for the carousel region." },
              { name: "slideClassName · gapClassName", type: "string", default: '"basis-full" · "gap-4"', description: "Responsive slide widths (basis-*) and spacing." },
              { name: "controls", type: '"overlay" | "below" | "header" | "none"', default: '"overlay"', description: "Edge arrows for heroes, a control row for rails, or arrows beside a header." },
              { name: "showDots · header", type: "boolean · ReactNode", description: "Page dots (default with overlay); header content for controls=\"header\"." },
              { name: "autoplay", type: "number (ms)", description: "Pauses on hover/focus, adds a pause button, disabled under reduced motion." },
            ]}
          />
          <DsProps
            component="CountdownTimer"
            rows={[
              { name: "endsAt", type: "Date | string | number", description: "The offer’s real end time." },
              { name: "variant", type: '"blocks" | "inline"', default: '"blocks"', description: "Digit tiles or a compact “Ends in 02h 14m” label." },
              { name: "tone · size", type: '"neutral" | "contrast" | "accent" | "on-color" · "sm" | "md" | "lg"', default: '"neutral" · "md"', description: "Tile colours and scale." },
              { name: "showSeconds · label · expiredText · onExpire", type: "boolean · string · ReactNode · fn", description: "Ticking detail, prefix, end state and callback." },
            ]}
          />
        </div>
      </DsSection>

      <DsSection title="Avatars">
        <DsPreview>
          <Avatar name="Maria Jones" src={avatars.maria} size="xs" />
          <Avatar name="Maria Jones" src={avatars.maria} size="sm" />
          <Avatar name="Maria Jones" src={avatars.maria} />
          <Avatar name="James Carter" size="lg" />
          <Avatar name="Sujon Ahmed" size="xl" />
          <Divider orientation="vertical" className="h-10" />
          <AvatarGroup people={people} max={4} />
          <AvatarGroup people={people} max={3} size="sm" />
        </DsPreview>
      </DsSection>

      <DsSection title="Table" description="Header row sits on a sunken band with overline labels; selected rows use the selected fill.">
        <SelectableTableDemo />
      </DsSection>

      <DsSection title="Description list" description="Semantic <dl> key–value rows. Rows for price and order details, table for specifications, stacked or grid for addresses and profile data.">
        <DsGrid>
          <DsPreview label="Rows · dividers" className="block">
            <DescriptionList
              dividers
              items={[
                { term: "Order ID", description: "LM-100482", action: <CopyButton value="LM-100482" label="Copy order ID" size="xs" /> },
                { term: "Placed on", description: "10 Sept 2026" },
                { term: "Payment", description: "UPI · sujon@okaxis" },
                { term: "Order total", description: "₹21,596", emphasis: true },
              ]}
            />
          </DsPreview>
          <DsPreview label="Table · specifications" className="block">
            <DescriptionList
              layout="table"
              size="sm"
              dividers
              items={[
                { term: "Model", description: "Aura ANC 700" },
                { term: "Connectivity", description: "Bluetooth 5.3, USB-C, 3.5 mm" },
                { term: "Battery", description: "Up to 40 hours (ANC off), 10 min charge = 5 hours" },
                { term: "Warranty", description: "1 year manufacturer warranty" },
                { term: "Country of origin", description: "India" },
              ]}
            />
          </DsPreview>
          <DsPreview label="Grid · stacked" className="block">
            <DescriptionList
              layout="grid"
              items={[
                { term: "Full name", description: "Sujon Ahmed" },
                { term: "Mobile", description: "+91 98765 43210" },
                { term: "Email", description: "sujon@bluesigns.shop" },
                { term: "Date of birth", description: "Not added" },
              ]}
            />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Steps" description="Display-only progress for returns, payments and shipments. Status comes from the current index or a per-step override (error), and is spoken, not just coloured.">
        <StepsDemo />
      </DsSection>

      <DsSection
        title="Carousel"
        description="Native scroll-snap: swipe, trackpad and keyboard all scroll the same track. Autoplay pauses on hover and focus, offers a pause button and never runs under reduced motion."
      >
        <CarouselDemo />
      </DsSection>

      <DsSection title="Countdown" description="For offers with a real end time only. Digits render after hydration from one shared clock; screen readers get a minute-level label instead of per-second announcements.">
        <CountdownDemo />
      </DsSection>

      <DsSection title="Keys & text links" description="Kbd marks shortcuts; TextLink styles links inside copy. External links open in a new tab and say so to screen readers.">
        <DsGrid>
          <DsPreview label="Kbd" className="flex-col items-start" code={`<KbdGroup keys={["Ctrl", "K"]} />`}>
            <p className="text-body text-fg-muted">
              Press <Kbd>/</Kbd> to search, <Kbd>Esc</Kbd> to close.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <KbdGroup keys={["Ctrl", "K"]} />
              <KbdGroup keys={["Shift", "?"]} size="sm" />
              <Kbd size="sm">↵</Kbd>
            </div>
          </DsPreview>
          <DsPreview label="TextLink" className="flex-col items-start" code={`<TextLink href="/account/orders">Track order</TextLink>`}>
            <TextLink href="/account/orders">Track your order</TextLink>
            <p className="text-body text-fg-muted">
              By continuing you agree to the <TextLink href="/" tone="inline">Terms of Use</TextLink> and{" "}
              <TextLink href="/" tone="inline">Privacy Policy</TextLink>.
            </p>
            <div className="flex flex-wrap gap-4">
              <TextLink href="/" tone="muted" size="sm">
                Help centre
              </TextLink>
              <TextLink href="https://www.npci.org.in/what-we-do/upi/product-overview" external size="sm">
                About UPI
              </TextLink>
            </div>
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Breadcrumbs & divider">
        <DsPreview className="flex-col items-stretch">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Audio", href: "/shop?category=audio" },
              { label: "Aura Wireless Headphones" },
            ]}
          />
          <Divider />
          <Divider label="or continue with" />
        </DsPreview>
      </DsSection>
    </>
  );
}
