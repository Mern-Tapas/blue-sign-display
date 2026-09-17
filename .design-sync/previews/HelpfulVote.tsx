import { HelpfulVote, toast } from "@bluesigns/ui";

export const UpOnly = () => <HelpfulVote helpful={48} />;

export const WithReport = () => (
  <div style={{ maxWidth: 480 }}>
    <HelpfulVote
      helpful={12}
      notHelpful={3}
      subject="review by Rohan Mehta"
      onReport={() => toast({ title: "Thanks — we’ll review this report", tone: "info" })}
      className="w-full"
    />
  </div>
);

export const InReviewFooter = () => (
  <div className="rounded-xl border border-border bg-surface p-4" style={{ maxWidth: 480 }}>
    <p className="text-body-strong">Quiet, comfy, and the battery is unreal</p>
    <p className="mt-1 text-body text-fg-muted">Noise cancelling handles the metro commute easily.</p>
    <div className="mt-3 border-t border-border-subtle pt-3">
      <HelpfulVote helpful={1284} notHelpful={37} subject="review by Ananya Iyer" />
    </div>
  </div>
);
