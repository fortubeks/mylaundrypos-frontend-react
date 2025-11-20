import { useState } from "react";
import { FilterPeriod } from "../../../utils/FilterPeriod";
import TableHead from "../../../utils/TableHead";
import empty from "../../../assets/icons/empty.svg";
import arrow from "../../../assets/icons/arrow-right.svg";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "../../../utils/Loader";
export default function Stock({ itemsToDisplay, loading }) {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("Most recent");
  return (
    <div className="rounded-[20px] border border-[#EFEFEF] w-full h-full flex flex-col">
      <div className="w-full py-3 px-3 flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm">Warehouse Stock</div>
        <FilterPeriod
          selected={period}
          setSelected={setPeriod}
          items={["Most recent", "Highest stock", "Lowest stock"]}
        />
      </div>
      <div className="overflow-x-auto pl-2 grow overflow-y-scroll">
        <div className=" w-full h-full grow">
          <table className="min-w-full h-full grow">
            <TableHead names={["Product name", "Stock count"]} text="text-xs" />
            {itemsToDisplay && (
              <tbody className="overflow-scroll">
                {itemsToDisplay.slice(0, 9).map((tm, i) => (
                  <List key={i} items={tm} />
                ))}
              </tbody>
            )}
            {itemsToDisplay?.length === 0 && (
              <tr className="w-full grow">
                <td className="px-3 py-6" colSpan="2">
                  {loading ? (
                    <div className="h-full grow flex flex-col justify-center items-center gap-1">
                      <BarLoader height="h-20" />
                    </div>
                  ) : (
                    <div className="h-full grow flex flex-col justify-center items-center gap-1">
                      <img
                        src={empty}
                        alt="No data"
                        className="w-12 h-12 mx-auto"
                      />
                      <span className="text-center text-sm text-[#959595]">
                        No stock added yet
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </table>
        </div>
      </div>
      <div
        className="w-full h-16 mt-auto flex gap-1 items-center justify-center border-t border-[#EFEFEF] cursor-pointer"
        onClick={() => navigate("/dashboard/warehouse-management")}
      >
        See all stock{" "}
        <img src={arrow} alt="arrow" className="w-4 h-4 rotate-180" />
      </div>
    </div>
  );
}

const List = ({ items }) => {
  return (
    <tr className="">
      <td className="px-2 py-3 text-sm">{items?.product_name}</td>
      <td className="px-2 py-3 text-center text-sm">{items?.stock_count}</td>
    </tr>
  );
};
