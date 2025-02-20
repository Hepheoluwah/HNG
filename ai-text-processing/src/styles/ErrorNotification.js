import React from "react";

export default function ErrorNotification({ message }) {
  return (
    <div className="bg-red-500 text-white text-center p-2 rounded-md mt-2">
      {message}
    </div>
  );
}
