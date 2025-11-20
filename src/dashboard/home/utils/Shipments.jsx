import { format } from "date-fns";
import TableHead from "../../../utils/TableHead";
import more from "../../../assets/icons/more2.svg";
import Drop from "../../../utils/Drop";
import { useDispatch } from "react-redux";
import {
  updateDetails,
  updateDocuments,
  // updateSendTrack,
} from "../../../store/slices/shippingSlice";
import Status from "../../../utils/Status";
import { receiptTemplate } from "../../../utils/receipt";
import html2pdf from "html2pdf.js";

export default function Shipments({
  itemsToDisplay,
  // loading
}) {
  return (
    <div className="grow h-full flex flex-col gap-5 rounded-3xl text-black relative">
      <div className="flex flex-col h-full">
        <div className="overflow-x-auto h-full">
          <div className="shadow h-full overflow-x-scroll md:overflow-hidden">
            <table className="min-w-full border-collapse">
              <TableHead
                names={[
                  "Tracking Number",
                  "Carrier",
                  "Service",
                  "Status",
                  "Origin",
                  "Destination",
                  "Ship Date",
                  "Delivery Date",
                  "Action",
                ]}
                checkbox={false}
              />
              <tbody className="divide-y divide-[#EFEFEF] border-collapse overflow-y-scroll">
                {itemsToDisplay?.length === 0 ? (
                  // [1, 2, 3, 4].map((_, i) => (
                  //     <tr key={i}>
                  //       <td className="py-2" colSpan={9}>
                  //         {loading && (
                  //           <div className="py-4 bg-[#EFEFEF]/60 rounded-lg animate-pulse w-full" />
                  //         )}
                  //       </td>
                  //     </tr>
                  //   ))
                  // [1, 2, 3, 4].map((_, i) => (
                  <tr>
                    <td className="py-2" colSpan={9}>
                      {/* <div className="py-4 bg-[#EFEFEF]/60 rounded-lg animate-pulse w-full" /> */}
                      <span className="mx-auto py-2 w-full flex justify-center text-center">
                        No shipment available
                      </span>
                    </td>
                  </tr>
                ) : (
                  itemsToDisplay &&
                  itemsToDisplay.map((tm, i) => {
                    return (
                      <List
                        key={i}
                        items={tm}
                        fetch={fetch}
                        last={itemsToDisplay.length - i <= 3}
                      />
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const List = ({ items, last }) => {
  const dispatch = useDispatch();

    const data = {
      tracking_number: items?.tracking_number || "N/A",
      from_name: items?.ship_from?.name || "N/A",
      from_email: items?.ship_from?.email || "N/A",
      from_phone: items?.ship_from?.phone || "N/A",
      from_address: items?.ship_from?.address1 || "N/A",
      from_address2: items?.ship_from?.address2 || "",
      from_city: items?.ship_from?.city_locality || "N/A",
      from_state: items?.ship_from?.state_province || "N/A",
      from_postal: items?.ship_from?.postal_code || "N/A",
      from_country: items?.ship_from?.country_code || "N/A",
      to_name: items?.ship_to?.name || "N/A",
      to_email: items?.ship_to?.email || "N/A",
      to_phone: items?.ship_to?.phone || "N/A",
      to_address: items?.ship_to?.address1 || "N/A",
      to_address2: items?.ship_to?.address2 || "",
      to_city: items?.ship_to?.city_locality || "N/A",
      to_state: items?.ship_to?.state_province || "N/A",
      to_postal: items?.ship_to?.postal_code || "N/A",
      to_country: items?.ship_to?.country_code || "N/A",
      payment_id: items?.payment_intent_id || "N/A",
      no_package: 1,
      total_weight: items?.package.weight.value || "N/A",
      payment_date: items?.created_at
        ? format(new Date(items?.created_at), "dd MMM, yyyy")
        : "N/A",
      shipping_fee: items?.payment_summary?.shipping_cost || 0,
      platform_fee: items?.payment_summary?.markup_amount || 0,
      insurance_fee: items?.payment_summary?.insurance_cost || 0,
      total_cost: items?.total_cost || 0,
    };

    // Inject data into the template
    const filledTemplate = receiptTemplate
      .replace(/{{tracking_number}}/g, data.tracking_number)
      .replace(/{{from_name}}/g, data.from_name)
      .replace(/{{from_email}}/g, data.from_email)
      .replace(/{{from_phone}}/g, data.from_phone)
      .replace(/{{from_address}}/g, data.from_address)
      .replace(/{{from_address2}}/g, data.from_address2)
      .replace(/{{from_city}}/g, data.from_city)
      .replace(/{{from_state}}/g, data.from_state)
      .replace(/{{from_postal}}/g, data.from_postal)
      .replace(/{{from_country}}/g, data.from_country)
      .replace(/{{to_name}}/g, data.to_name)
      .replace(/{{to_email}}/g, data.to_email)
      .replace(/{{to_phone}}/g, data.to_phone)
      .replace(/{{to_address}}/g, data.to_address)
      .replace(/{{to_address2}}/g, data.to_address2)
      .replace(/{{to_city}}/g, data.to_city)
      .replace(/{{to_state}}/g, data.to_state)
      .replace(/{{to_postal}}/g, data.to_postal)
      .replace(/{{to_country}}/g, data.to_country)
      .replace(/{{payment_id}}/g, data.payment_id)
      .replace(/{{no_package}}/g, data.no_package)
      .replace(/{{total_weight}}/g, data.total_weight)
      .replace(/{{payment_date}}/g, data.payment_date)
      .replace(/{{shipping_fee}}/g, data.shipping_fee)
      .replace(/{{platform_fee}}/g, data.platform_fee)
      .replace(/{{insurance_fee}}/g, data.insurance_fee)
      .replace(/{{total_cost}}/g, data.total_cost);

    const generatePDF = () => {
      const element = document.createElement("div");
      element.innerHTML = filledTemplate;
      document.body.appendChild(element);

      const opt = {
        margin: 0.3,
        filename: `receipt-${data.tracking_number}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          allowTaint: false,
        },
        jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
      };

      console.log(filledTemplate);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          html2pdf()
            .set(opt)
            .from(element)
            .save()
            .then(() => document.body.removeChild(element));
        });
      });
    };

  return (
    <tr className="h-fit">
      <td className="px-3 py-4 text-sm">
        <a
          className={`cursor-pointer ${
            items?.tracking_url && "underline"
          } break-all`}
          href={items?.tracking_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {items?.tracking_number || "N/A"}
        </a>
      </td>
      <td className="px-3 py-4 text-sm">{items?.carrier_code}</td>
      <td className="px-3 py-4 text-sm break-all">{items?.service_code}</td>
      <td className="px-3 py-4 text-sm">
        <Status name={items?.tracking_status} last={last} />
      </td>
      <td className="px-3 py-4 text-sm">
        {items?.ship_from?.city_locality} {items?.ship_from?.state_province},{" "}
        {items?.ship_from?.country_code}{" "}
      </td>
      <td className="px-3 py-4 text-sm">
        {items?.ship_to?.city_locality} {items?.ship_to?.state_province},{" "}
        {items?.ship_to?.country_code}{" "}
      </td>
      <td className="px-3 py-4 text-sm">
        {items?.ship_date
          ? format(new Date(items?.ship_date), "dd MMM, yyyy")
          : "N/A"}
      </td>
      <td className="px-3 py-4 text-sm">
        {items?.estimated_days ? (
          <span>
            {format(
              new Date(
                new Date(items?.ship_date).setDate(
                  new Date(items?.ship_date).getDate() +
                    parseInt(items?.estimated_days)
                )
              ),
              "dd MMM, yyyy"
            )}
          </span>
        ) : (
          "N/A"
        )}
      </td>
      <td className="px-3 py-4 text-sm">
        <Drop
          Main={() => (
            <img
              src={more}
              alt="more"
              className="w-7 h-7 min-w-7 min-h-7 cursor-pointer"
            />
          )}
          Dropdown={() => (
            <div className="text-sm bg-white text-[#4D4D4D] rounded-xl border border-[#EFEFEF] border-opacity-70 shadow-[0px_2px_2px_0px_#FFFFFF05] flex flex-col relative z-[9999999]">
              <button
                className="flex items-center gap-2 cursor-pointer py-2.5 px-4 pr-14 hover:bg-[#F6F6F6] rounded-lg whitespace-nowrap"
                onClick={() => dispatch(updateDetails(items))}
              >
                View Shipment Details
              </button>
              <a
                className="flex items-center gap-2 cursor-pointer py-2.5 px-4 pr-14 hover:bg-[#F6F6F6] rounded-lg whitespace-nowrap"
                href={items?.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Track Shipment
              </a>
              <button
                className="flex items-center gap-2 cursor-pointer py-2.5 px-4 pr-14 hover:bg-[#F6F6F6] rounded-lg whitespace-nowrap"
                onClick={() => dispatch(updateDocuments(items))}
              >
                Download shipping documents
              </button>
              <button
                className="flex items-center gap-2 cursor-pointer py-2.5 px-4 pr-14 hover:bg-[#F6F6F6] rounded-lg whitespace-nowrap"
                onClick={generatePDF}
              >
                Download Receipt
              </button>
            </div>
          )}
        />
      </td>
    </tr>
  );
};
