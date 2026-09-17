import { AskUsButton, Card, EmptyState, icons } from "@bluesigns/ui";

const { SearchX, Headset } = icons;

export const Standalone = () => <AskUsButton />;

export const NoFaqResults = () => (
  <Card variant="outline" padding="none" style={{ maxWidth: 520 }}>
    <EmptyState
      compact
      icon={<SearchX aria-hidden />}
      title="No answers for “refund to wallet”"
      description="Try different words, or send us your question and we’ll reply within 24 hours."
      action={<AskUsButton />}
    />
  </Card>
);

export const InHelpCard = () => (
  <Card className="gap-3" style={{ maxWidth: 420 }}>
    <div className="flex items-center gap-2">
      <Headset aria-hidden className="size-icon-md text-accent-fg" />
      <h3 className="text-title">Still need help?</h3>
    </div>
    <p className="text-body text-fg-muted">Our support team is available 8 AM – 10 PM, all seven days.</p>
    <div>
      <AskUsButton />
    </div>
  </Card>
);
