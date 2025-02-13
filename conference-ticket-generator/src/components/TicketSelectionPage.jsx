import { openDB } from "idb";
import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

const TicketSelectionPage = () => {
  const [ticketType, setTicketType] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const navigate = useNavigate();

  // Initialize IndexedDB
  useEffect(() => {
    const loadData = async () => {
      const db = await openDB("AttendeeDB", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("attendee")) {
            db.createObjectStore("attendee");
          }
        },
      });

      const storedType = await db.get("attendee", "ticketType");
      const storedCount = await db.get("attendee", "ticketCount");

      if (storedType) setTicketType(storedType);
      if (storedCount) setTicketCount(storedCount);
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      const db = await openDB("AttendeeDB", 1);
      await db.put("attendee", ticketType, "ticketType");
      await db.put("attendee", ticketCount, "ticketCount");
    };

    if (ticketType) saveData();
  }, [ticketType, ticketCount]);

  const handleTicketTypeChange = (type) => {
    setTicketType(type);
  };

  return (
    <div className="min-h-screen bg-[#0c1b1f] text-white p-4 md:p-6">
      <Header />

      <div className="flex items-center justify-center text-white p-4 md:p-6">
        <div className="bg-[#041e23] p-8 md:p-12 rounded-3xl shadow-lg w-full max-w-[700px] border border-[#1c3b4a] relative">
          <div className="flex justify-between items-center">
            <h2 className="text-xl md:text-2xl font-jejumyeongjo tracking-wide">
              Ticket Selection
            </h2>
            <p className="text-xs md:text-sm text-white">Step 1/3</p>
          </div>

          <div className="w-full h-1 flex mt-2 mb-4">
            <div className="w-1/3 h-full bg-[#24a0b5]" />
            <div className="w-2/3 h-full bg-[#1c3b4a]" />
          </div>

          <div className="bg-[#041e23] p-8 md:p-12 rounded-3xl shadow-lg w-full max-w-[700px] border border-[#1c3b4a] relative">
            <div className="bg-gradient-to-r from-[#08252b] to-[#12464e] p-4 md:p-6 rounded-xl mb-6 border max-h-[200px] border-[#1c3b4a] text-center">
              <h3 className="text-2xl md:text-5xl font-roadrage tracking-wide">
                Techember Fest '25
              </h3>

              <p className="mt-2 text-xs md:text-base">
                Join us for an unforgettable experience <br /> at [Event Name]!
                Secure your spot now.
              </p>
              <p className="mt-1 text-1xl">
                📍 [Event Location] &nbsp; || &nbsp; March 15, 2025 | 7:00 PM
              </p>
            </div>

            <div className="w-full h-1 bg-gradient-to-r from-[#12464e] to-[#1c3b4a] mb-4" />

            <div className="mb- pt-2">
              <label className="mb-2 text-xs md:text-sm text-gray-300 block">
                Select Ticket Type:
              </label>
              <div className="bg-[#052228] p-3 rounded-xl border border-[#1c3b4a]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { type: "Free", price: "Free", access: "REGULAR ACCESS", availability: "20/52" },
                    { type: "VIP", price: "$150", access: "VIP ACCESS", availability: "20/52" },
                    { type: "VVIP", price: "$150", access: "VVIP ACCESS", availability: "20/52" },
                  ].map(({ type, price, access, availability }) => (
                    <button
                      key={type}
                      className={`p-3 rounded-xl border border-[#24a0b5] text-left transition-all duration-200 ${
                        ticketType === type ? "bg-[#12464e]" : "bg-[#052228] hover:bg-[#12464e]"
                      }`}
                      onClick={() => handleTicketTypeChange(type)}
                      aria-pressed={ticketType === type}
                    >
                      <h4 className="text-sm md:text-lg pb-2 font-semibold">{price}</h4>
                      <p className="text-xs md:text-sm text-gray-300">{access}</p>
                      <p className="text-xs md:text-sm">{availability}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-4 mt-4 pb-4">
              <label className="mb-2 text-xs md:text-sm text-gray-300 block" htmlFor="ticketCount">
                Number of Tickets
              </label>
              <select
                id="ticketCount"
                className="w-full p-2 md:p-3 bg-[#052228] text-white rounded-xl border border-[#1c3b4a] focus:ring-2 focus:ring-[#24a0b5]"
                value={ticketCount}
                onChange={(e) => setTicketCount(e.target.value)}
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1} className="bg-[#052228]">
                    {num + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col-reverse md:flex-row justify-between mt-4 gap-3">
              <button
                className="w-full md:w-[45%] bg-[#08252b] px-6 py-2 md:py-3 rounded-xl text-[#24a0b5] border border-[#24a0b5] transition-transform duration-300 hover:scale-95"
                onClick={async () => {
                  const db = await openDB("AttendeeDB", 1);
                  await db.delete("attendee", "ticketType");
                  await db.delete("attendee", "ticketCount");
                  setTicketType(null);
                  setTicketCount(1);
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/attendee-details")}
                disabled={!ticketType}
                className={`w-full md:w-[50%] px-6 py-2 md:py-3 rounded-xl border transition-transform duration-300 ${
                  ticketType
                    ? "bg-[#24a0b5] text-white border-[#24a0b5] hover:scale-95"
                    : "bg-gray-500 text-gray-300 border-gray-500 cursor-not-allowed"
                }`}
                aria-disabled={!ticketType}
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
