import React from "react";

export const Button = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-[#F0C93B] hover:bg-[#E6B92E] text-[#1E1E1E] font-semibold py-3 px-8 rounded-md transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${className}`}
    >
      {children}
    </button>
  );
};
