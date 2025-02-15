import React, { useState, useRef, useEffect } from "react";
import { openDB } from "idb";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Header from "./Header";

const TicketConfirmationPage = () => {
  const barcodeRef = useRef(null);
  const ticketRef = useRef(null); // Ref for ticket area
  const navigate = useNavigate();
  const [attendee, setAttendee] = useState({
    name: "",
    email: "",
    specialRequest: "",
    profileImage: null,
  });

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, "234567891026", {
        format: "CODE128",
        lineColor: "#ffffff",
        background: "#041e23",
        width: 2,
        height: 50,
        displayValue: false,
      });
    }
  }, []);

  useEffect(() => {
    const loadAttendeeDetails = async () => {
      const db = await openDB("AttendeeDB", 1);
      const allKeys = await db.getAllKeys("attendee");

      const allData = {};
      for (const key of allKeys) {
        allData[key] = await db.get("attendee", key);
      }

      setAttendee({
        name: allData.name || "",
        email: allData.email || "",
        specialRequest: allData.specialRequest || "",
        profileImage: allData.profileImage || null,
        ticketCount: allData.ticketCount || null,
        ticketType: allData.ticketType || null,
      });
    };

    loadAttendeeDetails();
  }, []);

  // Function to handle ticket download as PDF
  const downloadTicketAsPDF = () => {
    const ticketElement = ticketRef.current;

    if (!ticketElement) return;

    // Ensure images are fully loaded before capturing
    setTimeout(() => {
      html2canvas(ticketElement, {
        scale: 2,
        useCORS: true, // Ensures images load
        allowTaint: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
        pdf.save("Techember_Ticket.pdf");
      });
    }, 1000); // Small delay to ensure images are loaded
  };

  return (

  //   <div
  //   className="min-h-screen gap-[40px] text-white p-4 md:p-6"
  //   style={{
  //     borderColor: "#0E464F",
  //     background:
  //       "radial-gradient(52.52% 32.71% at 50% 97.66%, rgba(36, 160, 181, 0.20) 0%, rgba(36, 160, 181, 0.00) 100%), #02191D",
  //   }}
  // >




    <div
      className="min-h-screen gap-[40px] flex flex-col  p-4 md:p-6 text-white"
      style={{
        background:
          "radial-gradient(52.52% 32.71% at 50% 97.66%, rgba(36, 160, 181, 0.20) 0%, rgba(36, 160, 181, 0.00) 100%), #02191D",
      }}
    >
      {/* Header Component */}
      <Header />

      <div className="flex items-center justify-center text-white p-4 md:p-6">

      <div className="bg-[#041e23] p-6 sm:p-12 rounded-3xl shadow-lg w-full max-w-md sm:max-w-lg border border-[#24a0b5]">
        {/* Progress Bar & Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex justify-between text-gray-300 text-xs sm:text-sm">
            <span className="text-base sm:text-lg">Ready</span>
            <span>Step 3/3</span>
          </div>
          <div className="w-full h-1 bg-gray-700 mt-2">
            <div className="h-1 bg-[#24a0b5] w-full"></div>
          </div>
        </div>

        {/* Confirmation Message */}
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">
          Your Ticket is Booked!
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm text-center mb-4">
          Check your email for a copy or{" "}
          <span
            className="font-semibold text-white underline cursor-pointer"
            onClick={downloadTicketAsPDF}
          >
            download
          </span>
        </p>

        {/* Ticket Container - Wrapped in ref */}
        <div
          ref={ticketRef}
          className="bg-[#041e23] p-4 sm:p-6 rounded-2xl shadow-lg border border-[#24a0b5] text-center mx-auto w-full max-w-xs sm:max-w-sm"
        >
          <h2 className="text-lg sm:text-xl font-bold text-[#24a0b5]">
            Techember Fest '25
          </h2>
          <p className="text-xs text-gray-400">
            📍 04 Rumens Road, Ikoyi, Lagos
          </p>
          <p className="text-xs text-gray-400">📅 March 15, 2025 | 7:00 PM</p>

          {/* Attendee Image */}
          <div className="flex justify-center my-4">
            <img
              src={attendee.profileImage}
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg border-4 border-[#5cffff] object-cover shadow-lg"
            />
          </div>

          {/* Attendee Details */}
          <div className="bg-[#0b3038] p-3 sm:p-4 rounded-lg text-left text-xs sm:text-sm shadow-sm">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 border-b border-[#1c3b4a] pb-3">
              <div>
                <p className="text-gray-400">Name</p>
                <p className="font-semibold text-white truncate">
                  {attendee.name}
                </p>
              </div>
              <div className="border-l border-[#1c3b4a] pl-2 sm:pl-4">
                <p className="text-gray-400">Email</p>
                <p className="font-semibold text-white truncate">
                  {attendee.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 border-b border-[#12464e] py-3">
              <div>
                <p className="text-gray-400">Ticket Type</p>
                <p className="font-semibold text-white">
                  {attendee.ticketType}
                </p>
              </div>
              <div className="border-l border-[#1c3b4a] pl-2 sm:pl-4">
                <p className="text-gray-400">Ticket for</p>
                <p className="font-semibold text-white">
                  {attendee.ticketCount}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-400">Special request?</p>
              <p className="text-xs sm:text-sm text-white line-clamp-3">
                {attendee.specialRequest}
              </p>
            </div>
          </div>
        </div>

        {/* Barcode */}
        <div className="pt-6 rounded-xl flex items-center justify-center">
          <svg ref={barcodeRef} className="w-full h-16 sm:h-[85px]" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 w-full">
          <button
            onClick={async () => {
              const db = await openDB("AttendeeDB", 1);
              await db.clear("attendee");
              setAttendee({
                name: "",
                email: "",
                specialRequest: "",
                profileImage: null,
                ticketCount: null,
                ticketType: null,
              });
              navigate("/");
            }}
            className="px-6 sm:px-8 py-2 border border-[#24a0b5] text-[#24a0b5] rounded-lg hover:bg-[#08252b] transition w-full sm:w-auto text-center"
          >
            Book Another Ticket
          </button>

          <button
            onClick={downloadTicketAsPDF}
            className="px-6 sm:px-8 py-2 bg-[#24a0b5] text-white rounded-lg hover:bg-[#1c7985] transition w-full sm:w-auto text-center"
          >
            Download Ticket
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default TicketConfirmationPage;
