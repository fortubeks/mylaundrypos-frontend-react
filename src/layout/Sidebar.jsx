import { motion } from "framer-motion";
import logoIcon from "/logos/green-blue-icon.png";
import logoFull from "/logos/green-blue-text.png";
import leftArr from "../assets/icons/left.svg";
// import search from "../assets/icons/search.svg";

import { NavLink, useNavigate } from "react-router-dom";
import { navLinks, otherLinks } from "../dashboard/Navlinks";
import { useDispatch, useSelector } from "react-redux";
import { setShowSearch, setSidebar } from "../store/slices/generalSlice";
import { useState } from "react";
import { useIsMobile } from "../utils/use-mobile";
import { FaVideo, FaLock } from "react-icons/fa";

export default function Sidebar() {
  // const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const open = useSelector((state) => state.general.sidebar);
  const subscription = useSelector((state) => state.user.subscription);
  const hasPremium = subscription?.has_premium ?? false;
  const isGrowth = hasPremium && subscription?.subscription?.plan === "growth";
  const disableSidebar = useSelector((state) => state.general.disableSidebar);
  const isMobile = useIsMobile();
  const setOpen = () => {
    dispatch(setSidebar(!open));
  };

  const [isHovered, setIsHovered] = useState(false);
  const baseSidebarWidth = !isMobile
    ? open
      ? "60px"
      : "230px"
    : open
      ? "230px"
      : "0px";
  const showText = !open || isHovered;

  return (
    <motion.nav
      className={`
    ${!isMobile ? "relative" : "absolute z-[9999] h-screen"}
    `}
      style={{ width: baseSidebarWidth }}
    >
      {/* Mobile backdrop - tap outside to close sidebar */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/30 z-[9990]"
          onClick={() => dispatch(setSidebar(false))}
        />
      )}
      <motion.nav
        layout
        className={`top-0 min-h-full h-full shrink-0 bg-[#F9F8F8] py-4 pr-3 flex flex-col gap-4 items-center overflow-y-scroll snap z-[9991] text-sm ${
          !isMobile
            ? open && isHovered
              ? "absolute left-0 rounded-lg px-3 border"
              : "sticky px-3"
            : isMobile && open
              ? "absolute left-0 rounded-lg px-3 border"
              : "hidden"
        }`}
        style={{
          width: !isMobile
            ? open && isHovered
              ? "230px"
              : baseSidebarWidth
            : open
              ? "230px"
              : "0px",
        }}
        onMouseEnter={() => (!isMobile ? open && setIsHovered(true) : null)}
        onMouseLeave={() => (!isMobile ? open && setIsHovered(false) : null)}
      >
        <TitleSection showText={showText} open={open} setOpen={setOpen} />

        <motion.div
          className={`hs-accordion w-full flex flex-col gap-5 py-3 
          ${open ? "items-center" : "items-start"}
          `}
        >
          <motion.div
            className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
            role="region"
            aria-labelledby="account-accordion"
          >
            <motion.div className="space-y-2 text-white">
              {navLinks.map((opt, i) => (
                <Option
                  key={i}
                  title={opt?.name}
                  href={opt?.path}
                  icon={opt?.icon}
                  open={open}
                  showText={showText}
                  disable={disableSidebar}
                  newTab={opt?.new}
                  requiresSubscription={opt?.requiresSubscription}
                  requiresGrowth={opt?.requiresGrowth}
                  hasPremium={hasPremium}
                  isGrowth={isGrowth}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className={`space-y-2 w-full py-3 relative`}>
          <button
            className={`bg-white text-black border border-[#E7E7E7] h-10 px-3 flex items-center gap-2 w-full rounded-[10px] transition-all duration-300 ease-in-out ${!showText && !isMobile ? "justify-center" : "justify-start"}
                h-10 flex items-center gap-1 w-full text-[#292D32] hover:bg-white hover:text-black hover:rounded-lg hover:px-3 transition-all duration-300 ease-in-out ${
                  disableSidebar
                    ? "pointer-events-none cursor-not-allowed text-[#939393]"
                    : ""
                } ${!showText && !isMobile ? "justify-center" : "justify-start"}`}
            onClick={() => dispatch(setShowSearch(true))}
            disabled={disableSidebar}
          >
            <FaVideo className="text-primary" />
            {(showText || isMobile) && (
              <motion.span
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-col"
              >
                Watch Tutorial
              </motion.span>
            )}
          </button>
          {otherLinks.map((opt, i) => {
            const isProfileLink =
              opt.name.toLowerCase().includes("profile") ||
              opt.path.includes("profile");

            // Skip profile link — it lives in the TopBar now
            if (isProfileLink) return null;

            // Hide "Upgrade to Pro" link when user already has premium
            if (opt.proLink && hasPremium) return null;

            // Render the "Upgrade to Pro" link as a styled NavLink
            if (opt.proLink) {
              return (
                <NavLink
                  key={i}
                  to={`/dashboard/${opt.path}`}
                  onClick={() => {
                    if (isMobile) dispatch(setSidebar(false));
                  }}
                  className={({ isActive }) =>
                    `h-10 flex items-center gap-2 w-full rounded-lg px-3 transition-all duration-300 ease-in-out text-yellow-600 hover:bg-yellow-50 ${
                      isActive ? "bg-yellow-50 font-semibold" : ""
                    } ${!showText && !isMobile ? "justify-center" : "justify-start"}`
                  }
                >
                  {opt.icon}
                  {(showText || isMobile) && (
                    <motion.span
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="text-sm font-semibold truncate"
                    >
                      {opt?.name}
                    </motion.span>
                  )}
                </NavLink>
              );
            }

            return (
              <NavLink
                key={i}
                to={`/dashboard/${opt.path}`}
                onClick={() => {
                  if (isMobile) dispatch(setSidebar(false));
                }}
                className={({ isActive }) =>
                  isActive
                    ? `bg-white text-black border border-[#E7E7E7] h-10 px-3 flex items-center gap-2 w-full rounded-[10px] transition-all duration-300 ease-in-out ${
                        disableSidebar
                          ? "pointer-events-none cursor-not-allowed text-[#939393]"
                          : ""
                      } ${!showText && !isMobile ? "justify-center" : "justify-start"}`
                    : `h-10 flex items-center gap-2 w-full text-[#292D32] hover:bg-white hover:text-black hover:rounded-lg hover:px-3 transition-all duration-300 ease-in-out ${
                        disableSidebar
                          ? "pointer-events-none cursor-not-allowed text-[#939393]"
                          : ""
                      } ${!showText && !isMobile ? "justify-center" : "justify-start"}`
                }
              >
                {opt.icon}
                {(showText || isMobile) && (
                  <motion.span
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex flex-col"
                  >
                    {opt?.name}
                  </motion.span>
                )}
              </NavLink>
            );
          })}
        </motion.div>
      </motion.nav>
    </motion.nav>
  );
}

const Option = ({
  title,
  href,
  icon,
  open,
  showText,
  disable,
  newTab,
  requiresSubscription,
  requiresGrowth,
  hasPremium,
  isGrowth,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const locked =
    (requiresSubscription && !hasPremium) || (requiresGrowth && !isGrowth);

  if (locked) {
    return (
      <button
        onClick={() => {
          if (isMobile) dispatch(setSidebar(!open));
          navigate("/dashboard/pricing");
        }}
        className={`h-10 flex items-center gap-2 w-full text-[#999] hover:bg-white hover:text-black hover:rounded-lg hover:px-3 transition-all duration-300 ease-in-out ${
          !showText && !isMobile ? "justify-center px-1" : "justify-start px-3"
        }`}
        title="Upgrade to Pro to unlock"
      >
        {icon}
        {(showText || isMobile) && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="truncate flex items-center gap-1"
          >
            {title}
            <FaLock className="text-xs ml-1 text-[#bbb]" />
          </motion.span>
        )}
        {newTab && (showText || isMobile) && (
          <span className="text-xs bg-[#E5E5E5] text-[#999] px-1.5 py-0.5 rounded-full">
            Pro
          </span>
        )}
      </button>
    );
  }

  return (
    <NavLink
      to={`/dashboard/${href}`}
      className={({ isActive }) =>
        isActive
          ? `bg-white text-black border border-[#E7E7E7] h-10 flex items-center gap-2 w-full rounded-[10px] transition-all duration-300 ease-in-out ${
              disable
                ? "pointer-events-none cursor-not-allowed text-[#939393]"
                : ""
            } ${
              !showText && !isMobile
                ? "justify-center px-1"
                : "justify-start px-3"
            }`
          : `h-10 flex items-center gap-2 w-full text-[#292D32] hover:bg-white hover:text-black hover:rounded-lg hover:px-3 transition-all duration-300 ease-in-out ${
              disable
                ? "pointer-events-none cursor-not-allowed text-[#939393]"
                : ""
            } ${
              !showText && !isMobile
                ? "justify-center px-1"
                : "justify-start px-3"
            }`
      }
      onClick={() => {
        if (isMobile) {
          dispatch(setSidebar(!open));
          console.log(open);
        }
        return null;
      }}
    >
      {/* {href === window.location.pathname.split("/")[2] ? (
        <ColoredIcon src={iconA} disabled={disable} />
      ) : (
        <ColoredIcon src={icon} disabled={disable} />
      )} */}
      {icon}
      {(showText || isMobile) && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="truncate"
        >
          {title}
        </motion.span>
      )}
      {newTab && (showText || isMobile) && (
        <span className="text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">
          New
        </span>
      )}
    </NavLink>
  );
};

const TitleSection = ({ showText, open, setOpen }) => {
  const isMobile = useIsMobile();
  return (
    <div
      className={`w-full relative flex cursor-pointer items-center justify-between transition-colors ${
        !showText && !isMobile && "flex-col gap-4 justify-center"
      }`}
    >
      <img
        src={showText ? logoFull : logoIcon}
        alt=""
        className={`object-contain w-fit h-14 ${open && "h-14"}`}
      />
      {(showText || isMobile) && <ToggleClose open={open} setOpen={setOpen} />}
    </div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={setOpen}
      // className={open && "absolute top-0 right-2"}
    >
      <motion.div layout className="flex items-center cursor-pointer">
        <img
          src={leftArr}
          alt=""
          className={`transition-transform object-contain cursor-pointer ${
            !open && "-rotate-90"
          }`}
        />
      </motion.div>
    </motion.button>
  );
};

// const ColoredIcon = ({
//   src,
//   disabled,
//   color = "bg-gray-400",
//   size = "w-5 h-5",
// }) => {
//   if (!disabled) {
//     return <img src={src} alt="" className={`object-contain`} />;
//   }

//   return (
//     <div
//       className={`object-contain ${size} ${color}`}
//       style={{
//         WebkitMaskImage: `url(${src})`,
//         WebkitMaskRepeat: "no-repeat",
//         WebkitMaskSize: "contain",
//         WebkitMaskPosition: "center",
//         maskImage: `url(${src})`,
//         maskRepeat: "no-repeat",
//         maskSize: "contain",
//         maskPosition: "center",
//       }}
//     />
//   );
// };

// const ColoredIcon = ({ src, disabled, size = "w-5 h-5" }) => {
//   return (
//     <img
//       src={src}
//       alt=""
//       className={`object-contain ${size}
//       ${disabled ? "grayscale opacity-50" : ""}
//       `}
//     />
//   );
// };
