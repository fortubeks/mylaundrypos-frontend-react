import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function useOnHoverOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mouseover", listener);
    return () => {
      document.removeEventListener("mouseout", listener);
    };
  }, [ref, handler]);
}

export const usePortal = () => {
  const [mounted, setMounted] = useState(false);
  const elRef = useRef(null);

  if (!elRef.current) {
    elRef.current = document.createElement("div");
    elRef.current.className = "dropdown-portal";
  }

  useEffect(() => {
    document.body.appendChild(elRef.current);
    setMounted(true);
    return () => {
      document.body.removeChild(elRef.current);
    };
  }, []);

  const Portal = ({ children }) =>
    mounted ? createPortal(children, elRef.current) : null;

  return Portal;
};

export function useDropdownPosition({ open, triggerRef, dropdownRef }) {
  const [style, setStyle] = useState({
    top: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    if (open && triggerRef.current && dropdownRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top;
      let left;

      const enoughSpaceBelow =
        viewportHeight - triggerRect.bottom >= dropdownRect.height;
      const enoughSpaceAbove = triggerRect.top >= dropdownRect.height;

      if (enoughSpaceBelow) {
        top = triggerRect.bottom + window.scrollY;
      } else if (enoughSpaceAbove) {
        top = triggerRect.top - dropdownRect.height + window.scrollY;
      } else {
        top =
          Math.min(viewportHeight - dropdownRect.height, triggerRect.bottom) +
          window.scrollY;
      }

      const enoughSpaceRight =
        viewportWidth - triggerRect.left >= dropdownRect.width;
      const overflowRight =
        triggerRect.left + dropdownRect.width > viewportWidth;

      if (enoughSpaceRight) {
        left = triggerRect.left + window.scrollX;
      } else if (overflowRight && triggerRect.right - dropdownRect.width > 0) {
        left = triggerRect.right - dropdownRect.width + window.scrollX;
      } else {
        left = Math.max(0, viewportWidth - dropdownRect.width) + window.scrollX;
      }

      setStyle({ top, left });
    }
  }, [open, triggerRef, dropdownRef]);

  return style;
}
