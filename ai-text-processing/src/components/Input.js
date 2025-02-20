import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const Input = ({ onSend }) => {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!inputText.trim()) {
      setError("Input text cannot be empty.");
      return;
    }

    onSend(inputText);
    setInputText("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-base-100 border-t border-base-300">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-2">
        {error && (
          <p className="text-error mb-2" role="alert">
            {error}
          </p>
        )}
        <textarea
          className="textarea textarea-bordered flex-grow"
          placeholder="Type your text here..."
          aria-label="Message input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={2}
        />
        <button type="submit" className="btn btn-primary sm:w-auto gap-2" aria-label="Send text">
          <FaPaperPlane />
        </button>
      </div>
    </form>
  );
};

export default Input;
