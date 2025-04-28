"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import ReportDownlaoder from "./ReportDownloader";

const ResultsScreen = ({ userInfo, scores }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle, loading, success, error
  const [emailStatus, setEmailStatus] = useState("idle"); // idle, sending, sent, error

  // Save user data to the database when component mounts
  useEffect(() => {
    const saveUserData = async () => {
      if (!userInfo || !scores || typeof window === "undefined") return;

      try {
        setSaveStatus("loading");

        // Prepare the data to be sent to the API
        const userData = {
          name: userInfo.name || "",
          age: userInfo.age || "",
          gender: userInfo.gender || "",
          email: userInfo.emailId || "",
          contact: userInfo.contactNo || "",
          scores: scores,
          pdfBlob: window.pdfBlob ? true : false, // Indicate if PDF is available
        };

        // Send the data to the API to save user data
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        // if (data.success) {
        // If user data is saved successfully, send the PDF via email
        if (window.pdfBlob && userData.email) {
          try {
            setEmailStatus("sending");

            // Convert PDF blob to base64
            const reader = new FileReader();
            reader.readAsDataURL(window.pdfBlob);

            reader.onloadend = async () => {
              const base64data = reader.result.split(",")[1];

              // Send email with PDF attachment
              const emailResponse = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: userData.email,
                  name: userData.name,
                  pdfData: base64data,
                }),
              });

              const emailData = await emailResponse.json();
              if (emailData.success) {
                console.log("Email sent successfully");
                setEmailStatus("sent");
              } else {
                console.error("Failed to send email:", emailData.error);
                setEmailStatus("error");
              }
            };
          } catch (emailError) {
            console.error("Error sending email:", emailError);
            setEmailStatus("error");
          }
        }

        setSaveStatus("success");
      } catch (error) {
        setSaveStatus("error");
      }
    };

    saveUserData();
  }, [userInfo, scores]);
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white">
      {/* Logo */}
      <div className="w-full flex justify-center mt-8 mb-4">
        <Image
          src="/Mind_Logo.png"
          alt="Mending Mind Logo"
          width={200}
          height={80}
          priority
          className="object-contain"
        />
      </div>

      {/* Illustration */}
      <div className="w-full flex justify-center mb-6">
        <Image
          src="/complete.svg"
          alt=" Illustration"
          width={250}
          height={250}
          className="object-contain"
        />
      </div>

      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-black mb-2">
          {" "}
          SKILL BASED PSYCHOMETRIC ASSESSMENT,
        </h1>
        <div className="w-48 h-0.5 bg-gray-300 mx-auto mb-4"></div>
        <p className="text-base italic text-gray-600">
          brought to you by Mending Mind.
        </p>
      </div>

      {/* Completion Message */}
      <div className="text-center mb-8">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm max-w-md mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">
                Assessment Complete!
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Your personalized assessment report is ready. Click the button
                  below to download your detailed report with insights and
                  recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="flex flex-col items-center mb-10">
        <ReportDownlaoder userInfo={userInfo} scores={scores} />
      </div>

      {/* Status Indicators */}
      {saveStatus === "loading" && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-2 mb-4 rounded">
          <p className="text-sm">Loading your personalized report...</p>
        </div>
      )}

      {emailStatus === "sending" && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-2 mb-4 rounded">
          <p className="text-sm">Sending your report to your email...</p>
        </div>
      )}

      {emailStatus === "sent" && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-2 mb-4 rounded">
          <p className="text-sm">Your report has been sent to your email!</p>
        </div>
      )}

      {emailStatus === "error" && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4 rounded">
          <p className="text-sm">
            There was an error sending your report to your email. You can still
            download it using the button above.
          </p>
        </div>
      )}

      {/* Thank You Message */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Thank You for Completing the Assessment!
        </h3>
        <p className="text-gray-600 mt-2 max-w-md mx-auto">
          We appreciate your participation.
        </p>
      </div>

      {/* Contact Info */}

      {/* Bottom Yellow Section */}
      <div className="w-full h-24 bg-[#F0C93B] mt-auto"></div>
    </div>
  );
};

export default ResultsScreen;
