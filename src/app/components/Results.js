"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import PDFGenerator from "../services/PDFGenerator";
// Note: You'll need to install jspdf and jspdf-autotable packages
// npm install jspdf jspdf-autotable

export default function Results({ userInfo, answers, onRestart }) {
  const { language } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);

  // Generate a unique report ID
  const reportId = `MSAQ${Math.random()
    .toString(36)
    .substring(2, 8)}${Math.random().toString(36).substring(2, 4)}`;

  // Function to handle PDF download
  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      // Generate a dynamic PDF report based on user info and answers
      const pdfBlob = await PDFGenerator.generateReport(
        userInfo,
        answers,
        language
      );

      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open the PDF in a new tab
      window.open(pdfUrl, "_blank");

      // Clean up the URL object after a delay
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to static PDF if generation fails
      window.open("/Mind_Scan_Report_MSAQ25KMlm.pdf", "_blank");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-6 bg-white">
      {/* Logo */}
      <div className="w-full max-w-[200px] mx-auto mb-8">
        <Image
          src="/Mind_Logo.png"
          alt="Mending Mind Logo"
          width={200}
          height={67}
          priority
          className="w-full"
        />
        <p className="text-center text-sm mt-2">Prioritizing Mental Health</p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Image */}
        <div className="relative w-full h-64">
          <Image
            src="/question-1.png"
            alt="Mind Scan"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-5xl font-bold tracking-tight">MINDSCAN,</h1>
            <p className="text-xl font-medium">a mental health checkup camp</p>
            <div className="w-full h-px bg-white my-4"></div>
            <p className="text-base italic font-medium">
              brought to you by Mending Mind.
            </p>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-center">
              {language === "en"
                ? "Your Mind Scan Report"
                : "आपकी माइंड स्कैन रिपोर्ट"}
            </h2>
            <p className="text-center text-gray-600 mb-2">
              {language === "en" ? "Report ID" : "रिपोर्ट आईडी"}: {reportId}
            </p>
            <p className="text-center text-gray-600">
              {language === "en" ? "Date" : "दिनांक"}:{" "}
              {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* User Information */}
          {userInfo && (
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">
                {language === "en"
                  ? "Personal Information"
                  : "व्यक्तिगत जानकारी"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    {language === "en" ? "Name" : "नाम"}:
                  </p>
                  <p className="font-medium">{userInfo.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">
                    {language === "en" ? "Age" : "उम्र"}:
                  </p>
                  <p className="font-medium">{userInfo.age}</p>
                </div>
                <div>
                  <p className="text-gray-600">
                    {language === "en" ? "Gender" : "लिंग"}:
                  </p>
                  <p className="font-medium">{userInfo.gender}</p>
                </div>
                <div>
                  <p className="text-gray-600">
                    {language === "en" ? "Email" : "ईमेल"}:
                  </p>
                  <p className="font-medium">{userInfo.emailId}</p>
                </div>
              </div>
            </div>
          )}

          {/* Thank You Message */}
          <div className="mb-8 text-center">
            <motion.h2
              className="text-2xl font-bold text-[#D15B3B] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {language === "en"
                ? "Thank you for your engagement."
                : "आपकी भागीदारी के लिए धन्यवाद।"}
            </motion.h2>
          </div>

          {/* Assessment Summary */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              {language === "en" ? "Assessment Summary" : "मूल्यांकन सारांश"}
            </h3>
            <p className="mb-4">
              {language === "en"
                ? "Thank you for completing the Mind Scan assessment. Your responses have been analyzed to provide insights into your mental well-being."
                : "माइंड स्कैन मूल्यांकन पूरा करने के लिए धन्यवाद। आपकी प्रतिक्रियाओं का विश्लेषण आपके मानसिक स्वास्थ्य के बारे में जानकारी प्रदान करने के लिए किया गया है।"}
            </p>

            {/* This would be replaced with actual assessment results */}
            <div className="p-4 bg-[#B4E0E0]/20 border border-[#B4E0E0] rounded-lg">
              <p className="font-medium text-[#1E1E1E]">
                {language === "en"
                  ? "Your complete assessment report is available for download. Click the button below to access your detailed Mind Scan report."
                  : "आपकी पूरी मूल्यांकन रिपोर्ट डाउनलोड के लिए उपलब्ध है। अपनी विस्तृत माइंड स्कैन रिपोर्ट तक पहुंचने के लिए नीचे दिए गए बटन पर क्लिक करें।"}
              </p>
            </div>
          </div>

          {/* Download Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {language === "en"
                ? "DOWNLOAD YOUR REPORT HERE"
                : "अपनी रिपोर्ट यहां डाउनलोड करें"}
            </h2>
            <div className="flex justify-center">
              <div className="relative">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="bg-[#F0C93B] hover:bg-[#D15B3B] text-[#1E1E1E] hover:text-white font-bold py-4 px-8 rounded-full transition-colors flex items-center justify-center min-w-[200px] shadow-md"
                >
                  {isDownloading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {language === "en" ? "Processing..." : "प्रोसेसिंग..."}
                    </span>
                  ) : (
                    <span>
                      {language === "en" ? "CLICK HERE >" : "यहां क्लिक करें >"}
                    </span>
                  )}
                </button>
                <Image
                  src="/arrow-right.svg"
                  alt="Arrow"
                  width={40}
                  height={40}
                  className="absolute -right-10 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>
          </div>

          {/* Restart Button */}
          <div className="text-center">
            <button
              onClick={onRestart}
              className="text-[#9A8BC5] hover:text-[#D15B3B] underline transition-colors font-medium"
            >
              {language === "en"
                ? "Start a new assessment"
                : "एक नया मूल्यांकन शुरू करें"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
