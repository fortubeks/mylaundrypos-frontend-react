import { Outlet } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
// import TopBar from "../layout/TopBar";
import { PopOut } from "./general";
// import Notification from "./general/Notification";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import { Logout } from "../utils/Logout";

export default function Dashboard() {
  const idleTimerRef = useRef(null);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("hasSeenTutorial");

    if (!seen) {
      setShowTutorial(true);
    }
  }, []);

  const handleCloseTutorial = () => {
    localStorage.setItem("hasSeenTutorial", "true");
    setShowTutorial(false);
  };

  const handleLogout = useCallback(() => {
    Logout("You have been logged out due to inactivity", "/login");
  }, []);

  const onIdle = () => {
    console.log("User is idle");
    handleLogout();
  };

  useIdleTimer({
    ref: idleTimerRef,
    timeout: 1000 * 60 * 60,
    onIdle,
    // onActive,
    // onAction,
    debounce: 500,
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        localStorage.setItem("hiddenTime", Date.now().toString());
      } else if (document.visibilityState === "visible") {
        const hiddenTime = localStorage.getItem("hiddenTime");
        if (hiddenTime) {
          const timeAway = Date.now() - Number(hiddenTime);
          if (timeAway > 1000 * 60 * 60) {
            handleLogout();
          } else {
            localStorage.removeItem("hiddenTime");
          }
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleLogout]);

  return (
    <main className="flex h-screen overflow-hidden bg-[#F9F8F8]">
      <Sidebar />
      <section className="overflow-y-hidden overflow-x-hidden min-h-full h-full grow w-full flex flex-col gap-1.5 transition-all ease-in-out duration-500">
        {/* <TopBar /> */}
        <section className={`grow h-full bg-white overflow-hidden `}>
          <Outlet />
        </section>
      </section>
      {showTutorial && (
        <PopOut
          child={
            <div className="w-full h-full">
              <iframe
                className="w-full h-full"
                // https://youtu.be/4hG5kiS9Ekg
                src="https://www.youtube.com/embed/4hG5kiS9Ekg?autoplay=1"
                title="Instruction Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          }
          onClick={handleCloseTutorial}
        />
      )}
      {/* {notification && (
        <PopOut
          child={<Notification />}
          onClick={() => dispatch(setShowNotification(false))}
        />
      )} */}
    </main>
  );
}
