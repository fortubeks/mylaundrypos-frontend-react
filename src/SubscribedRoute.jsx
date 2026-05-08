import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * Wraps a route that requires an active Pro subscription.
 * Redirects unsubscribed users to /dashboard/pricing.
 * The Dashboard parent already fetches subscription on mount.
 */
const SubscribedRoute = ({ children }) => {
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

  if (!subscription?.has_premium) {
    return <Navigate to="/dashboard/pricing" replace />;
  }

  return children;
};

export default SubscribedRoute;
