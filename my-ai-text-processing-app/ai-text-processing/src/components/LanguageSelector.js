import React from "react";

const LanguageSelector = ({ language, onChange }) => {
  return (
    <div className="flex items-center bg-gray-700 p-2 rounded-lg">
      <span className="text-white mr-2">🌍</span>
      <select
        className="bg-transparent text-white outline-none"
        value={language}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="it">Italian</option>
        <option value="pt">Portuguese</option>
        <option value="zh">Chinese</option>
        <option value="ja">Japanese</option>
        <option value="ru">Russian</option>
        <option value="ar">Arabic</option>
        <option value="hi">Hindi</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
