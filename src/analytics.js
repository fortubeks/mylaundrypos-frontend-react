const GA_MEASUREMENT_ID = "G-FTY3Y5NX6V";
const SIGN_UP_CONVERSION_ID = "AW-10990925394/FaVjCIOPhLMcENLs8Pgo";

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

export function trackSignUpConversion() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "conversion", {
    send_to: SIGN_UP_CONVERSION_ID,
  });
}
