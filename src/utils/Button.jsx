export function Button({
  name,
  icon,
  icon2,
  width = "fit-content",
  onClick,
  type = "button",
  disabled = true,
  loading = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`min-w-fit h-10 bg-primary text-white rounded-xl flex items-center justify-center px-4 md:px-8 gap-2 disabled:bg-[#E4E4E4] relative`}
      style={{ width: `${width}` }}
      disabled={!disabled || loading}
    >
      {loading ? (
        <CircularLoader />
      ) : (
        <>
          {icon && <img src={icon} alt="" className="object-contain" />}
          {name}
          {icon2 && <img src={icon2} alt="" className="object-contain" />}
        </>
      )}
    </button>
  );
}

export function ButtonPrimary({
  name,
  icon,
  icon2,
  width = "fit-content",
  onClick,
  type = "button",
  disabled = false,
  loading = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`min-w-fit h-10 bold bg-primary text-white rounded-lg flex items-center justify-center px-5 gap-2 disabled:bg-[#E4E4E4] relative text-sm`}
      style={{ width: `${width}` }}
      disabled={disabled || loading}
    >
      {loading ? (
        <CircularLoader />
      ) : (
        <>
          {icon && <img src={icon} alt="" className="object-contain" />}
          {name}
          {icon2 && <img src={icon2} alt="" className="object-contain" />}
        </>
      )}
    </button>
  );
}

export function ButtonBorder({
  name = "Create shipment",
  onClick,
  type = "button",
}) {
  // set default action for on click to navigate to route
  // const navigate = useNavigate();
  
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-2 h-10 text-sm border-[#EFEFEF] rounded-xl border text-[#212121] bg-inherit flex justify-center items-center gap-1 w-fit min-w-fit group hover:text-primary hover:font-semibold"
    >
      {name}
    </button>
  );
}

export function ButtonGrey({
  name,
  icon,
  width = "fit-content",
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-5 h-9 rounded-[10px] text-[#212121] bg-[#F6F6F6] disabled:bg-[#E9E9E9] flex justify-center items-center gap-2"
      style={{ width: `${width}` }}
    >
      {icon && <img src={icon} alt="" className="object-contain" />}
      {name}
    </button>
  );
}

export function ButtonSecondary({
  name,
  icon,
  icon2,
  width = "fit-content",
  onClick,
  type = "button",
  disabled = true,
  loading = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="px-6 h-10 rounded-[10px] text-white font-bold bg-primary disabled:bg-[#E9E9E9] flex justify-center items-center gap-2 whitespace-nowrap disable:cursor-not-allowed disable:bg-[#E4E4E4] "
      style={{ width }}
      disabled={!disabled || loading}
    >
      {icon && <img src={icon} alt="" className="object-contain" />}
      {name}
      {icon2 && icon2}
      {loading && <CircularLoader />}
    </button>
  );
}

export const CircularLoader = ({
  size = 30,
  color = "#FFF",
  strokeWidth = 5,
}) => {
  return (
    <div className="relative inline-block">
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 50 50"
      >
        <circle
          className="stroke-gray-200"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth={strokeWidth}
        />
        <circle
          className={`stroke-current text-${color}`}
          color={color}
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            strokeDasharray: "125,125",
            strokeDashoffset: "125",
            animation: "loader 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
          }}
        />
      </svg>
      <style>{`
        @keyframes loader {
          0% {
            stroke-dashoffset: 125;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -125;
          }
        }
      `}</style>
    </div>
  );
};
