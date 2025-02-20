import React from "react";

const InputField = ({ value, onChange, onSend, loading }) => {
  return (
    <div className="flex items-center bg-gray-700 rounded-lg p-3">
      <input
        type="text"
        className="w-full bg-transparent outline-none text-white px-3 placeholder-gray-400"
        placeholder="Type a message..."
        value={value}
        onChange={onChange}
        disabled={loading}
      />
      <button
        onClick={onSend}
        className="bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600 transition ml-2"
        disabled={loading}
      >
        ➤
      </button>
    </div>
  );
};

export default InputField;




// function InputField({ value, onChange, onSend, loading }) {
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !loading) {
//       onSend(); // Trigger send on "Enter"
//     }
//   };

//   return (
//     <div className="flex gap-2">
//       <input
//         type="text"
//         value={value}
//         onChange={onChange}
//         onKeyDown={handleKeyDown} // Listen for Enter key
//         className="border p-2 flex-grow"
//         placeholder="Type your message..."
//         disabled={loading}
//       />
//       <button 
//         onClick={onSend} 
//         disabled={loading}
//         className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
//       >
//         {loading ? "Sending..." : "Send"}
//       </button>
//     </div>
//   );
// }

// export default InputField;

  