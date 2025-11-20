// import { useState } from "react";

export const RadioGroup = ({ items, setSelected, selected }) => {
  return (
    <div tabIndex={0} className="flex flex-col gap-4">
      {items.map((item, index) => (
        <li
          key={index}
          className={`text-sm cursor-pointer flex items-center gap-2`}
          onClick={() => setSelected(item)}
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
      ))}
    </div>
  );
};
