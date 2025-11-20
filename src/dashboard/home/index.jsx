import TabHead from "../../utils/TabHead";
// import { FilterTime } from "../../utils/FilterTime";
import { useCallback, useEffect, useState } from "react";
// import Shipments from "./utils/Shipments";
import AnalyticCard from "./utils/AnalyticCard";
import { BarLoader } from "../../utils/Loader";
import { cleanUpErr, RequestService } from "../../services";
import Filter from "../../utils/Filter";
import { FaClock, FaCreditCard, FaShoppingCart, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("All Time");

  const fetchByRange = useCallback(async () => {
    setLoading(true);
    try {
      const getPeriod =
        period === "All Time"
          ? "all"
          : period === "Today"
          ? "today"
          : period === "This Week"
          ? "week"
          : period === "This Month"
          ? "month"
          : period === "This Year"
          ? "year"
          : "all";
      const response = await RequestService.getParam("/dashboard", {
        period: getPeriod,
      });
      console.log(response?.data?.data?.analytics, "analytics");
      setItems(response?.data?.data?.analytics || []);
    } catch (error) {
      console.log(error);
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchByRange();
  }, [fetchByRange, period]);

  if (loading) {
    return (
      <main className="h-full grow flex flex-col justify-center items-center rounded-[20px] border border-[#E7E7E7] overflow-y-auto">
        <BarLoader />
      </main>
    );
  }

  return (
    <main className="h-full grow flex flex-col border border-[#E7E7E7] overflow-y-auto">
      <TabHead name="Dashboard">
        <Filter selected={period} setSelected={setPeriod} />
      </TabHead>
      <div className="p-5 w-full flex flex-col gap-3">
        <div className="grid grid-cols-4 grid-rows-1 gap-4">
          <AnalyticCard
            name="Total Orders"
            icon={<FaShoppingCart className="w-8 h-8 text-[#4A90E2]" />}
            figure={`${items?.current?.total_orders || 0}`}
            period={period}
            level={
              items?.current?.total_orders > items?.previous?.total_orders
                ? "increase"
                : items?.current?.total_orders < items?.previous?.total_orders
                ? "decrease"
                : "none"
            }
            percentChange={items?.percentage?.total_orders || 0}
          />
          <AnalyticCard
            name="Total Revenue"
            icon={<FaCreditCard className="w-8 h-8 text-[#50C878]" />}
            figure={`$${
              items?.current?.total_revenue
                ? items?.current?.total_revenue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.00"
            }`}
            period={period}
            level={
              items?.current?.total_revenue > items?.previous?.total_revenue
                ? "increase"
                : items?.current?.total_revenue < items?.previous?.total_revenue
                ? "decrease"
                : "none"
            }
            percentChange={items?.percentage?.total_revenue || 0}
          />
          <AnalyticCard
            name="Total Customers"
            icon={<FaUsers className="w-8 h-8 text-[#FFA500]" />}
            figure={`${items?.current?.total_customers || 0}`}
            period={period}
            level={
              items?.current?.total_customers > items?.previous?.total_customers
                ? "increase"
                : items?.current?.total_customers <
                  items?.previous?.total_customers
                ? "decrease"
                : "none"
            }
            percentChange={items?.percentage?.total_customers || 0}
          />
          <AnalyticCard
            name="Pending Orders"
            icon={<FaClock className="w-8 h-8 text-[#FFA500]" />}
            figure={`${items?.current?.pending_orders || 0}`}
            period={period}
            level={
              items?.current?.pending_orders > items?.previous?.pending_orders
                ? "increase"
                : items?.current?.pending_orders <
                  items?.previous?.pending_orders
                ? "decrease"
                : "none"
            }
            percentChange={items?.percentage?.pending_orders || 0}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5">
        <div className="flex flex-col gap-2">
          <b className="font-semibold text-2xl md:text-3xl">Quick Actions</b>
          <p className="text-[#595959] text-sm md:text-base">
            Access frequently used features quickly
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <button
            className="bg-[#4A90E2] text-white py-4 rounded-lg font-semibold hover:bg-[#3a78c2] transition"
            onClick={() => navigate("/dashboard/orders")}
          >
            Manage Orders
          </button>
          <button
            className="bg-[#50C878] text-white py-4 rounded-lg font-semibold hover:bg-[#3da966] transition"
            onClick={() => navigate("/dashboard/customers")}
          >
            Manage Customers
          </button>
          <button
            className="bg-[#FFA500] text-white py-4 rounded-lg font-semibold hover:bg-[#e68a00] transition"
            onClick={() => navigate("/dashboard/laundry-items")}
          >
            Manage Laundry Items
          </button>
          <button
            className="bg-[#FF6347] text-white py-4 rounded-lg font-semibold hover:bg-[#e5533b] transition"
            onClick={() => navigate("/dashboard/service-items")}
          >
            Manage Service Items
          </button>
        </div>
      </div>
    </main>
  );
}
