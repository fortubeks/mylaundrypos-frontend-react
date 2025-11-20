import empty from "../../../assets/icons/empty.svg";
import clock from "../../../assets/icons/clock.svg";
import Status from "../../../utils/Status";
import { BarLoader } from "../../../utils/Loader";

export default function History({ data, loading }) {
  const dataAvailable = data[0];
  // && Object.keys(data).length > 0;

  return (
    <div className="rounded-[20px] border border-[#EFEFEF] w-full h-full flex flex-col">
      <div className="w-full py-3 px-3 flex items-center justify-between">
        <div
          className="flex items-center gap-1 text-sm"
          onClick={() => console.log(dataAvailable)}
        >
          Tracking History
        </div>
      </div>
      <div className="h-full grow overflow-y-scroll">
        {!dataAvailable &&
          (loading ? (
            <div className="h-full grow flex flex-col justify-center items-center gap-1">
              <BarLoader height="h-20" />
            </div>
          ) : (
            <div className="h-full grow flex flex-col justify-center items-center gap-1">
              <img src={empty} alt="No data" className="w-12 h-12 mx-auto" />
              <span className="text-center text-sm text-[#959595]">
                No tracking history available
              </span>
            </div>
          ))}
        {dataAvailable && (
          <div className="flex flex-col gap-2 px-2">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1 w-1/2">
                <a
                  className={`cursor-pointer capitalize ${
                    dataAvailable?.tracking_url && "underline"
                  } break-all`}
                  href={dataAvailable?.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {dataAvailable?.tracking_number || "N/A"}
                </a>
                <span className="text-xs text-[#959595]">Tracking ID</span>
              </div>
              <Status name={dataAvailable?.status} />
            </div>
            <div className="flex flex-col border-t relative z-0 ">
              <span className="h-full absolute top-0 left-[9px] z-[-1] border border-dashed border-[#DEDEDE] bgd-[#DEDEDE] flex"></span>
              {dataAvailable ? (
                <div className="flex flex-col gap-8">
                  {[
                    {
                      name: "Destination",
                      value: dataAvailable?.destination || "N/A",
                    },
                    {
                      name: "Last update on Shipment",
                      value: `${new Date(
                        dataAvailable?.last_update
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}, ${new Date(
                        dataAvailable?.last_update
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`,
                    },
                  ].map((item, index) => (
                    <Movement key={index} item={item} ind={index} />
                  ))}
                </div>
              ) : (
                // ))
                <div className="text-center text-sm text-[#959595]">
                  No movements recorded
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="w-full py-1 h-16 mt-auto flex gap-2 items-center px-4 border-t border-[#EFEFEF]">
        <img src={clock} className="object-contain h-8 w-fit" />
        <div className="flex flex-col">
          <span className="text-xs text-[#959595]">
            Estimated delivery date
          </span>
          <b className="font-bold text-sm">
            {dataAvailable ? (
              <div className="">
                {new Date(dataAvailable.estimated_delivery).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}{" "}
                {new Date(dataAvailable.estimated_delivery).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </div>
            ) : (
              "----"
            )}
          </b>
        </div>
      </div>
    </div>
  );
}

// const Movement = ({ item }) => {
//   return (
//     <div className={`flex flex-col py-4 gap-10 text-sm text-black`}>
//       <div className="flex flex-col gap-2">
//         <b className="text-[#959595]">Destination</b>
//         <span className="capitalize">{item.destination || "N/A"}</span>
//       </div>
//       <div className="flex flex-col gap-2">
//         <b className="text-[#959595]">Last Update</b>
//         <span className="">
//           {new Date(item.last_update).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//           ,{" "}
//           {new Date(item.last_update).toLocaleTimeString("en-US", {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </span>
//       </div>
//     </div>
//   );
// };

const Movement = ({ item, ind }) => {
  return (
    <div
      className={`flex gap-2 py-3 text-sm text-[#959595]
      ${
        ind === 0
          ? "bg-[linear-gradient(to_bottom,white_50%,transparent_50%)]"
          : ""
      } ${
        ind === 1
          ? "bg-[linear-gradient(to_top,white_50%,transparent_50%)]"
          : ""
      }`}
    >
      <span
        className={`w-5 h-5 min-w-5 min-h-5 flex border-[6px] z-10 bg-white border-[#DEDEDE] rounded-[50%]`}
      ></span>
      <div className="flex flex-col gap-2 ">
        <span>{item.name}</span>
        <span className="text-black">{item.value}</span>
      </div>
    </div>
  );
};
