const ActionButtons = ({ text, onSummarize, onTranslate }) => {
    return (
      <div className="action-buttons mt-4">
        {text.length > 150 && (
          <button
            className="summarize-btn p-2 mr-2 bg-green-500 text-white rounded"
            onClick={onSummarize}
          >
            Summarize
          </button>
        )}
        <button
          className="translate-btn p-2 bg-yellow-500 text-white rounded"
          onClick={onTranslate}
        >
          Translate
        </button>
      </div>
    );
  };
  
  export default ActionButtons;
  