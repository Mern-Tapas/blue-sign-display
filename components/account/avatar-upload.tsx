"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";

export type AvatarUploadProps = {
  name: string;
  src?: string;
  /** Receives the new file, or null when removed. Throw to show an error. */
  onChange: (file: File | null) => Promise<void> | void;
  maxSizeMb?: number;
  className?: string;
};

/**
 * Profile photo with a camera button: choose a JPG/PNG/WebP up to the size limit, preview it
 * immediately, or remove the photo to fall back to initials. Errors are announced.
 */
export function AvatarUpload({ name, src, onChange, maxSizeMb = 4, className }: AvatarUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null | undefined>(undefined);
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const urlRef = useRef<string | null>(null);

  useEffect(() => () => void (urlRef.current && URL.revokeObjectURL(urlRef.current)), []);

  const shown = preview === undefined ? src : (preview ?? undefined);

  async function pick(file: File) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return setError("Choose a JPG, PNG or WebP image");
    if (file.size > maxSizeMb * 1024 * 1024) return setError(`Choose an image under ${maxSizeMb} MB`);
    setError(undefined);
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = URL.createObjectURL(file);
    setPreview(urlRef.current);
    setBusy(true);
    try {
      await onChange(file);
    } catch {
      setError("Couldn’t upload the photo. Try again.");
      setPreview(undefined);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div data-slot="avatar-upload" className={cn("relative flex w-fit flex-col items-center gap-2", className)}>
      <div className={cn("relative rounded-pill", busy && "opacity-70")}>
        <Avatar name={name} src={shown} size="xl" className="size-20 text-heading-sm" />
        <input
          ref={inputRef}
          id={`${id}-file`}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void pick(f);
            e.target.value = "";
          }}
        />
        {shown ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="neutral" aria-label="Change profile photo" className="absolute -right-1 -bottom-1 size-control-sm rounded-pill px-0 ring-2 ring-surface">
                <Camera aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => inputRef.current?.click()}>
                <Camera aria-hidden /> Upload new photo
              </DropdownMenuItem>
              <DropdownMenuItem
                destructive
                onSelect={async () => {
                  setPreview(null);
                  await onChange(null);
                }}
              >
                <Trash2 aria-hidden /> Remove photo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button size="sm" variant="neutral" aria-label="Add profile photo" onClick={() => inputRef.current?.click()} className="absolute -right-1 -bottom-1 size-control-sm rounded-pill px-0 ring-2 ring-surface">
            <Camera aria-hidden />
          </Button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="max-w-40 text-center text-caption text-danger-fg">
          {error}
        </p>
      )}
    </div>
  );
}
