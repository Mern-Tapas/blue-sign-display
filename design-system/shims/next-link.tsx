// Stand-in for next/link outside a Next.js app: a plain anchor. In-app paths ("/shop")
// don't navigate, so a design or preview never loads a missing route.
import * as React from "react";

type Url = string | { pathname?: string | null; query?: Record<string, unknown>; hash?: string | null };

export type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: Url;
  prefetch?: boolean | null;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  legacyBehavior?: boolean;
  locale?: string | false;
};

function toHref(href: Url): string {
  if (typeof href === "string") return href;
  const query = href.query
    ? "?" + new URLSearchParams(Object.entries(href.query).map(([k, v]) => [k, String(v)])).toString()
    : "";
  return `${href.pathname ?? ""}${query}${href.hash ? `#${href.hash.replace(/^#/, "")}` : ""}`;
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, prefetch: _prefetch, replace: _replace, scroll: _scroll, shallow: _shallow, passHref: _passHref, legacyBehavior: _legacy, locale: _locale, onClick, ...rest },
  ref,
) {
  const url = toHref(href);
  return (
    <a
      ref={ref}
      href={url}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && url.startsWith("/")) e.preventDefault();
      }}
      {...rest}
    />
  );
});

export default Link;
