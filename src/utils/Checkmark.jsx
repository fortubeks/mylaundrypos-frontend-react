import { FaCheck } from "react-icons/fa";

export default function Checkmark({ checked, setChecked, onClick }) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked);
          if (onClick) onClick(e);
        }}
      />
      <div className="w-5 h-5 border border-gray-300 rounded bg-white peer-checked:bg-secondary peer-checked:border-secondary flex items-center justify-center relative transition-colors duration-200">
        <FaCheck className="text-white text-xs" />
      </div>
    </label>
  );
}
