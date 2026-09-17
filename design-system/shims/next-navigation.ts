// Stand-in for next/navigation outside a Next.js app: a fixed "/" route and no-op router.
const router = {
  push: (_href: string) => {},
  replace: (_href: string) => {},
  prefetch: (_href: string) => {},
  back: () => {},
  forward: () => {},
  refresh: () => {},
};

export function useRouter() {
  return router;
}

export function usePathname() {
  return "/";
}

export function useSearchParams() {
  return new URLSearchParams();
}

export function useParams<T extends Record<string, string | string[]>>() {
  return {} as T;
}

export function useSelectedLayoutSegment() {
  return null;
}

export function useSelectedLayoutSegments(): string[] {
  return [];
}

export function redirect(_href: string): never {
  throw new Error("redirect() is not available outside the Next.js app");
}

export function notFound(): never {
  throw new Error("notFound() is not available outside the Next.js app");
}
