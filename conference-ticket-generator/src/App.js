import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TicketSelectionPage from "./components/TicketSelectionPage";
import AttendeeDetailsPage from "./components/AttendeeDetailsPage";
import TicketConfirmationPage from "./components/TicketConfirmationPage";
import AboutUsPage from "./components/AboutUsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TicketSelectionPage />} />
        <Route path="/attendee-details" element={<AttendeeDetailsPage />} />
        <Route path="/ticket-confirmation" element={<TicketConfirmationPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
