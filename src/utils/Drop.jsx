import { useRef, useState } from "react";
import {
  useDropdownPosition,
  // useOnHoverOutside,
  usePortal,
} from "./DropFunctions";

export default function Drop({ Main, Dropdown }) {
  const [open, setOpen] = useState(false);
c
  return (
    <div
      ref={triggerRef}
      className="w-fit h-fit relative"
      onClick={() => setOpen((prev) => !prev)}
    >
      <Main />
      {open && (
        <Portal>
          <div
            ref={dropdownRef}
            className="absolute z-[999999999] transition-all"
            style={{
              position: "absolute",
              top: style.top,
              left: style.left,
              minWidth: 200, // Optional: match trigger or fixed width
            }}
          >
            <Dropdown />
          </div>
        </Portal>
      )}
    </div>
  );
}
