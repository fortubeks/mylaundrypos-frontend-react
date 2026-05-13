import { useCallback, useEffect, useState } from "react";
import { BookingService, cleanUpErr } from "../../services";
import Search from "../../utils/Search";
import { BarLoader } from "../../utils/Loader";
import NavigatorPager from "../../utils/NavigatorPager";
import toast from "../../utils/Toast";
import { useIsMobile } from "../../utils/use-mobile";
import BookingDetail from "./BookingDetail";

const STATUS_COLORS = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

export default function Bookings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(20);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
    per_page: 20,
  });
  const [selected, setSelected] = useState(null);
  const isMobile = useIsMobile();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await BookingService.getBookings({
        page: currentPage,
        per_page: perPage,
        search,
        status: statusFilter,
      });
      setItems(res.data || []);
      setPagination({
        total: res.total,
        current_page: res.current_page,
        last_page: res.last_page,
        per_page: res.per_page,
      });
    } catch (err) {
      cleanUpErr(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, currentPage, perPage]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  async function handleConfirm(id) {
    try {
      await BookingService.confirmBooking(id);
      toast.success("Booking confirmed!");
      fetch();
      setSelected(null);
    } catch (err) {
      cleanUpErr(err);
    }
  }

  async function handleCancel(id) {
    try {
      await BookingService.cancelBooking(id);
      toast.success("Booking cancelled.");
      fetch();
      setSelected(null);
    } catch (err) {
      cleanUpErr(err);
    }
  }

  async function handleConvert(id) {
    try {
      await BookingService.convertToOrder(id);
      toast.success("Booking converted to order!");
      fetch();
      setSelected(null);
    } catch (err) {
      cleanUpErr(err);
    }
  }

  if (selected) {
    return (
      <BookingDetail
        booking={selected}
        onBack={() => setSelected(null)}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onConvert={handleConvert}
      />
    );
  }

  return (
    <main className="h-full grow flex flex-col border border-[#E7E7E7] overflow-y-auto">
      <div className="p-5 w-full flex flex-col gap-3">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <Search
            value={search}
            setValue={(v) => {
              setSearch(v);
              setCurrentPage(1);
            }}
            placeholder="Search by name, phone, code…"
            width={isMobile ? "w-full" : "w-72"}
          />
          <div className="flex gap-2 ml-auto flex-wrap">
            {["", "pending", "confirmed", "completed", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${
                  statusFilter === s
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary"
                }`}
              >
                {s === "" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", val: pagination.total, color: "text-gray-800" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-100 rounded-xl p-3"
            >
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <BarLoader />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
            <div className="text-5xl mb-3">📋</div>
            <p className="font-medium">No bookings yet</p>
            <p className="text-sm mt-1">
              Bookings from your public page will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "Code",
                    "Customer",
                    "Phone",
                    "Type",
                    "Services",
                    "Total",
                    "Date",
                    "Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-3 text-xs font-semibold text-gray-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelected(b)}
                  >
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      {b.booking_code}
                    </td>
                    <td className="py-3 px-3 font-medium text-gray-800 whitespace-nowrap">
                      {b.customer_name}
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {b.customer_phone}
                    </td>
                    <td className="py-3 px-3">
                      <span className="capitalize text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {b.service_type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {Array.isArray(b.items) ? b.items.length : 0} item(s)
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-800">
                      ₦{Number(b.total_amount).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-gray-400 whitespace-nowrap text-xs">
                      {new Date(b.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-semibold capitalize ${
                          STATUS_COLORS[b.status] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-primary text-xs hover:underline">
                        View
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.last_page > 1 && (
          <NavigatorPager
            total={pagination.total}
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            perPage={pagination.per_page}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </main>
  );
}
