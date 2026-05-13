import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Wraps a route that requires an active Growth subscription.
 * Starter subscribers and unsubscribed users are redirected to /dashboard/pricing.
 */
const GrowthRoute = ({ children }) => {
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
    subscription?.has_premium && subscription?.subscription?.plan === "growth";

  if (!isGrowth) {
    return <Navigate to="/dashboard/pricing" replace />;
  }

  return children;
};

export default GrowthRoute;
