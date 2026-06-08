import { useSelector } from "react-redux";
import FeatureLockedPage from "./dashboard/general/FeatureLockedPage";

/**
 * Wraps a route that requires an active Growth subscription.
 * Starter subscribers and unsubscribed users are redirected to /dashboard/pricing.
 */
const GrowthRoute = ({ children, featureName = "This page", description }) => {
  const subscription = useSelector((state) => state.user.subscription);
  const subscriptionLoading = useSelector(
    (state) => state.user.subscriptionLoading,
  );

  if (subscription === null || subscriptionLoading) {
    return (
      <div className="flex grow h-full w-full justify-center items-center text-[#959595] text-sm">
        Checking subscription…
      </div>
    );
  }

  const isGrowth =
    subscription?.access?.marketing ||
    (subscription?.has_paid && subscription?.subscription?.plan === "growth");

  if (!isGrowth) {
    return (
      <FeatureLockedPage
        featureName={featureName}
        requiredPlan="Growth"
        description={description}
      />
    );
  }

  return children;
};

export default GrowthRoute;
