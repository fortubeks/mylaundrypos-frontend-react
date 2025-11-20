// import bell from "../assets/icons/bell.svg";
// import Drop from "../utils/Drop";
import { useLocation } from "react-router-dom";
import Search from "../utils/Search";
import Drop from "../utils/Drop";
import { useState } from "react";
import bell from "../assets/icons/bell.svg";
import question from "../assets/icons/question.svg";
import gs from "../assets/icons/gs.svg";
import info from "../assets/icons/info-circle-p.svg";
import stars from "../assets/icons/stars.svg";

import { ButtonPrimary } from "../utils/Button";
import { useDispatch, useSelector } from "react-redux";
import { setOpenSub } from "../store/slices/subscriptionSlice";

export default function TopBar() {
  const location = useLocation();
  const [search, setSearch] = useState("");
  const str1 = location?.pathname?.split("/")?.slice(2)[0];
  const subscription = useSelector((state) => state.subscription.subscription);

  return (
    <div className="px-5 sticky-0 left-0 top-0 flex items-center justify-between z-[999] gap-10 border border-[#E7E7E7] bg-white rounded-[20px] transition-all duration-500 ease-in-out">
      {subscription ? (
        <span className="text-sm flex gap-2 items-center text-[#898E99] capitalize">
          <img src={gs} alt="" className="object-contain" />
          {str1?.split("-").join(" ")}
        </span>
      ) : (
        <Subscribe />
      )}
      <div className="flex gap-4 items-center ml-auto py-2">
        <Search value={search} setValue={setSearch} />
        <span className="flex bg-[#D8D8D8] min-w-[1px] w-[1px] h-10"></span>
        <Drop
          Main={() => (
            <div className="flex items-center cursor-pointer">
              <img src={bell} alt="" className="object-contain h-6 w-fit" />
            </div>
          )}
          Dropdown={() => (
            <div className="text-xs bg-white rounded-xl shadow-[0px_2px_16px_0px_rgba(17,24,39,0.08)] flex flex-col divide-y">
              <nav className="flex items-center gap-2 cursor-pointer py-4 px-4 pr-14 whitespace-nowrap">
                no notifications
              </nav>
            </div>
          )}
          direction="-right-1/2"
        />
        <Drop
          Main={() => (
            <div className="flex items-center cursor-pointer">
              <img src={question} alt="" className="object-contain h-6 w-fit" />
            </div>
          )}
          Dropdown={() => (
            <div className="text-sm bg-white text-[#4D4D4D] rounded-lg border border-[#D1D5DB] border-opacity-70 shadow-[0px_2px_16px_0px_rgba(17,24,39,0.08)] flex flex-col mt-3 relative z-[9999999]"></div>
          )}
          direction="right-0"
        />
      </div>
    </div>
  );
}

const Subscribe = () => {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center gap-2 h-full text-sm">
      <img src={info} alt="" className="object-contain h-6 w-fit" />
      You can only make <b>10 shipment</b> per month on your current plan
      <ButtonPrimary
        name="Upgrade plan"
        width="fit-content"
        icon={stars}
        onClick={() => dispatch(setOpenSub(true))}
      />
    </div>
  );
};
