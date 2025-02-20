// const ChatWindow = ({ text }) => {
//     return (
//       <div className="bg-gray-100 p-4 rounded-lg mb-4">
//         <div className="whitespace-pre-line">{text}</div>
//       </div>
//     );
//   };
  
//   export default ChatWindow;
  

import React from "react";

const ChatWindow = ({ text }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg text-white mb-4">
      <h2 className="text-lg font-semibold">Chat Window</h2>
      <p className="mt-2">{text || "Start typing a message..."}</p>
    </div>
  );
};

export default ChatWindow;
