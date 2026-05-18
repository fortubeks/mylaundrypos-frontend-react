import { useEffect, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { ErrorMessage } from "./Input";
import { createPortal } from "react-dom";
import { useDropdownPos } from "./useDropdownPos";

export const SelectDropDownImage = ({
  items,
  setSelected,
  selected,
  placeholder,
  slide = true,
  direction = true,
  // icon,
  width = 1.3,
  empty = "No items found",
  error = false,
  showErrors = false,
  onSearch,
}) => {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { triggerRef, listRef, pos } = useDropdownPos(open, () => {
    setOpen(false);
    setSearchTerm("");
  });

  useEffect(() => {
    if (onSearch) onSearch(searchTerm);
  }, [searchTerm]);

  const hasValue = selected && Object.keys(selected).length > 0;
  const showLabel = hasValue;

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full h-10 font-medium">
        <div
          ref={triggerRef}
          onClick={() => {
            setOpen(!open);
            setIsFocused(!isFocused);
          }}
          className="rounded-lg bg-[#F6F6F6] h-10 px-4 flex gap-1 justify-between items-center cursor-pointer text-sm text-[#959595] w-full"
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
                <span className="text-[#201B1D] w-full truncate">
                  {selected?.name}
                </span>
              )}
            </span>
          </div>
          <FaCaretDown className="text-lg" />
        </div>
        <div className="min-h-1">
          {((isFocused && error) || (showErrors && error)) && (
            <ErrorMessage message={error} />
          )}
        </div>
      </div>

      {open &&
        createPortal(
          <>
            {/* backdrop */}
            <div
              className="fixed inset-0 z-[9999998]"
              onClick={() => {
                setOpen(false);
                setSearchTerm("");
              }}
            />
            {/* floating list */}
            <div
              ref={listRef}
              className="bg-white shadow-[0px_4px_12px_0px_rgba(18,18,18,0.15)] px-2 py-3 flex flex-col gap-1 rounded-xl overflow-y-auto z-[9999999] max-h-56"
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                width: pos.width,
              }}
            >
              <input
                type="text"
                className="mb-1 rounded-md min-h-8 h-8 w-full bg-gray-100 text-[#201B1D] px-2 text-sm focus:outline-none"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {filteredItems.length === 0 && (
                <span className="p-2 text-sm text-gray-400">{empty}</span>
              )}
              {filteredItems.map((item, index) => (
                <li
                  key={index}
                  className="px-3 py-2 text-sm cursor-pointer text-[#201B1D] flex items-center gap-2 hover:bg-[#F6F6F6] rounded-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelected(item);
                    setOpen(false);
                    setIsFocused(false);
                    setSearchTerm("");
                  }}
                >
                  {item?.name}
                </li>
              ))}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};
