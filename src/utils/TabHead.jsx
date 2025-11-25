import { useDispatch } from "react-redux";
import { setSidebar } from "../store/slices/generalSlice";

export default function TabHead({ name, size = "18px", children }) {
  const dispatch = useDispatch();

  return (
    <div className="w-full min-h-14 h-14 px-4 flex items-center border-b border-[#EFEFEF] sticky top-0 bg-[#F9F8F8] z-10">
      <div
        className="md:hidden"
        onClick={() => {
          dispatch(setSidebar(true));
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 mr-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </div>
      <h3
        className="font-semibold capitalize text-black"
        style={{ fontSize: size }}
      >
        {name}
      </h3>
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  );
}
