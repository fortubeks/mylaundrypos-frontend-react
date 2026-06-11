const SIGN_UP_CONVERSION_ID = "AW-10990925394/cRHBCJGhqrMcENLs8Pgo";
// const DASHBOARD_CONVERSION_ID = "AW-10990925394/8x7mCM-mqLMcENLs8Pgo";

function trackConversion(sendTo, sessionKey) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  if (sessionKey && window.sessionStorage.getItem(sessionKey)) {
    return;
  }

  window.gtag("event", "conversion", {
    send_to: sendTo,
  });

  if (sessionKey) {
    window.sessionStorage.setItem(sessionKey, "true");
  }
}

export function trackPageView(pagePath) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_title: document.title,
      page_location: window.location.href,
    });
  }

  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
}

export function trackSignUpConversion() {
  trackConversion(SIGN_UP_CONVERSION_ID);
}

// export function trackDashboardConversion() {
//   trackConversion(DASHBOARD_CONVERSION_ID, "laundry::dashboard-conversion");
// }
