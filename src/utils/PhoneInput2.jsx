import { useRef, useState } from "react";
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

export const PhoneInput = ({
  value,
  setValue,
  placeholder,
  slide = true,
  disabled = false,
  error,
  showErrors = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const hasValue = value && value.trim() !== "";
  const showLabel = isFocused || hasValue;

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`rounded-xl bg-[#F6F6F6] pl-2 pr-2 h-10 flex items-center
    ${
      isFocused
        ? "border-primary bg-card"
        : "border-input bg-card hover:border-input/50"
    }
    `}
      >
        <div className="flex-1 relative h-full">
          <label
            className={`absolute left-0 px-1 ml-2 text-sm font-medium transition-all duration-200 pointer-events-none ${
              showLabel
                ? `top-0 -translate-y-4 bg-card px-1 text-xs text-[#959595] bg-white/80 ${
                    !slide && "hidden"
                  }`
                : "top-1/2 -translate-y-1/2 text-muted-foreground text-[#959595]"
            }`}
          >
            {placeholder}
          </label>
          <input
            type="tel"
            ref={inputRef}
            min={1}
            value={value}
            pattern="[0-9]*"
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            className="h-full w-full px-3 bg-inherit flex items-center text-[#201B1D] placeholder:text-[#9D9D9D]"
            // placeholder={placeholder}
          />
        </div>
      </div>
      <div className="min-h-1">
        {((isFocused && error) || (showErrors && error)) && (
          <ErrorMessage message={error} />
        )}
      </div>
    </div>
  );
};