"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/cn";

export type ProductImageProps = Omit<ImageProps, "alt"> & { alt: string; wrapperClassName?: string };

/** next/image with a sunken-panel fallback when the source fails (offline, 404). */
export function ProductImage({ className, wrapperClassName, alt, fill = true, sizes, ...props }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("relative overflow-hidden bg-surface-sunken", wrapperClassName)}>
      {failed ? (
        <div role="img" aria-label={alt} className="flex size-full items-center justify-center text-fg-subtle">
          <ImageOff aria-hidden className="size-6" />
        </div>
      ) : (
        <Image
          alt={alt}
          fill={fill}
          sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
          className={cn("object-cover", className)}
          onError={() => setFailed(true)}
          {...props}
        />
      )}
    </div>
  );
}
