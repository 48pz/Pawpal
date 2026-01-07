import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import UserHoverCard from "./UserHoverCard";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const UserHoverPopover = ({ open, x, y, userId, onClose }) => {
  const CARD_W = 256;
  const CARD_H = 220;

  const pos = useMemo(() => {
    const padding = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left = x + 12;
    let top = y + 12;

    left = clamp(left, padding, vw - CARD_W - padding);
    top = clamp(top, padding, vh - CARD_H - padding);

    return { left, top };
  }, [x, y]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !userId) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[999] bg-transparent" onClick={onClose} />
      <div
        className="fixed z-[1000]"
        style={{ left: pos.left, top: pos.top }}
        onClick={(e) => e.stopPropagation()}
      >
        <UserHoverCard userId={userId} />
      </div>
    </>,
    document.body
  );
};

export default UserHoverPopover;
