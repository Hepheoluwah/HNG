// src/app/page.js

"use client";  // Add this line at the very top

import { useState } from 'react';
import InputArea from '../components/InputArea';
import OutputArea from '../components/OutputArea';
import ActionButtons from '../components/ActionButtons';
import LanguageSelector from '../components/LanguageSelector';
import { detectLanguage, summarizeText, translateText } from '../utils/aiAPI';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('');
  const [summary, setSummary] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState('');

  const handleSendText = async (newText) => {
    setText(newText);
    setOutput(newText);
    setSummary('');
    setTranslatedText('');
    setError('');

    try {
      const detectedLanguage = await detectLanguage(newText);
      setLanguage(detectedLanguage);
    } catch (err) {
      setError('Failed to detect language.');
    }
  };

  const handleSummarize = async () => {
    try {
      const summaryResult = await summarizeText(text);
      setSummary(summaryResult);
    } catch (err) {
      setError('Failed to summarize text.');
    }
  };

  const handleTranslate = async (selectedLanguage) => {
    try {
      const translation = await translateText(text, selectedLanguage);
      setTranslatedText(translation);
    } catch (err) {
      setError('Failed to translate text.');
    }
  };

  return (
    <div className="container p-8">
      <h1 className="text-3xl font-bold mb-6">AI-Powered Text Processing</h1>
      <InputArea onSendText={handleSendText} />
      {error && <ErrorMessage message={error} />}
      <OutputArea output={output} language={language} summary={summary} translatedText={translatedText} />
      <LanguageSelector onLanguageChange={handleTranslate} />
      <ActionButtons text={text} onSummarize={handleSummarize} onTranslate={handleTranslate} />
    </div>
  );
};

export default Home;
