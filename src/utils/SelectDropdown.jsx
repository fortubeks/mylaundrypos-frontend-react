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
        className={`rounded-lg bg-[#F6F6F6] h-10 px-4 flex gap-1 justify-between items-center cursor-pointer text-sm  w-full`}
      >
        {selected ? (
          selected
        ) : (
          <span className="text-[#959595]">{placeholder}</span>
        )}
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
    </div>
  );
}
