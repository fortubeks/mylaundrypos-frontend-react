export default function TabHead({ name, size = "18px", children }) {
  return (
    <div className="w-full min-h-14 h-14 px-4 flex items-center border-b border-[#EFEFEF]">
      <h3
        className="font-semibold capitalize text-black"
        style={{ fontSize: size }}
      >
        {name}
      </h3>
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}
