import { Link } from "react-router-dom";
import { FaArrowRight, FaLock } from "react-icons/fa";

const PREVIEW_ITEMS = [
  { title: "Overview", value: "Locked" },
  { title: "Status", value: "Upgrade required" },
  { title: "Access", value: "Restricted" },
  { title: "Plan", value: "Free" },
];

export default function FeatureLockedPage({
  featureName,
  requiredPlan,
  description,
}) {
  return (
    <main className="relative h-full grow overflow-hidden border border-[#E7E7E7] bg-[#FBFBFB]">
      <div className="pointer-events-none absolute inset-0 p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 blur-[2px] opacity-60">
          {PREVIEW_ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#E7E7E7] bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#959595]">
                {item.title}
              </p>
              <div className="mt-6 h-3 w-3/5 rounded-full bg-[#EAEAEA]" />
              <p className="mt-4 text-sm font-medium text-[#4D4D4D]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 blur-[2px] opacity-50 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-[#E7E7E7] bg-white p-6"
            >
              <div className="h-4 w-32 rounded-full bg-[#EAEAEA]" />
              <div className="mt-5 h-28 rounded-2xl bg-[#F3F3F3]" />
              <div className="mt-4 h-3 w-2/3 rounded-full bg-[#EAEAEA]" />
              <div className="mt-3 h-3 w-1/2 rounded-full bg-[#EAEAEA]" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-white/45 p-5 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F3F7FF] text-primary">
            <FaLock />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-[#212121]">
            {featureName} is on the {requiredPlan} plan
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#666666]">
            {description ||
              `Upgrade to ${requiredPlan} to unlock ${featureName.toLowerCase()} and keep everything in one workflow.`}
          </p>
          <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-[#F8FAFC] p-4 text-sm text-[#4D4D4D]">
            <div className="flex items-center justify-between gap-3">
              <span>Required plan</span>
              <strong className="text-[#212121]">{requiredPlan}</strong>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Open from</span>
              <strong className="text-[#212121]">Billing & Subscriptions</strong>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/dashboard/billing"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Upgrade now
              <FaArrowRight className="text-xs" />
            </Link>
            <Link
              to="/dashboard/pricing"
              className="inline-flex items-center justify-center rounded-2xl border border-[#D9E1F2] px-5 py-3 text-sm font-semibold text-[#274690] transition hover:bg-[#F5F8FF]"
            >
              Compare plans
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}