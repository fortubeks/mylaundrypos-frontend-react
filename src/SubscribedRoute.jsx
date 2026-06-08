import { useSelector } from "react-redux";
import FeatureLockedPage from "./dashboard/general/FeatureLockedPage";

/**
 * Wraps a route that requires an active paid subscription.
 * Redirects unsubscribed users to /dashboard/pricing.
 * The Dashboard parent already fetches subscription on mount.
 */
const SubscribedRoute = ({
  children,
  featureName = "This page",
  description,
}) => {
  const subscription = useSelector((state) => state.user.subscription);
  const subscriptionLoading = useSelector(
    (state) => state.user.subscriptionLoading,
  );

  // Still fetching subscription for the first time
  if (subscription === null || subscriptionLoading) {
    return (
      <div className="flex grow h-full w-full justify-center items-center text-[#959595] text-sm">
        Checking subscription…
      </div>
    );
  }

  if (!subscription?.has_paid) {
    return (
      <FeatureLockedPage
        featureName={featureName}
        requiredPlan="Starter"
        description={description}
      />
    );
  }

  return children;
};

export default SubscribedRoute;
