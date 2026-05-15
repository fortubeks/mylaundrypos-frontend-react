import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { ErrorMessage } from "./Input";
import { createPortal } from "react-dom";
import { useDropdownPos } from "./useDropdownPos";

export default function DropDown({
  items,
  setSelected,
  selected,
  placeholder,
  slide = true,
  error = false,
  showErrors = false,
}) {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { triggerRef, listRef, pos } = useDropdownPos(open, () =>
    setOpen(false),
  );

  const hasValue = selected && selected.length > 0;
  const showLabel = hasValue;

  return (
    <div className="w-full text-sm relative">
      <div
        ref={triggerRef}
        onClick={() => {
          setOpen(!open);
          setIsFocused(!isFocused);
        }}
        tabIndex={0}
        className="rounded-lg bg-[#F6F6F6] h-10 px-4 flex gap-1 justify-between items-center cursor-pointer text-sm w-full"
      >
        <div className="flex-1 relative w-full">
          <label
            className={`absolute left-0 px-1 text-sm font-medium transition-all duration-200 pointer-events-none ${
              showLabel
                ? `top-0 -translate-y-4 -translate-x-3 bg-card px-1 text-xs text-[#959595] bg-white/80 ${
                    !slide && "hidden"
                  }`
                : "top-1/2 -translate-y-1/2 text-muted-foreground text-[#959595]"
            }`}
          >
            {placeholder}
          </label>
          <span className="flex gap-2 items-center w-full">
            {selected && (
              <span className="text-[#201B1D] w-full truncate">{selected}</span>
            )}
          </span>
        </div>
        <FaCaretDown className={open ? "rotate-180" : ""} />
      </div>

      {open &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[9999998]"
              onClick={() => setOpen(false)}
            />
            <ul
              ref={listRef}
              className="bg-white shadow-[0px_4px_12px_0px_rgba(18,18,18,0.15)] px-4 py-4 flex flex-col gap-3 rounded-xl overflow-y-auto z-[9999999] max-h-[240px]"
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                width: pos.width,
              }}
            >
              <li
                className="text-sm cursor-pointer flex items-center gap-2 hover:text-primary"
                onClick={() => {
                  setSelected("");
                  setOpen(false);
                }}
              >
                {placeholder}
              </li>
              {items?.map((item, i) => (
                <li
                  key={i}
                  className="text-sm cursor-pointer flex items-center gap-2 hover:text-primary"
                  onClick={() => {
                    setSelected(item);
                    setOpen(false);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </>,
          document.body,
        )}

      <div className="min-h-1">
        {((isFocused && error) || (showErrors && error)) && (
          <ErrorMessage message={error} />
        )}
      </div>
    </div>
  );
}
