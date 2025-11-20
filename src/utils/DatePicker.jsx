import { useRef, useState } from "react";
import filter from "../assets/icons/calendar.svg";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // th
import { FaCaretDown } from "react-icons/fa";
import {
  useDropdownPosition,
  // useOnHoverOutside,
  usePortal,
} from "./DropFunctions";
import { format } from "date-fns";

export const DatePicker = ({ date, setDate }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const Portal = usePortal();

  // const closeHoverMenu = () => setOpen(false);
  // useOnHoverOutside(dropdownRef, closeHoverMenu);

  const style = useDropdownPosition({ open, triggerRef, dropdownRef });

  return (
    <div className="w-full relative" ref={triggerRef}>
      <div
        onClick={() => setOpen(!open)}
        tabIndex={0}
        className={`rounded-xl bg-[#F6F6F6] w-full h-10 py-1 px-2 flex gap-1 justify-between items-center`}
      >
        <img src={filter} alt="" />
        {date ? (
          <span className="">{format(date, "dd MMM, yyyy")}</span>
        ) : (
          <span className="text-[#9CA3AF]">Choose Date</span>
        )}
        <FaCaretDown className={`ml-auto ${open && "rotate-180"}`} />
      </div>
      {open && (
        <Portal>
          <div
            ref={dropdownRef}
            className="absolute z-[999999999] transition-all"
            style={{
              position: "absolute",
              top: style.top,
              left: style.left,
              minWidth: 200,
            }}
          >
            <div
              className={`bg-white backdrop-blur-[8px] border border-[#EFEFEF] shadow-[0px_1px_2px_0px_#1018280A] px-4 py-4 flex flex-col gap-2 rounded-xl overflow-y-auto relative z-[9999999]`}
            >
              <div className="flex">
                <Calendar
                  onChange={(item) => {
                    setDate(item);
                    setOpen(false);
                  }}
                  date={date}
                />
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
};
