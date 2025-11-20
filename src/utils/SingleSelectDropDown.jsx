import { useEffect, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

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

export const SingleSelectDropDown = ({ items, setSelected, selected }) => {
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

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-10 font-medium" ref={dropdownRef}>
        <div
          onClick={() => setOpen(!open)}
          className={`rounded-xl bg-[#F6F6F6] h-10 px-5 flex justify-between items-center ${
            !selected && "text-[#212121]"
          }`}
        >
          {selected ? (
            <span className="truncate">{selected}</span>
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
                setSelected("");
                setOpen(false);
              }}
            >
              <span
                className={`border rounded-[50%] flex justify-center items-center p-1
              ${
                selected === ""
                  ? "border-secondary"
                  : "border-dashed border-[#939393]"
              }`}
              >
                <span
                  className={`rounded-[50%] flex h-3 w-3 ${
                    selected === "" ? "bg-secondary" : ""
                  }`}
                ></span>
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
                    setSelected(item);
                    setOpen(false);
                  }}
                >
                  <span
                    className={`border rounded-[50%] flex justify-center items-center p-1
                     ${
                       selected === item
                         ? "border-secondary"
                         : "border-dashed border-[#939393]"
                     }`}
                  >
                    <div
                      className={`rounded-[50%] flex h-3 w-3 ${
                        selected === item ? "bg-secondary" : ""
                      }`}
                    ></div>
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
