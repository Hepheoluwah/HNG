// src/components/Navbar.js
import React from "react";
import { FaTrash, FaMoon, FaSun } from "react-icons/fa";

const Navbar = ({ clearChat, toggleTheme, currentTheme }) => {
  return (
    <div className="navbar bg-base-100 shadow">
      <div className="flex-1 px-2 mx-2">
        <span className="text-lg font-bold">AI-Powered Text Processing</span>
      </div>
      <div className="flex-none space-x-2 pr-4">
        {/* Clear Chat */}
        <button
          onClick={clearChat}
          className="btn btn-error btn-sm gap-2"
          aria-label="Clear chat"
        >
          <FaTrash />
          Clear
        </button>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-sm gap-2"
          aria-label="Toggle theme"
        >
          {currentTheme === "light" ? <FaMoon /> : <FaSun />}
          {currentTheme === "light" ? "Dark" : "Light"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
