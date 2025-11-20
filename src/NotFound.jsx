import lost from "./assets/construction.svg";
import logo from "/logos/green-blue-text.png";
import { Logout } from "./utils/Logout";

export default function NotFound() {
  return (
    <div className="p-5">
      <div className="h-screen rounded-2xl flex flex-col justify-center items-center gap-5 bg-[#F6F6F6] relative">
        <img
          src={logo}
          alt="Logo"
          className="object-contain h-14 absolute top-3 w-fit"
        />
        <img src={lost} alt="" className="object-contain h-48 w-fit" />
        <span>Under Construction: We’re Still Painting This Page 🎨</span>
        <button
          onClick={() => Logout('Logged out')}
          className="bg-secondary px-4 h-10 w-fit flex justify-center items-center rounded-lg text-white"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
