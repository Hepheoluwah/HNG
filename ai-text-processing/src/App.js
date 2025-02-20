import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // Optional: for smooth animations
import ChatOutput from "./components/ChatOutput";
import ChatInput from "./components/ChatInput";
import NavBar from "./components/Navbar";
import { processText, translateText, summarizeText } from "./services/aiApi";
import Landingimage from "../src/images/chaticon2.png";

// Supported languages array
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "pt", label: "Portuguese" },
  { code: "es", label: "Spanish" },
  { code: "ru", label: "Russian" },
  { code: "tr", label: "Turkish" },
  { code: "fr", label: "French" },
];

// Landing Page Component with Animated Icon and Get Started Button
const LandingPage = ({ onStart }) => (
  <div className="flex flex-col justify-center items-center h-screen bg-gray-100 px-4 sm:px-8">
    {/* Animated icon */}
    <motion.div
      className="cursor-pointer"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      onClick={onStart}
    >
      <img
        src={Landingimage}
        alt="App Icon"
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
      />
    </motion.div>
    <p className="mt-4 text-lg font-bold text-black text-center">
    AI-Powered Text Processing Interface <br /> Click the icon or the button below to get started!
    </p>
    <button
      onClick={onStart}
      className="mt-5 px-6 py-3 text-base font-bold text-white bg-black rounded-lg transition-colors duration-300 hover:bg-gray-800 focus:outline-none"
    >
      Get Started
    </button>
  </div>
);

function App() {
  // State to control landing page visibility
  const [introShown, setIntroShown] = useState(true);

  // Existing states
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState("light");
  const [copiedTranslation, setCopiedTranslation] = useState({});
  const [copiedSummary, setCopiedSummary] = useState({});

  // Speech recognition state and refs
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Load saved conversation on mount
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

  const saveConversation = () => {
    localStorage.setItem("conversations", JSON.stringify(messages));
    alert("Conversation saved!");
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("conversations");
  };

  const loadConversations = () => {
    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      setMessages(JSON.parse(savedConversations));
      alert("Conversation loaded!");
    } else {
      alert("No conversation found to load.");
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
          "That's like asking a mirror for directions. Try another language!",
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

  // If the intro is still showing, render the landing page
  if (introShown) {
    return <LandingPage onStart={() => setIntroShown(false)} />;
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
    </div>
  );
}

export default App;
