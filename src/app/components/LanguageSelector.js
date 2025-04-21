"use client";

import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    // Language selection is now handled by parent component through click event
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 z-50">
      <div className="bg-[#FFB800] rounded-2xl p-10 w-full max-w-md mx-4">
        <h2 className="text-[28px] font-bold text-center mb-10">
          LANGUAGE/भाषा
        </h2>
        <div className="space-y-6">
          <button
            onClick={() => handleLanguageSelect("en")}
            className={`w-full py-4 rounded-xl text-[18px] font-medium transition-colors ${
              language === "en"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            English/अंग्रेज़ी
          </button>
          <button
            onClick={() => handleLanguageSelect("hi")}
            className={`w-full py-4 rounded-xl text-[18px] font-medium transition-colors ${
              language === "hi"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            Hindi/हिंदी
          </button>
        </div>
      </div>
    </div>
  );
}
