import { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import filter from "../assets/icons/filter-o.svg";

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

export default function Filter({
  items = ["All Time", "Today", "This Week", "This Month", "This Year"],
  setSelected,
  selected,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const closeHoverMenu = () => {
  //   setOpen(false);
  // };
  // useOnHoverOutside(dropdownRef, closeHoverMenu);

  return (
    <div className="w-fit text-sm relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        tabIndex={0}
        className={`bg-inherit border border-[#EFEFEF] text-[#212121] rounded-xl flex justify-between items-center px-5 h-10 gap-3 text-sm`}
      >
        {selected ? (
          selected
        ) : (
          <span className="flex items-center gap-2">
            <img src={filter} alt="" className="object-contain" />
            Filter
          </span>
        )}
        <FaChevronDown className={`text-xs ${open && "rotate-180"}`} />
      </div>
      {open && (
        <ul
          className={`bg-white min-w-full w-fit shadow-[0px_4px_4px_0px_rgba(18,18,18,0.10)] px-4 py-4 absolute bottom-0 translate-y-full flex flex-col gap-3 rounded-xl overflow-y-auto z-[9999999] max-h-[400px] `}
          // style={{ width: dropdownWidth }}
        >
          <li
            className={`text-sm cursor-pointer flex items-center gap-2`}
            onClick={() => {
              setSelected("");
              setOpen(false);
            }}
          >
            Filter
          </li>
          {items?.map((item, i) => (
            <li
              key={i}
              className={`text-sm cursor-pointer flex items-center gap-2 whitespace-nowrap`}
              onClick={() => {
                if (item !== selected) {
                  setSelected(item);
                  setOpen(false);
                }
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
