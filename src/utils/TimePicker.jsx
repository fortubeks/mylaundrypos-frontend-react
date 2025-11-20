import { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import clock from "../assets/icons/clock3.svg";
import CustomTimeInput from "./TimeInput";

// function useOnHoverOutside(ref, handler) {
//   useEffect(() => {
//     const listener = (event) => {
//       if (!ref.current || ref.current.contains(event.target)) {
//         return;
//       }
//       handler(event);
//     };
//     document.addEventListener("mouseover", listener);
//     return () => {
//       document.removeEventListener("mouseout", listener);
//     };
//   }, [ref, handler]);
// }


export default function TimePicker({
  setSelected,
  selected,
  setMer,
  mer,
  icon = clock,
}) {
  return (
    <div className="w-full h-10 font-medium relative">
      <div
        tabIndex={0}
        className={`rounded-xl bg-[#F6F6F6] w-full h-10 py-1 px-2 flex gap-1 justify-between items-center`}
      >
        <span className="flex gap-3 items-center w-full cursor-pointer">
          <img src={icon} alt="" className="object-contain" />
          <CustomTimeInput onChange={setSelected} value={selected} />
        </span>
        <DropDown selected={mer} setSelected={setMer} />
      </div>
    </div>
  );
}

export function DropDown({ setSelected, selected }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const closeHoverMenu = () => {
  //   setOpen(false);
  // };
  // useOnHoverOutside(dropdownRef, closeHoverMenu);

  return (
    <div
      className="w-fit min-w-fit z-10 relative font-medium text-sm"
      ref={dropdownRef}
    >
      <div
        onClick={() => setOpen(!open)}
        tabIndex={0}
        className={`h-8 px-2 flex justify-start items-center gap-2 p-1 bg-white rounded-full cursor-pointer text-sm md:text-base`}
      >
        <div className="text-xs md:text-sm flex items-center gap-1">
          <span className="w-full truncate flex items-center gap-2">
            <span>{selected}</span>
          </span>
          <FaChevronDown className={`${open && "rotate-180"} text-sm`} />
        </div>
      </div>
      {open && (
        <div
          className={`bg-white backdrop-blur-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.10)] px-2 py-4 flex flex-col gap-3 rounded-xl absolute right-0 h-fit max-h-[200px] overflow-y-scroll snap z-10 min-w-fit`}
        >
          {["AM", "PM"].map((item, index) => {
            return (
              <li
                key={index}
                className={`pl-2 pr-14 text-sm cursor-pointer text-[#626262] flex justify-start items-center gap-2`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelected(item);
                  setOpen(false);
                }}
              >
                {item}
              </li>
            );
          })}
        </div>
      )}
    </div>
  );
}
