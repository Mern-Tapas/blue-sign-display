import { useEffect, useRef } from "react";
import { ImportCsvDialog } from "@bluesigns/ui";

/** ImportCsvDialog owns its open state; the preview opens it by pressing its "Import CSV" trigger. */
export const Open = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.click();
  }, []);
  return (
    <div ref={ref}>
      <ImportCsvDialog />
    </div>
  );
};
