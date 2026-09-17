"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Inset } from "@/components/ui/inset";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { openConsentSettings, useConsent } from "@/components/support/cookie-consent";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Retry fails once, then succeeds, to show the busy state and recovery. */
export function ErrorStateDemo() {
  const [attempts, setAttempts] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [kind, setKind] = useState<"generic" | "network">("generic");

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <SegmentedControl
        aria-label="Error kind"
        size="sm"
        value={kind}
        onValueChange={(v: string) => {
          setKind(v as "generic" | "network");
          setLoaded(false);
          setAttempts(0);
        }}
        options={[
          { value: "generic", label: "Generic" },
          { value: "network", label: "Network" },
        ]}
      />
      {loaded ? (
        <Inset tone="success" role="status" className="flex flex-col items-center gap-2 px-6 py-8">
          <p className="text-body-strong">Loaded on attempt {attempts}</p>
          <Button size="sm" variant="secondary" onClick={() => { setLoaded(false); setAttempts(0); }}>
            Reset preview
          </Button>
        </Inset>
      ) : (
        <ErrorState
          kind={kind}
          size="inline"
          className="w-full max-w-md"
          onRetry={async () => {
            await wait(800);
            const n = attempts + 1;
            setAttempts(n);
            if (n >= 2) setLoaded(true);
          }}
        />
      )}
      {!loaded && attempts === 1 && <p className="text-caption text-fg-muted">Still failing: the next retry succeeds.</p>}
    </div>
  );
}

export function ConsentReadout() {
  const consent = useConsent();
  const on = Object.entries(consent.purposes).filter(([, v]) => v).map(([k]) => k);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-body text-fg-muted" aria-live="polite">
        Saved on this device: {consent.decided ? (on.length ? `essential + ${on.join(", ")}` : "essential only") : "no choice yet (optional cookies off)"}
      </p>
      <Button size="sm" variant="secondary" onClick={openConsentSettings}>
        Cookie settings
      </Button>
    </div>
  );
}
