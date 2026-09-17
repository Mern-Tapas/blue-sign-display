"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, SendHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { textLinkVariants } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/use-media-query";

export type ChatMessage = { id: string; from: "user" | "agent"; text: string };

export type ChatLauncherProps = {
  /** Suggested first questions shown as chips. */
  quickReplies?: string[];
  /** Produces the agent's reply. Wire to your chat backend; the default is a scripted demo. */
  getReply?: (text: string) => Promise<string>;
  /** Hand-off to a person, e.g. scroll to the contact form. */
  escalate?: { label: string; href: string };
  /** "floating" is fixed bottom-right; "inline" renders the trigger in flow (docs, help pages). */
  placement?: "floating" | "inline";
  demo?: boolean;
  className?: string;
};

const scripted = async (text: string) => {
  await new Promise((r) => setTimeout(r, 900));
  const t = text.toLowerCase();
  if (/refund|money/.test(t)) return "Refunds start after the pickup passes a quality check. UPI and wallets take 1–2 days; cards 5–7 working days. You can see the status on the order.";
  if (/where|track|order|deliver/.test(t)) return "Open Orders to see live tracking and the courier’s number. Want me to connect you to a person about a specific order?";
  if (/return|exchange/.test(t)) return "Choose Return or exchange on a delivered order within 14 days. We’ll arrange a pickup at your address.";
  if (/cod|cash/.test(t)) return "Cash on Delivery is available on most PIN codes, with a ₹19 handling fee.";
  return "I can help with orders, returns, refunds and payments. For anything else, a person from our team can pick this up.";
};

let seq = 0;
const nextId = () => `m${++seq}`;

/**
 * Support chat entry point: a launcher button and a panel shell (side panel from 1024 px, bottom
 * sheet on phones) with a message log announced politely, quick replies, a composer and a clear
 * route to a human. Messaging itself is supplied through `getReply`.
 */
export function ChatLauncher({
  quickReplies = ["Where is my order?", "Refund status", "Return an item", "Is COD available?"],
  getReply = scripted,
  escalate = { label: "Talk to a person", href: "/help#contact" },
  placement = "floating",
  demo = true,
  className,
}: ChatLauncherProps) {
  const wide = useMediaQuery("(min-width: 1024px)", true);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: "hello", from: "agent", text: "Hi! I’m BlueSigns’s help assistant. What can I help you with today?" }]);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  async function send(text: string) {
    const value = text.trim();
    if (!value || typing) return;
    setDraft("");
    setMessages((m) => [...m, { id: nextId(), from: "user", text: value }]);
    setTyping(true);
    try {
      const reply = await getReply(value);
      setMessages((m) => [...m, { id: nextId(), from: "agent", text: reply }]);
    } catch {
      setMessages((m) => [...m, { id: nextId(), from: "agent", text: "Sorry, I couldn’t reply just now. Please try again or talk to a person." }]);
    } finally {
      setTyping(false);
    }
  }

  const userHasWritten = messages.some((m) => m.from === "user");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          data-slot="chat-launcher"
          size="lg"
          leadingIcon={<MessageCircle aria-hidden />}
          className={cn(placement === "floating" && "fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-(--z-sticky) shadow-popover sm:right-6 lg:bottom-6", className)}
        >
          Chat with us
        </Button>
      </SheetTrigger>
      <SheetContent side={wide ? "right" : "bottom"} className="flex flex-col" aria-describedby={undefined}>
        <SheetHeader title="Help chat">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-caption text-fg-muted">
              <span aria-hidden className="size-2 rounded-pill bg-success" />
              Typically replies instantly
            </span>
            {demo && <Badge tone="neutral" size="sm">Demo · scripted replies</Badge>}
          </div>
        </SheetHeader>
        <SheetBody className="flex min-h-64 flex-1 flex-col gap-3 overflow-hidden p-0">
          <div ref={logRef} role="log" aria-live="polite" aria-label="Chat messages" className="flex flex-1 flex-col gap-3 overflow-y-auto px-6 py-2">
            {messages.map((m) => (
              <p
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-body",
                  m.from === "user" ? "self-end rounded-br-md bg-accent text-fg-on-accent" : "self-start rounded-bl-md bg-surface-sunken text-fg",
                )}
              >
                <span className="sr-only">{m.from === "user" ? "You: " : "BlueSigns: "}</span>
                {m.text}
              </p>
            ))}
            {typing && (
              <p className="flex items-center gap-1 self-start rounded-2xl rounded-bl-md bg-surface-sunken px-3.5 py-3">
                <span className="sr-only">BlueSigns is typing</span>
                {[0, 1, 2].map((i) => (
                  <span key={i} aria-hidden className="size-1.5 rounded-pill bg-fg-muted motion-safe:animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </p>
            )}
          </div>
          {!userHasWritten && (
            <div className="flex flex-wrap gap-2 px-6" aria-label="Suggested questions" role="group">
              {quickReplies.map((q) => (
                <Chip key={q} size="sm" onClick={() => send(q)}>
                  {q}
                </Chip>
              ))}
            </div>
          )}
        </SheetBody>
        <SheetFooter className="items-stretch">
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <Input aria-label="Message" placeholder="Type your question" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={500} wrapperClassName="flex-1" autoComplete="off" />
            <Button type="submit" aria-label="Send message" disabled={!draft.trim() || typing} className="px-3">
              <SendHorizontal aria-hidden />
            </Button>
          </form>
          <a href={escalate.href} onClick={() => setOpen(false)} className={cn(textLinkVariants({ size: "md" }), "self-center")}>
            {escalate.label}
          </a>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
