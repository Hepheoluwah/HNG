import React from "react";
import { motion } from "framer-motion";
import { FaTrash, FaGlobe, FaFileAlt, FaCopy } from "react-icons/fa";
import SpeechOutputButton from "./SpeechOutputButton";
import { LANGUAGES } from "../App";
// import Logo from "../src/images/chaticon2.png";
import Logo from "../images/chaticon2.png";

const ChatOutput = ({
  messages,
  deleteMessage,
  handleTranslate,
  handleSummarize,
  handleTranslationLanguageChange,
  getLanguageLabel,
  copiedTranslation,
  setCopiedTranslation,
  copiedSummary,
  setCopiedSummary,
  messagesEndRef,
}) => {
  return (
    <div className="flex-grow p-4 overflow-auto bg-base-200">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center font-sans">
          <p className="text-2xl font-bold p-10 text-gray-700">
            What would you like to translate or get summarized?
          </p>
        </div>
      ) : (
        messages.map((msg) => (
          <motion.div
            key={msg.id}
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card shadow bg-base-100">
              <div className="card-body relative">
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="absolute top-2 right-2 btn btn-xs btn-ghost"
                  aria-label="Delete message"
                >
                  <FaTrash />
                </button>
                <h2 className="card-title break-words">{msg.text}</h2>
                {msg.loading && (
                  <p className="text-sm text-gray-500">Detecting language...</p>
                )}
                {msg.error && (
                  <p className="text-error" role="alert">
                    {msg.error}
                  </p>
                )}
                {!msg.loading && !msg.error && msg.detectedLanguage && (
                  <p className="text-sm">
                    <span className="font-semibold">Detected:</span>{" "}
                    {getLanguageLabel(msg.detectedLanguage)}
                  </p>
                )}
                {/* Translation and Summarization Controls */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <label
                    htmlFor={`lang-select-${msg.id}`}
                    className="text-sm font-semibold flex items-center"
                  >
                    <img src={Logo} alt="Logo" className="h-5 mr-1" />
                    Translate to:
                  </label>
                  <select
                    id={`lang-select-${msg.id}`}
                    className="select select-bordered select-sm w-full max-w-xs"
                    value={msg.translationLanguage}
                    onChange={(e) =>
                      handleTranslationLanguageChange(msg.id, e.target.value)
                    }
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
                  {msg.detectedLanguage === "en" && msg.text.length > 150 && (
                    <button
                      className="btn btn-info btn-sm gap-2"
                      onClick={() => handleSummarize(msg.id)}
                      aria-label="Summarize text"
                    >
                      <FaFileAlt />
                      {msg.summarizing ? "Summarizing..." : "Summarize"}
                    </button>
                  )}
                </div>
                {/* Display Translation */}
                {msg.translation && (
                  <div className="mt-2 flex items-center">
                    <p className="text-sm italic flex items-center">
                      <img src={Logo} alt="Logo" className="h-5 mr-1" />
                      <span className="font-semibold mr-2">Translation:</span>
                      {msg.translation}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard
                          .writeText(msg.translation)
                          .then(() => {
                            setCopiedTranslation((prev) => ({
                              ...prev,
                              [msg.id]: true,
                            }));
                            setTimeout(
                              () =>
                                setCopiedTranslation((prev) => ({
                                  ...prev,
                                  [msg.id]: false,
                                })),
                              2000
                            );
                          });
                      }}
                      className="ml-2"
                      aria-label="Copy translation"
                    >
                      <FaCopy className="text-xl" />
                    </button>
                    {copiedTranslation[msg.id] && (
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-green-500 ml-2"
                      >
                        Copied!
                      </motion.span>
                    )}
                    <div className="relative group">
                      <SpeechOutputButton
                        text={msg.translation}
                        langCode={msg.translationLanguage}
                        className="ml-2"
                        ariaLabel="Play translation"
                      />
                      <span className="absolute bottom-0 left-0 transform translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Play translation
                      </span>
                    </div>
                  </div>
                )}
                {/* Display Summary */}
                {msg.summary && (
                  <div className="mt-2 flex items-center">
                    <p className="text-sm italic flex items-center">
                      <img src={Logo} alt="Logo" className="h-5 mr-1" />
                      <span className="font-semibold mr-2">Summary:</span>
                      {msg.summary}
                    </p>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(msg.summary).then(() => {
                          setCopiedSummary((prev) => ({
                            ...prev,
                            [msg.id]: true,
                          }));
                          setTimeout(
                            () =>
                              setCopiedSummary((prev) => ({
                                ...prev,
                                [msg.id]: false,
                              })),
                            2000
                          );
                        });
                      }}
                      className="ml-2"
                      aria-label="Copy summary"
                    >
                      <FaCopy className="text-xl" />
                    </button>
                    {copiedSummary[msg.id] && (
                      <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-green-500 ml-2"
                      >
                        Copied!
                      </motion.span>
                    )}
                    <div className="relative group">
                      <SpeechOutputButton
                        text={msg.summary}
                        langCode="en-US"
                        className="ml-2"
                        ariaLabel="Play summary"
                      />
                      <span className="absolute bottom-0 left-0 transform translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Play summary
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
       <div className="absolute bottom-2 right-4 text-gray-500 text-xs opacity-50">
        Powered by <span className="font-bold">0x_ifeoluwa</span>
      </div>
      <div ref={messagesEndRef} />
      <div className="absolute bottom-2 right-4 text-gray-500 text-xs opacity-50">
        Powered by <span className="font-bold">0x_ifeoluwa</span>
      </div>
    </div>
  );
};

export default ChatOutput;
