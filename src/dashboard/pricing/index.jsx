import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SubscriptionService } from "../../services";
import {
  updateSubscription,
  setSubscriptionLoading,
} from "../../store/slices/userSlice";
import { usePaystack } from "../../utils/usePaystack";
import { FaCheck, FaTimes, FaCrown, FaLock } from "react-icons/fa";
import toast from "../../utils/Toast";

// ─── Plan definitions (monthly only) ────────────────────────────
const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Core POS features to get your laundry business running.",
    features: [
      "Dashboard",
      "Order Management",
      "Customer Management",
      "Laundry & Service Items",
      "Settings",
    ],
    locked: ["Reports & Analytics", "Email Marketing"],
    cta: "Current Plan",
    free: true,
  },
  {
    id: "starter",
    name: "Starter",
    price: 3500,
    description: "Unlock reports and marketing for growing businesses.",
    features: [
      "Everything in Free",
      "Reports & Analytics",
      "Email Marketing Campaigns",
    ],
    locked: [],
    cta: "Get Starter",
  },
  {
    id: "growth",
    name: "Growth",
    price: 14500,
    description: "Built for laundries ready to scale.",
    features: [
      "Everything in Starter",
      "Priority Support",
      "Advanced Features (Coming Soon)",
    ],
    locked: [],
    cta: "Get Growth",
    recommended: true,
  },
];

const fmt = (n) =>
  n === 0
    ? "Free"
    : new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 0,
      }).format(n);

// ─── Individual plan card ────────────────────────────────────────
function PlanCard({ plan, currentPlan, isPremium, onSubscribe, loading }) {
  const isCurrentPlan = currentPlan === plan.id;
  const isActive = isCurrentPlan && (plan.free ? true : isPremium);
  const disabled = plan.free || isActive || loading;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 p-6 gap-5 transition-all bg-white ${
        plan.recommended ? "border-primary shadow-lg" : "border-[#EFEFEF]"
      }`}
    >
      {plan.recommended && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs px-4 py-1 rounded-full flex items-center gap-1.5 whitespace-nowrap">
          <FaCrown className="text-yellow-300 text-[10px]" />
          Most Popular
        </span>
      )}

      {isActive && (
        <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
          Active
        </span>
      )}

      {/* Plan name & price */}
      <div>
        <h2 className="text-lg font-bold text-[#212121]">{plan.name}</h2>
        <p className="text-sm text-[#959595] mt-1">{plan.description}</p>
      </div>

      <div className="flex items-end gap-1">
        <span className="text-3xl font-extrabold text-[#212121]">
          {fmt(plan.price)}
        </span>
        {plan.price > 0 && (
          <span className="text-[#959595] text-sm mb-1">/month</span>
        )}
      </div>

      {/* Included features */}
      <ul className="flex flex-col gap-2">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <FaCheck className="text-primary mt-0.5 shrink-0" />
            <span className="text-[#444]">{f}</span>
          </li>
        ))}
        {/* Locked/unavailable features */}
        {plan.locked.map((f, i) => (
          <li
            key={`l${i}`}
            className="flex items-start gap-2 text-sm opacity-50"
          >
            <FaTimes className="text-[#bbb] mt-0.5 shrink-0" />
            <span className="text-[#999] line-through">{f}</span>
          </li>
        ))}
      </ul>

      <button
        disabled={disabled}
        onClick={() => !disabled && onSubscribe(plan.id)}
        className={`mt-auto w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
          disabled
            ? "bg-[#F3F3F3] text-[#999] cursor-not-allowed"
            : "bg-primary text-white hover:opacity-90 active:scale-95"
        }`}
      >
        {loading && !plan.free && !isActive ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Processing…
          </span>
        ) : isActive ? (
          "Current Plan"
        ) : plan.free ? (
          "Free Forever"
        ) : (
          <>
            <FaLock className="text-xs opacity-70" />
            {plan.cta}
          </>
        )}
      </button>
    </div>
  );
}

// ─── Main Pricing Page ───────────────────────────────────────────
export default function Pricing() {
  const dispatch = useDispatch();
  const subscription = useSelector((state) => state.user.subscription);
  const subscriptionLoading = useSelector(
    (state) => state.user.subscriptionLoading,
  );
  const user = useSelector((state) => state.user.user);

  const [activatingPlan, setActivatingPlan] = useState(null); // plan id being activated
  const { openPaystack } = usePaystack();

  const fetchSubscription = useCallback(async () => {
    dispatch(setSubscriptionLoading(true));
    try {
      const data = await SubscriptionService.getStatus();
      dispatch(updateSubscription(data));
    } catch {
      // ignore
    } finally {
      dispatch(setSubscriptionLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // kobo amounts matching the backend
  const PLAN_AMOUNTS = { starter: 350000, growth: 1450000 };

  const handleSubscribe = async (planId) => {
    if (!planId || planId === "free") return;

    setActivatingPlan(planId);

    // Step 1 — Initialize on backend
    let reference;
    try {
      const data = await SubscriptionService.initializePayment(planId);
      reference = data.reference;
    } catch (err) {
      console.error("Initialize failed", err);
      toast.error?.(
        err?.response?.data?.message ||
          "Could not initialize payment. Please try again.",
      );
      setActivatingPlan(null);
      return;
    }

    // Step 2 — Open Paystack popup (errors here are popup/network issues, not init issues)
    try {
      await openPaystack({
        email: user?.email,
        amount: PLAN_AMOUNTS[planId],
        reference,
        onSuccess: async (transaction) => {
          // Step 3 — Verify on backend
          try {
            const ref = transaction?.reference || reference;
            const updated = await SubscriptionService.verifyPayment(ref);
            dispatch(updateSubscription(updated));
            toast.success?.(
              "Subscription activated! Welcome to " +
                planId.charAt(0).toUpperCase() +
                planId.slice(1) +
                "!",
            );
          } catch (err) {
            console.error("Verify failed", err);
            toast.error?.(
              "Payment received but activation failed. Please contact support.",
            );
          } finally {
            setActivatingPlan(null);
          }
        },
        onClose: () => {
          setActivatingPlan(null);
        },
      });
    } catch (err) {
      console.error("Popup error", err);
      toast.error?.(
        err?.message || "Could not open payment popup. Please try again.",
      );
      setActivatingPlan(null);
    }
  };

  const currentPlan = subscription?.subscription?.plan ?? "free";
  const isPremium = subscription?.has_premium ?? false;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col items-center gap-10 px-4 py-10 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-[#212121]">
            Simple, transparent pricing
          </h1>
          <p className="text-[#959595] text-sm">
            Starter and Growth plans unlock Reports &amp; Marketing. Billed
            monthly — cancel anytime.
          </p>
        </div>

        {/* Plan cards */}
        {subscriptionLoading && !subscription ? (
          <div className="flex items-center justify-center h-40 text-[#959595] text-sm">
            Loading plans…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentPlan={currentPlan}
                isPremium={isPremium}
                onSubscribe={handleSubscribe}
                loading={activatingPlan === plan.id}
              />
            ))}
          </div>
        )}

        {/* Active plan expiry notice */}
        {subscription?.subscription?.ends_at && isPremium && (
          <p className="text-sm text-[#959595]">
            Your <span className="font-semibold capitalize">{currentPlan}</span>{" "}
            plan renews on{" "}
            <strong>
              {new Date(subscription.subscription.ends_at).toLocaleDateString(
                "en-NG",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </strong>
            .
          </p>
        )}

        {/* Payment note */}
        <p className="text-xs text-[#bbb] text-center">
          Payments are processed securely via Paystack. Subscriptions auto-renew
          monthly until cancelled.
        </p>
      </div>
    </div>
  );
}
