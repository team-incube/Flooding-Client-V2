"use client";

import { createPortal } from "react-dom";
import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import Exclamation from "@/shared/asset/svg/Exclamation";

type TooltipPlacement = "top" | "bottom";

interface NoteTooltipProps {
  notes: string[];
  ariaLabel?: string;
}

const arrowPlacementStyles = {
  top: "-bottom-1.5",
  bottom: "-top-1.5",
};

const TOOLTIP_GAP = 10;

export function NoteTooltip({
  notes,
  ariaLabel = "안내 보기",
}: NoteTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<TooltipPlacement>("top");
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties>({});
  const [arrowLeft, setArrowLeft] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const {
        top,
        bottom,
        left: buttonLeft,
        width,
      } = buttonRef.current.getBoundingClientRect();

      const card = buttonRef.current.closest("[data-tooltip-card]");
      const cardLeft = card ? card.getBoundingClientRect().left : buttonLeft;

      setArrowLeft(buttonLeft - cardLeft + width / 2);

      if (top < 110) {
        setPlacement("bottom");
        setTooltipStyle({ left: cardLeft, top: bottom + TOOLTIP_GAP });
      } else {
        setPlacement("top");
        setTooltipStyle({
          left: cardLeft,
          bottom: window.innerHeight - top + TOOLTIP_GAP,
        });
      }
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="inline-flex shrink-0 sm:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="bg-sub-3 flex size-4.5 cursor-pointer items-center justify-center rounded-full"
        aria-label={ariaLabel}
        aria-expanded={isOpen}
      >
        <Exclamation size={10} />
      </button>
      {isOpen &&
        createPortal(
          <>
            <div
              className="bg-main-text fixed z-[200] flex w-max max-w-[calc(100vw-40px)] flex-col gap-0.5 rounded-xl px-4 py-2"
              style={tooltipStyle}
            >
              {notes.map((note) => (
                <p key={note} className="text-sub-4 text-caption-2">
                  {note.replace(/^※ /, "")}
                </p>
              ))}
              <div
                className={`bg-main-text absolute size-3 -translate-x-1/2 rotate-45 ${arrowPlacementStyles[placement]}`}
                style={{ left: arrowLeft }}
              />
            </div>
            <div
              className="fixed inset-0 z-[199]"
              onClick={() => setIsOpen(false)}
            />
          </>,
          document.body,
        )}
    </div>
  );
}
