// import { useEffect } from "react";
// import { useNavigate } from "react-router";
// import { AuthService, cleanUpErr, UserService } from "../services";
// import toast from "../utils/Toast";
// import { isVerified } from "../store/slices/userSlice";
// import { useDispatch } from "react-redux";

// const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// export default function GoogleButton() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const navigateAndClearHistory = (route) => {
//     navigate(route, { replace: true });
//     window.history.replaceState(null, "", route);

//     window.history.pushState(null, "", route);

//     const handlePopState = () => {
//       window.history.pushState(null, "", route);
//       window.removeEventListener("popstate", handlePopState);
//     };

//     window.addEventListener("popstate", handlePopState);
//   };

//   useEffect(() => {
//     if (!window.google) return;

//     window.google.accounts.id.initialize({
//       client_id: googleClientId,
//       callback: async (response) => {
//         try {
//           const idToken = response.credential;
//           const payload = JSON.parse(atob(idToken.split(".")[1]));
//           console.log("Google ID Token Payload:", payload);
//           const data = {
//             provider: "google",
//             provider_id: payload.sub,
//             provider_token: idToken,
//             email: payload.email,
//             name: payload.name,
//           };

//           const res = await AuthService.socialAuth(data);
//           console.log(res);
//           localStorage.setItem(
//             "laundry::auth",
//             JSON.stringify({
//               token: res?.data?.token,
//               userId: res?.data?.user.id,
//             }),
//           );

//           await UserService.getUser();

//           toast.success("Login Successful");
//           const route =
//             // ? "/dashboard/get-started"
//             "/dashboard/dashboard";

//           dispatch(isVerified(true));
//           navigateAndClearHistory(route);
//         } catch (err) {
//           cleanUpErr(err);
//         }
//       },
//     });
//   }, [navigate]);

//   const handleGoogleSignIn = () => {
//     if (!window.google) {
//       toast.error("Google SDK not loaded yet. Please refresh.");
//       return;
//     }

//     // Trigger Google One Tap flow for custom button
//     window.google.accounts.id.prompt((notification) => {
//       if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
//         toast.error("Google Sign-In cannot be displayed.");
//       }
//     });
//   };

//   return (
//     <div className="w-full">
//       <button
//         type="button" // important: prevent default form submit
//         className="inline-flex w-full items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors rounded-lg px-7 border bg-gray-100 hover:bg-gray-200"
//         onClick={handleGoogleSignIn}
//       >
//         <svg
//           width="20"
//           height="20"
//           viewBox="0 0 20 20"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
//             fill="#4285F4"
//           />
//           <path
//             d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
//             fill="#34A853"
//           />
//           <path
//             d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
//             fill="#FBBC05"
//           />
//           <path
//             d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
//             fill="#EB4335"
//           />
//         </svg>
//         Sign In with Google
//       </button>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { AuthService, cleanUpErr, UserService } from "../services";
import { isVerified } from "../store/slices/userSlice";
import toast from "../utils/Toast";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const dashboardRoute = "/dashboard/dashboard";

let googleIdentityInitialized = false;
let activeCredentialHandler = null;

export default function GoogleButton({
  label = "Sign in with Google",
  successMessage = "Login Successful",
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hiddenButtonRef = useRef(null);
  const hasRenderedButtonRef = useRef(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const handleGoogleCredential = async (response) => {
      try {
        const idToken = response.credential;

        const payload = JSON.parse(atob(idToken.split(".")[1]));

        const data = {
          provider: "google",
          provider_id: payload.sub,
          provider_token: idToken,
          email: payload.email,
          name: payload.name,
        };

        const res = await AuthService.socialAuth(data);
        const authData = res?.data?.data || res?.data;

        if (!authData?.token || !authData?.user?.id) {
          throw new Error("Google authentication did not return a valid session.");
        }

        // useAuthStore.getState().setSession({
        //   token: authData.token,
        //   user: authData.user,
        // });

        localStorage.setItem(
          "laundry::auth",
          JSON.stringify({
            token: authData.token,
            userId: authData.user.id,
          }),
        );

        await UserService.getUser();
        dispatch(isVerified(true));

        toast.success(successMessage);

        navigate(dashboardRoute, { replace: true });
      } catch (error) {
        cleanUpErr(error);
      }
    };

    activeCredentialHandler = handleGoogleCredential;

    const hiddenButtonContainer = hiddenButtonRef.current;

    if (!hiddenButtonContainer) {
      return undefined;
    }

    let observer;
    let loadTimeoutId;
    let googlePollId;

    const syncGoogleReadyState = () => {
      const renderedButton = hiddenButtonContainer.querySelector(
        "div[role=button]",
      );

      if (renderedButton) {
        setIsGoogleReady(true);
        setLoadFailed(false);
        return true;
      }

      return false;
    };

    const initializeGoogleButton = () => {
      if (!window.google) {
        return;
      }

      if (!googleIdentityInitialized) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: (response) => activeCredentialHandler?.(response),
          auto_select: false,
        });

        googleIdentityInitialized = true;
      }

      if (hasRenderedButtonRef.current) {
        syncGoogleReadyState();
        return;
      }

      window.google.accounts.id.renderButton(hiddenButtonContainer, {
        theme: "outline",
        size: "large",
      });

      hasRenderedButtonRef.current = true;

      if (syncGoogleReadyState()) {
        return;
      }

      observer = new MutationObserver(() => {
        if (syncGoogleReadyState()) {
          observer.disconnect();
        }
      });

      observer.observe(hiddenButtonContainer, {
        childList: true,
        subtree: true,
      });
    };

    const googleScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    const handleGoogleLoadTimeout = () => {
      if (!hasRenderedButtonRef.current && !window.google) {
        setLoadFailed(true);
      }
    };

    loadTimeoutId = window.setTimeout(handleGoogleLoadTimeout, 8000);

    googlePollId = window.setInterval(() => {
      if (window.google) {
        initializeGoogleButton();
        window.clearInterval(googlePollId);
      }
    }, 250);

    if (window.google) {
      initializeGoogleButton();
    } else if (googleScript) {
      googleScript.addEventListener("load", initializeGoogleButton);
    } else {
      setLoadFailed(true);
    }

    return () => {
      observer?.disconnect();
      window.clearInterval(googlePollId);
      window.clearTimeout(loadTimeoutId);
      googleScript?.removeEventListener("load", initializeGoogleButton);

      if (activeCredentialHandler === handleGoogleCredential) {
        activeCredentialHandler = null;
      }
    };
  }, [dispatch, navigate, successMessage]);

  const handleCustomGoogleLogin = () => {
    const googleBtn = hiddenButtonRef.current?.querySelector("div[role=button]");

    if (googleBtn) {
      googleBtn.click();
    } else if (loadFailed) {
      toast.error("Google sign-in failed to load. Refresh the page or disable blockers.");
    } else {
      toast.error("Google sign-in is still loading. Please try again.");
    }
  };

  return (
    <div className="w-full">
      {/* Hidden real Google button */}
      <div ref={hiddenButtonRef} style={{ display: "none" }} />

      {/* Your custom button */}
      <button
        type="button"
        onClick={handleCustomGoogleLogin}
        disabled={!isGoogleReady}
        className="inline-flex w-full items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors rounded-lg px-7 border bg-gray-100 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
            fill="#4285F4"
          />
          <path
            d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
            fill="#34A853"
          />
          <path
            d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
            fill="#FBBC05"
          />
          <path
            d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
            fill="#EB4335"
          />
        </svg>
        {isGoogleReady ? label : loadFailed ? "Google unavailable" : "Loading Google..."}
      </button>
    </div>
  );
}
