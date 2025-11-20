import { useState } from "react";

const clamp = (val, min, max) => {
  const num = parseInt(val, 10);
  if (isNaN(num)) return "";
  return Math.max(min, Math.min(num, max)).toString().padStart(2, "0");
};

const formatTimeInput = (raw) => {
  const digits = raw.replace(/\D/g, "").slice(0, 4);

  const hourRaw = digits.slice(0, 2);
  const minRaw = digits.slice(2, 4);

  const hour = hourRaw.length === 2 ? clamp(hourRaw, 1, 12) : hourRaw;
  const minute = minRaw.length === 2 ? clamp(minRaw, 0, 59) : minRaw;

  let result = hour;
  if (minute !== undefined && minute !== "") result += `:${minute}`;
  else if (hour.length === 2) result += ":";

  return result;
};

const CustomTimeInput = ({ value, onChange }) => {
  const [input, setInput] = useState(value || "");

  const handleChange = (e) => {
    const formatted = formatTimeInput(e.target.value);
    setInput(formatted);
    if (formatted.length === 5) onChange?.(formatted); // Call onChange only when fully typed
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      maxLength={5}
      value={input}
      placeholder="HH:MM"
      onChange={handleChange}
      className="w-full p-2 text-start bg-inherit"
    />
  );
};

export default CustomTimeInput;
