import type { Metadata } from "next";
import { PackageSearch, ShoppingBag, X } from "lucide-react";
import { ToastDemo } from "@/components/docs/demos/toast-demo";
import { DsGrid, DsPageHeader, DsPreview, DsSection } from "@/components/docs/ds-section";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Feedback" };

export default function FeedbackPage() {
  return (
    <>
      <DsPageHeader
        title="Feedback &"
        muted="status"
        description="Alerts inform in place, toasts confirm actions, progress and skeletons fill waiting time."
      />

      <DsSection title="Alerts">
        <div className="flex flex-col gap-3">
          <Alert tone="info" title="Free shipping unlocked">
            Orders above ₹499 get free delivery — you’re all set.
          </Alert>
          <Alert tone="success" title="Payment confirmed">
            Order LM-100482 is being packed.
          </Alert>
          <Alert
            tone="warning"
            title="Only 3 left in stock"
            action={
              <Button size="sm" variant="secondary">
                Notify me
              </Button>
            }
          >
            Complete checkout within 10 minutes to reserve your item.
          </Alert>
          <Alert
            tone="danger"
            title="Card declined"
            action={
              <IconButton label="Dismiss" variant="ghost" size="sm">
                <X aria-hidden />
              </IconButton>
            }
          >
            Your bank declined the charge. Try another payment method.
          </Alert>
          <Alert tone="neutral" title="Neutral alert">
            For low-priority notes on white surfaces.
          </Alert>
        </div>
      </DsSection>

      <DsSection title="Inline notes" description="Alert size sm for one-line notes inside cards and forms; the accent tone is for positive nudges (savings, offers), not warnings.">
        <DsGrid>
          <DsPreview label="size sm · tones" className="flex-col items-stretch gap-2">
            <Alert size="sm" tone="accent">You save ₹1,240 on this order</Alert>
            <Alert size="sm" tone="success">Delivery by Thu, 18 Sept</Alert>
            <Alert size="sm" tone="warning">Only 2 left in size M</Alert>
            <Alert size="sm" tone="danger">This PIN code isn’t serviceable</Alert>
          </DsPreview>
          <DsPreview label="neutral · md" className="flex-col items-stretch gap-2">
            <Alert tone="neutral" title="Invoice ready">GST invoice is emailed after delivery.</Alert>
            <Alert tone="accent" title="Bank offer applied">10% instant discount with HDFC Bank cards (demo offer).</Alert>
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Toasts" description="Imperative toast() API. Swipe right or press Escape (F8 focuses the region) to dismiss.">
        <ToastDemo />
      </DsSection>

      <DsSection title="Progress">
        <DsGrid>
          <DsPreview label="Monthly spending limit" className="flex-col items-stretch">
            <Progress value={1400} max={5500} track="hatch" aria-label="Spending limit" />
            <div className="flex justify-between text-caption">
              <span>
                <span className="font-medium figures">{formatPrice(1400)}</span> <span className="text-fg-muted">spent of</span>
              </span>
              <span className="font-medium figures">{formatPrice(5500)}</span>
            </div>
          </DsPreview>
          <DsPreview label="Free shipping progress and tones" className="flex-col items-stretch">
            <p className="text-label">
              Add <span className="text-accent-fg">₹120</span> for free shipping
            </p>
            <Progress value={127} max={150} aria-label="Free shipping progress" />
            <Progress value={80} tone="success" size="sm" aria-label="Success" />
            <Progress value={45} tone="warning" size="sm" aria-label="Warning" />
            <Progress value={15} tone="danger" size="lg" aria-label="Danger" />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Loading">
        <DsGrid>
          <DsPreview label="Spinner">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" className="text-accent" />
            <Spinner size="lg" className="text-fg-muted" />
            <Button loading variant="secondary">
              Loading
            </Button>
          </DsPreview>
          <DsPreview label="Product card skeleton">
            <div className="flex w-full gap-4">
              {[0, 1].map((i) => (
                <div key={i} className="flex flex-1 flex-col gap-3">
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4 rounded-pill" />
                  <Skeleton className="h-4 w-1/3 rounded-pill" />
                </div>
              ))}
            </div>
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Empty states">
        <DsGrid>
          <DsPreview className="justify-center">
            <EmptyState
              icon={<ShoppingBag aria-hidden />}
              title="Your cart is empty"
              description="Looks like you haven’t added anything yet. Start with our best sellers."
              action={<Button>Start shopping</Button>}
            />
          </DsPreview>
          <DsPreview className="justify-center">
            <EmptyState
              compact
              icon={<PackageSearch aria-hidden />}
              title="No products match"
              description="Try removing a filter or widening the price range."
              action={
                <Button variant="secondary" size="sm">
                  Clear all filters
                </Button>
              }
            />
          </DsPreview>
        </DsGrid>
      </DsSection>
    </>
  );
}
