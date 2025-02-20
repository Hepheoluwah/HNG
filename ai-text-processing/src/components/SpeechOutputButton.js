import React, { useState, useEffect } from "react";
import { FaVolumeUp, FaPause } from "react-icons/fa";

const SpeechOutputButton = ({
  text,
  langCode = "en-US",
  className = "",
  ariaLabel = "Play speech",
  onSpeechEnd,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Cleanup any onvoiceschanged handler on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const toggleSpeech = () => {
    // If already playing, cancel and reset state
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      if (onSpeechEnd) onSpeechEnd();
      return;
    }

    // Cancel any currently playing utterance
    window.speechSynthesis.cancel();

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
      setIsPlaying(false);
      if (onSpeechEnd) onSpeechEnd();
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <button onClick={toggleSpeech} className={className} aria-label={ariaLabel}>
      {isPlaying ? <FaPause className="text-xl" /> : <FaVolumeUp className="text-xl" />}
    </button>
  );
};

export default SpeechOutputButton;
