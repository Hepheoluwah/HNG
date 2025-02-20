import { useState } from 'react';

const InputArea = ({ onSendText }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== '') {
      onSendText(text);
      setText('');
    }
  };

  return (
    <div className="input-area">
      <textarea
        className="w-full p-3 border rounded-lg"
        rows="5"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text..."
      />
      <button
        className="send-btn p-2 mt-2 bg-blue-500 text-white rounded"
        onClick={handleSubmit}
      >
        Send
      </button>
    </div>
  );
};

export default InputArea;
