"use client";

import { useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import { toast } from "@/components/providers/toast-store";
import { Button } from "@/components/ui/button";
import { ADMIN_DEMO_NOTE } from "@/lib/data/admin";
import { FormActionsBar, useDraft } from "../admin-parts";
import { PageHeader } from "../page-header";
import { DangerZoneSection } from "./danger-zone-section";
import { NotificationsSection } from "./notifications-section";
import { PaymentsSection } from "./payments-section";
import { defaultSettings, settingsSections, validateSettings, type StoreSettings } from "./settings-data";
import { SettingsSubnav } from "./settings-subnav";
import { ShippingSection } from "./shipping-section";
import { StaffSection } from "./staff-section";
import { StoreProfileSection } from "./store-profile-section";
import { TaxesSection } from "./taxes-section";

const anchor = "scroll-mt-[calc(var(--nav-h)+1.5rem)] border-b border-border-subtle";

/**
 * All store settings on one page: a section sub-navigation, one draft for every form section and a
 * sticky save bar that appears only when something changed. Errors show once a field is left or a
 * save is attempted.
 */
export function SettingsScreen() {
  const { draft, setDraft, dirty, commit, discard } = useDraft<StoreSettings>(defaultSettings);
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [attempted, setAttempted] = useState(false);
  const [saving, setSaving] = useState(false);
  const errors = validateSettings(draft);

  const section = {
    draft,
    update: (fn: (d: StoreSettings) => StoreSettings) => setDraft(fn),
    error: (path: string) => (attempted || touched.has(path) ? errors[path] : undefined),
    touch: (path: string) => setTouched((t) => (t.has(path) ? t : new Set(t).add(path))),
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAttempted(true);
    const count = Object.keys(errors).length;
    if (count > 0) {
      const form = e.currentTarget;
      // Wait for the error styles to render, then take the owner to the first problem.
      window.requestAnimationFrame(() => {
        const first = form.querySelector<HTMLElement>("[aria-invalid=true]") ?? form.querySelector<HTMLElement>("[data-slot=alert]");
        first?.scrollIntoView({ block: "center" });
        first?.focus({ preventScroll: true });
      });
      toast({ title: `Fix ${count} ${count === 1 ? "field" : "fields"} before saving`, description: Object.values(errors)[0], tone: "danger" });
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      commit();
      setSaving(false);
      setAttempted(false);
      setTouched(new Set());
      toast({ title: "Settings saved", description: "Changes apply to the storefront within a minute.", tone: "success" });
    }, 800);
  };

  return (
    <>
      <PageHeader
        title="Settings"
        meta={
          <>
            <span>BlueSigns · India store</span>
            <span aria-hidden>·</span>
            <span>{ADMIN_DEMO_NOTE}</span>
          </>
        }
        actions={
          <Button asChild variant="secondary" leadingIcon={<History aria-hidden />}>
            <Link href="/admin/settings/audit">Audit log</Link>
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[11rem_minmax(0,1fr)] xl:gap-10">
        <SettingsSubnav sections={settingsSections} />

        <form onSubmit={submit} noValidate aria-label="Store settings" className="flex min-w-0 flex-col gap-8">
          <div id="store-profile" className={anchor}>
            <StoreProfileSection {...section} />
          </div>
          <div id="shipping" className={anchor}>
            <ShippingSection {...section} />
          </div>
          <div id="payments" className={anchor}>
            <PaymentsSection {...section} />
          </div>
          <div id="taxes" className={anchor}>
            <TaxesSection {...section} />
          </div>
          <div id="notifications" className={anchor}>
            <NotificationsSection {...section} />
          </div>
          <div id="staff" className={anchor}>
            <StaffSection draft={draft} update={section.update} />
          </div>
          <div id="danger-zone" className="scroll-mt-[calc(var(--nav-h)+1.5rem)]">
            <DangerZoneSection />
          </div>

          <FormActionsBar
            dirty={dirty}
            saving={saving}
            onDiscard={() => {
              discard();
              setAttempted(false);
              setTouched(new Set());
              toast({ title: "Changes discarded", tone: "neutral" });
            }}
          />
        </form>
      </div>
    </>
  );
}
