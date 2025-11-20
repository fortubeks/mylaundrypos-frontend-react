import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";


let _setToastState = null; // singleton setter

const TOAST_TTL = 5000;

const Toast = ({ id, text, type, remove }) => {
  useEffect(() => {
    const timer = setTimeout(() => remove(id), TOAST_TTL);
    return () => clearTimeout(timer);
  }, [id, remove]);

  // const icon =
  //   type === "success" ? (
  //     <img
  //       src={check}
  //       alt="Success"
  //       className="object-contain h-8 aspect-square"
  //     />
  //   ) : (
  //     <img src={info} alt="Info" className="object-contain h-8 aspect-square" />
  //   );
  const bg = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <motion.div
      layout
      initial={{ y: -15, scale: 0.95 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`px-5 h-fit min-h-[54px] flex items-center rounded-[20px] gap-3 text-xsm shadow-lg text-white ${bg} pointer-events-auto relative`}
    >
      {/* <figure className="h-full border-r border-[#585858] pr-3 py-2">
        {icon}
      </figure> */}
      <span className="py-2">{text}</span>
      {/* <button onClick={() => remove(id)} className="ml-auto">
        <FiX />
      </button> */}
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  _setToastState = setToast; // assign setter for global use

  const removeToast = useCallback(() => setToast(null), []);

  return (
    <>
      {children}
      <div className="flex flex-col gap-1 max-w-[60%] w-fit fixed top-10 right-10 z-[9999999] pointer-events-none">
        <AnimatePresence>
          {toast && (
            <Toast
              key={toast.id}
              id={toast.id}
              text={toast.text}
              type={toast.type}
              remove={removeToast}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Singleton API exposed
const toast = {
  success: (message) => {
    if (_setToastState) {
      _setToastState({ id: Date.now(), type: "success", text: message });
    } else {
      console.warn("ToastProvider not mounted yet.");
    }
  },
  error: (message) => {
    if (_setToastState) {
      _setToastState({ id: Date.now(), type: "error", text: message });
    } else {
      console.warn("ToastProvider not mounted yet.");
    }
  },
};

export default toast;
