import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { createPortal } from "react-dom";
import { useDropdownPos } from "./useDropdownPos";

export default function DropDown({
  items,
  setSelected,
  selected,
  placeholder,
  onSelect,
  icon = null,
}) {
  const [open, setOpen] = useState(false);
  const { triggerRef, listRef, pos } = useDropdownPos(open, () =>
    setOpen(false),
  );

  return (
    <div className="w-full text-sm relative">
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        tabIndex={0}
        className="rounded-xl bg-[#F6F6F6] w-full h-10 py-1 px-2 flex gap-1 justify-between items-center cursor-pointer"
      >
        {icon && <img src={icon} alt="" className="object-contain" />}
        {selected ? (
          selected
        ) : (
          <span className="text-[#9CA3AF]">{placeholder}</span>
        )}
        <FaCaretDown className={`ml-auto ${open ? "rotate-180" : ""}`} />
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
              className="bg-white shadow-[0px_4px_12px_0px_rgba(18,18,18,0.15)] py-2 flex flex-col rounded-xl overflow-y-auto z-[9999999] max-h-[240px]"
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                width: pos.width,
              }}
            >
              <li
                className="text-sm cursor-pointer flex items-center gap-2 hover:bg-[#F6F6F6] rounded-lg px-3 py-2"
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
                  className="text-sm cursor-pointer flex items-center gap-2 hover:bg-[#F6F6F6] rounded-lg px-3 py-2"
                  onClick={() => {
                    if (onSelect) {
                      onSelect(item);
                    } else {
                      setSelected(item);
                    }
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
    </div>
  );
}
