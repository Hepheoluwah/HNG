import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGlobe } from "react-icons/fa";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "zh", label: "Chinese" },
];

const Output = ({ messages, handleSummarize, handleTranslate, handleTranslationLanguageChange }) => {
  const messagesEndRef = useRef(null);

  // Scroll to the latest message whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getLanguageLabel = (code) => {
    const lang = LANGUAGES.find((l) => l.code === code);
    return lang ? lang.label : "Unknown";
  };

  return (
    <div className="flex-grow p-4 overflow-auto bg-base-200">
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card shadow bg-base-100">
            <div className="card-body">
              <h2 className="card-title break-words">{msg.text}</h2>

              {msg.loading && <p className="text-sm text-gray-500">Detecting language...</p>}
              {msg.error && <p className="text-error" role="alert">{msg.error}</p>}

              {!msg.loading && !msg.error && msg.detectedLanguage && (
                <p className="text-sm">
                  <span className="font-semibold">Detected:</span> {getLanguageLabel(msg.detectedLanguage)}
                </p>
              )}

              {!msg.loading && !msg.error && msg.detectedLanguage === "en" && msg.text.length > 150 && !msg.summary && (
                <button
                  className="btn btn-primary btn-sm mt-2"
                  onClick={() => handleSummarize(msg.id, msg.text)}
                  aria-label="Summarize text"
                >
                  Summarize
                </button>
              )}

              {msg.summary && (
                <p className="text-sm italic">
                  <span className="font-semibold">Summary:</span> {msg.summary}
                </p>
              )}

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
                <label htmlFor={`lang-select-${msg.id}`} className="text-sm font-semibold">
                  Translate to:
                </label>
                <select
                  id={`lang-select-${msg.id}`}
                  className="select select-bordered select-sm w-full max-w-xs"
                  value={msg.translationLanguage}
                  onChange={(e) => handleTranslationLanguageChange(msg.id, e.target.value)}
                  aria-label="Select language for translation"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-accent btn-sm gap-2"
                  onClick={() => handleTranslate(msg.id)}
                  aria-label="Translate text"
                >
                  <FaGlobe />
                  {msg.translating ? "Translating..." : "Translate"}
                </button>
              </div>

              {msg.translation && (
                <p className="text-sm italic mt-2">
                  <span className="font-semibold">Translation:</span> {msg.translation}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Output;
