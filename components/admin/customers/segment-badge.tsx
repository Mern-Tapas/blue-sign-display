import { Badge } from "@/components/ui/badge";
import { segmentMeta, type CustomerSegment } from "./customer-data";

/** Customer segment in words; at-risk wears the warning tone so it stands out in a long list. */
export function SegmentBadge({ segment, size = "sm", className }: { segment: CustomerSegment; size?: "sm" | "md"; className?: string }) {
  const meta = segmentMeta[segment];
  return (
    <Badge tone={meta.tone} size={size} className={className}>
      {meta.label}
    </Badge>
  );
}
