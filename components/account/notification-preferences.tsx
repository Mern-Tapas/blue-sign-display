"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Inset } from "@/components/ui/inset";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";
import type { NotificationCategory, NotificationChannel } from "@/lib/data/account";

export type NotificationPrefs = Record<string, Record<NotificationChannel, boolean>>;

export type NotificationPreferencesProps = {
  categories: NotificationCategory[];
  defaultValue: NotificationPrefs;
  onSave: (prefs: NotificationPrefs) => Promise<void>;
  className?: string;
};

const channels: { id: NotificationChannel; label: string }[] = [
  { id: "sms", label: "SMS" },
  { id: "email", label: "Email" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "push", label: "Push" },
];

/**
 * What to hear about, and where: a category × channel grid (table on desktop, stacked cards on
 * phones). Essential channels are locked with the reason; marketing is opt-in (DPDP).
 */
export function NotificationPreferences({ categories, defaultValue, onSave, className }: NotificationPreferencesProps) {
  const [prefs, setPrefs] = useState(defaultValue);
  const [saved, setSaved] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(prefs) !== JSON.stringify(saved);

  const toggle = (cat: string, ch: NotificationChannel, v: boolean) => setPrefs((p) => ({ ...p, [cat]: { ...p[cat]!, [ch]: v } }));

  const control = (c: NotificationCategory, ch: { id: NotificationChannel; label: string }) => {
    const locked = c.locked?.includes(ch.id);
    const sw = (
      <Switch
        size="sm"
        aria-label={`${c.label} by ${ch.label}${locked ? " (always on)" : ""}`}
        checked={locked ? true : Boolean(prefs[c.id]?.[ch.id])}
        disabled={locked}
        onCheckedChange={(v) => toggle(c.id, ch.id, v)}
      />
    );
    return locked ? (
      <Tooltip content="Required so you don’t miss OTPs and important updates">
        <span className="inline-flex items-center gap-1.5">
          {sw}
          <Lock aria-hidden className="size-3 text-fg-muted" />
        </span>
      </Tooltip>
    ) : (
      sw
    );
  };

  return (
    <form
      data-slot="notification-preferences"
      className={cn("flex flex-col gap-4", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        await onSave(prefs);
        setSaved(prefs);
        setBusy(false);
        toast({ title: "Notification settings saved", tone: "success" });
      }}
    >
      <TableContainer className="hidden rounded-2xl md:block">
        <Table>
          <caption className="sr-only">Notification preferences by channel</caption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead scope="col" className="px-5">
                Notify me about
              </TableHead>
              {channels.map((ch) => (
                <TableHead key={ch.id} scope="col" className="w-24 px-3 text-center">
                  {ch.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c.id} className="hover:bg-transparent">
                <th scope="row" className="px-5 py-4 text-left align-middle font-normal">
                  <span className="block text-body-strong text-fg">{c.label}</span>
                  <span className="block text-caption text-fg-muted">{c.description}</span>
                </th>
                {channels.map((ch) => (
                  <TableCell key={ch.id} className="px-3 py-4 text-center">
                    <span className="inline-flex justify-center">{control(c, ch)}</span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ul className="flex flex-col gap-3 md:hidden">
        {categories.map((c) => (
          <Card key={c.id} asChild variant="outline" padding="sm">
            <li>
              <div>
                <p className="text-body-strong">{c.label}</p>
                <p className="text-caption text-fg-muted">{c.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {channels.map((ch) => (
                  <Inset key={ch.id} size="sm" asChild>
                    <span className="flex items-center justify-between gap-2 py-2 text-label">
                      {ch.label}
                      {control(c, ch)}
                    </span>
                  </Inset>
                ))}
              </div>
            </li>
          </Card>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <Button type="submit" loading={busy} disabled={!dirty}>
          Save preferences
        </Button>
        {dirty && (
          <Button type="button" variant="ghost" onClick={() => setPrefs(saved)}>
            Discard
          </Button>
        )}
      </div>
    </form>
  );
}
