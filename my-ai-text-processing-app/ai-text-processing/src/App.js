import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import InputField from "./components/InputField";
import OutputDisplay from "./components/OutputDisplay";
import LanguageSelector from "./components/LanguageSelector";
import { processText, translateText } from "./services/aiApi";

function App() {
  const [textInput, setTextInput] = useState("");
  const [chatWindowText, setChatWindowText] = useState("");
  const [output, setOutput] = useState("");
  const [translatedOutput, setTranslatedOutput] = useState("");
  const [language, setLanguage] = useState("en");
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTextInputChange = (e) => setTextInput(e.target.value);

  const handleSend = async () => {
    if (!textInput.trim()) return;

    setChatWindowText(textInput.trim());
    setLoading(true);

    try {
      const result = await processText(textInput);

      if (!result || result.error) {
        setOutput(result?.error || "Error: Unable to process the text.");
      } else {
        const { detectedLanguage, confidence } = result;
        setDetectedLanguage(detectedLanguage);

        const languageMap = {
          en: "English",
          fr: "French",
          es: "Spanish",
          de: "German",
          it: "Italian",
          pt: "Portuguese",
          zh: "Chinese",
          ja: "Japanese",
          ru: "Russian",
          ar: "Arabic",
          hi: "Hindi",
        };

        const languageName = languageMap[detectedLanguage] || detectedLanguage;
        const approxConfidence = Math.floor(confidence * 100);
        setOutput(`I'm ${approxConfidence}% confident this is ${languageName}.`);
      }
    } catch (error) {
      console.error("Processing error:", error);
      setOutput("Error: Unable to process the text.");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!chatWindowText.trim()) return;

    setLoading(true);
    try {
      const translation = await translateText(chatWindowText, language, detectedLanguage);
      setTranslatedOutput(translation || "Translation failed.");
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatedOutput("Error: Unable to translate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">AI Translator & Summarizer</h1>

      <div className="w-full max-w-2xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <ChatWindow text={chatWindowText} />

        <div className="mb-4">
          <LanguageSelector language={language} onChange={setLanguage} />
        </div>

        <InputField
          value={textInput}
          onChange={handleTextInputChange}
          onSend={handleSend}
          loading={loading}
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={handleTranslate}
            className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Translating..." : "Translate"}
          </button>
          <button
            onClick={handleSend}
            className="w-1/2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition ml-2"
            disabled={loading}
          >
            {loading ? "Processing..." : "Summarize"}
          </button>
        </div>

        <OutputDisplay output={translatedOutput || output} />
      </div>
    </div>
  );
}

export default App;
