import { useEffect, useRef } from "react";
import { ChatLauncher } from "@bluesigns/ui";

// Preview only: the launcher keeps its open state internally, so click its trigger once to show the panel.
function OpenOnMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector<HTMLButtonElement>('[data-slot="chat-launcher"]')?.click();
  }, []);
  return <div ref={ref}>{children}</div>;
}

export const OpenPanel = () => (
  <OpenOnMount>
    <ChatLauncher placement="inline" escalate={{ label: "Talk to a person", href: "#contact-support" }} />
  </OpenOnMount>
);

export const InlineTrigger = () => (
  <div className="flex flex-col items-start gap-3" style={{ maxWidth: 420 }}>
    <p className="text-body text-fg-muted">Quick questions about delivery, refunds or COD? Our assistant replies instantly.</p>
    <ChatLauncher placement="inline" />
  </div>
);

export const CustomQuickReplies = () => (
  <OpenOnMount>
    <ChatLauncher
      placement="inline"
      demo={false}
      quickReplies={["Change delivery address", "Cancel my order", "EMI options", "GST invoice"]}
      getReply={async () => {
        await new Promise((r) => setTimeout(r, 800));
        return "You can change the address until the order is packed. Go to Orders, open the order and choose Change address.";
      }}
    />
  </OpenOnMount>
);
