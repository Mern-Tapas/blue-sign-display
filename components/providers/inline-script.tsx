/**
 * Inline script that runs during HTML parsing (before paint) on hard loads.
 * On the client React would warn about rendering a <script>; switching the type to
 * text/plain there (per the Next.js "preventing flash" guide) keeps it inert and silent.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
