import React from "react";

const OutputDisplay = ({ output }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg text-white mt-4">
      <h2 className="text-lg font-semibold">Output:</h2>
      <p className="mt-2">{output || "Waiting for output..."}</p>
    </div>
  );
};

export default OutputDisplay;




// const OutputDisplay = ({ output }) => {
//   return (
//     <div className="mt-4 p-4 border border-gray-300 rounded-lg">
//       <h2 className="font-bold text-lg">Processed Output:</h2>
//       <p>{output}</p>
//     </div>
//   );
// };

// export default OutputDisplay;
