const GA_MEASUREMENT_ID = "G-FTY3Y5NX6V";

export function trackPageView(pagePath) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: pagePath,
    page_title: document.title,
    page_location: window.location.href,
  });
}
