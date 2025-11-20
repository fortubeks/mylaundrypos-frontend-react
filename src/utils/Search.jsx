import search from "../assets/icons/search.svg";

export default function Search({
  value,
  setValue,
  width = "250px",
  containerW,
  placeholder = "Search something..."
}) {
  return (
    <label
      className="rounded-md h-10 px-2 bg-white border border-[#DCE6EE] w-fit font-medium relative flex items-center"
      style={{ width: containerW ? containerW : "" }}
    >
      <img src={search} alt="" className="object-contain " />
      <input
        type="text"
        className=" text-[#4C515B] px-2 h-full rounded-full font-normal text-xs outline-none"
        style={{ width: `${width}` }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </label>
  );
}
