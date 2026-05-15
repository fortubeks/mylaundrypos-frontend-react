import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Calculates fixed-position coordinates for a floating dropdown list
 * so it escapes overflow:hidden/auto parent containers.
 *
 * Usage:
 *   const { triggerRef, pos, recalc } = useDropdownPos(open, () => setOpen(false));
 *   // Attach triggerRef to the trigger element
 *   // On the floating list use: style={{ position:"fixed", top:pos.top, left:pos.left, width:pos.width }}
 */
export function useDropdownPos(isOpen, onClose) {
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const recalc = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    // If dropdown would go off bottom of viewport, flip upward
    const spaceBelow = window.innerHeight - r.bottom;
    const maxListHeight = 240;
    const top =
      spaceBelow < maxListHeight && r.top > maxListHeight
        ? r.top - maxListHeight - 4
        : r.bottom + 4;
    setPos({ top, left: r.left, width: r.width });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    recalc();
    const close = (e) => {
      // Don't close when the user scrolls inside the dropdown list itself
      if (listRef.current && listRef.current.contains(e.target)) return;
      onClose?.();
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [isOpen, recalc, onClose]);

  return { triggerRef, listRef, pos, recalc };
}
