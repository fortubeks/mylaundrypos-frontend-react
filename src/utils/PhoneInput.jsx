import { useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useSelector } from "react-redux";


export const PhoneInput = ({ value, setValue, placeholder, code, setCode }) => {
  return (
    <div className="rounded-xl bg-[#F6F6F6] pl-4 pr-2 h-10 flex items-center">
      <input
        type="tel"
        min={1}
        value={value}
        pattern="[0-9]*"
        onChange={(e) => setValue(e.target.value)}
        className="h-full w-full bg-inherit flex items-center placeholder:text-[#9D9D9D]"
        placeholder={placeholder}
      />
      <DropDown selected={code} setSelected={setCode} />
    </div>
  );
};

export default function DropDown({ setSelected, selected }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const closeHoverMenu = () => {
  //   setOpen(false);
  // };
  // useOnHoverOutside(dropdownRef, closeHoverMenu);
  const countriesList = useSelector((state) => state.general.countries);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredItems = countriesList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {/* <span className="text-xl">{selected?.emoji}</span> */}
            <span>+{selected?.phone_code}</span>
          </span>
          <FaChevronDown className={`${open && "rotate-180"} text-sm`} />
        </div>
      </div>
      {open && (
        <div
          className={`bg-white backdrop-blur-[8px] shadow-[0px_4px_4px_0px_rgba(18,18,18,0.10)] px-2 py-4 flex flex-col gap-3 rounded-xl absolute right-0 h-fit max-h-[200px] overflow-y-scroll snap z-10 min-w-fit`}
        >
          <input
            type="text"
            className="rounded-md min-h-8 h-8 w-full bg-gray-200 text-[#201B1D] px-2 text-sm"
            value={searchTerm}
            placeholder="Filter"
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              setSearchTerm(value);
            }}
          />
          {filteredItems.map((item, index) => {
            return (
              <li
                key={index}
                className={`pl-2 pr-5 text-sm cursor-pointer text-[#626262] flex justify-start items-center gap-2`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelected(item);
                  setOpen(false);
                }}
              >
                <span className="text-lg">{item?.emoji}</span>
                <div className="line-clamp-2">+{item?.phone_code}</div>
              </li>
            );
          })}
        </div>
      )}
    </div>
  );
}
