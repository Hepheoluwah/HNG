// import { openDB } from "idb";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { saveToDB, getFromDB, resetDB } from "./idbUtils";

const TicketSelectionPage = () => {
  const [ticketType, setTicketType] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const storedType = await getFromDB("ticketType");
      const storedCount = await getFromDB("ticketCount");

      if (storedType) setTicketType(storedType);
      if (storedCount) setTicketCount(storedCount);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (ticketType !== null && ticketCount > 0) {
      saveToDB("ticketType", ticketType);
      saveToDB("ticketCount", ticketCount);
    }
  }, [ticketType, ticketCount]);

  const handleReset = async () => {
    await resetDB();
    setTicketType(null);
    setTicketCount(1);
  };

  const handleTicketTypeChange = (type) => {
    setTicketType(type);
  };

  

  return (
    <div
      className="min-h-screen gap-[40px] text-white p-4 md:p-6"
      style={{
        borderColor: "#0E464F",
        background:
          "radial-gradient(52.52% 32.71% at 50% 97.66%, rgba(36, 160, 181, 0.20) 0%, rgba(36, 160, 181, 0.00) 100%), #02191D",
      }}
    >
      <Header />

      <div className="flex items-center justify-center text-white p-4 md:p-6">
        <div className="bg-[#041E23] p-6 md:p-10 rounded-3xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl border border-[#1c3b4a]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-jejumyeongjo tracking-wide">
              Ticket Selection
            </h2>
            <p className="text-sm sm:text-base text-gray-300 sm:ml-4 mt-2 sm:mt-0">
              Step 1/3
            </p>
          </div>

          <div className="w-full h-1 flex mt-2 mb-4">
            <div className="w-1/3 h-full bg-[#24a0b5]" />
            <div className="w-2/3 h-full bg-[#1c3b4a]" />
          </div>

          <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:bg-[#08252b] lg:p-10 lg:rounded-3xl lg:shadow-lg lg:border lg:border-[#1c3b4a]">
            <div className="bg-gradient-to-r from-[#0d373f] to-[#082228] p-6 md:p-8 rounded-xl mb-6 border border-[#1c3b4a] text-center">
              <h3 className="text-4xl sm:text-5xl lg:text-7xl font-roadrage">
                Techember Fest ’25
              </h3>
              <p className="mt-3 text-sm sm:text-base text-gray-300 px-2 sm:px-6">
                Join us for an unforgettable experience! at <br /> [Event Name]!
                Secure your spot now.
              </p>
              <p className="mt-2 text-sm sm:text-base text-gray-300 text-center flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                📍 [Event Location]
                <span className="sm:hidden"></span>
                <span className="hidden sm:inline"> | </span>
                March 15, 2025 | 7:00 PM
              </p>
            </div>
            <label className="mb-2 text-base sm:text-lg block text-gray-300">
              Select Ticket Type:
            </label>

            <div className="bg-[#052228] p-3 rounded-xl border border-[#1c3b4a]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    type: "Free",
                    price: "Free",
                    access: "REGULAR ACCESS",
                    availability: "20/52",
                  },
                  {
                    type: "VIP",
                    price: "$150",
                    access: "VIP ACCESS",
                    availability: "20/52",
                  },
                  {
                    type: "VVIP",
                    price: "$150",
                    access: "VVIP ACCESS",
                    availability: "20/52",
                  },
                ].map(({ type, price, access, availability }) => (
                  <button
                    key={type}
                    className={`p-3 rounded-xl border border-[#24a0b5] text-left transition-all duration-200 ${
                      ticketType === type
                        ? "bg-[#12464e]"
                        : "bg-[#08252B] hover:bg-[#12464e]"
                    }`}
                    onClick={() => handleTicketTypeChange(type)}
                  >
                    <h4 className="text-xl sm:text-lg font-semibold">
                      {price}
                    </h4>
                    <p className="mt-2 text-sm sm:text-xs text-gray-300">
                      {access}
                    </p>
                    <p className="mt-1 text-sm sm:text-xs">{availability}</p>
                  </button>
                ))}
              </div>
            </div>

            <label className="mb-2 text-sm sm:text-base text-gray-300 block mt-4">
              Number of Tickets
            </label>

            <select
              className="w-full p-3 sm:p-4 bg-[#08252B] text-white rounded-xl border border-[#1c3b4a] text-sm sm:text-base focus:ring-2 focus:ring-[#24a0b5]"
              value={ticketCount}
              onChange={(e) => setTicketCount(Number(e.target.value))}
            >
              {[...Array(10).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
            <div className="flex flex-col-reverse sm:flex-row justify-between mt-4 gap-3">
              <button
                className="w-full sm:w-1/2 bg-[#08252b] px-6 py-2 rounded-xl text-[#24a0b5] border border-[#24a0b5] hover:scale-95"
                onClick={handleReset}
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/attendee-details")}
                disabled={!ticketType}
                className={`w-full sm:w-1/2 px-6 py-2 rounded-xl border transition-transform duration-300 ${
                  ticketType
                    ? "bg-[#24a0b5] text-white border-[#24a0b5] hover:scale-95"
                    : "bg-gray-500 text-gray-300 border-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketSelectionPage;
