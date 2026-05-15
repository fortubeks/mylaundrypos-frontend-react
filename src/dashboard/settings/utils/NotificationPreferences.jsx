import { useEffect, useState } from "react";
import { cleanUpErr, RequestService } from "../../../services";
import { NotificationService } from "../../../services/notification";
import toast from "../../../utils/Toast";
import { RiMailLine, RiBellLine } from "react-icons/ri";

export default function NotificationPreferences() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await RequestService.get("/user/settings");
        const setting = res.data?.data?.setting;
        if (
          setting &&
          typeof setting.booking_email_notifications !== "undefined"
        ) {
          setEmailEnabled(Boolean(setting.booking_email_notifications));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = async () => {
    const newValue = !emailEnabled;
    setEmailEnabled(newValue);
    setLoading(true);
    try {
      await NotificationService.updateEmailPreference(newValue);
      toast.success(
        newValue
          ? "Booking email notifications enabled"
          : "Booking email notifications disabled",
      );
    } catch (err) {
      setEmailEnabled(!newValue); // revert
      cleanUpErr(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E7E7E7] rounded-[14px] p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <RiBellLine className="text-[#00BE9C] text-xl" />
        <h3 className="font-semibold text-[#292D32] text-sm">
          Notification Preferences
        </h3>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <RiMailLine className="text-gray-400 text-lg mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-[#292D32]">
              Booking Email Notifications
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Receive an email whenever a customer makes a new booking through
              your landing page.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading || fetching}
          className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200 focus:outline-none ${
            emailEnabled ? "bg-[#00BE9C]" : "bg-gray-300"
          } ${loading || fetching ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          role="switch"
          aria-checked={emailEnabled}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
              emailEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
