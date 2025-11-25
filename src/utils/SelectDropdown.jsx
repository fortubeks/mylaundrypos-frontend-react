import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { ErrorMessage } from "./Input";

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
  const dropdownRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // const closeHoverMenu = () => {
  //   setOpen(false);
  // };
  // useOnHoverOutside(dropdownRef, closeHoverMenu);

  const hasValue = selected && selected.length > 0;
  const showLabel = hasValue;

  return (
    <div className="w-full text-sm relative" ref={dropdownRef}>
      <div
        onClick={() => {
          setOpen(!open);
          setIsFocused(!isFocused);
        }}
        tabIndex={0}
        className={`rounded-lg bg-[#F6F6F6] h-10 px-4 flex gap-1 justify-between items-center cursor-pointer text-sm  w-full`}
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
            {/* {selected?.flag && (
                <img
                  src={selected?.flag}
                  alt=""
                  className="object-contain h-5 w-5"
                />
              )} */}
            {selected && (
              <span className="text-[#201B1D] w-full truncate">{selected}</span>
            )}
          </span>
        </div>
        <FaCaretDown className={`${open && "rotate-180"}`} />
      </div>
      {open && (
        <ul
          className={`bg-white min-w-40px] w-full shadow-[0px_4px_4px_0px_rgba(18,18,18,0.10)] px-4 py-4 absolute bottom-0 translate-y-full flex flex-col gap-3 rounded-xl overflow-y-auto z-[9999999] max-h-[300px] `}
          // style={{ width: dropdownWidth }}
        >
          <li
            className={`text-sm cursor-pointer flex items-center gap-2`}
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
              className={`text-sm cursor-pointer flex items-center gap-2`}
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
      <div className="min-h-1">
        {((isFocused && error) || (showErrors && error)) && (
          <ErrorMessage message={error} />
        )}
      </div>
    </div>
  );
}
