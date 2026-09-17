import type { Metadata } from "next";
import { Bell, CreditCard, Download, Home, LayoutGrid, Package, Settings } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { CommandPaletteDemo, SidebarNavDemo } from "@/components/docs/demos/admin-demos";
import { DsDoDont } from "@/components/docs/ds-foundations";
import { DsPageHeader, DsPreview, DsProps, DsSection } from "@/components/docs/ds-section";
import { IconRail } from "@/components/layout/icon-rail";
import { Button } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";

export const metadata: Metadata = { title: "Admin shell & navigation" };

export default function AdminShellDocsPage() {
  return (
    <>
      <DsPageHeader
        title="Admin shell"
        muted="& navigation"
        description="The frame for Operate surfaces: a flat sidebar that collapses to icons, a slim top bar with search and account actions, and a page header that carries the title, meta and actions. Familiar on purpose: the tool disappears into the task."
      />

      <DsSection title="Live app" description="Everything on this page is assembled in the demo back office.">
        <DsPreview label="AdminShell" className="justify-between">
          <p className="max-w-md text-body text-fg-muted">
            Sidebar collapses from 1024px (remembered per device), becomes a sheet on phones, and Ctrl K / ⌘K opens search anywhere.
          </p>
          <TextLink href="/admin" size="md">
            Open /admin
          </TextLink>
        </DsPreview>
      </DsSection>

      <DsSection title="Sidebar navigation" description="Grouped destinations with overline labels; the current page uses the soft accent. Collapsed, rows become 40px icon targets with tooltips and a dot for pending counts.">
        <DsPreview label="SidebarNav · expanded and collapsed" className="block">
          <SidebarNavDemo />
        </DsPreview>
        <DsPreview label="IconRail · floating pill rail (storefront dashboards)" className="mt-5">
          <IconRail
            groups={[
              [
                { href: "#", label: "Home", icon: Home, active: true },
                { href: "#", label: "Catalogue", icon: LayoutGrid },
                { href: "#", label: "Orders", icon: Package },
              ],
              [
                { href: "#", label: "Payments", icon: CreditCard },
                { href: "#", label: "Notifications", icon: Bell },
                { href: "#", label: "Settings", icon: Settings },
              ],
            ]}
          />
        </DsPreview>
      </DsSection>

      <DsSection title="Page header" description="heading-lg title (hierarchy stays below the storefront's display sizes), meta line for status and IDs, and actions that wrap under the title on phones.">
        <DsPreview label="PageHeader" className="block">
          <PageHeader
            title="Orders"
            breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Orders" }]}
            meta={<span>120 orders · last 30 days · demo data</span>}
            actions={
              <>
                <Button variant="secondary" leadingIcon={<Download aria-hidden />}>
                  Export
                </Button>
                <Button>Create order</Button>
              </>
            }
          />
        </DsPreview>
      </DsSection>

      <DsSection title="Command palette" description="One keyboard-first search for pages, actions and records. ↑ ↓ move, Enter opens, Esc closes and returns focus. Results are grouped, and the empty state suggests what to type.">
        <DsPreview label="CommandPalette" className="flex-col items-start gap-2">
          <CommandPaletteDemo />
        </DsPreview>
      </DsSection>

      <DsSection title="Guidance">
        <DsDoDont
          items={[
            {
              do: { example: <p className="rounded-pill bg-accent-soft px-4 py-2 text-label text-accent-soft-fg">Orders · 15</p>, text: "mark the current page with the soft accent and show counts only for work waiting on the user." },
              dont: { example: <p className="rounded-pill bg-accent px-4 py-2 text-label text-fg-on-accent">Orders</p>, text: "fill the current nav item with solid blue — the page's primary action is the only solid blue on screen." },
            },
          ]}
        />
      </DsSection>

      <DsSection title="Props">
        <DsProps
          component="AdminShell · SidebarNav · PageHeader · CommandPalette"
          rows={[
            { name: "nav · workspace · actions · commandPalette · demo", type: "AdminShell", description: "Sidebar state persists in localStorage (ds-admin-sidebar); binds Ctrl/⌘ K." },
            { name: "groups · collapsed · onNavigate", type: "SidebarNav", description: "Items: href, label, icon, count, exact." },
            { name: "title · description · breadcrumbs · meta · actions · children", type: "PageHeader", description: "Server-safe." },
            { name: "items · placeholder", type: "CommandPalette", description: "Items: id, label, group, hint, icon, href | onSelect, keywords. Open with openCommandPalette()." },
          ]}
        />
      </DsSection>
    </>
  );
}
