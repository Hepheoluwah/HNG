import React from "react";
import { FaTrash, FaMoon, FaSun } from "react-icons/fa";
import Logo from "../../src/images/chaticon2.png"; // Adjust path if needed

const NavBar = ({
  currentTheme,
  toggleTheme,
  saveConversation,
  loadConversations,
  clearChat,
  onLogoClick, // New prop for handling logo click
}) => {
  return (
    <div className="navbar bg-base-100 shadow px-4 py-2">
      <div className="w-full flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          {/* Logo Section */}
          <img
            src={Logo}
            alt="Logo"
            className="w-10 h-10 cursor-pointer"
            onClick={onLogoClick}
          />
          <div className="text-xl font-bold cursor-pointer" onClick={onLogoClick}>
            AI-Powered Text Processing
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 justify-center md:justify-end">
          <button
            onClick={saveConversation}
            className="btn btn-outline btn-sm md:btn-md"
            aria-label="Save conversation"
          >
            Save Conversation
          </button>
          <button
            onClick={loadConversations}
            className="btn btn-outline btn-sm md:btn-md"
            aria-label="Load conversation"
          >
            Load Conversation
          </button>
          <button
            onClick={clearChat}
            className="btn btn-error btn-sm md:btn-md flex items-center gap-1"
            aria-label="Clear chat"
          >
            <FaTrash /> Clear Chat
          </button>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm md:btn-md flex items-center gap-1"
            aria-label="Toggle theme"
          >
            {currentTheme === "light" ? <FaMoon /> : <FaSun />}
            {currentTheme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
