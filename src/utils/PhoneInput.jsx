import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { useDropdownPos } from "./useDropdownPos";

export const PhoneInput = ({ value, setValue, placeholder, code, setCode }) => {
  return (
    <div className="rounded-xl bg-[#F6F6F6] pl-4 pr-2 h-10 flex items-center">
      <input
        type="tel"
        min={1}
        value={value}
        pattern="[0-9]*"
        onChange={(e) => setValue(e.target.value)}
        className="h-full w-full bg-inherit flex items-center placeholder:text-[#9D9D9D]"
        placeholder={placeholder}
      />
      <DropDown selected={code} setSelected={setCode} />
    </div>
  );
};

export default function DropDown({ setSelected, selected }) {
  const [open, setOpen] = useState(false);
  const { triggerRef, listRef, pos } = useDropdownPos(open, () =>
    setOpen(false),
  );
  const countriesList = useSelector((state) => state.general.countries);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredItems = countriesList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-fit min-w-fit z-10 relative font-medium text-sm">
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        tabIndex={0}
        className="h-8 px-2 flex justify-start items-center gap-2 p-1 bg-white rounded-full cursor-pointer text-sm md:text-base"
      >
        <div className="text-xs md:text-sm flex items-center gap-1">
          <span className="w-full truncate flex items-center gap-2">
            <span>+{selected?.phone_code}</span>
          </span>
          <FaChevronDown className={`${open ? "rotate-180" : ""} text-sm`} />
        </div>
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
              className="bg-white shadow-[0px_4px_12px_0px_rgba(18,18,18,0.15)] px-2 py-4 flex flex-col gap-3 rounded-xl overflow-y-auto z-[9999999] max-h-[220px] min-w-[160px]"
              style={{
                position: "fixed",
                top: pos.top,
                right: "auto",
                left: pos.left,
              }}
            >
              <input
                type="text"
                className="rounded-md min-h-8 h-8 w-full bg-gray-200 text-[#201B1D] px-2 text-sm"
                value={searchTerm}
                placeholder="Filter"
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                onClick={(e) => e.stopPropagation()}
              />
              {filteredItems.map((item, index) => (
                <li
                  key={index}
                  className="pl-2 pr-5 text-sm cursor-pointer text-[#626262] flex justify-start items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelected(item);
                    setOpen(false);
                  }}
                >
                  <span className="text-lg">{item?.emoji}</span>
                  <div className="line-clamp-2">+{item?.phone_code}</div>
                </li>
              ))}
            </div>
          </>,
          document.body,
        )}
    </div>
  );
}
