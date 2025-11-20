import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setShowNotification } from "../../store/slices/generalSlice";
import Filter from "../../utils/Filter";
import { cleanUpErr, RequestService } from "../../services";
import { BarLoader } from "../../utils/Loader";
// import {
//   sendNotificationTest,
// } from "./function";
import trash from "../../assets/icons/trash2.svg";
import Navigator from "../../utils/Navigator";
import toast from "../../utils/Toast";

export default function Notification() {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = parseInt((currentPage - 1) * +perPage);
  const endIndex = parseInt(startIndex + +perPage);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await RequestService.get("/notifications");
      setList(response?.data?.data);
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);

  const deleteNotification = (id) => {
    try {
      const response = RequestService.delete(`/notifications/delete/${id}`);
      console.log(response);

      setList((prevList) => prevList.filter((item) => item.id !== id));
      toast.success("Notification deleted successfully");
    } catch (error) {
      console.error("Error deleting notification:", error);
      cleanUpErr(error);
    }
  };

  const filteredList = list.filter((notification) => {
    if (selected === "All") return true;
    if (selected === "Shipping") return notification.type === "shipping";
    if (selected === "Payment") return notification.type === "payment";
    return true;
  });

  const itemsToDisplay = filteredList?.slice(startIndex, endIndex);

  return (
    <div className="w-full h-full grow relative text-sm flex flex-col">
      <div className="flex items-center justify-between w-full px-4 py-1 border-b border-[#EFEFEF]">
        <b
          className="font-semibold text-sm"
          // onClick={() => sendNotificationTest()}
        >
          Notifications
        </b>
        <button
          onClick={() => dispatch(setShowNotification(false))}
          className={`flex items-center justify-center px-3 h-10 border border-[#EFEFEF] rounded-md text-[#959595] text-sm`}
        >
          esc
        </button>
      </div>
      <div className="flex items-center justify-between w-full px-4 py-1 border-b border-[#EFEFEF]">
        <p className="text-sm">Result ({list.length})</p>
        <Filter
          items={["All", "Shipping", "Payment"]}
          setSelected={setSelected}
          selected={selected}
        />
      </div>
      <div className="w-full h-[67%] grow flex">
        <ul className="w-full  z-50 h-full overflow-y-auto divide-y divide-[#EFEFEF]">
          {filteredList.length === 0 ? (
            loading ? (
              <div className="flex items-center justify-center h-full grow">
                <BarLoader />
              </div>
            ) : (
              <li className="px-4 py-2 text-sm text-gray-400">
                No notifications found
              </li>
            )
          ) : (
            filteredList.map((notification) => (
              <li
                key={notification.id}
                className="px-4 py-3 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span
                      className={`${
                        notification.type === "shipping"
                          ? "bg-[#DFE3F4]"
                          : "bg-[#DAF9E1]"
                      } text-xs py-1 px-4 rounded-full`}
                    >
                      {notification?.title || "Notification"}
                    </span>
                    <button
                      className=""
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <img src={trash} alt="" className="object-contain" />
                    </button>
                  </div>
                  <span className="text-xs">
                    {new Date(notification?.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="">
                  {/* <b className="inline">{notification?.title}: </b>{" "} */}
                  {notification?.body}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="px-4 py-1">
        {itemsToDisplay.length > 0 && (
          <Navigator
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            array={list}
            perPage={perPage}
            setPerPage={setPerPage}
          />
        )}
      </div>
    </div>
  );
}
