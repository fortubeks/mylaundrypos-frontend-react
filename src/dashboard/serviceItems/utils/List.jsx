import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { FiPackage, FiClock, FiTag } from "react-icons/fi";
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
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <BarLoader />
      </div>
    );
  }

  if (!itemsToDisplay || itemsToDisplay.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
          <FiPackage className="text-primary" size={28} />
        </div>
        <p className="font-semibold text-gray-800 text-base">No service items yet</p>
        <p className="text-gray-400 text-sm max-w-[260px]">
          Add your first service item to start building your catalogue.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {itemsToDisplay.map((tm, i) => (
        <List
          key={i}
          items={tm}
          fetch={fetch}
          setShowCreate={setShowCreate}
          setSelectedItem={setSelectedItem}
        />
      ))}
    </div>
  );
}

const List = ({ items, setShowCreate, setSelectedItem, fetch }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const deleteItem = async () => {
    setDisabled(true);
    try {
      await RequestService.delete(`/service-items/${items?.id}`);
      setShowDelete(false);
      setDisabled(false);
      fetch();
      toast.success("Service item deleted successfully");
    } catch (error) {
      setDisabled(false);
      cleanUpErr(error);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-bold text-gray-900 text-[15px] leading-tight">
          {items?.name}
        </span>
        <span className="shrink-0 bg-primary/10 text-primary font-extrabold text-xs px-2.5 py-1 rounded-xl whitespace-nowrap">
          ₦{Number(items?.price || 0).toLocaleString()}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {items?.category?.name && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100">
            <FiTag size={10} />
            {items.category.name}
          </span>
        )}
        {items?.laundry_item?.name && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg border border-emerald-100">
            <FiPackage size={10} />
            {items.laundry_item.name}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        {items?.unit_type && (
          <span className="flex items-center gap-1">
            <span className="text-gray-400">Unit:</span>
            <span className="font-medium text-gray-700">{items.unit_type}</span>
          </span>
        )}
        {items?.turnaround_time && (
          <span className="flex items-center gap-1.5">
            <FiClock size={11} className="text-gray-400" />
            <span className="font-medium text-gray-700">{items.turnaround_time}</span>
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-50">
        <button
          onClick={() => {
            setSelectedItem(items);
            setShowCreate(true);
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary hover:bg-primary/8 px-3 py-1.5 rounded-lg transition-all"
        >
          <FaPencilAlt size={10} /> Edit
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
        >
          <FaTrashAlt size={10} /> Delete
        </button>
      </div>

      {showDelete && (
        <Delete
          setShowModal={setShowDelete}
          onClick={deleteItem}
          disabled={disabled}
        />
      )}
    </div>
  );
};

const Delete = ({ setShowModal, onClick, disabled }) => {
  return (
    <main className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[99999]">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[300px] flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-gray-900 text-base">Delete service item?</p>
          <p className="text-gray-500 text-sm">This action cannot be undone.</p>
        </div>
        <div className="flex gap-2">
          <button
            className="flex-1 h-9 font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm transition-colors disabled:opacity-60"
            onClick={onClick}
            disabled={disabled}
          >
            {disabled ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mx-auto" />
            ) : (
              "Delete"
            )}
          </button>
          <button
            className="flex-1 h-9 font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
};
