import up from "../../../assets/icons/up.svg";
import down from "../../../assets/icons/down.svg";
import stale from "../../../assets/icons/stale.svg";

export default function AnalyticCard({
  name,
  icon,
  figure,
  period,
  level,
  percentChange = 0,
}) {
  return (
    <div className="rounded-[20px] border bg-[#EFEFEF] w-full h-full">
      <div className="w-full py-4 px-4 flex items-center justify-between border-b border-[#EFEFEF]">
        <div className="flex items-center gap-3 text-sm font-medium">
          {/* <img src={icon} alt="" className="w-8 h-8 object-contain" /> */}
          {icon}
          {name}
        </div>
      </div>
      <div className="px-4 py-6 flex flex-col gap-5">
        <b className="font-bold text-[30px]">{figure}</b>
        <div className="flex gap-2 items-center text-sm">
          <span
            className={`
                    ${level === "increase" ? "bg-[#E5FFF7] text-[#0CCE92]" : ""}
                    ${level === "decrease" ? "bg-[#FFF3F7] text-[#BE1C2D]" : ""}
                    ${level === "none" ? "bg-[#F6F6F6] text-[#201B1D]" : ""}
                    px-2 py-0.5 rounded-full flex items-center gap-2 font-semibold
            `}
          >
            <img
              src={
                level === "increase" ? up : level === "decrease" ? down : stale
              }
              alt=""
              className="w-4 h-4 object-contain"
            />
            {percentChange}%
          </span>
          <span className="text-[#959595]">
            vs{" "}
            {period === "All Time"
              ? "all time"
              : period === "Today"
              ? "yesterday"
              : period === "This Week"
              ? "last Week"
              : period === "This Month"
              ? "last Month"
              : "Previous Period"}
          </span>
        </div>
      </div>
    </div>
  );
}
