import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatOutput from "./components/ChatOutput";
import ChatInput from "./components/ChatInput";
import NavBar from "./components/Navbar";
import { processText, translateText, summarizeText } from "./services/aiApi";
import LandingImage from "../src/images/chaticon2.png";

// Supported languages array
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "pt", label: "Portuguese" },
  { code: "es", label: "Spanish" },
  { code: "ru", label: "Russian" },
  { code: "tr", label: "Turkish" },
  { code: "fr", label: "French" },
];

// Auto-dismissing Modal Component
const Modal = ({ message, onClose, duration = 1000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="modal-overlay"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <motion.div
            key="modal-content"
            className="bg-white rounded-lg p-6 w-11/12 max-w-md"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <p className="text-gray-800 text-base sm:text-lg">{message}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LandingPage = ({ onStart }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 sm:px-8">
    {/* Header Section */}
    <header className="text-center space-y-4">
      <motion.h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        AI Text Processor
      </motion.h1>
      <motion.p
        className="text-lg sm:text-xl max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Instantly <span className="text-yellow-300">Detect</span>,{" "}
        <span className="text-green-300">Translate</span>, and{" "}
        <span className="text-yellow-300">Summarize</span> text using the power
        of AI and Chrome API.
      </motion.p>
    </header>

    {/* Animated Icon */}
    <motion.div
      className="mt-10"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <img
        src={LandingImage}
        alt="AI Text Processor Icon"
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
      />
    </motion.div>

    {/* Get Started Button */}
    <motion.button
      onClick={onStart}
      className="mt-10 px-8 py-4 bg-white text-indigo-600 font-bold rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-white"
      whileHover={{
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      whileTap={{
        scale: 0.95,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
    >
      Get Started
    </motion.button>

    {/* Features Section */}
    <section className="mt-12 max-w-4xl w-full">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { delay: 1.2, staggerChildren: 0.3 },
          },
        }}
      >
        <motion.div
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-filter backdrop-blur-sm"
        >
          <h3 className="text-xl font-semibold mb-2">Detect</h3>
          <p className="text-sm">
            Instantly recognize the language of any text using smart detection.
          </p>
        </motion.div>
        <motion.div
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-filter backdrop-blur-sm"
        >
          <h3 className="text-xl font-semibold mb-2">Translate</h3>
          <p className="text-sm">
            Break language barriers with fast and accurate translations.
          </p>
        </motion.div>
        <motion.div
          variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
          className="p-4 bg-white bg-opacity-20 rounded-lg backdrop-filter backdrop-blur-sm"
        >
          <h3 className="text-xl font-semibold mb-2">Summarize</h3>
          <p className="text-sm">
            Get concise summaries to quickly grasp the main points of lengthy texts.
          </p>
        </motion.div>
      </motion.div>
    </section>
    <footer className="mt-12 text-center text-sm opacity-75">
  Developed and designed with <span className="text-red-400">♡</span> by{" "}
  <span className="font-semibold">0x_Ifeoluwa</span>
</footer>

  </div>
);

function App() {
  // Initialize landing page state based on localStorage
  const [introShown, setIntroShown] = useState(() =>
    localStorage.getItem("landingSeen") ? false : true
  );

  // Automatically load the default conversation from localStorage on mount
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem("conversations");
    return stored ? JSON.parse(stored) : [];
  });
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [copiedTranslation, setCopiedTranslation] = useState({});
  const [copiedSummary, setCopiedSummary] = useState({});

  // Modal state and helper functions
  const [modalMessage, setModalMessage] = useState("");
  const showModal = (message) => setModalMessage(message);
  const closeModal = () => setModalMessage("");

  // Speech recognition state and refs
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-save conversation whenever messages change (default conversation)
  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(messages));
  }, [messages]);

  // Setup SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setInputText(transcript);
      };

      recognitionRef.current.onend = () => setIsRecording(false);
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event);
        setIsRecording(false);
      };
    }
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Toggle voice input recording
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

  // Conversation and theme controls
  const toggleTheme = () =>
    setCurrentTheme((prev) => (prev === "light" ? "dark" : "light"));

  // When saving conversation manually, copy the current conversation to a separate key.
  const saveConversation = () => {
    localStorage.setItem("savedConversations", JSON.stringify(messages));
    showModal("Conversation saved!");
  };

  // Clear chat should clear the default conversation (and thus messages state)
  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("conversations");
    showModal("Chat cleared!");
  };

  // Load conversation from the saved conversation (separate key)
  const loadConversations = () => {
    const saved = localStorage.getItem("savedConversations");
    if (saved) {
      setMessages(JSON.parse(saved));
      showModal("Conversation loaded!");
    } else {
      showModal("No conversation found to load.");
    }
  };

  // Helper functions to update messages
  const deleteMessage = (id) =>
    setMessages((prev) => prev.filter((msg) => msg.id !== id));

  const updateMessageById = (id, newData) =>
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, ...newData } : msg))
    );

  // Handle sending a new message
  const handleSend = async (e) => {
    e.preventDefault();
    setError(null);

    if (!inputText.trim()) {
      setError("Input text cannot be empty.");
      return;
    }

    const newMessage = {
      id: Date.now(),
      text: inputText,
      detectedLanguage: "en",
      translationLanguage: "en",
      translation: null,
      summary: null,
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

  // Handle translating a message
  const handleTranslate = async (id) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    if (!msg.detectedLanguage) {
      updateMessageById(id, {
        error: "Language not detected.",
        translating: false,
      });
      return;
    }
    if (msg.translationLanguage === msg.detectedLanguage) {
      updateMessageById(id, {
        error:
          "Can't translate to the same language. Please choose a different target language.",
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
            error: "Invalid API key.",
            translating: false,
          });
          return;
        }
        if (!translated.startsWith("Error:")) {
          updateMessageById(id, {
            translation: translated,
            translating: false,
          });
        } else {
          updateMessageById(id, {
            error: translated || "Translation failed.",
            translating: false,
          });
        }
      } else {
        updateMessageById(id, {
          error: "Translation failed.",
          translating: false,
        });
      }
    } catch (err) {
      updateMessageById(id, {
        error: "Translation error. Please try again later.",
        translating: false,
      });
    }
  };

  // Handle summarizing a message
  const handleSummarize = async (id) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    updateMessageById(id, { summarizing: true, summary: null, error: null });

    if (!window.ai || !window.ai.summarizer) {
      updateMessageById(id, {
        error: "Summarizer API not available.",
        summarizing: false,
      });
      return;
    }

    try {
      if (typeof window.ai.summarizer.initialize === "function") {
        await window.ai.summarizer.initialize();
      }
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
      updateMessageById(id, {
        error: "Summarization error.",
        summarizing: false,
      });
    }
  };

  // Update translation language for a message
  const handleTranslationLanguageChange = (id, newLang) => {
    updateMessageById(id, { translationLanguage: newLang });
  };

  // Helper: get language label from code
  const getLanguageLabel = (code) => {
    const lang = LANGUAGES.find((l) => l.code === code);
    return lang ? lang.label : "Unknown";
  };

  // Function to handle logo click in the NavBar
  const handleLogoClick = () => {
    setIntroShown(true);
  };

  // Function to dismiss the landing page and save flag in localStorage
  const handleLandingStart = () => {
    setIntroShown(false);
    localStorage.setItem("landingSeen", "true");
  };

  // If the intro is still showing, render the landing page
  if (introShown) {
    return <LandingPage onStart={handleLandingStart} />;
  }

  // Render the main chat interface once the landing page is dismissed
  return (
    <div data-theme={currentTheme} className="min-h-screen flex flex-col">
      <NavBar
        currentTheme={currentTheme}
        toggleTheme={toggleTheme}
        saveConversation={saveConversation}
        loadConversations={loadConversations}
        clearChat={clearChat}
        onLogoClick={handleLogoClick}
      />
      <ChatOutput
        messages={messages}
        deleteMessage={deleteMessage}
        handleTranslate={handleTranslate}
        handleSummarize={handleSummarize}
        handleTranslationLanguageChange={handleTranslationLanguageChange}
        getLanguageLabel={getLanguageLabel}
        copiedTranslation={copiedTranslation}
        setCopiedTranslation={setCopiedTranslation}
        copiedSummary={copiedSummary}
        setCopiedSummary={setCopiedSummary}
        messagesEndRef={messagesEndRef}
      />
      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        error={error}
        handleSend={handleSend}
        toggleRecording={toggleRecording}
        isRecording={isRecording}
        setError={setError}
      />

      {/* Auto-dismissing Modal */}
      <Modal message={modalMessage} onClose={closeModal} />
    </div>
  );
}

export default App;
