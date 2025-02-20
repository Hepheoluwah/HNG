const LanguageSelector = ({ onLanguageChange }) => {
    const languages = [
      { code: 'en', label: 'English' },
      { code: 'pt', label: 'Portuguese' },
      { code: 'es', label: 'Spanish' },
      { code: 'ru', label: 'Russian' },
      { code: 'tr', label: 'Turkish' },
      { code: 'fr', label: 'French' },
    ];
  
    return (
      <select
        onChange={(e) => onLanguageChange(e.target.value)}
        className="language-selector mt-2 p-2 border rounded"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    );
  };
  
  export default LanguageSelector;
  