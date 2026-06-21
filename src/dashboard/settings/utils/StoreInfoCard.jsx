import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cleanUpErr, RequestService, UserService } from "../../../services";
import toast from "../../../utils/Toast";
import { FaPencilAlt } from "react-icons/fa";
import { PopOut } from "../../general";
import { Input } from "../../../utils/Input";
import { Button, ButtonBorder } from "../../../utils/Button";
import { isBusinessInfoComplete } from "../../../utils/businessInfoValidator";
import { FiChevronDown } from "react-icons/fi";
import { useDropdownPos } from "../../../utils/useDropdownPos";

export default function StoreInfoCard({ isFirstTime = false }) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState({});
  const [businessComplete, setBusinessComplete] = useState(true);
  const [countries, setCountries] = useState([]);
  const [data, setSettings] = useState({
    business_name: "",
    business_phone: "",
    business_address: "",
    business_currency: "",
  });

  const fetchSettings = async () => {
    try {
      const response = await RequestService.get("/user/settings");
      console.log(response);
      setSettings(response.data.data);
      const isComplete = isBusinessInfoComplete(response.data.data);
      setBusinessComplete(isComplete);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await RequestService.get("/customers/countries");
      setCountries(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchCountries();
  }, []);

  const submit = async () => {
    setLoading(true);

    try {
      const response = await RequestService.put("/user/settings", item);
      console.log(response);
      toast.success("Store information updated");
      fetchSettings();
      setShowModal(false);
    } catch (error) {
      console.error(error);
      cleanUpErr(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type, file);
    try {
      const response = await RequestService.postForm(
        "/user/change-logo",
        formData,
      );
      console.log(response);
      toast.success("Logo updated");
      await Promise.all([UserService.getUser(), fetchSettings()]);
      e.target.value = "";
    } catch (error) {
      console.log(error);
      cleanUpErr(error);
    }
  };

  return (
    <>
      {(isFirstTime || !businessComplete) && (
        <div className="w-full p-4 md:p-6 flex items-start gap-4 bg-red-50 border border-red-200 rounded-[20px]">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-red-900 mb-2">
              ⚠️ Business Information Required
            </h4>
            <p className="text-red-800 mb-4">
              {isFirstTime
                ? "Welcome! To start creating orders, please complete your business information below."
                : "Your business information is incomplete. Please fill in all required fields to continue using the system."}
            </p>
            <p className="text-sm text-red-700 font-medium">
              Required fields: Business Name, Phone, Address, and Currency
            </p>
          </div>
        </div>
      )}
      <div className="w-full p-4 md:p-8 flex flex-col gap-4 border rounded-[20px]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold lg:mb-6">
              Laundry Information
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500">
                  Business Name
                </p>
                <p
                  className={`font-medium ${!data?.setting?.business_name ? "text-red-600" : ""}`}
                >
                  {data?.setting?.business_name || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500">
                  Business Phone
                </p>
                <p
                  className={`font-medium ${!data?.setting?.business_phone ? "text-red-600" : ""}`}
                >
                  {data?.setting?.business_phone || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500">
                  Business Address
                </p>
                <p
                  className={`font-medium ${!data?.setting?.business_address ? "text-red-600" : ""}`}
                >
                  {data?.setting?.business_address || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500">
                  Business Currency
                </p>
                <p
                  className={`font-medium ${!data?.setting?.business_currency ? "text-red-600" : ""}`}
                >
                  {data?.setting?.business_currency || "N/A"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500">
                  Business Logo
                </p>
                <div className="relative inline-block group cursor-pointer">
                  <img
                    src={
                      data?.setting?.business_logo
                        ? `${import.meta.env.VITE_API_IMAGE_BASE_URL}${"logo_images/"}${data?.setting?.business_logo}`
                        : "/logos/green-blue-icon.png"
                    }
                    alt="Business Logo"
                    className="w-20 h-auto rounded-md"
                  />

                  <FaPencilAlt
                    className="absolute top-1 right-1 w-5 h-5 text-white bg-black/60 rounded p-1 
               opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  />

                  {/* Invisible File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      handleFileChange(e, "business_logo");
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setItem(data?.setting || {});
              setShowModal(true);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hoverdark:border-gray-700 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>
      {showModal && (
        <PopOut
          child={
            <ModalContent
              item={item}
              setItem={setItem}
              submit={submit}
              loading={loading}
              setShowModal={setShowModal}
              countries={countries}
            />
          }
          onClick={() => setShowModal(false)}
        />
      )}
    </>
  );
}

const ModalContent = ({
  item,
  setItem,
  submit,
  loading,
  setShowModal,
  countries,
}) => {
  const [currencySearch, setCurrencySearch] = useState("");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const {
    triggerRef: currencyRef,
    listRef: currencyListRef,
    pos: currencyPos,
  } = useDropdownPos(currencyOpen, () => setCurrencyOpen(false));

  const filteredCurrencies = countries.filter(
    (c) =>
      c.currency &&
      (c.currency.toLowerCase().includes(currencySearch.toLowerCase()) ||
        c.currency_name.toLowerCase().includes(currencySearch.toLowerCase())),
  );

  // Deduplicate by currency code
  const uniqueCurrencies = filteredCurrencies.filter(
    (c, idx, arr) => arr.findIndex((x) => x.currency === c.currency) === idx,
  );

  const selectedCurrencyLabel = item?.business_currency
    ? (() => {
        const found = countries.find(
          (c) => c.currency === item.business_currency,
        );
        return found
          ? `${found.currency} – ${found.currency_name}`
          : item.business_currency;
      })()
    : "Select currency";

  return (
    <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl lg:p-11">
      <div className="px-2 pr-14">
        <h4 className="mb-2 text-2xl font-semibold">
          Edit Laundry Information
        </h4>
        <p className="mb-6 text-sm text-gray-500 lg:mb-7">
          Update your laundry information below.
        </p>
      </div>
      <form className="flex flex-col">
        <div className="px-2 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div>
              <span>Business Name</span>
              <Input
                type="text"
                selected={item?.business_name || ""}
                setSelected={(e) => setItem({ ...item, business_name: e })}
              />
            </div>
            <div>
              <span>Business Phone</span>
              <Input
                type="text"
                selected={item?.business_phone || ""}
                setSelected={(e) => setItem({ ...item, business_phone: e })}
              />
            </div>
            <div>
              <span>Business Address</span>
              <Input
                type="text"
                selected={item?.business_address || ""}
                setSelected={(e) => setItem({ ...item, business_address: e })}
              />
            </div>
            <div>
              <span>Business Currency</span>
              <div className="relative mt-1">
                <button
                  ref={currencyRef}
                  type="button"
                  onClick={() => setCurrencyOpen((o) => !o)}
                  className="w-full flex items-center justify-between rounded-xl bg-[#F6F6F6] px-4 h-10 text-sm text-left"
                >
                  <span
                    className={
                      item?.business_currency
                        ? "text-gray-900"
                        : "text-gray-400"
                    }
                  >
                    {selectedCurrencyLabel}
                  </span>
                  <FiChevronDown
                    className={`transition-transform ${currencyOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {currencyOpen &&
                  createPortal(
                    <>
                      <div
                        className="fixed inset-0 z-[9999998]"
                        onClick={() => setCurrencyOpen(false)}
                      />
                      <div
                        ref={currencyListRef}
                        className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col z-[9999999]"
                        style={{
                          position: "fixed",
                          top: currencyPos.top,
                          left: currencyPos.left,
                          width: currencyPos.width,
                          maxHeight: 224,
                        }}
                      >
                        <div className="p-2 border-b">
                          <input
                            autoFocus
                            type="text"
                            value={currencySearch}
                            onChange={(e) => setCurrencySearch(e.target.value)}
                            placeholder="Search currency…"
                            className="w-full px-3 py-1.5 text-sm rounded-lg bg-gray-100 outline-none"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <ul className="overflow-y-auto">
                          {uniqueCurrencies.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-400 text-center">
                              No results
                            </li>
                          ) : (
                            uniqueCurrencies.map((c) => (
                              <li
                                key={c.currency}
                                onClick={() => {
                                  setItem({
                                    ...item,
                                    business_currency: c.currency,
                                  });
                                  setCurrencyOpen(false);
                                  setCurrencySearch("");
                                }}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${
                                  item?.business_currency === c.currency
                                    ? "bg-green-50 font-semibold"
                                    : ""
                                }`}
                              >
                                {c.currency} – {c.currency_name}
                                {c.currency_symbol
                                  ? ` (${c.currency_symbol})`
                                  : ""}
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    </>,
                    document.body,
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <ButtonBorder name="Close" onClick={() => setShowModal(false)}>
            Close
          </ButtonBorder>
          <Button
            name="Save Changes"
            onClick={() => submit()}
            loading={loading}
          ></Button>
        </div>
      </form>
    </div>
  );
};
