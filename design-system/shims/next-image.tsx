// Stand-in for next/image outside a Next.js app: a plain <img> that honours `fill`.
import * as React from "react";

type StaticImage = { src: string; width?: number; height?: number };

export type ImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height"> & {
  src: string | StaticImage;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  priority?: boolean;
  quality?: number | `${number}`;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
  loader?: unknown;
  overrideSrc?: string;
};

const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(
  { src, width, height, fill, priority, quality: _q, placeholder: _p, blurDataURL: _b, unoptimized: _u, loader: _l, overrideSrc: _o, style, loading, ...rest },
  ref,
) {
  const s = typeof src === "string" ? src : src.src;
  const w = width ?? (typeof src === "string" ? undefined : src.width);
  const h = height ?? (typeof src === "string" ? undefined : src.height);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={s}
      width={fill ? undefined : w}
      height={fill ? undefined : h}
      loading={loading ?? (priority ? "eager" : "lazy")}
      decoding="async"
      style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : style}
      {...rest}
    />
  );
});

export default Image;
