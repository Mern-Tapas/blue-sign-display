import type { Metadata } from "next";
import { DsDoDont } from "@/components/docs/ds-foundations";
import { DsPageHeader, DsSection } from "@/components/docs/ds-section";

export const metadata: Metadata = { title: "Motion" };

const durations = [
  ["--dur-instant", "100ms", "Menu highlight, state layer on dense UI"],
  ["--dur-fast", "160ms", "Hover, press, exits — and the default for any transition"],
  ["--dur-base", "220ms", "Popovers, menus, enters, card lift"],
  ["--dur-slow", "320ms", "Sheets, drawers, progress fills"],
];

const easings = [
  ["--ease-out", "cubic-bezier(.23, 1, .32, 1)", "Enter, hover, press — default for all transitions"],
  ["--ease-in-out", "cubic-bezier(.77, 0, .175, 1)", "Movement of something already on screen"],
  ["--ease-drawer", "cubic-bezier(.32, .72, 0, 1)", "Sheets and drawers"],
];

const animations = [
  ["animate-fade-in / out", "Overlays, tab panels"],
  ["animate-scale-in / out", "Dialogs, popovers, selects"],
  ["animate-slide-in-{right,left,bottom}", "Sheets, toasts"],
  ["animate-slide-up", "Inline reveals"],
  ["animate-accordion-down / up", "Accordion content"],
  ["animate-shimmer", "Skeletons (stops under reduced motion)"],
  ["animate-caret-blink", "OTP caret (stops under reduced motion)"],
];

export default function MotionPage() {
  return (
    <>
      <DsPageHeader
        title="Motion"
        muted="that confirms"
        description="Short and decelerating. Motion confirms what just happened — an item added, a sheet opening — and never decorates. Exits are faster than enters, and there is no ease-in for UI."
      />

      <DsSection title="Durations">
        <div className="overflow-hidden rounded-2xl bg-surface shadow-flat">
          <table className="w-full text-left text-body">
            <thead className="bg-surface-sunken text-overline text-fg-muted">
              <tr>
                <th scope="col" className="px-5 py-2.5">Token</th>
                <th scope="col" className="px-5 py-2.5">Value</th>
                <th scope="col" className="px-5 py-2.5">Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {durations.map(([t, v, u]) => (
                <tr key={t}>
                  <td className="px-5 py-3 font-mono text-caption">{t}</td>
                  <td className="px-5 py-3 figures">{v}</td>
                  <td className="px-5 py-3 text-fg-muted">{u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-caption text-fg-muted">
          Write <code className="font-mono">duration-(--dur-fast)</code>. A bare <code className="font-mono">transition-colors</code> already uses 160ms with --ease-out.
        </p>
      </DsSection>

      <DsSection title="Easing" description="Hover a card to preview the curve.">
        <div className="grid gap-4 md:grid-cols-3">
          {easings.map(([name, value, use]) => (
            <div key={name} className="group rounded-2xl bg-surface p-5 shadow-flat">
              <div className="@container h-10 rounded-pill bg-surface-sunken p-1">
                <div
                  className="size-8 rounded-pill bg-accent transition-transform duration-(--dur-slow) group-hover:translate-x-[calc(100cqw-3rem)]"
                  style={{ transitionTimingFunction: `var(${name})` }}
                />
              </div>
              <p className="mt-3 font-mono text-caption">{name}</p>
              <p className="text-caption text-fg-muted">
                {value} · {use}
              </p>
            </div>
          ))}
        </div>
      </DsSection>

      <DsSection title="Animations">
        <div className="overflow-hidden rounded-2xl bg-surface shadow-flat">
          <ul className="divide-y divide-border-subtle">
            {animations.map(([name, use]) => (
              <li key={name} className="flex flex-col gap-0.5 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <code className="font-mono text-caption">{name}</code>
                <span className="text-body text-fg-muted">{use}</span>
              </li>
            ))}
          </ul>
        </div>
      </DsSection>

      <DsSection
        title="Reduced motion"
        description="Gentler, not zero. Keyframes read --motion-travel and --motion-scale-from, so slides and pops become fades; loops stop; press and lift drop their transforms; spinners slow to 1.6s but keep turning because they communicate progress."
      >
        <DsDoDont
          items={[
            {
              do: {
                example: <span className="rounded-pill bg-surface px-4 py-2 text-label shadow-popover motion-safe:animate-slide-up">Added to bag</span>,
                text: "animate confirmation of a user action with the shared keyframes so reduced motion is handled for you.",
              },
              dont: {
                example: <span className="rounded-pill bg-accent px-4 py-2 text-label text-fg-on-accent">✨ New in ✨</span>,
                text: "add looping or decorative motion to draw attention to merchandising.",
              },
            },
          ]}
        />
      </DsSection>
    </>
  );
}
