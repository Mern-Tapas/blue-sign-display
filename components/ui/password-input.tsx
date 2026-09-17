"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/cn";
import { Input, type InputProps } from "./input";

export type PasswordInputProps = Omit<InputProps, "type" | "endSlot"> & {
  /** Show the lock icon at the start. */
  showIcon?: boolean;
  /** Controlled visibility. */
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
};

/**
 * Password field with a show / hide toggle. Defaults to `autoComplete="current-password"`;
 * pass `"new-password"` on sign-up and reset forms so password managers offer to generate one.
 */
export function PasswordInput({
  showIcon = true,
  visible: visibleProp,
  onVisibleChange,
  autoComplete = "current-password",
  startSlot,
  disabled,
  ...props
}: PasswordInputProps) {
  const [visibleState, setVisibleState] = useState(false);
  const visible = visibleProp ?? visibleState;

  function toggle() {
    const next = !visible;
    if (visibleProp === undefined) setVisibleState(next);
    onVisibleChange?.(next);
  }

  return (
    <Input
      type={visible ? "text" : "password"}
      autoComplete={autoComplete}
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      disabled={disabled}
      startSlot={startSlot ?? (showIcon ? <Lock aria-hidden /> : undefined)}
      endSlot={
        <button
          type="button"
          data-slot="password-toggle"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          disabled={disabled}
          onClick={toggle}
          className={cn(
            "state-layer hit-area relative -mr-1.5 flex size-control-xs shrink-0 items-center justify-center rounded-pill text-fg-muted",
            "transition-colors duration-(--dur-fast) hover:text-fg disabled:pointer-events-none",
          )}
        >
          {visible ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
        </button>
      }
      {...props}
    />
  );
}
