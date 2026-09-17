"use client";

import { useEffect, useId, useRef, useState } from "react";
import { FileText, ImagePlus, Upload, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useFieldControl } from "./field";

export type UploadItem = {
  id: string;
  file: File;
  /** Object URL for image previews. */
  url?: string;
  /**
   * Set by whoever is doing the uploading. Absent means "nothing is in flight", which is
   * how every existing caller behaves.
   */
  status?: "pending" | "uploading" | "done" | "error";
  /** 0–100 while uploading. */
  progress?: number;
  /** Why it failed, shown on the row. */
  error?: string;
};

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function accepts(file: File, accept?: string) {
  if (!accept) return true;
  return accept.split(",").some((raw) => {
    const rule = raw.trim().toLowerCase();
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
}

export type FileUploadProps = {
  /** Same syntax as the native attribute: "image/*,.pdf". */
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  /** Bytes per file. */
  maxSize?: number;
  value?: UploadItem[];
  defaultValue?: UploadItem[];
  onValueChange?: (items: UploadItem[]) => void;
  /** Dropzone (default) or a compact button for tight spaces. */
  variant?: "dropzone" | "button";
  /** Image grid thumbnails or file rows. */
  layout?: "grid" | "list";
  title?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  name?: string;
  className?: string;
};

/**
 * Drag-and-drop or tap-to-pick uploader. The real file input stays in the tab order (the
 * visible zone is its label), rejected files are explained in an alert, and object URLs for
 * previews are created in the handler and revoked on remove / unmount.
 */
export function FileUpload({
  accept,
  multiple = true,
  maxFiles = multiple ? 5 : 1,
  maxSize = 5 * 1024 * 1024,
  value: valueProp,
  defaultValue = [],
  onValueChange,
  variant = "dropzone",
  layout = "grid",
  title,
  description,
  disabled = false,
  id,
  name,
  className,
}: FileUploadProps) {
  const uid = useId();
  const control = useFieldControl({ id });
  const inputId = control.id ?? `upload-${uid}`;
  const errorId = `${inputId}-rejections`;
  const [itemsState, setItemsState] = useState<UploadItem[]>(defaultValue);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const items = valueProp ?? itemsState;
  const urls = useRef(new Set<string>());

  useEffect(() => {
    const created = urls.current;
    return () => created.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const isImage = (f: File) => f.type.startsWith("image/");
  const full = items.length >= maxFiles;

  function commit(next: UploadItem[]) {
    if (valueProp === undefined) setItemsState(next);
    onValueChange?.(next);
  }

  function add(list: FileList | File[]) {
    const incoming = Array.from(list);
    const rejected: string[] = [];
    const accepted: UploadItem[] = [];
    let room = maxFiles - items.length;
    for (const file of incoming) {
      if (!accepts(file, accept)) rejected.push(`${file.name} isn’t a supported file type.`);
      else if (file.size > maxSize) rejected.push(`${file.name} is larger than ${formatFileSize(maxSize)}.`);
      else if (room <= 0) rejected.push(`${file.name} wasn’t added — you can upload up to ${maxFiles}.`);
      else {
        const url = isImage(file) ? URL.createObjectURL(file) : undefined;
        if (url) urls.current.add(url);
        accepted.push({ id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`, file, url });
        room -= 1;
      }
    }
    setErrors(rejected);
    if (accepted.length) commit(multiple ? [...items, ...accepted] : accepted.slice(0, 1));
  }

  function remove(item: UploadItem) {
    if (item.url) {
      URL.revokeObjectURL(item.url);
      urls.current.delete(item.url);
    }
    setErrors([]);
    commit(items.filter((i) => i.id !== item.id));
  }

  const describedBy = [control["aria-describedby"], errors.length ? errorId : undefined].filter(Boolean).join(" ") || undefined;

  const input = (
    <input
      id={inputId}
      name={name}
      type="file"
      accept={accept}
      multiple={multiple}
      disabled={disabled || full}
      aria-describedby={describedBy}
      aria-invalid={control["aria-invalid"]}
      onChange={(e) => {
        if (e.target.files) add(e.target.files);
        e.target.value = "";
      }}
      className="peer sr-only"
    />
  );

  const dropHandlers = {
    onDragOver: (e: React.DragEvent) => {
      if (disabled || full) return;
      e.preventDefault();
      if (!dragging) setDragging(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (!disabled && !full) add(e.dataTransfer.files);
    },
  };

  const hint = description ?? `${accept?.includes("image") ? "JPG, PNG or WebP" : "Any file"} · up to ${formatFileSize(maxSize)}${multiple ? ` · max ${maxFiles}` : ""}`;

  return (
    <div data-slot="file-upload" className={cn("flex flex-col gap-3", className)}>
      {variant === "dropzone" ? (
        <div {...dropHandlers} className="relative">
          {input}
          <label
            htmlFor={inputId}
            data-dragging={dragging || undefined}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-sunken px-6 py-8 text-center",
              "transition-[border-color,background-color] duration-(--dur-fast) ease-out hover:border-accent",
              "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring",
              "data-dragging:border-accent data-dragging:bg-accent-soft",
              control["aria-invalid"] && "border-danger",
              (disabled || full) && "cursor-not-allowed border-transparent bg-disabled text-disabled-fg hover:border-transparent",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "flex size-11 items-center justify-center rounded-pill bg-surface text-accent-fg shadow-xs [&_svg]:size-icon-lg",
                (disabled || full) && "text-disabled-fg",
              )}
            >
              {accept?.includes("image") ? <ImagePlus /> : <Upload />}
            </span>
            <span className="text-body font-medium">
              {full ? `Maximum ${maxFiles} ${maxFiles === 1 ? "file" : "files"} added` : (title ?? (
                <>
                  <span className="text-accent-fg">Choose {multiple ? "files" : "a file"}</span>
                  <span className="pointer-coarse:hidden"> or drag here</span>
                </>
              ))}
            </span>
            <span className="text-caption text-fg-muted">{hint}</span>
          </label>
        </div>
      ) : (
        <div {...dropHandlers} className="flex flex-wrap items-center gap-3">
          {input}
          <label
            htmlFor={inputId}
            className={cn(
              "press state-layer relative inline-flex h-control-sm cursor-pointer items-center gap-2 rounded-pill border border-border bg-surface px-3.5 text-label font-medium text-fg",
              "transition-[border-color,transform] duration-(--dur-fast) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus-ring [&_svg]:size-icon-sm",
              (disabled || full) && "cursor-not-allowed border-transparent bg-disabled text-disabled-fg",
            )}
          >
            <Upload aria-hidden />
            {title ?? (multiple ? "Add files" : "Add file")}
          </label>
          <span className="text-caption text-fg-muted">{hint}</span>
        </div>
      )}

      {errors.length > 0 && (
        <ul id={errorId} role="alert" className="flex flex-col gap-1 text-caption text-danger-fg">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {items.length > 0 &&
        (layout === "grid" ? (
          <ul aria-label="Selected files" className="flex flex-wrap gap-2">
            {items.map((item) => (
              <li key={item.id} className={cn("group/thumb relative size-20 overflow-hidden rounded-md bg-surface-sunken", item.status === "error" && "ring-2 ring-danger")}>
                {item.url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                  <img src={item.url} alt={item.file.name} className="size-full object-cover" />
                ) : (
                  <span className="flex size-full flex-col items-center justify-center gap-1 p-2 text-center text-caption text-fg-muted">
                    <FileText aria-hidden className="size-icon-lg" />
                    <span className="line-clamp-1 w-full break-all">{item.file.name}</span>
                  </span>
                )}
                <button
                  type="button"
                  aria-label={`Remove ${item.file.name}`}
                  onClick={() => remove(item)}
                  className="hit-area absolute top-1 right-1 flex size-6 items-center justify-center rounded-pill bg-scrim text-white transition-colors duration-(--dur-fast) hover:bg-black"
                >
                  <X aria-hidden className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <ul aria-label="Selected files" className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 rounded-md bg-surface-sunken p-2 pr-3">
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-surface text-fg-muted">
                  {item.url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                    <img src={item.url} alt="" className="size-full object-cover" />
                  ) : (
                    <FileText aria-hidden className="size-icon-md" />
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-body text-fg">{item.file.name}</span>
                  {item.status === "error" ? (
                    <span className="text-caption text-danger-fg">{item.error ?? "Upload failed"}</span>
                  ) : item.status === "uploading" ? (
                    <span className="flex items-center gap-2">
                      <span
                        role="progressbar"
                        aria-label={`Uploading ${item.file.name}`}
                        aria-valuenow={Math.round(item.progress ?? 0)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="h-1 min-w-0 flex-1 overflow-hidden rounded-pill bg-surface"
                      >
                        <span className="block h-full rounded-pill bg-accent transition-[width] duration-(--dur-base)" style={{ width: `${Math.round(item.progress ?? 0)}%` }} />
                      </span>
                      <span className="text-caption text-fg-muted figures">{Math.round(item.progress ?? 0)}%</span>
                    </span>
                  ) : (
                    <span className="text-caption text-fg-muted figures">{formatFileSize(item.file.size)}</span>
                  )}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${item.file.name}`}
                  onClick={() => remove(item)}
                  className="state-layer hit-area relative flex size-control-xs items-center justify-center rounded-pill text-fg-muted hover:text-fg"
                >
                  <X aria-hidden className="size-icon-sm" />
                </button>
              </li>
            ))}
          </ul>
        ))}
      <p aria-live="polite" className="sr-only">
        {items.length} {items.length === 1 ? "file" : "files"} selected
      </p>
    </div>
  );
}
