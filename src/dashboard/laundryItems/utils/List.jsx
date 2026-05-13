import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { BarLoader } from "../../../utils/Loader";
import { useState } from "react";
import { cleanUpErr, RequestService } from "../../../services";
import toast from "../../../utils/Toast";

const COLORS = [
  { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
  { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-100" },
];

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
          <FiShoppingBag className="text-primary" size={28} />
        </div>
        <p className="font-semibold text-gray-800 text-base">No laundry items yet</p>
        <p className="text-gray-400 text-sm max-w-[260px]">
          Add items like shirts, trousers and duvets to your catalogue.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
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

  const color = COLORS[(items?.id || 0) % COLORS.length];

  const deleteItem = async () => {
    setDisabled(true);
    try {
      await RequestService.delete(`/laundry-items/${items?.id}`);
      setShowDelete(false);
      setDisabled(false);
      fetch();
      toast.success("Laundry item deleted successfully");
    } catch (error) {
      setDisabled(false);
      cleanUpErr(error);
    }
  };

  return (
    <div
      className={`bg-white border ${color.border} rounded-2xl p-3.5 flex flex-col gap-2.5 hover:shadow-md transition-all`}
    >
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-xl ${color.bg} ${color.text} flex items-center justify-center font-extrabold text-sm flex-shrink-0`}
      >
        {items?.name?.charAt(0)?.toUpperCase() || "?"}
      </div>

      {/* Name */}
      <p className="font-semibold text-gray-900 text-sm leading-tight">
        {items?.name}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1 pt-1.5 border-t border-gray-50">
        <button
          onClick={() => {
            setSelectedItem(items);
            setShowCreate(true);
          }}
          className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-primary hover:bg-primary/8 py-1.5 rounded-lg transition-all"
        >
          <FaPencilAlt size={9} /> Edit
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 py-1.5 rounded-lg transition-all"
        >
          <FaTrashAlt size={9} /> Delete
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
          <p className="font-bold text-gray-900 text-base">Delete laundry item?</p>
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
