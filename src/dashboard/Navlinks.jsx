import { FaUsers } from "react-icons/fa";
import profile from "../assets/icons/profile.svg";
import settings from "../assets/icons/setting.svg";
import { MdDashboard } from "react-icons/md";
import { IoPricetag } from "react-icons/io5";
import { IoIosCard } from "react-icons/io";
import { GrLineChart } from "react-icons/gr";
import { MdOutlinePointOfSale } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { RiVipCrownLine } from "react-icons/ri";
import { FiCalendar, FiGlobe } from "react-icons/fi";

export const navLinks = [
  {
    path: "dashboard",
    name: "Dashboard",
    icon: <MdDashboard className="text-lg" />,
  },
  {
    path: "customers",
    name: "Customers",
    icon: <FaUsers className="text-lg" />,
  },
  {
    path: "orders",
    name: "Orders",
    icon: <MdOutlinePointOfSale className="text-lg" />,
  },
  {
    path: "laundry-items",
    name: "Laundry Items",
    icon: <IoPricetag className="text-lg" />,
  },
  {
    path: "service-items",
    name: "Service Items",
    icon: <IoIosCard className="text-lg" />,
  },
  {
    path: "reports",
    name: "Reports",
    icon: <GrLineChart className="text-lg" />,
    requiresSubscription: true,
  },
  {
    path: "marketing",
    name: "Marketing",
    icon: <FcSalesPerformance className="text-lg" />,
    new: true,
    requiresSubscription: true,
  },
  {
    path: "bookings",
    name: "Bookings",
    icon: <FiCalendar className="text-lg" />,
    new: true,
    requiresGrowth: true,
  },
  {
    path: "landing-page",
    name: "Landing Page",
    icon: <FiGlobe className="text-lg" />,
    new: true,
    requiresGrowth: true,
  },
];

export const otherLinks = [
  {
    path: "settings",
    name: "Settings",
    icon: <img src={settings} alt="settings" className="object-contain" />,
  },
  {
    path: "pricing",
    name: "Upgrade to Pro",
    icon: <RiVipCrownLine className="text-lg text-yellow-500" />,
    proLink: true,
  },
  // {
  //   path: "help-center",
  //   name: "Help Center",
  // },
  {
    path: "profile",
    name: "Profile",
    icon: <img src={profile} alt="profile" className="object-contain" />,
  },
];

export const getProfileMenuItems = () => [
  // {
  //   name: "Update Profile",
  //   icon: <FaCaretRight className="text-[#212121] text-lg" />,
  //   path: "/dashboard/settings/update-profile",
  // },
  {
    name: "Privacy Policy",
    icon: "",
    path: "http://laundrypos.com/privacy-policy",
    external: true,
  },
  {
    name: "Terms of Service",
    icon: "",
    path: "http://laundrypos.com/terms-of-service",
    external: true,
  },
  { name: "Log Out", icon: "", isLogout: true },
];
