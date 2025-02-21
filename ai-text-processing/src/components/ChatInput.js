import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";

const ChatInput = ({
  inputText,
  setInputText,
  error,
  handleSend,
  setError,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = "en-US";
      recognitionInstance.interimResults = false;
      recognitionInstance.continuous = true; // Keep listening until stopped manually
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setInputText((prevText) => (prevText ? prevText + " " + transcript : transcript));
      };
      recognitionInstance.onerror = () => setError("Voice recognition error.");
      setRecognition(recognitionInstance);
    } else {
      setError("Speech recognition is not supported in your browser.");
    }
  }, [setInputText, setError]);

  const toggleRecording = () => {
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }

    setIsRecording(!isRecording);
  };

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
          <button
            type="button"
            onClick={toggleRecording}
            className={`btn btn-lg ${isRecording ? "bg-red-500 text-white" : "btn-secondary"}`}
            aria-label="Voice input"
          >
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
