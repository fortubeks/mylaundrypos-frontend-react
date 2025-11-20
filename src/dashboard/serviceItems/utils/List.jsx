import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import TableHead from "../../../utils/TableHead";
import { BarLoader } from "../../../utils/Loader";
import { useEffect, useState } from "react";
import { cleanUpErr, RequestService } from "../../../services";
import toast from "../../../utils/Toast";

export default function TableList({
  itemsToDisplay,
  loading,
  fetch,
  setShowCreate,
  setSelectedItem,
}) {
  return (
    <div className="grow h-full flex flex-col gap-5 rounded-3xl text-black relative">
      <div className="flex flex-col h-full">
        <div className="overflow-x-auto h-full">
          <div className="shadow h-full overflow-x-scroll md:overflow-hidden">
            <table className="min-w-full border-collapse">
              <TableHead
                names={[
                  "Name",
                  "Service Category",
                  "Laundry Item",
                  "Price",
                  "Unit Type",
                  "Turnaround Time",
                  "Action",
                ]}
                checkbox={false}
              />
              <tbody className="divide-y divide-[#EFEFEF] border-collapse overflow-y-scroll">
                {itemsToDisplay?.length === 0 ? (
                  loading ? (
                    <tr>
                      <td className="py-2" colSpan={9}>
                        <span className="mx-auto py-10 w-full flex justify-center text-center">
                          <div className="h-full grow flex justify-center items-center">
                            <BarLoader />
                          </div>
                        </span>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="py-2" colSpan={9}>
                        <span className="mx-auto text-[#B0B0B0] py-5 w-full flex justify-center text-center">
                          No item available
                        </span>
                      </td>
                    </tr>
                  )
                ) : (
                  itemsToDisplay &&
                  itemsToDisplay.map((tm, i) => {
                    return (
                      <List
                        key={i}
                        items={tm}
                        fetch={fetch}
                        setShowCreate={setShowCreate}
                        setSelectedItem={setSelectedItem}
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

const List = ({ items, setShowCreate, setSelectedItem, fetch }) => {
  const [category, setCategory] = useState(null);
  const [laundryItem, setLaundryItem] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await RequestService.get(
          `/service-categories/${items?.service_category_id}`
        );
        const category = response.data.data;
        setCategory(category);

        if (items?.laundry_item_id) {
          const res = await RequestService.get(
            `/laundry-items/${items?.laundry_item_id}`
          );
          const laundryItem = res.data.data;
          setLaundryItem(laundryItem);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  const deleteCustomer = async () => {
    setDisabled(true);

    try {
      const response = await RequestService.delete(`/service-items/${items?.id}`);

      console.log(response);
      setShowDelete(false);
      setDisabled(false);
      fetch();
      toast.success("Service item deleted successfully");
    } catch (error) {
      console.log(error);
      setDisabled(false);
      cleanUpErr(error);
    }
  };

  return (
    <tr className="h-fit">
      <td className="px-3 py-4 text-sm">
        {items?.name}
      </td>
      <td className="px-3 py-4 text-sm">{category?.name || "N/A"}</td>
      <td className="px-3 py-4 text-sm">{laundryItem?.name || "N/A"}</td>
      <td className="px-3 py-4 text-sm">{items?.price}</td>
      <td className="px-3 py-4 text-sm">{items?.unit_type || "N/A"}</td>
      <td className="px-3 py-4 text-sm">{items?.turnaround_time || "N/A"}</td>
      <td className="px-3 py-4 text-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedItem(items);
              setShowCreate(true);
            }}
          >
            <FaPencilAlt className="text-gray-500 hover:text-gray-700" />
          </button>
          <button className="" onClick={() => setShowDelete(true)}>
            <FaTrashAlt className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
      </td>
      {showDelete && (
        <Delete
          setShowModal={setShowDelete}
          onClick={deleteCustomer}
          disabled={disabled}
        />
      )}
    </tr>
  );
};

const Delete = ({ setShowModal, onClick, disabled }) => {
  return (
    <main className="fixed top-5 right-8 h-fit w-fit flex justify-end z-[999999999] shadow-[10px_10px_30px_10px_#0000001F]">
      <main className="overflow-y-scroll snap w-fit h-fit z-50 shadow-[10px_10px_30px_10px_#0000001F]">
        <div className="w-fit h-fit p-3 pr-20 bg-white flex flex-col gap-2 rounded-xl shadow-[10px_10px_30px_10px_#0000001F] text-sm">
          <b className="bold text-lg">Delete this service item?</b>
          <nav className="flex gap-2">
            <button
              className="h-8 font-bold px-2 rounded-md bg-primary text-white"
              onClick={onClick}
            >
              {disabled ? (
                <div className="animate-spin h-6 w-6 border-white border rounded-full"></div>
              ) : (
                "Yes"
              )}
            </button>
            <button
              className="h-8 font-bold px-3 rounded-md bg-[#F9FAFB]"
              onClick={() => setShowModal(false)}
            >
              No
            </button>
          </nav>
        </div>
      </main>
    </main>
  );
};
