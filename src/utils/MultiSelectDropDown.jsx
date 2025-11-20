import { useEffect, useRef, useState } from "react";
import { FaCaretDown, FaCheck } from "react-icons/fa";

export const MultiSelectDropDown = ({
  items,
  setSelected,
  selected,
  onChange,
  placeholder,
  slide = true,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);

  useEffect(() => {
    if (dropdownRef.current) {
      setDropdownWidth(dropdownRef.current.offsetWidth);
    }
  }, [dropdownRef]);

  // const handleToggle = (item) => {
  //   if (selected.includes(item)) {
  //     setSelected(selected.filter((sel) => sel !== item));
  //   } else {
  //     setSelected([...selected, item]);
  //   }
  // };
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = selected && selected.length !== 0;
  const showLabel = isFocused || hasValue;

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-10 font-medium" ref={dropdownRef}>
        <div
          onClick={() => {
            setOpen(!open);
            setIsFocused(!isFocused);
          }}
          className={`rounded-xl bg-[#F6F6F6] h-10 px-5 flex justify-between items-center ${
            !selected && "text-[#212121]"
          }`}
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
              {selected?.length > 0 && (
                <span className="text-[#201B1D] w-full truncate">
                  {selected?.map((sel) => sel.name).join(", ")}
                </span>
              )}
            </span>
          </div>
          <FaCaretDown className={`${open && "rotate-180"} text-xl`} />
        </div>
        {open && (
          <div
            className={`bg-white backdrop-blur-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.10)] mt-[2px] px-3 py-2 flex flex-col gap-3 rounded-xl overflow-y-auto absolute z-10 `}
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
                selected?.length === 0
                  ? "border-secondary"
                  : "border-dashed border-[#939393]"
              }`}
              >
                <span
                  className={`rounded flex justify-center items-center w-5 h-5 ${
                    selected?.length === 0 ? "bg-secondary" : ""
                  }`}
                >
                  {selected?.length === 0 && (
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
                    onChange(item);
                  }}
                >
                  <span
                    className={`border rounded flex justify-center items-center
                     ${
                       selected.find((sel) => sel.id === item.id)
                         ? ""
                         : "border-dashed border-[#939393]"
                     }`}
                  >
                    <div
                      className={`rounded flex h-5 w-5 justify-center items-center ${
                        selected.find((sel) => sel.id === item.id)
                          ? "bg-secondary"
                          : ""
                      }`}
                    >
                      {selected.find((sel) => sel.id === item.id) && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </div>
                  </span>{" "}
                  {item.name}
                </li>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
