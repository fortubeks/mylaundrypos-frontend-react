import Fuse from "fuse.js";

export const appRoutes = [
  "/dashboard/get-started",
  "/dashboard/unauthorized",
  "/dashboard/help-center",
  "/dashboard/settings/overview",
  "/dashboard/settings/update-profile",
  "/dashboard/settings/account-security",
  "/dashboard/settings/billing-history",
  "/dashboard/settings/billing-history/shipping",
  "/dashboard/settings/payment-methods",
  "/dashboard/settings/shipping-address",
  "/dashboard/shipping/rate-comparison",
  "/dashboard/shipping/rate-comparison/compare-all",
  "/dashboard/shipping/rate-comparison/compare-specific",
  "/dashboard/shipping/create-shipment",
  // "/dashboard/shipping/create-shipment/shipping-details",
  // "/dashboard/shipping/create-shipment/review-details",
  // "/dashboard/shipping/create-shipment/review-details/pickup",
  // "/dashboard/shipping/create-shipment/review-details/drop",
  // "/dashboard/shipping/create-shipment/payment",
  // "/dashboard/shipping/create-shipment/payment/pay",
  // "/dashboard/shipping/create-shipment/download-documents",
  "/dashboard/shipping/view-shipments",
  // "/dashboard/shipping/track-shipment",
  "/dashboard/shipping/address-book",
  "/dashboard/shipping/saved-packages",
  "/dashboard/settings/billing-history/subscription",
  "/dashboard/settings/subscription",
  "/dashboard/analytics-and-reports",
  "/dashboard/warehouse-management",
  "/dashboard/quotes-and-payments",
];

// export const fuse = new Fuse(appRoutes, {
//   includeScore: true,
//   threshold: 0.4, // lower = stricter; try 0.3–0.5
//   ignoreLocation: true,
//   keys: [], // because routes are strings
// });

export const fuse = new Fuse(appRoutes, {
  includeScore: true,
  includeMatches: true,
  threshold: 0.4,
  ignoreLocation: true,
  keys: [],
});
