import { getToken } from "firebase/messaging";
import { messaging } from "../../../firebase";
import { store } from "../../store/store";
import { updateUserInfo } from "../../store/slices/userSlice";
import { RequestService } from "../../services";

export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    try {
      const fcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_API_FIREBASE_VAPID_KEY,
      });

      if (fcmToken) {
        console.log("FCM Token:", fcmToken);
        store.dispatch(updateUserInfo({ fcmToken }));
        const subscribe = await RequestService.post(
          "/notifications/subscribe",
          {
            browser_fcm_token: fcmToken,
            platform: "browser",
            // topic: "general",
            // fcmToken
          }
        );
        console.log("FCM Token saved:", subscribe);
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
    }
  } else {
    console.warn("Notification permission not granted");
  }
};

export const addFcmToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    try {
      const fcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_API_FIREBASE_VAPID_KEY,
      });

      if (fcmToken) {
        console.log("FCM Token:", fcmToken);
        store.dispatch(updateUserInfo({ fcmToken }));
        const saveToken = await RequestService.post("/fcm-token", {
          fcm_token: fcmToken,
        });
        console.log("FCM Token saved:", saveToken);
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    } catch (err) {
      console.error("An error occurred while retrieving token. ", err);
    }
  } else {
    console.warn("Notification permission not granted");
  }
};

export const sendNotificationTest = async () => {
  try {
    const response = await RequestService.post("/notifications/send", {
      title: "Shipment Update",
      body: "Your shipment is on the way to you!",
      image_url: "/images/test-notification.png",
      click_url: "/dashboard/shipments",
    });
    console.log("Notification sent:", response);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export const showInAppNotification = (payload) => {
  const { title, body } = payload.notification || {};
  const data = payload.data || {};

  const container = document.createElement("div");
  container.className =
    "fixed top-5 right-5 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-[9999999]";
  container.style.minWidth = "280px";

  container.innerHTML = `
    <h4 class="text-lg font-semibold">${title || "Notification"}</h4>
    <p class="text-sm text-gray-700">${body || ""}</p>
  `;

  // <div class="flex justify-end mt-2 space-x-2">
  //   $
  //   {data.url
  //     ? `<button class="text-blue-600 hover:underline" id="view-btn">View</button>`
  //     : ""}
  //   <button class="text-gray-500 hover:text-gray-700" id="dismiss-btn">
  //     Dismiss
  //   </button>
  // </div>;
  document.body.appendChild(container);

  const dismiss = () => container.remove();

  container.querySelector("#dismiss-btn")?.addEventListener("click", dismiss);
  container.querySelector("#view-btn")?.addEventListener("click", () => {
    window.location.href = data.url;
    dismiss();
  });

  setTimeout(dismiss, 5000);
};
