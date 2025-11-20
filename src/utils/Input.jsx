import { useRef, useState } from "react";

export const Input = ({
  setSelected,
  selected,
  icon,
  placeholder,
  slide = true,
  type = "text",
  min,
  max,
  required = false,
  disabled = false,
  error = false,
  showErrors = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const hasValue = selected && selected !== "";
  const showLabel = isFocused || hasValue;

  return (
    <div className="flex flex-col gap-1 w-full">
      <div
        className={`relative rounded-xl bg-[#F6F6F6] w-full h-10 flex gap-1 justify-between items-center ${
          isFocused
            ? "border-primary bg-card"
            : "border-input bg-card hover:border-input/50"
        }`}
      >
        {icon && <img src={icon} alt="" className="object-contain w-4 h-4" />}
        <div className="flex-1 relative h-full">
          <label
            className={`absolute left-0 px-1 ml-2 text-sm font-medium transition-all duration-200 pointer-events-none ${
              showLabel
                ? `top-0 -translate-y-2 bg-card px-1 text-xs text-[#959595] bg-white/80 ${
                    !slide && "hidden"
                  }`
                : "top-1/2 -translate-y-1/2 text-muted-foreground text-[#959595]"
            }`}
          >
            {placeholder}
          </label>

          <input
            ref={inputRef}
            type={type}
            min={min}
            // maxLength={type === "number" ? max : undefined}
            max={max}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder=""
            disabled={disabled}
            required={required}
            className="w-full h-full bg-transparent  text-[#201B1D] text-foreground placeholder-transparent py-2 px-3 disabled:cursor-not-allowed"
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

export const ErrorMessage = ({ message }) => {
  return (
    <p className="text-[#F90B0B] text-xs flex gap-1 items-center">{message}</p>
  );
};
