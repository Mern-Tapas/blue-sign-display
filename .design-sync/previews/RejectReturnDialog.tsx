import { useEffect, useRef } from "react";
import { RejectReturnDialog, sampleData, toast } from "@bluesigns/ui";

const { adminReturns } = sampleData;

const request = adminReturns.find((r) => r.status === "requested")!;

/** The dialog owns its open state behind its Reject trigger; this preview presses the trigger once so the dialog shows. */
function OpenOnMount({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.click();
  }, []);
  return <div ref={ref}>{children}</div>;
}

export const Open = () => (
  <OpenOnMount>
    <RejectReturnDialog
      returnId={request.id}
      customerName={request.customerName}
      onReject={(reason) => toast({ title: `Return ${request.id} rejected`, description: reason, tone: "neutral" })}
    />
  </OpenOnMount>
);

export const Trigger = () => (
  <div className="flex items-center gap-2 rounded-lg bg-surface-sunken p-3" style={{ width: 380 }}>
    <span className="flex-1 text-body-strong">Return {request.id}</span>
    <RejectReturnDialog returnId={request.id} customerName={request.customerName} onReject={() => {}} />
  </div>
);
