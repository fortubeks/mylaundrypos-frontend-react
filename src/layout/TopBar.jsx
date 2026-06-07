import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// import { ButtonPrimary } from "../utils/Button";
import { useDispatch, useSelector } from "react-redux";
import { setSidebar } from "../store/slices/generalSlice";
import { setNotificationPanelOpen } from "../store/slices/notificationSlice";
import { getProfileMenuItems } from "../dashboard/Navlinks";
import { useIsMobile } from "../utils/use-mobile";
import { Logout } from "../utils/Logout";
import { AnimatePresence, motion } from "framer-motion";
import { RiMenu3Line, RiNotification3Line } from "react-icons/ri";
import NotificationPanel from "./NotificationPanel";
import { NotificationService } from "../services/notification";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  customers: "Customers",
  orders: "Orders",
  "create-order": "Create Order",
  "laundry-items": "Laundry Items",
  "service-items": "Service Items",
  "orders-service-items": "Orders Service Items",
  reports: "Reports & Insights",
  marketing: "Email Marketing",
  bookings: "Bookings",
  "landing-page": "Landing Page",
  pricing: "Pricing & Plans",
  billing: "Billing & Subscriptions",
  settings: "Settings",
  profile: "Profile",
};

export default function TopBar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const open = useSelector((state) => state.general.sidebar);
  const isMobile = useIsMobile();
  const unreadCount = useSelector((s) => s.notifications.unreadCount);

  const segment = location?.pathname?.split("/")?.slice(2)[0] ?? "";
  const pageTitle =
    PAGE_TITLES[segment] ??
    segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // Fetch notifications on mount
  useEffect(() => {
    NotificationService.fetchNotifications();
  }, []);

  return (
    <>
      <div className="px-3 sm:px-5 sticky top-0 left-0 flex items-center justify-between z-[999] gap-2 sm:gap-4 border border-[#E7E7E7] bg-white rounded-t-[20px] transition-all duration-500 ease-in-out min-h-[56px]">
        {isMobile && (
          <button
            onClick={() => dispatch(setSidebar(!open))}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 shrink-0"
            aria-label="Toggle sidebar"
          >
            <RiMenu3Line className="text-xl text-[#292D32]" />
          </button>
        )}

        <h2 className="font-semibold text-[#292D32] text-base capitalize flex-1 truncate">
          {pageTitle}
        </h2>

        <div className="flex gap-2 sm:gap-4 items-center py-2 shrink-0">
          {/* Bell icon */}
          <button
            onClick={() => dispatch(setNotificationPanelOpen(true))}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <RiNotification3Line className="text-xl text-[#292D32]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#00BE9C] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <ProfileDropdown />
        </div>
      </div>

      <NotificationPanel />
    </>
  );
}

function ProfileDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const disableSidebar = useSelector((state) => state.general.disableSidebar);
  const profileMenuItems = getProfileMenuItems(dispatch);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "UN";

  const handleLogout = () => {
    Logout("Logging out", "/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors relative shrink-0"
        aria-label="Profile menu"
      >
        <span className="text-gray-600 font-medium text-sm">{initials}</span>
        <span className="w-2 h-2 bg-[#00BE9C] block absolute bottom-0 right-0 rounded-full border border-white"></span>
      </button>

      <AnimatePresence>
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-[10000]"
              onClick={() => setShowDropdown(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-12 w-72 bg-white rounded-lg pt-2 z-[10001] shadow-[4px_4px_20px_6px_#0000000D]"
            >
              <div className="px-3">
                <div className="flex items-center gap-3 px-3 py-3 bg-[#F9F8F8] rounded-[10px]">
                  <div className="w-10 h-10 bg-gray-200 relative rounded-full flex items-center justify-center shrink-0">
                    <span className="text-gray-600 font-medium">
                      {initials}
                    </span>
                    <span className="w-2 h-2 bg-[#00BE9C] block absolute bottom-0 right-1 rounded-full"></span>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {user?.name || "User Name"}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="relative">
                {profileMenuItems.map((item, index) => {
                  const showDivider = index < profileMenuItems.length - 1;

                  return (
                    <div key={index}>
                      <button
                        className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-md transition-colors ${
                          item.isLogout
                            ? "font-semibold hover:bg-red-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          if (item.isLogout) {
                            handleLogout();
                          } else if (item.external) {
                            window.open(item.path, "_blank");
                          } else if (item.action) {
                            item.action();
                          } else {
                            navigate(item.path);
                          }
                          setShowDropdown(false);
                        }}
                        disabled={
                          !(!disableSidebar || item.isLoggin || !item.external)
                        }
                      >
                        <span className="text-sm flex items-center gap-1">
                          {item.name}
                        </span>
                        {item.icon && (
                          <span className="text-gray-400 text-xs">
                            {item.icon}
                          </span>
                        )}
                      </button>
                      {showDivider && (
                        <div className="border-t border-[#EFEFEF]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
