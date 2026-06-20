import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCheck,
  FaClock,
  FaCreditCard,
  FaCrown,
  FaHistory,
  FaLock,
} from "react-icons/fa";
import { SubscriptionService } from "../../services";
import {
  setSubscriptionLoading,
  updateSubscription,
} from "../../store/slices/userSlice";
import { usePaystack } from "../../utils/usePaystack";
import toast from "../../utils/Toast";

const FALLBACK_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Core POS operations with no recurring billing.",
    features: [
      "Dashboard",
      "Orders",
      "Customers",
      "Laundry & Service Items",
      "Settings",
    ],
    restricted: ["Reports", "Marketing", "Bookings", "Landing Page"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 3500,
    description: "Unlock reports and performance insights.",
    features: ["Everything in Free", "Reports & Analytics"],
    restricted: ["Marketing", "Bookings", "Landing Page"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 14500,
    description: "Adds marketing, bookings, landing pages, and priority support.",
    features: [
      "Everything in Starter",
      "Marketing Campaigns",
      "Bookings",
      "Landing Page",
      "Priority Support",
    ],
    restricted: [],
    recommended: true,
  },
];

const formatCurrency = (amount, currency = "NGN") => {
  if (amount == null) return "-";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatPaystackAmount = (amount, currency = "NGN") => {
  if (amount == null) return "-";

  return formatCurrency(amount / 100, currency);
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function planButtonLabel(plan, currentPlan, isActive, renewablePlan) {
  if (plan.id === "free") return "Included";
  if (isActive && currentPlan === plan.id) return "Current Plan";
  if (isActive && currentPlan === "growth" && plan.id === "starter") {
    return "Growth Active";
  }
  if (!isActive && renewablePlan === plan.id) return `Renew ${plan.name}`;
  if (isActive && currentPlan === "starter" && plan.id === "growth") {
    return "Upgrade to Growth";
  }

  return `Subscribe to ${plan.name}`;
}

function PlanCard({
  plan,
  currentPlan,
  isActive,
  renewablePlan,
  activatingPlan,
  onChoosePlan,
}) {
  const isCurrentPlan = isActive && currentPlan === plan.id;
  const isDowngradeWhileGrowthActive =
    isActive && currentPlan === "growth" && plan.id === "starter";
  const lockedFeatures = plan.restricted || [];
  const disabled =
    plan.id === "free" ||
    activatingPlan === plan.id ||
    isCurrentPlan ||
    isDowngradeWhileGrowthActive;

  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-6 shadow-sm transition ${
        plan.recommended
          ? "border-primary bg-[#FCFDFF] shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
          : "border-[#E7E7E7] bg-white"
      }`}
    >
      {plan.recommended && (
        <span className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-full bg-[#F3F7FF] px-3 py-1 text-xs font-semibold text-primary">
          <FaCrown className="text-[11px]" />
          Recommended
        </span>
      )}

      <div>
        <h2 className="text-xl font-bold text-[#212121]">{plan.name}</h2>
        <p className="mt-2 text-sm leading-6 text-[#666666]">
          {plan.description}
        </p>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className="text-4xl font-extrabold text-[#212121]">
          {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
        </span>
        {plan.price > 0 && (
          <span className="pb-1 text-sm text-[#959595]">/month</span>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {plan.features.map((feature) => (
          <div key={feature} className="flex items-start gap-3 text-sm text-[#3A3A3A]">
            <FaCheck className="mt-1 shrink-0 text-primary" />
            <span>{feature}</span>
          </div>
        ))}
        {lockedFeatures.map((feature) => (
          <div
            key={feature}
            className="flex items-start gap-3 text-sm text-[#9B9B9B]"
          >
            <FaLock className="mt-1 shrink-0 text-[#C0C0C0]" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChoosePlan(plan.id)}
        className={`mt-8 inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
          disabled
            ? "cursor-not-allowed bg-[#F2F2F2] text-[#999999]"
            : "bg-primary text-white hover:opacity-90"
        }`}
      >
        {activatingPlan === plan.id
          ? "Opening checkout..."
          : planButtonLabel(plan, currentPlan, isActive, renewablePlan)}
      </button>
    </div>
  );
}

function SummaryCard({ title, value, hint, icon }) {
  return (
    <div className="rounded-3xl border border-[#E7E7E7] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#959595]">
            {title}
          </p>
          <p className="mt-4 text-2xl font-bold text-[#212121]">{value}</p>
          <p className="mt-2 text-sm text-[#666666]">{hint}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5F8FF] text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}

function HistoryTable({ title, icon, emptyText, columns, rows }) {
  return (
    <section className="rounded-3xl border border-[#E7E7E7] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F5F8FF] text-primary">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#212121]">{title}</h3>
          <p className="text-sm text-[#777777]">
            Recent activity across subscriptions and payments.
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-[#FAFAFA] px-5 py-10 text-center text-sm text-[#888888]">
          {emptyText}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EFEFEF] text-[#8A8A8A]">
                {columns.map((column) => (
                  <th key={column.key} className="px-3 py-3 font-semibold">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={`${row.reference || row.plan || index}-${index}`}
                  className="border-b border-[#F4F4F4] last:border-b-0"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-3 py-4 text-[#3A3A3A]">
                      {column.render ? column.render(row) : row[column.key] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function Pricing() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const subscription = useSelector((state) => state.user.subscription);
  const subscriptionLoading = useSelector(
    (state) => state.user.subscriptionLoading,
  );
  const { openPaystack } = usePaystack();

  const [overview, setOverview] = useState(null);
  const [activatingPlan, setActivatingPlan] = useState(null);

  const syncSubscriptionState = useCallback(
    (billingData) => {
      dispatch(
        updateSubscription({
          subscription: billingData?.current_subscription,
          latest_subscription: billingData?.latest_subscription,
          renewable_plan: billingData?.renewable_plan,
          access: billingData?.access,
          has_paid: billingData?.access?.reports ?? false,
          is_active: billingData?.current_subscription?.is_active ?? false,
        }),
      );
    },
    [dispatch],
  );

  const refreshBilling = useCallback(async () => {
    dispatch(setSubscriptionLoading(true));
    try {
      const data = await SubscriptionService.getBillingOverview();
      setOverview(data);
      syncSubscriptionState(data);
    } catch (error) {
      toast.error?.(
        error?.response?.data?.message ||
          "Could not load billing information right now.",
      );
    } finally {
      dispatch(setSubscriptionLoading(false));
    }
  }, [dispatch, syncSubscriptionState]);

  useEffect(() => {
    refreshBilling();
  }, [refreshBilling]);

  const handleChoosePlan = async (planId) => {
    if (!planId || planId === "free") return;

    setActivatingPlan(planId);

    let checkout;
    try {
      checkout = await SubscriptionService.initializePayment(planId);
    } catch (error) {
      toast.error?.(
        error?.response?.data?.message ||
          "Could not initialize checkout. Please try again.",
      );
      setActivatingPlan(null);
      return;
    }

    try {
      await openPaystack({
        email: user?.email,
        amount: checkout.amount,
        reference: checkout.reference,
        onSuccess: async (transaction) => {
          try {
            const verified = await SubscriptionService.verifyPayment(
              transaction?.reference || checkout.reference,
            );
            dispatch(updateSubscription(verified));
            await refreshBilling();
            toast.success?.(
              `${checkout.plan === "growth" ? "Growth" : "Starter"} subscription activated successfully.`,
            );
          } catch (error) {
            toast.error?.(
              error?.response?.data?.message ||
                "Payment succeeded but activation could not be confirmed.",
            );
          } finally {
            setActivatingPlan(null);
          }
        },
        onClose: () => {
          setActivatingPlan(null);
        },
      });
    } catch (error) {
      toast.error?.(
        error?.message || "Could not open Paystack checkout right now.",
      );
      setActivatingPlan(null);
    }
  };

  const plans = overview?.plans || FALLBACK_PLANS;
  const currentSubscription =
    overview?.current_subscription || subscription?.subscription;
  const currentPlan = currentSubscription?.plan || "free";
  const isActive = currentSubscription?.is_active || false;
  const renewablePlan = overview?.renewable_plan || subscription?.renewable_plan;
  const payments = overview?.payments || [];
  const subscriptions = overview?.subscriptions || [];
  const latestSubscription = overview?.latest_subscription;

  return (
    <main className="h-full grow overflow-y-auto bg-[#F8F8F8]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 xl:px-8">
        <section className="rounded-[32px] border border-[#E7E7E7] bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Billing & Subscriptions
              </p>
              <h1 className="mt-3 text-3xl font-bold text-[#212121]">
                Manage your plan, renewals, and payment history
              </h1>
              <p className="mt-3 text-sm leading-6 text-[#666666]">
                Starter unlocks Reports. Growth unlocks Marketing, Bookings,
                and your Landing Page. All recurring payments are processed
                securely through Paystack.
              </p>
            </div>

            <div className="rounded-3xl bg-[#F7FAFF] p-5 xl:min-w-[320px]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7F8DAA]">
                Current plan
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                  <FaCrown />
                </span>
                <div>
                  <p className="text-2xl font-bold capitalize text-[#212121]">
                    {currentPlan}
                  </p>
                  <p className="text-sm text-[#677189]">
                    {isActive
                      ? `Active until ${formatDate(currentSubscription?.ends_at)}`
                      : latestSubscription?.reference
                        ? `Last subscription ended ${formatDate(latestSubscription?.ends_at)}`
                        : "You are currently on the free plan."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <SummaryCard
            title="Plan status"
            value={isActive ? "Active" : "Inactive"}
            hint={
              isActive
                ? `Your current plan renews on ${formatDate(currentSubscription?.ends_at)}.`
                : renewablePlan
                  ? `You can renew your last ${renewablePlan} plan at any time.`
                  : "Choose a plan to start billing from the dashboard."
            }
            icon={<FaClock />}
          />
          <SummaryCard
            title="Last payment"
            value={
              payments[0]
                ? formatPaystackAmount(payments[0].amount_paid, payments[0].currency)
                : "-"
            }
            hint={
              payments[0]
                ? `${payments[0].plan} via ${payments[0].payment_channel || "Paystack"}`
                : "No payment has been recorded yet."
            }
            icon={<FaCreditCard />}
          />
          <SummaryCard
            title="Renewable plan"
            value={
              renewablePlan
                ? renewablePlan.charAt(0).toUpperCase() + renewablePlan.slice(1)
                : "None"
            }
            hint={
              renewablePlan
                ? "Use the plan card below to renew or upgrade from the app."
                : "Your billing history will appear here after your first subscription."
            }
            icon={<FaHistory />}
          />
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {subscriptionLoading && !overview ? (
            <div className="col-span-full rounded-3xl border border-[#E7E7E7] bg-white px-6 py-12 text-center text-sm text-[#888888] shadow-sm">
              Loading billing details...
            </div>
          ) : (
            plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentPlan={currentPlan}
                isActive={isActive}
                renewablePlan={renewablePlan}
                activatingPlan={activatingPlan}
                onChoosePlan={handleChoosePlan}
              />
            ))
          )}
        </section>

        <HistoryTable
          title="Subscription History"
          icon={<FaHistory />}
          emptyText="No subscription history yet. Your successful subscriptions and renewals will appear here."
          columns={[
            {
              key: "plan",
              label: "Plan",
              render: (row) => (
                <span className="font-semibold capitalize text-[#212121]">
                  {row.plan}
                </span>
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <span className="inline-flex rounded-full bg-[#F4F7FB] px-3 py-1 text-xs font-semibold capitalize text-[#52627D]">
                  {row.status}
                </span>
              ),
            },
            {
              key: "starts_at",
              label: "Started",
              render: (row) => formatDate(row.starts_at),
            },
            {
              key: "ends_at",
              label: "Ends",
              render: (row) => formatDate(row.ends_at),
            },
            {
              key: "reference",
              label: "Reference",
            },
          ]}
          rows={subscriptions}
        />

        <HistoryTable
          title="Payment History"
          icon={<FaCreditCard />}
          emptyText="No payments recorded yet. Successful payments will appear here after checkout or renewal."
          columns={[
            {
              key: "paid_at",
              label: "Date",
              render: (row) => formatDate(row.paid_at),
            },
            {
              key: "plan",
              label: "Plan",
              render: (row) => (
                <span className="font-semibold capitalize text-[#212121]">
                  {row.plan}
                </span>
              ),
            },
            {
              key: "amount_paid",
              label: "Amount",
              render: (row) => formatPaystackAmount(row.amount_paid, row.currency),
            },
            {
              key: "payment_channel",
              label: "Channel",
              render: (row) => row.payment_channel || "Paystack",
            },
            {
              key: "reference",
              label: "Reference",
            },
          ]}
          rows={payments}
        />
      </div>
    </main>
  );
}
