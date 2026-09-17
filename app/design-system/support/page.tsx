import type { Metadata } from "next";
import { ConsentReadout, ErrorStateDemo } from "@/components/docs/demos/support-demo";
import { DsGrid, DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { ChatLauncher } from "@/components/support/chat-launcher";
import { CookieConsent } from "@/components/support/cookie-consent";
import { FaqList } from "@/components/support/faq-list";
import { ContactSupportView } from "@/components/support/help-views";
import { OfflineBanner } from "@/components/support/offline-banner";
import { NotFoundState } from "@/components/ui/not-found-state";
import { BagPageSkeleton, ListingPageSkeleton, OrdersPageSkeleton, ProductPageSkeleton } from "@/components/ui/page-skeletons";
import { faqCategories, faqs } from "@/lib/data/support";

export const metadata: Metadata = { title: "Support & system states" };

const demoOrders = [
  { id: "LM-100482", label: "LM-100482 · 11 Sept 2026" },
  { id: "LM-100377", label: "LM-100377 · 2 Sept 2026" },
];

export default function SupportDocsPage() {
  return (
    <>
      <DsPageHeader
        title="Support"
        muted="& system states"
        description="Where shoppers go when something isn’t right, and what the store shows while loading, failing, offline or asking for consent. The help center lives at /help. Answers, contact details and chat replies are demo content."
      />

      <DsSection title="FAQ" description="Search looks through questions and answers across every topic; chips narrow the list when not searching. No results offers contact instead of a dead end.">
        <DsPreview label="FaqList" className="block">
          <FaqList faqs={faqs} categories={faqCategories} className="max-w-3xl" />
        </DsPreview>
      </DsSection>

      <DsSection title="Contact support" description="Order and issue up front so support doesn’t have to ask. Choosing ‘Damaged, defective or wrong item’ turns the attachment button into a photo dropzone. Include ‘fail’ in the message to see the error.">
        <DsPreview label="ContactSupportForm" surface="sunken" className="block">
          <ContactSupportView orders={demoOrders} />
        </DsPreview>
      </DsSection>

      <DsSection title="Chat" description="Side panel from 1024 px, bottom sheet on phones. Messages are in a polite live log, quick replies disappear once the shopper writes, and a person is always one link away. In the store it floats above the bottom nav.">
        <DsPreview label="ChatLauncher · inline">
          <ChatLauncher placement="inline" escalate={{ label: "Talk to a person", href: "#contact-support" }} />
        </DsPreview>
      </DsSection>

      <DsSection title="Errors" description="Say what happened and what to do next, keep a way out, and never show stack traces. Route errors use the page size with the Next.js digest as a support reference.">
        <DsGrid>
          <DsPreview label="ErrorState · inline (retry fails once)">
            <ErrorStateDemo />
          </DsPreview>
          <DsPreview label="NotFoundState" className="block">
            <NotFoundState headingAs="h2" className="py-6 sm:py-8" />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Offline" description="Pinned above the bottom nav while offline; ‘Back online’ confirms for three seconds. Turn off the network in DevTools to see it live on any store page.">
        <DsGrid>
          <DsPreview label="Offline">
            <OfflineBanner forceState="offline" />
          </DsPreview>
          <DsPreview label="Restored">
            <OfflineBanner forceState="restored" />
          </DsPreview>
        </DsGrid>
      </DsSection>

      <DsSection title="Cookie consent" description="Optional purposes start off. Reject and Accept have equal weight, each purpose is explained in plain words, and Cookie settings in the footer reopens the dialog to change or withdraw. Mount it once per layout.">
        <DsPreview label="CookieConsent · preview" surface="sunken" className="flex-col items-stretch gap-4">
          <CookieConsent preview className="max-w-md" />
          <ConsentReadout />
        </DsPreview>
      </DsSection>

      <DsSection title="Page skeletons" description="Shaped like the page that’s loading, with one ‘Loading…’ status for screen readers. Used by loading.tsx on /shop and product pages.">
        <div className="flex flex-col gap-5">
          <DsPreview label="ListingPageSkeleton" className="block">
            <ListingPageSkeleton items={4} />
          </DsPreview>
          <DsPreview label="ProductPageSkeleton" className="block">
            <ProductPageSkeleton />
          </DsPreview>
          <DsGrid>
            <DsPreview label="BagPageSkeleton" className="block">
              <BagPageSkeleton items={1} />
            </DsPreview>
            <DsPreview label="OrdersPageSkeleton" className="block">
              <OrdersPageSkeleton items={2} />
            </DsPreview>
          </DsGrid>
        </div>
      </DsSection>

      <DsSection title="Props">
        <DsProps
          component="Support & system states"
          rows={[
            { name: "faqs · categories · defaultCategory · noResultsAction", type: "FaqList", description: "Search spans all topics; ?topic= on /help preselects a chip." },
            { name: "orders · issueTypes · defaultOrderId · photoIssues · onSubmit → ticket", type: "ContactSupportForm", description: "Validates issue and a 20-character description; success shows a copyable reference." },
            { name: "quickReplies · getReply · escalate · placement · demo", type: "ChatLauncher", description: "Panel shell; supply getReply from your chat backend." },
            { name: "kind · size · headingAs · onRetry · secondaryAction · digest", type: "ErrorState", description: "Used by app/(store)/error.tsx with retry()." },
            { name: "title · description · links · searchAction · headingAs", type: "NotFoundState", description: "Server-safe; GET search works without JavaScript. Used by app/not-found.tsx." },
            { name: "forceState · className", type: "OfflineBanner", description: "useOnlineStatus() is exported for other offline-aware UI." },
            { name: "privacyHref · preview · className", type: "CookieConsent", description: "useConsent() gates optional tags; openConsentSettings() reopens the dialog." },
            { name: "items · className", type: "Listing / Product / Bag / OrdersPageSkeleton", description: "Server-safe; role=status with a single label." },
          ]}
        />
      </DsSection>
    </>
  );
}
