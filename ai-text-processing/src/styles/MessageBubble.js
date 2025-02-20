import React from "react";

export default function MessageBubble({ text, type }) {
  return (
    <div className={`p-3 rounded-lg w-fit max-w-xs ${type === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"}`}>
      {text}
    </div>
  );
}
