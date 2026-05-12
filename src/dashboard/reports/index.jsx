import { useCallback, useEffect, useMemo, useState } from "react";
import Filter from "../../utils/Filter";
import { BarLoader } from "../../utils/Loader";
import { cleanUpErr, RequestService } from "../../services";
import {
  FaArrowUp,
  FaArrowDown,
  FaMoneyBillWave,
  FaShoppingBag,
  FaUsers,
  FaCalculator,
  FaExclamationCircle,
} from "react-icons/fa";
import {
  parseISO,
  isWithinInterval,
  format,
  isBefore,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  getHours,
  getDay,
  getDate,
  getMonth,
  subMonths,
} from "date-fns";

// ─── Constants ───────────────────────────────────────────────────
const PERIODS = ["All Time", "Today", "This Week", "This Month", "This Year"];

const STATUS_META = {
  pending: {
    bar: "bg-yellow-400",
    dot: "bg-yellow-400",
    label: "text-yellow-700",
  },
  processing: {
    bar: "bg-blue-400",
    dot: "bg-blue-400",
    label: "text-blue-700",
  },
  ready: { bar: "bg-green-400", dot: "bg-green-400", label: "text-green-700" },
  delivered: { bar: "bg-gray-400", dot: "bg-gray-400", label: "text-gray-600" },
};

const PAYMENT_COLORS = [
  "bg-primary",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-orange-400",
  "bg-pink-500",
  "bg-teal-400",
];

// ─── Formatting helpers ──────────────────────────────────────────
const fmtCurrency = (n) =>
  n != null
    ? new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
      }).format(n)
    : "—";

const fmtShort = (n) => {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}k`;
  return `₦${Math.round(n)}`;
};

// ─── Period helpers ──────────────────────────────────────────────
const PERIOD_PARAM = {
  Today: "today",
  "This Week": "week",
  "This Month": "month",
  "This Year": "year",
  "All Time": "all",
};

function getPeriodRange(period) {
  const now = new Date();
  switch (period) {
    case "Today":
      return { start: startOfDay(now), end: endOfDay(now) };
    case "This Week":
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case "This Month":
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case "This Year":
      return { start: startOfYear(now), end: endOfYear(now) };
    default:
      return null;
  }
}

function filterByPeriod(orders, period) {
  const range = getPeriodRange(period);
  if (!range) return orders;
  return orders.filter((o) => {
    try {
      return isWithinInterval(parseISO(o.order_date ?? o.created_at), range);
    } catch {
      return false;
    }
  });
}

function buildTrendBuckets(orders, period) {
  const now = new Date();

  if (period === "Today") {
    const slots = [
      { label: "Morning", hours: [6, 7, 8, 9, 10, 11] },
      { label: "Afternoon", hours: [12, 13, 14, 15, 16, 17] },
      { label: "Evening", hours: [18, 19, 20, 21, 22] },
      { label: "Night", hours: [0, 1, 2, 3, 4, 5, 23] },
    ];
    return slots.map(({ label, hours }) => {
      const subset = orders.filter((o) => {
        try {
          return hours.includes(getHours(parseISO(o.created_at)));
        } catch {
          return false;
        }
      });
      return {
        label,
        revenue: subset.reduce((s, o) => s + +o.total_amount, 0),
        orders: subset.length,
      };
    });
  }

  if (period === "This Week") {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const toIdx = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
    return days.map((label, idx) => {
      const subset = orders.filter((o) => {
        try {
          return toIdx[getDay(parseISO(o.order_date ?? o.created_at))] === idx;
        } catch {
          return false;
        }
      });
      return {
        label,
        revenue: subset.reduce((s, o) => s + +o.total_amount, 0),
        orders: subset.length,
      };
    });
  }

  if (period === "This Month") {
    return ["Wk 1", "Wk 2", "Wk 3", "Wk 4"].map((label, idx) => {
      const subset = orders.filter((o) => {
        try {
          return (
            Math.floor(
              (getDate(parseISO(o.order_date ?? o.created_at)) - 1) / 7,
            ) === idx
          );
        } catch {
          return false;
        }
      });
      return {
        label,
        revenue: subset.reduce((s, o) => s + +o.total_amount, 0),
        orders: subset.length,
      };
    });
  }

  if (period === "This Year") {
    return [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].map((label, idx) => {
      const subset = orders.filter((o) => {
        try {
          return getMonth(parseISO(o.order_date ?? o.created_at)) === idx;
        } catch {
          return false;
        }
      });
      return {
        label,
        revenue: subset.reduce((s, o) => s + +o.total_amount, 0),
        orders: subset.length,
      };
    });
  }

  // All Time → last 12 months
  return Array.from({ length: 12 }, (_, i) => {
    const d = subMonths(now, 11 - i);
    const y = d.getFullYear(),
      m = d.getMonth();
    const subset = orders.filter((o) => {
      try {
        const od = parseISO(o.order_date ?? o.created_at);
        return od.getFullYear() === y && od.getMonth() === m;
      } catch {
        return false;
      }
    });
    return {
      label: format(d, "MMM yy"),
      revenue: subset.reduce((s, o) => s + +o.total_amount, 0),
      orders: subset.length,
    };
  });
}

function computeTopServices(orders) {
  const map = {};
  orders.forEach((order) => {
    (order.items ?? []).forEach((item) => {
      const name = item.service_item?.name ?? "Other";
      if (!map[name]) map[name] = { name, count: 0, revenue: 0 };
      map[name].count += +(item.quantity ?? 1);
      map[name].revenue += +item.subtotal ?? 0;
    });
  });
  return Object.values(map)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);
}

function computePaymentMethods(orders) {
  const map = {};
  orders.forEach((order) => {
    (order.payments ?? []).forEach((p) => {
      const mode = p.mode_of_payment ?? "Unknown";
      map[mode] = (map[mode] ?? 0) + +p.amount;
    });
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

function computeOverdue(orders) {
  const today = startOfDay(new Date());
  return orders.filter((o) => {
    if (!o.due_date || o.status === "delivered") return false;
    try {
      return isBefore(parseISO(o.due_date), today);
    } catch {
      return false;
    }
  });
}

// ─── Sub-components ──────────────────────────────────────────────
function ChangeBadge({ val }) {
  if (val == null) return null;
  const up = val >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
    >
      {up ? (
        <FaArrowUp className="text-[9px]" />
      ) : (
        <FaArrowDown className="text-[9px]" />
      )}
      {Math.abs(val)}%
    </span>
  );
}

function MetricCard({ label, value, sub, icon, color, pct }) {
  return (
    <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}
        >
          {icon}
        </div>
        <ChangeBadge val={pct} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#212121] truncate">
          {value ?? "—"}
        </p>
        <p className="text-xs text-[#959595] mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-[#bbb] mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function TrendChart({ buckets }) {
  const max = Math.max(...buckets.map((b) => b.revenue), 1);
  const hasData = buckets.some((b) => b.revenue > 0);
  return (
    <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 h-full flex flex-col">
      <p className="text-sm font-semibold text-[#212121] mb-5">Revenue Trend</p>
      {!hasData ? (
        <div className="flex-1 flex items-center justify-center text-[#bbb] text-sm">
          No orders in this period.
        </div>
      ) : (
        <div className="flex items-end gap-1.5 flex-1 min-h-[120px]">
          {buckets.map((b, i) => {
            const heightPct =
              b.revenue > 0 ? Math.max((b.revenue / max) * 100, 5) : 0;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1 h-full justify-end group"
              >
                {/* Hover value label */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-primary whitespace-nowrap">
                  {b.revenue > 0 ? fmtShort(b.revenue) : ""}
                </span>
                <div
                  title={`${b.label}: ${fmtCurrency(b.revenue)} · ${b.orders} order${b.orders !== 1 ? "s" : ""}`}
                  className="w-full rounded-t-md transition-all duration-500 cursor-default hover:opacity-75"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: b.revenue > 0 ? "#008aff" : "#F3F3F3",
                  }}
                />
                <span className="text-[9px] text-[#959595] truncate w-full text-center">
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBreakdown({ orders }) {
  const statuses = ["pending", "processing", "ready", "delivered"];
  const counts = statuses.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});
  const total = orders.length || 1;

  return (
    <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#212121]">Order Status</p>
        <span className="text-xs text-[#959595]">{orders.length} total</span>
      </div>
      {orders.length === 0 ? (
        <p className="text-xs text-[#bbb] text-center py-4">No orders yet.</p>
      ) : (
        <>
          {/* Stacked progress bar */}
          <div className="flex rounded-full overflow-hidden h-2.5 w-full bg-[#F3F3F3]">
            {statuses.map((s) => {
              const pct = (counts[s] / total) * 100;
              if (!pct) return null;
              return (
                <div
                  key={s}
                  className={`${STATUS_META[s].bar} h-full`}
                  style={{ width: `${pct}%` }}
                />
              );
            })}
          </div>
          {/* Breakdown rows */}
          <div className="flex flex-col gap-2.5">
            {statuses.map((s) => (
              <div
                key={s}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${STATUS_META[s].dot}`}
                  />
                  <span className="capitalize text-[#444]">{s}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 rounded-full bg-[#F3F3F3] overflow-hidden">
                    <div
                      className={`${STATUS_META[s].bar} h-full`}
                      style={{ width: `${(counts[s] / total) * 100}%` }}
                    />
                  </div>
                  <span className="w-5 text-right text-[#212121] font-semibold">
                    {counts[s]}
                  </span>
                  <span className="w-8 text-right text-xs text-[#959595]">
                    {((counts[s] / total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TopServices({ orders }) {
  const services = useMemo(() => computeTopServices(orders), [orders]);
  const maxRev = Math.max(...services.map((s) => s.revenue), 1);
  return (
    <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 flex flex-col gap-4">
      <p className="text-sm font-semibold text-[#212121]">
        Top Services by Revenue
      </p>
      {services.length === 0 ? (
        <p className="text-xs text-[#bbb] text-center py-4">
          No service data yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {services.map((s, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-[#333] truncate max-w-[55%]">
                  {s.name}
                </span>
                <span className="text-sm font-bold text-[#212121]">
                  {fmtCurrency(s.revenue)}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#F3F3F3] overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(s.revenue / maxRev) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-[#959595]">
                {s.count} unit{s.count !== 1 ? "s" : ""} ordered
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaymentMethods({ orders }) {
  const methods = useMemo(() => computePaymentMethods(orders), [orders]);
  const total = methods.reduce((s, [, v]) => s + v, 0) || 1;
  return (
    <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 flex flex-col gap-4">
      <p className="text-sm font-semibold text-[#212121]">Payment Methods</p>
      {methods.length === 0 ? (
        <p className="text-xs text-[#bbb] text-center py-4">
          No payment data yet.
        </p>
      ) : (
        <>
          <div className="flex rounded-full overflow-hidden h-2.5 w-full bg-[#F3F3F3]">
            {methods.map(([mode, amount], i) => (
              <div
                key={mode}
                className={`${PAYMENT_COLORS[i % PAYMENT_COLORS.length]} h-full`}
                style={{ width: `${(amount / total) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {methods.map(([mode, amount], i) => (
              <div
                key={mode}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${PAYMENT_COLORS[i % PAYMENT_COLORS.length]}`}
                  />
                  <span className="text-[#444] capitalize">{mode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#959595]">
                    {((amount / total) * 100).toFixed(0)}%
                  </span>
                  <span className="text-sm font-semibold text-[#212121]">
                    {fmtCurrency(amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function OverdueAlert({ orders }) {
  const overdue = useMemo(() => computeOverdue(orders), [orders]);
  if (overdue.length === 0) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
      <FaExclamationCircle className="text-red-500 shrink-0 mt-0.5 text-lg" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-red-700">
          {overdue.length} Overdue Order{overdue.length !== 1 ? "s" : ""}
        </p>
        <p className="text-xs text-red-500 mt-0.5">
          {overdue.length === 1 ? "This order is" : "These orders are"} past the
          due date and not yet delivered.
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {overdue.slice(0, 6).map((o) => (
            <span
              key={o.id}
              className="text-xs bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full whitespace-nowrap"
            >
              {o.customer?.first_name} {o.customer?.last_name} — due{" "}
              {format(parseISO(o.due_date), "MMM d")}
            </span>
          ))}
          {overdue.length > 6 && (
            <span className="text-xs text-red-400">
              +{overdue.length - 6} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function Reports() {
  const [period, setPeriod] = useState("All Time");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [allOrders, setAllOrders] = useState([]);

  // Fetch summary stats (re-fetches on period change)
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const res = await RequestService.getParam("/dashboard", {
        period: PERIOD_PARAM[period],
      });
      setSummary(res?.data?.data?.analytics ?? null);
    } catch (e) {
      cleanUpErr(e);
    } finally {
      setSummaryLoading(false);
    }
  }, [period]);

  // Fetch all orders once (client-side filtered for charts)
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await RequestService.getParam("/orders", { per_page: 500 });
      setAllOrders(res?.data?.data?.data ?? []);
    } catch (e) {
      cleanUpErr(e);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filtered = useMemo(
    () => filterByPeriod(allOrders, period),
    [allOrders, period],
  );
  const buckets = useMemo(
    () => buildTrendBuckets(filtered, period),
    [filtered, period],
  );

  const cur = summary?.current;
  const pct = summary?.percentage;
  const avgOrder =
    cur?.total_orders > 0 ? cur.total_revenue / cur.total_orders : 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-2 flex items-center justify-end border-b border-[#EFEFEF]">
        <Filter items={PERIODS} selected={period} setSelected={setPeriod} />
      </div>

      {summaryLoading && !summary ? (
        <BarLoader />
      ) : (
        <div className="p-5 flex flex-col gap-5">
          {/* Overdue alert — only if there are overdue orders */}
          {!ordersLoading && <OverdueAlert orders={allOrders} />}

          {/* ── Key metrics ── */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard
              label="Total Revenue"
              value={fmtCurrency(cur?.total_revenue)}
              icon={<FaMoneyBillWave className="text-white text-lg" />}
              color="bg-primary"
              pct={pct?.total_revenue}
            />
            <MetricCard
              label="Total Orders"
              value={cur?.total_orders}
              icon={<FaShoppingBag className="text-white text-lg" />}
              color="bg-violet-500"
              pct={pct?.total_orders}
            />
            <MetricCard
              label="New Customers"
              value={cur?.total_customers}
              icon={<FaUsers className="text-white text-lg" />}
              color="bg-emerald-500"
              pct={pct?.total_customers}
            />
            <MetricCard
              label="Avg. Order Value"
              value={fmtCurrency(avgOrder)}
              sub={`across ${cur?.total_orders ?? 0} orders`}
              icon={<FaCalculator className="text-white text-lg" />}
              color="bg-orange-400"
            />
          </div>

          {/* ── Revenue trend + Order status ── */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
            style={{ minHeight: 220 }}
          >
            <div className="lg:col-span-2">
              {ordersLoading ? (
                <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 h-full flex items-center justify-center text-[#bbb] text-sm">
                  Loading trend…
                </div>
              ) : (
                <TrendChart buckets={buckets} />
              )}
            </div>
            {ordersLoading ? (
              <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 flex items-center justify-center text-[#bbb] text-sm">
                Loading…
              </div>
            ) : (
              <StatusBreakdown orders={filtered} />
            )}
          </div>

          {/* ── Top services + Payment methods ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {ordersLoading ? (
              <>
                <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 h-40 flex items-center justify-center text-[#bbb] text-sm">
                  Loading…
                </div>
                <div className="bg-white border border-[#EFEFEF] rounded-2xl p-5 h-40 flex items-center justify-center text-[#bbb] text-sm">
                  Loading…
                </div>
              </>
            ) : (
              <>
                <TopServices orders={filtered} />
                <PaymentMethods orders={filtered} />
              </>
            )}
          </div>

          {/* ── Pending orders count ── */}
          {!ordersLoading && cur?.pending_orders > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-4 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
              <p className="text-sm text-yellow-800">
                <strong>{cur.pending_orders}</strong> order
                {cur.pending_orders !== 1 ? "s are" : " is"} still{" "}
                <strong>pending</strong> — waiting to be picked up for
                processing.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
