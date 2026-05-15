import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { setNotificationPanelOpen } from "../store/slices/notificationSlice";
import { NotificationService } from "../services/notification";
import {
  RiCheckDoubleLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiCalendarCheckLine,
  RiNotification3Line,
} from "react-icons/ri";

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const ICON_MAP = {
  booking: <RiCalendarCheckLine className="text-[#00BE9C] text-lg shrink-0" />,
};

export default function NotificationPanel() {
  const dispatch = useDispatch();
  const { panelOpen, notifications, unreadCount, loading } = useSelector(
    (s) => s.notifications,
  );
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!panelOpen) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        dispatch(setNotificationPanelOpen(false));
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [panelOpen, dispatch]);

  const handleMarkRead = (id) => {
    NotificationService.markRead(id);
  };

  const handleMarkAllRead = () => {
    NotificationService.markAllRead();
  };

  const handleDelete = (id) => {
    NotificationService.deleteNotification(id);
  };

  return (
    <AnimatePresence>
      {panelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[10999] bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setNotificationPanelOpen(false))}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-[11009] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E7E7] shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-[#292D32] text-base">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="text-xs font-bold bg-[#00BE9C] text-white rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    title="Mark all as read"
                    className="text-[#00BE9C] text-xs font-medium flex items-center gap-1 px-2 py-1 rounded hover:bg-[#e6f9f5] transition-colors"
                  >
                    <RiCheckDoubleLine />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => dispatch(setNotificationPanelOpen(false))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400"
                >
                  <RiCloseLine className="text-xl" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="flex justify-center items-center py-12 text-gray-400 text-sm">
                  Loading…
                </div>
              )}

              {!loading && notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                  <RiNotification3Line className="text-5xl opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              )}

              {!loading &&
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-5 py-4 border-b border-[#F4F4F4] cursor-pointer transition-colors ${
                      !n.read_at ? "bg-[#f0fdf9]" : "hover:bg-gray-50"
                    }`}
                    onClick={() => !n.read_at && handleMarkRead(n.id)}
                  >
                    <div className="mt-1">
                      {ICON_MAP[n.type] ?? (
                        <RiNotification3Line className="text-gray-400 text-lg shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-snug ${
                          !n.read_at
                            ? "font-semibold text-[#292D32]"
                            : "text-[#292D32]"
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {n.body}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(n.id);
                      }}
                      className="self-start mt-1 w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors shrink-0"
                      title="Delete"
                    >
                      <RiDeleteBinLine className="text-sm" />
                    </button>
                  </div>
                ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
