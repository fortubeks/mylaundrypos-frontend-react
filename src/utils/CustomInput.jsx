export default function CustomInput({
  name,
  value,
  type = "text",
  setValue,
  disabled = false,
  placeholder = "",
}) {
  return (
    <label className="flex flex-col gap-1 w-full">
      <span className="">{name}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="h-10 px-2 border-[0.5px] border-[#E9E9E9] w-full bg-inherit rounded-lg disabled:bg-[#FCFCFC]"
      />
    </label>
  );
}