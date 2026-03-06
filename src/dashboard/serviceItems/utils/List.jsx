import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import TableHead from "../../../utils/TableHead";
import { BarLoader } from "../../../utils/Loader";
import { useState } from "react";
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
            {itemsToDisplay?.length === 0 ? (
              loading ? (
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
                    <tr>
                      <td className="py-2" colSpan={9}>
                        <span className="mx-auto py-10 w-full flex justify-center text-center">
                          <div className="h-full grow flex justify-center items-center">
                            <BarLoader />
                          </div>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
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
                    <tr>
                      <td className="py-2" colSpan={9}>
                        <span className="mx-auto text-[#B0B0B0] py-5 w-full flex justify-center text-center">
                          No item available
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
                {itemsToDisplay &&
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
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const List = ({ items, setShowCreate, setSelectedItem, fetch }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const deleteCustomer = async () => {
    setDisabled(true);

    try {
      const response = await RequestService.delete(
        `/service-items/${items?.id}`,
      );

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
    <div className="h-fit p-3 pb-8 text-sm border rounded-lg hover:bg-gray-100 bg-white flex flex-col gap-3 group relative">
      <div className="flex items-center justify-between gap-3">
        <span className="font-bold text-lg ">{items?.name}</span>
        <span className="font-medium text-lg">₦{items?.price}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="">
          <b>Category: </b>

          {items?.category?.name || "N/A"}
        </span>
        <span className="">
          <b>Laundry item: </b>
          {items?.laundry_item?.name || "N/A"}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="">
          <b>Unit Type: </b>
          {items?.unit_type || "N/A"}
        </span>
        <span className="">
          <b>Turnaround Time: </b>
          {items?.turnaround_time || "N/A"}
        </span>
      </div>
      <span className=" group-hover:flex hidden absolute right-1/2 bottom-2 translate-x-1/2">
        <div className="flex items-center gap-3 text-lg">
          <button
            onClick={() => {
              setSelectedItem(items);
              setShowCreate(true);
            }}
          >
            <FaPencilAlt className="text-primary hover:text-primary/80" />
          </button>
          <button className="" onClick={() => setShowDelete(true)}>
            <FaTrashAlt className="text-red-700 hover:text-red-900" />
          </button>
        </div>
      </span>
      {showDelete && (
        <Delete
          setShowModal={setShowDelete}
          onClick={deleteCustomer}
          disabled={disabled}
        />
      )}
    </div>
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
