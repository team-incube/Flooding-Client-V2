import type { ReactNode } from "react";
import { TextButton } from "@/shared/ui/Button/TextButton";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  titleVariant?: "primary" | "negative" | "default";
  description: ReactNode;
  confirmLabel: string;
  confirmVariant?: "filled" | "negative";
  cancelLabel?: string;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const titleVariantStyles = {
  primary: "text-p-1",
  negative: "text-negative",
  default: "text-main-text",
} as const;

export function ConfirmModal({
  open,
  title,
  titleVariant = "default",
  description,
  confirmLabel,
  confirmVariant = "filled",
  cancelLabel = "뒤로가기",
  isPending = false,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="bg-background/50 fixed inset-0 z-[100] flex items-center justify-center">
      <div className="bg-background-surface flex w-[90%] max-w-[448px] flex-col gap-3 rounded-2xl p-6">
        <span className={`font-bold ${titleVariantStyles[titleVariant]}`}>
          {title}
        </span>
        <div className="text-main-text">{description}</div>
        <div className="flex gap-2">
          <TextButton
            size="fit"
            variant="ghost"
            className="flex-1"
            onClick={onClose}
          >
            {cancelLabel}
          </TextButton>
          <TextButton
            size="fit"
            variant={isPending ? "disabled" : confirmVariant}
            className="flex-1"
            disabled={isPending}
            onClick={isPending ? undefined : onConfirm}
          >
            {confirmLabel}
          </TextButton>
        </div>
      </div>
    </div>
  );
}
