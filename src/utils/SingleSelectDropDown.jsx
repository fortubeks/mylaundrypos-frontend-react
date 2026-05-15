import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { createPortal } from "react-dom";
import { useDropdownPos } from "./useDropdownPos";

export const SingleSelectDropDown = ({ items, setSelected, selected }) => {
  const [open, setOpen] = useState(false);
  const { triggerRef, listRef, pos } = useDropdownPos(open, () =>
    setOpen(false),
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-10 font-medium">
        <div
          ref={triggerRef}
          onClick={() => setOpen(!open)}
          className={`rounded-xl bg-[#F6F6F6] h-10 px-5 flex justify-between items-center cursor-pointer ${
            !selected && "text-[#212121]"
          }`}
        >
          {selected ? (
            <span className="truncate">{selected}</span>
          ) : (
            <span className="text-[#929292]">Choose an option</span>
          )}
          <FaCaretDown className={`${open ? "rotate-180" : ""} text-xl`} />
        </div>

        {open &&
          createPortal(
            <>
              <div
                className="fixed inset-0 z-[9999998]"
                onClick={() => setOpen(false)}
              />
              <div
                ref={listRef}
                className="bg-white shadow-[0px_4px_12px_0px_rgba(18,18,18,0.15)] px-3 py-2 flex flex-col gap-3 rounded-xl overflow-y-auto z-[9999999] max-h-[240px]"
                style={{
                  position: "fixed",
                  top: pos.top,
                  left: pos.left,
                  width: pos.width,
                }}
              >
                <li
                  className="px-2 py-1 text-sm cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    setSelected("");
                    setOpen(false);
                  }}
                >
                  <span
                    className={`border rounded-[50%] flex justify-center items-center p-1 ${
                      selected === ""
                        ? "border-secondary"
                        : "border-dashed border-[#939393]"
                    }`}
                  >
                    <span
                      className={`rounded-[50%] flex h-3 w-3 ${
                        selected === "" ? "bg-secondary" : ""
                      }`}
                    />
                  </span>
                  Select option
                </li>
                {items.map((item, index) => (
                  <li
                    key={index}
                    className="px-2 py-1 text-sm cursor-pointer flex items-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelected(item);
                      setOpen(false);
                    }}
                  >
                    <span
                      className={`border rounded-[50%] flex justify-center items-center p-1 ${
                        selected === item
                          ? "border-secondary"
                          : "border-dashed border-[#939393]"
                      }`}
                    >
                      <div
                        className={`rounded-[50%] flex h-3 w-3 ${
                          selected === item ? "bg-secondary" : ""
                        }`}
                      />
                    </span>
                    {item}
                  </li>
                ))}
              </div>
            </>,
            document.body,
          )}
      </div>
    </div>
  );
};
