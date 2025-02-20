import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaTrash,
  FaPaperPlane,
  FaGlobe,
  FaMoon,
  FaSun,
  FaMicrophone,
  FaVolumeUp,
  FaCopy,
  FaFileAlt 
} from "react-icons/fa";
import { processText, translateText, summarizeText } from "./services/aiApi"; 
// Languages
const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "pt", label: "Portuguese" },
  { code: "es", label: "Spanish" },
  { code: "ru", label: "Russian" },
  { code: "tr", label: "Turkish" },
  { code: "fr", label: "French" },
];

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState("light");

  const [copiedTranslation, setCopiedTranslation] = useState({});
const [copiedSummary, setCopiedSummary] = useState({});
const [playingTranslation, setPlayingTranslation] = useState({});
const [playingSummary, setPlayingSummary] = useState({});


  // State and ref for Speech Input
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Ref to auto-scroll to bottom of messages
  const messagesEndRef = useRef(null);

  // On mount, load saved conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      setMessages(JSON.parse(savedConversations));
    }
  }, []);

  // Setup SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US"; // Default language

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInputText(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event);
        setIsRecording(false);
      };
    }
  }, []);

  // Toggle recording for speech input
  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // const handleSpeechOutput = (text, langCode = "en-US") => {
  //   if (!text.trim()) return;
  //   window.speechSynthesis.cancel();
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.lang = langCode;
  //   const voices = window.speechSynthesis.getVoices();
  //   if (voices.length > 0) {
  //     utterance.voice =
  //       voices.find((voice) => voice.lang.startsWith(langCode)) || voices[0];
  //     window.speechSynthesis.speak(utterance);
  //   } else {
  //     window.speechSynthesis.onvoiceschanged = () => {
  //       const updatedVoices = window.speechSynthesis.getVoices();
  //       utterance.voice =
  //         updatedVoices.find((voice) => voice.lang.startsWith(langCode)) ||
  //         updatedVoices[0];
  //       window.speechSynthesis.speak(utterance);
  //     };
  //   }
  // };

  const handleSpeechOutputTranslation = (text, langCode = "en-US", msgId) => {
    // If this translation is already playing, cancel and reset its state
    if (playingTranslation[msgId]) {
      window.speechSynthesis.cancel();
      setPlayingTranslation((prev) => ({ ...prev, [msgId]: false }));
      return;
    }
    
    // Cancel any ongoing speech (affecting both translation and summary)
    window.speechSynthesis.cancel();
    // Reset both states to be safe
    setPlayingTranslation({});
    setPlayingSummary({});
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
  
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices.find((voice) => voice.lang.startsWith(langCode)) || voices[0];
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        utterance.voice = updatedVoices.find((voice) => voice.lang.startsWith(langCode)) || updatedVoices[0];
      };
    }
  
    utterance.onend = () => {
      setPlayingTranslation((prev) => ({ ...prev, [msgId]: false }));
    };
  
    window.speechSynthesis.speak(utterance);
    setPlayingTranslation((prev) => ({ ...prev, [msgId]: true }));
  };



  const handleSpeechOutputSummary = (text, langCode = "en-US", msgId) => {
    // If this summary is already playing, cancel and reset its state
    if (playingSummary[msgId]) {
      window.speechSynthesis.cancel();
      setPlayingSummary((prev) => ({ ...prev, [msgId]: false }));
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    // Reset both states to be safe
    setPlayingTranslation({});
    setPlayingSummary({});
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
  
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      utterance.voice = voices.find((voice) => voice.lang.startsWith(langCode)) || voices[0];
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        utterance.voice = updatedVoices.find((voice) => voice.lang.startsWith(langCode)) || updatedVoices[0];
      };
    }
  
    utterance.onend = () => {
      setPlayingSummary((prev) => ({ ...prev, [msgId]: false }));
    };
  
    window.speechSynthesis.speak(utterance);
    setPlayingSummary((prev) => ({ ...prev, [msgId]: true }));
  };
  

  // Auto-scroll to the latest message when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Save conversation to localStorage
  const saveConversation = () => {
    localStorage.setItem("conversations", JSON.stringify(messages));
    alert("Conversation saved!");
  };

  // Clear chat (only clears the current view)
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("conversations");
  };

  // Load previous conversations from localStorage
  const loadConversations = () => {
    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      setMessages(JSON.parse(savedConversations));
      alert("Conversation loaded!");
    } else {
      alert("No conversation found to load.");
    }
  };

  // Delete individual message by id
  const deleteMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  // Helper to update a single message by id
  const updateMessageById = (id, newData) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...newData } : msg))
    );
  };

  // Handle sending new text
  const handleSend = async (e) => {
    e.preventDefault();
    setError(null);

    if (!inputText.trim()) {
      setError("Input text cannot be empty.");
      return;
    }

    // For demonstration, we assume the text is in English.
    const newMessage = {
      id: Date.now(),
      text: inputText,
      detectedLanguage: "en",
      translationLanguage: "en",
      translation: null,
      summary: null, // Added summary field
      error: null,
      loading: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    try {
      const result = await processText(newMessage.text);
      if (result.error) {
        updateMessageById(newMessage.id, {
          error: result.error,
          loading: false,
        });
      } else {
        updateMessageById(newMessage.id, {
          detectedLanguage: result.detectedLanguage || "en",
          loading: false,
        });
      }
    } catch (err) {
      updateMessageById(newMessage.id, {
        error: "Failed to process text.",
        loading: false,
      });
    }
  };

  // Translate text for a given message
  const handleTranslate = async (id) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;

    if (!msg.detectedLanguage) {
      updateMessageById(id, {
        error:
          "Uh-oh! I have no clue what language this is. Are you speaking alien? 👽",
        translating: false,
      });
      return;
    }

    if (msg.translationLanguage === msg.detectedLanguage) {
      updateMessageById(id, {
        error:
          "Oops! That’s like asking a mirror to reflect itself. Try another language! 😆",
        translating: false,
      });
      return;
    }

    updateMessageById(id, {
      translating: true,
      translation: null,
      error: null,
    });

    try {
      const translated = await translateText(
        msg.text,
        msg.translationLanguage,
        msg.detectedLanguage
      );

      if (typeof translated === "string") {
        if (translated.includes("API key not valid")) {
          updateMessageById(id, {
            error:
              "Oops! Looks like you're trying to translate from an unknown language.👽",
            translating: false,
          });
          return;
        }

        if (!translated.startsWith("Error:")) {
          updateMessageById(id, { translation: translated, translating: false });
        } else {
          updateMessageById(id, {
            error: translated || "Translation failed.",
            translating: false,
          });
        }
      } else {
        updateMessageById(id, {
          error:
            "Translation failed. Maybe your text prefers to stay where it is? 🤔",
          translating: false,
        });
      }
    } catch (err) {
      updateMessageById(id, {
        error: "Something went wrong while translating. Please try again later. 😕",
        translating: false,
      });
    }
  };

  // New: Summarize text for a given message
  // const handleSummarize = async (id) => {
  //   const msg = messages.find((m) => m.id === id);
  //   if (!msg) return;

  //   updateMessageById(id, {
  //     summarizing: true,
  //     summary: null,
  //     error: null,
  //   });

  //   try {
  //     const summary = await summarizeText(msg.text);
  //     if (typeof summary === "string" && !summary.startsWith("Error:")) {
  //       updateMessageById(id, { summary, summarizing: false });
  //     } else {
  //       updateMessageById(id, {
  //         error: summary || "Summarization failed.",
  //         summarizing: false,
  //       });
  //     }
  //   } catch (err) {
  //     updateMessageById(id, {
  //       error: "Something went wrong while summarizing. Please try again later.",
  //       summarizing: false,
  //     });
  //   }
  // };

 




  // New: Summarize text for a given message with proper session checks
  const handleSummarize = async (id) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;

    updateMessageById(id, {
      summarizing: true,
      summary: null,
      error: null,
    });

    // Check if the summarizer API is available
    if (!window.ai || !window.ai.summarizer) {
      updateMessageById(id, {
        error: "Summarizer API is not available. Please try again later.",
        summarizing: false,
      });
      return;
    }

    try {
      // If the summarizer has an initialize method, call it to ensure proper setup
      if (typeof window.ai.summarizer.initialize === "function") {
        await window.ai.summarizer.initialize();
      }
      
      // Now call the summarize API function with the message text
      const summary = await summarizeText(msg.text);
      
      if (typeof summary === "string" && !summary.startsWith("Error:")) {
        updateMessageById(id, { summary, summarizing: false });
      } else {
        updateMessageById(id, {
          error: summary || "Summarization failed.",
          summarizing: false,
        });
      }
    } catch (err) {
      // If the error is due to an invalid state (session issue), handle it gracefully
      if (err.name === "InvalidStateError") {
        updateMessageById(id, {
          error: "Summarizer session error. Please try again later.",
          summarizing: false,
        });
      } else {
        updateMessageById(id, {
          error: "Something went wrong while summarizing. Please try again later.",
          summarizing: false,
        });
      }
    }
  };





  // Handle changing the translation language
  const handleTranslationLanguageChange = (id, newLang) => {
    updateMessageById(id, { translationLanguage: newLang });
  };

  // Helper: get language label
  const getLanguageLabel = (code) => {
    const lang = LANGUAGES.find((l) => l.code === code);
    return lang ? lang.label : "Unknown";
  };

  return (
    <div data-theme={currentTheme} className="min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow px-4 py-2">
        <div className="w-full flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-xl font-bold">AI-Powered Text Processing</div>
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end">
            <button
              onClick={saveConversation}
              className="btn btn-outline btn-sm md:btn-md"
              aria-label="Save conversation"
            >
              Save Conversation
            </button>
            <button
              onClick={loadConversations}
              className="btn btn-outline btn-sm md:btn-md"
              aria-label="Load previous conversations"
            >
              Load Conversation
            </button>
            <button
              onClick={clearChat}
              className="btn btn-error btn-sm md:btn-md flex items-center gap-1"
              aria-label="Clear chat"
            >
              <FaTrash />
              Clear Chat
            </button>
            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm md:btn-md flex items-center gap-1"
              aria-label="Toggle theme"
            >
              {currentTheme === "light" ? <FaMoon /> : <FaSun />}
              {currentTheme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Output Area */}
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

                {/* Translation and Summarization Section */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <label
                    htmlFor={`lang-select-${msg.id}`}
                    className="text-sm font-semibold"
                  >
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
                  {/* Conditionally render the Summarize button */}
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

                {/* Translated Text with Speech Output */}
                {msg.translation && (
                  <div className="mt-2 flex items-center">
                    <p className="text-sm italic">
                      <span className="font-semibold">Translation:</span> {msg.translation}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(msg.translation).then(() => {
                          setCopiedTranslation((prev) => ({ ...prev, [msg.id]: true }));
                          setTimeout(() => {
                            setCopiedTranslation((prev) => ({ ...prev, [msg.id]: false }));
                          }, 2000);
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
                    <button
                      onClick={() =>
                        handleSpeechOutputTranslation(msg.translation, msg.translationLanguage)
                      }
                      className="ml-2 translation-sound-button"
                      aria-label="Play translation"
                    >
                      <FaVolumeUp className="text-xl" />
                    </button>
                  </div>
                )}

{msg.summary && (
  <div className="mt-2 flex items-center">
    <p className="text-sm italic">
      <span className="font-semibold">Summary:</span> {msg.summary}
    </p>
    {/* Copy Summary Button */}
    <button
      onClick={() => {
        navigator.clipboard.writeText(msg.summary).then(() => {
          setCopiedSummary((prev) => ({ ...prev, [msg.id]: true }));
          setTimeout(() => {
            setCopiedSummary((prev) => ({ ...prev, [msg.id]: false }));
          }, 2000);
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
    {/* Speech Output Button for Summary */}
    <button
      onClick={() => handleSpeechOutputSummary(msg.summary, "en-US")}
      className="ml-2 summary-sound-button"
      aria-label="Play summary"
    >
      <FaVolumeUp className="text-xl" />
    </button>
  </div>
)}

                {/* Display Summary if available */}
                {/* {msg.summary && (
                  <div className="mt-2 flex items-center">
                    <p className="text-sm italic">
                      <span className="font-semibold">Summary:</span> {msg.summary}
                    </p>

                  </div>
                )} */}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-base-100 border-t border-base-300"
      >
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
              className="btn btn-secondary btn-lg"
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
    </div>
  );
}

export default App;
