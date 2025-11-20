import { useRef, useState } from "react";
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

export default function DropDown({
  items,
  setSelected,
  selected,
  placeholder,
  onSelect,
  icon = null,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const closeHoverMenu = () => {
  //   setOpen(false);
  // };
  // useOnHoverOutside(dropdownRef, closeHoverMenu);

  return (
    <div className="w-full text-sm relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        tabIndex={0}
        className={`rounded-xl bg-[#F6F6F6] w-full h-10 py-1 px-2 flex gap-1 justify-between items-center`}
      >
        {icon && <img src={icon} alt="" className="object-contain" />}
        {selected ? (
          selected
        ) : (
          <span className="text-[#9CA3AF]">{placeholder}</span>
        )}
        <FaCaretDown className={`ml-auto ${open && "rotate-180"}`} />
      </div>
      {open && (
        <ul
          className={`bg-white min-w-40px] w-full shadow-[0px_4px_4px_0px_rgba(18,18,18,0.10)] py-4 absolute bottom-0 translate-y-full flex flex-col rounded-xl overflow-y-auto z-[9999999] max-h-[200px] `}
          // style={{ width: dropdownWidth }}
        >
          <li
            className={`text-sm cursor-pointer flex items-center gap-2 hover:bg-[#F6F6F6] rounded-lg px-3 py-2`}
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
              className={`text-sm cursor-pointer flex items-center gap-2 hover:bg-[#F6F6F6] rounded-lg px-3 py-2`}
              onClick={() => {
                if (item !== selected) {
                  if (onSelect) {
                    onSelect(item);
                    setOpen(false);
                  } else {
                    setSelected(item);
                  }
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
