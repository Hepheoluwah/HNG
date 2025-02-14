import React from "react";
import Header from "./Header";

const AboutUsPage = () => {
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
        <h1 className="text-lg sm:text-xl font-semibold mb-4">Event Ticket Booking UI – Open Source Practice Project 🎟️</h1>
        
        <h2 className="text-md sm:text-lg font-semibold">Overview</h2>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-4">
          This is a beginner-friendly yet practical Event Ticket Booking UI designed for developers to clone, explore, and build upon. The design focuses on a seamless, login-free ticket reservation flow, allowing users to book event tickets quickly and efficiently.
        </p>
        
        <h2 className="text-md sm:text-lg font-semibold">Flow & Features</h2>
        
        <h3 className="text-sm sm:text-base font-semibold mt-4">🎫 Ticket Selection</h3>
        <ul className="text-sm sm:text-base text-gray-300 list-disc pl-4">
          <li>Users can browse available tickets (Free & Paid).</li>
          <li>Ticket options are displayed in a list or card view.</li>
          <li>For Free Tickets → Clicking “Get Free Ticket” proceeds to attendee details.</li>
          <li>For Paid Tickets → Clicking “Purchase Ticket” would ideally open a payment modal.</li>
        </ul>
        
        <h3 className="text-sm sm:text-base font-semibold mt-4">📝 Attendee Details Form</h3>
        <ul className="text-sm sm:text-base text-gray-300 list-disc pl-4">
          <li>Users input their Name, Email, and optional Phone Number.</li>
          <li>Profile picture upload option with preview functionality.</li>
          <li>Ticket summary is visible to ensure users review their details before submission.</li>
        </ul>
        
        <h3 className="text-sm sm:text-base font-semibold mt-4">💳 Payment or Success Page</h3>
        <ul className="text-sm sm:text-base text-gray-300 list-disc pl-4">
          <li>If the ticket is free, the user is taken directly to the Ticket Confirmation Page.</li>
          <li>If the ticket is paid, developers can integrate Stripe, Paystack, or Flutterwave to process payments before showing the confirmation page.</li>
          <li>Upon successful booking, users should receive their e-ticket.</li>
          <li>A visual ticket preview with a unique QR Code.</li>
          <li>Download or email ticket as PDF or save it to their device.</li>
        </ul>
      </div>
    </div>
    </div>
  );
};

export default AboutUsPage;
