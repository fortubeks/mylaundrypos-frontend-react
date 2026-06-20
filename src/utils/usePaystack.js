import { useCallback, useEffect } from "react";

const PAYSTACK_SCRIPT_URL = "https://js.paystack.co/v1/inline.js";
const PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

/** Resolves when window.PaystackPop is available. */
function waitForPaystack(timeout = 8000) {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve();
    const start = Date.now();
    const id = setInterval(() => {
      if (window.PaystackPop) {
        clearInterval(id);
        resolve();
      } else if (Date.now() - start > timeout) {
        clearInterval(id);
        reject(
          new Error("Paystack failed to load. Check your internet connection."),
        );
      }
    }, 100);
  });
}

/**
 * Loads the Paystack inline JS script once and returns an `openPaystack`
 * function that shows the Paystack payment popup.
 *
 * Usage:
 *   const { openPaystack } = usePaystack();
 *   openPaystack({ email, amount, reference, onSuccess, onClose });
 *
 * amount — in kobo (e.g. 350000 for ₦3,500)
 */
export function usePaystack() {
  useEffect(() => {
    if (document.getElementById("paystack-inline-script")) return;
    const script = document.createElement("script");
    script.id = "paystack-inline-script";
    script.src = PAYSTACK_SCRIPT_URL;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openPaystack = useCallback(
    async ({ email, amount, reference, accessCode, onSuccess, onClose }) => {
      await waitForPaystack();

      const handler = window.PaystackPop.setup({
        key: PUBLIC_KEY,
        email,
        amount,
        ref: reference,
        channels: ["card"],
        callback: (response) => {
          if (onSuccess) onSuccess(response);
        },
        onClose: () => {
          if (onClose) onClose();
        },
      });

      handler.openIframe();
    },
    [],
  );

  return { openPaystack };
}
