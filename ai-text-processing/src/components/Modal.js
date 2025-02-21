import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {/* Only render if there's a message */}
      {message && (
        <motion.div
          key="modal-overlay"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {/* Modal content container */}
          <motion.div
            key="modal-content"
            className="bg-white rounded-lg p-6 w-11/12 max-w-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <p className="text-gray-800 text-base sm:text-lg">{message}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
