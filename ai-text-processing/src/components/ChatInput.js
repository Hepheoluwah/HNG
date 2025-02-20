// ChatInput.js
import React from "react";
import { motion } from "framer-motion";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";

const ChatInput = ({
  inputText,
  setInputText,
  error,
  handleSend,
  toggleRecording,
  isRecording,
  setError,
}) => {
  return (
    <form onSubmit={handleSend} className="p-4 bg-base-100 border-t border-base-300">
      <div className="flex flex-col sm:flex-row gap-2 w-full max-w-4xl mx-auto">
        <textarea
          rows={4}
          className={`textarea textarea-bordered flex-grow p-2 ${
            error && !inputText ? "border-error placeholder:text-error" : ""
          } min-h-[120px] sm:min-h-[150px]`}
          placeholder={!inputText && error ? error : "Type your text here..."}
          aria-label="Message input"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (error) setError(null);
          }}
        />
        <div className="flex flex-col gap-2 sm:w-40">
          <button type="button" onClick={toggleRecording} className="btn btn-secondary btn-lg" aria-label="Voice input">
            {isRecording ? (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <FaMicrophone />
              </motion.div>
            ) : (
              <FaMicrophone />
            )}
          </button>
          <button
            type="submit"
            className="btn btn-primary bg-send-btn btn-lg flex items-center gap-2 border-2 border-gray-500 dark:border-gray-500"
            aria-label="Send text"
          >
            <span>SEND</span>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
