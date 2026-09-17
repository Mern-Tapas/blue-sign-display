import { ErrorState } from "@bluesigns/ui";

export const Inline = () => (
  <div style={{ maxWidth: 480 }}>
    <ErrorState size="inline" onRetry={() => {}} />
  </div>
);

export const Network = () => (
  <div style={{ maxWidth: 480 }}>
    <ErrorState kind="network" size="inline" onRetry={() => {}} />
  </div>
);

export const Page = () => (
  <div style={{ maxWidth: 640 }}>
    <ErrorState
      size="page"
      headingAs="h2"
      title="We couldn’t load your orders"
      description="Something went wrong on our side. Your orders are safe — try again in a moment."
      onRetry={() => {}}
      secondaryAction={{ label: "Go to home", href: "/" }}
      digest="3847261590"
    />
  </div>
);
