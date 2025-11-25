import { useEffect, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { ErrorMessage } from "./Input";

export const SelectDropDownImage = ({
  items,
  setSelected,
  selected,
  placeholder,
  slide = true,
  direction = true,
  // icon,
  width = 1.3,
  empty = "No items found",
  error = false,
  showErrors = false,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // const closeHoverMenu = () => {
  //   setOpen(false);
  // };
  // useOnHoverOutside(dropdownRef, closeHoverMenu);

  useEffect(() => {
    if (dropdownRef.current) {
      setDropdownWidth(dropdownRef.current.offsetWidth);
    }
  }, [dropdownRef]);

  const hasValue = selected && Object.keys(selected).length > 0;
  const showLabel = hasValue;

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2 w-full relative">
      <div className="w-full h-10 font-medium" ref={dropdownRef}>
        <div
          onClick={() => {
            setOpen(!open);
            setIsFocused(!isFocused);
          }}
          className={`rounded-lg bg-[#F6F6F6] h-10 px-4 flex gap-1 justify-between items-center cursor-pointer text-sm text-[#959595] w-full`}
        >
          {/* {icon && <img src={icon} alt="" className="object-contain h-4 w-4" />} */}
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
                <span className="text-[#201B1D] w-full truncate">
                  {selected?.name}
                </span>
              )}
            </span>
          </div>
          <FaCaretDown className="text-lg" />
        </div>
        {open && (
          <div
            className={`bg-white shadow-[0px_4px_4px_0px_rgba(18,18,18,0.10)] px-2 py-4 flex flex-col rounded-xl overflow-y-auto absolute z-40 w-full md:w-[${
              dropdownWidth * width
            }px] ${!direction && "bottom-10"} max-h-56`}
          >
            <input
              type="text"
              className="mb-2 p-1 border rounded"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredItems.length === 0 && <span className="p-2">{empty}</span>}
            {filteredItems.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`p-2 text-sm cursor-pointer text-black flex justify-between items-center gap-2 hover:bg-[#F6F6F6] rounded`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelected(item);
                    setOpen(false);
                    setIsFocused(false);
                  }}
                >
                  <div className="flex gap-2 items-center">
                    {/* {item?.flag && (
                      <img
                        className={`rounded-[50%] flex h-6 w-6 object-contain`}
                        src={item?.flag}
                        alt=""
                      />
                    )} */}
                    {item?.name}
                  </div>
                </li>
              );
            })}
          </div>
        )}
        <div className="min-h-1">
          {((isFocused && error) || (showErrors && error)) && (
            <ErrorMessage message={error} />
          )}
        </div>
      </div>
    </div>
  );
};
