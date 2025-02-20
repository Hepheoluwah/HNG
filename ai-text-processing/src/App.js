import React, { useState, useEffect, useRef } from "react";
import ChatOutput from "./components/ChatOutput";
import ChatInput from "./components/ChatInput";
import NavBar from "./components/Navbar";
import { processText, translateText, summarizeText } from "./services/aiApi";

// Languages array
export const LANGUAGES = [
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

  // Handle sending new message
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

  // Handle translation for a message
  const handleTranslate = async (id) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    if (!msg.detectedLanguage) {
      updateMessageById(id, { error: "Language not detected.", translating: false });
      return;
    }
    if (msg.translationLanguage === msg.detectedLanguage) {
      updateMessageById(id, {
        error: "That's like asking a mirror for directions. 🪞😆 Try another language!",
        translating: false,
      });
      return;
    }
    updateMessageById(id, { translating: true, translation: null, error: null });
    try {
      const translated = await translateText(
        msg.text,
        msg.translationLanguage,
        msg.detectedLanguage
      );
      if (typeof translated === "string") {
        if (translated.includes("API key not valid")) {
          updateMessageById(id, { error: "Invalid API key.", translating: false });
          return;
        }
        if (!translated.startsWith("Error:")) {
          updateMessageById(id, { translation: translated, translating: false });
        } else {
          updateMessageById(id, { error: translated || "Translation failed.", translating: false });
        }
      } else {
        updateMessageById(id, { error: "Translation failed.", translating: false });
      }
    } catch (err) {
      updateMessageById(id, {
        error: "Translation error. Please try again later.",
        translating: false,
      });
    }
  };

  // Handle summarization for a message with session checks
  const handleSummarize = async (id) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg) return;
    updateMessageById(id, { summarizing: true, summary: null, error: null });

    if (!window.ai || !window.ai.summarizer) {
      updateMessageById(id, { error: "Summarizer API not available.", summarizing: false });
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
        updateMessageById(id, { error: summary || "Summarization failed.", summarizing: false });
      }
    } catch (err) {
      if (err.name === "InvalidStateError") {
        updateMessageById(id, { error: "Summarizer session error.", summarizing: false });
      } else {
        updateMessageById(id, { error: "Summarization error.", summarizing: false });
      }
    }
  };

  // Update translation language for a message
  const handleTranslationLanguageChange = (id, newLang) => {
    updateMessageById(id, { translationLanguage: newLang });
  };

  // Helper: get language label by code
  const getLanguageLabel = (code) => {
    const lang = LANGUAGES.find((l) => l.code === code);
    return lang ? lang.label : "Unknown";
  };

  return (
    <div data-theme={currentTheme} className="min-h-screen flex flex-col">
      {/* NavBar Component */}
      <NavBar
        currentTheme={currentTheme}
        toggleTheme={toggleTheme}
        saveConversation={saveConversation}
        loadConversations={loadConversations}
        clearChat={clearChat}
      />

      {/* Chat Output Component */}
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

      {/* Chat Input Component */}
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
