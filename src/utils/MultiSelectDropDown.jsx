import { useEffect, useRef, useState } from "react";
import { FaCaretDown, FaCheck } from "react-icons/fa";

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

export const MultiSelectDropDown = ({ items, setSelected, selected }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  // const closeHoverMenu = () => {
  //   setOpen(false);
  // };
  // useOnHoverOutside(dropdownRef, closeHoverMenu);

  useEffect(() => {
    if (dropdownRef.current) {
      setDropdownWidth(dropdownRef.current.offsetWidth);
    }
  }, [dropdownRef]);

  const handleToggle = (item) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((sel) => sel !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-12 font-medium" ref={dropdownRef}>
        <div
          onClick={() => setOpen(!open)}
          className={`rounded-xl bg-[#F6F6F6] h-12 px-5 flex justify-between items-center ${
            !selected && "text-[#212121]"
          }`}
        >
          {selected.length > 0 ? (
            <span className="truncate">{selected.join(", ")}</span>
          ) : (
            <span className="text-[#929292]">Choose an option</span>
          )}
          <FaCaretDown className={`${open && "rotate-180"} text-xl`} />
        </div>
        {open && (
          <div
            className={`bg-white backdrop-blur-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.10)] mt-[2px] px-3 py-2 flex flex-col gap-3 rounded-xl overflow-y-auto absolute `}
            style={{ width: dropdownWidth }}
          >
            <li
              className={`px-2 py-1 text-sm cursor-pointer flex items-center gap-2`}
              onClick={() => {
                setSelected([]);
                setOpen(false);
              }}
            >
              <span
                className={`border rounded flex justify-center items-center
              ${
                selected.length === 0
                  ? "border-secondary"
                  : "border-dashed border-[#939393]"
              }`}
              >
                <span
                  className={`rounded flex justify-center items-center w-5 h-5 ${
                    selected.length === 0 ? "bg-secondary" : ""
                  }`}
                >
                  {selected.length === 0 && (
                    <FaCheck className="text-white text-xs" />
                  )}
                </span>
              </span>{" "}
              Select option
            </li>
            {items.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`px-2 py-1 text-sm cursor-pointer flex items-center gap-2`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggle(item);
                  }}
                >
                  <span
                    className={`border rounded flex justify-center items-center
                     ${
                       selected.includes(item)
                         ? ""
                         : "border-dashed border-[#939393]"
                     }`}
                  >
                    <div
                      className={`rounded flex h-5 w-5 justify-center items-center ${
                        selected.includes(item) ? "bg-secondary" : ""
                      }`}
                    >
                      {selected.includes(item) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                  </span>{" "}
                  {item}
                </li>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
