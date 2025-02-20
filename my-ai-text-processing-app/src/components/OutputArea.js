const OutputArea = ({ output, language, summary, translatedText }) => {
    return (
      <div className="output-area p-4 bg-gray-100 rounded-lg mt-4">
        <div className="output-text mb-4">{output}</div>
        {language && <div className="language-detected">Language: {language}</div>}
        {summary && <div className="summary-output">Summary: {summary}</div>}
        {translatedText && <div className="translated-text">Translated: {translatedText}</div>}
      </div>
    );
  };
  
  export default OutputArea;
  