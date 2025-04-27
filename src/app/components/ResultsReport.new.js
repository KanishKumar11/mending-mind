"use client";

import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut, Radar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  ArcElement
);

// Main component that handles both mobile view and PDF generation
const ResultsReport = ({ userInfo, scores, onRestart }) => {
  const componentRef = useRef(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [chartData, setChartData] = useState(null);

  // Default scores if none are provided
  const defaultScores = {
    personality: {
      extraversion: 7,
      agreeableness: 8,
      conscientiousness: 6,
      neuroticism: 4,
      openness: 9,
    },
    stress: 14,
    decisionStyle: {
      rational: 16,
      intuitive: 12,
    },
    resilience: 59,
    cbic: {
      empathy: 6,
      emotional: 5,
      decision: 6,
    },
  };

  // Use provided scores or default scores
  const reportScores = scores || defaultScores;

  // Prepare chart data
  useEffect(() => {
    // Personality data
    const personalityData = {
      labels: [
        "Extraversion",
        "Agreeableness",
        "Conscientiousness",
        "Neuroticism",
        "Openness",
      ],
      datasets: [
        {
          label: "Score",
          data: [
            reportScores.personality.extraversion,
            reportScores.personality.agreeableness,
            reportScores.personality.conscientiousness,
            reportScores.personality.neuroticism,
            reportScores.personality.openness,
          ],
          backgroundColor: "#F0C93B",
          borderColor: "#E6B92E",
          borderWidth: 1,
        },
      ],
    };

    // Decision style data
    const decisionStyleData = {
      labels: ["Rational", "Intuitive"],
      datasets: [
        {
          label: "Score",
          data: [
            reportScores.decisionStyle.rational,
            reportScores.decisionStyle.intuitive,
          ],
          backgroundColor: ["#B4E0E0", "#9A8BC5"],
          borderColor: ["#8ECACA", "#8A7BB5"],
          borderWidth: 1,
        },
      ],
    };

    // CBIC data
    const cbicData = {
      labels: ["Empathy", "Emotional Intelligence", "Decision Making"],
      datasets: [
        {
          label: "CBIC Scores",
          data: [
            reportScores.cbic.empathy,
            reportScores.cbic.emotional,
            reportScores.cbic.decision,
          ],
          backgroundColor: "rgba(176, 224, 224, 0.2)",
          borderColor: "#B4E0E0",
          borderWidth: 2,
          pointBackgroundColor: "#F0C93B",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "#F0C93B",
        },
      ],
    };

    setChartData({
      personality: personalityData,
      decisionStyle: decisionStyleData,
      cbic: cbicData,
    });
  }, [reportScores]);

  // Function to handle printing/PDF generation
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Mending_Mind_Assessment_Report",
    onBeforeGetContent: () => {
      setIsPrinting(true);
      return new Promise((resolve) => {
        // Add a small delay to ensure all content is properly rendered
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    },
    onAfterPrint: () => {
      setIsPrinting(false);
    },
    removeAfterPrint: false,
    suppressErrors: false,
  });

  // Calculate stress level category
  const getStressLevel = (score) => {
    if (score <= 13) return "Low";
    if (score <= 26) return "Moderate";
    return "High";
  };

  // Calculate resilience level category
  const getResilienceLevel = (score) => {
    const maxPossible = 100; // Assuming max possible score is 100
    const percentage = (score / maxPossible) * 100;

    if (percentage >= 75) return "High";
    if (percentage >= 50) return "Moderate";
    return "Low";
  };

  const stressLevel = getStressLevel(reportScores.stress);
  const resilienceLevel = getResilienceLevel(reportScores.resilience);

  if (!chartData) {
    return <div className="p-8 text-center">Loading your results...</div>;
  }

  return (
    <div className="results-container">
      {/* Add print styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          .results-container > *:not(#print-section) {
            display: none !important;
          }

          #print-section {
            display: block !important;
            width: 100%;
            height: auto;
          }
        }
      `,
        }}
      />

      {/* Mobile-friendly preview - only shown when not printing */}
      {!isPrinting && (
        <motion.div
          className="mobile-preview p-4 md:p-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Your Assessment Results
          </h1>

          {/* User Info */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap justify-between">
              <div>
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {userInfo?.name || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Age:</span>{" "}
                  {userInfo?.age || "N/A"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Gender:</span>{" "}
                  {userInfo?.gender || "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Personality Section */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-[#B4E0E0]">
              Personality Profile
            </h2>
            <div className="h-64 md:h-80 w-full mb-4">
              <Bar
                data={chartData.personality}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 10,
                      ticks: {
                        stepSize: 2,
                      },
                    },
                  },
                }}
              />
            </div>
            <p className="text-sm md:text-base">
              Your personality profile shows strengths in{" "}
              {reportScores.personality.extraversion > 6
                ? "extraversion"
                : "introversion"}
              , with notable scores in{" "}
              {reportScores.personality.conscientiousness > 6
                ? "conscientiousness"
                : "openness to experience"}
              .
            </p>
          </div>

          {/* Stress & Resilience */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-[#B4E0E0]">
              Stress & Resilience
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 border rounded-lg p-4 text-center">
                <h3 className="font-semibold mb-2">Stress Level</h3>
                <div
                  className={`text-2xl font-bold mb-2 ${
                    stressLevel === "Low"
                      ? "text-green-500"
                      : stressLevel === "Moderate"
                      ? "text-orange-500"
                      : "text-red-500"
                  }`}
                >
                  {stressLevel}
                </div>
                <p className="text-sm">Score: {reportScores.stress} / 40</p>
              </div>
              <div className="flex-1 border rounded-lg p-4 text-center">
                <h3 className="font-semibold mb-2">Resilience</h3>
                <div
                  className={`text-2xl font-bold mb-2 ${
                    resilienceLevel === "High"
                      ? "text-green-500"
                      : resilienceLevel === "Moderate"
                      ? "text-orange-500"
                      : "text-red-500"
                  }`}
                >
                  {resilienceLevel}
                </div>
                <p className="text-sm">
                  Score: {reportScores.resilience} / 100
                </p>
              </div>
            </div>
          </div>

          {/* Decision Style */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-[#B4E0E0]">
              Decision-Making Style
            </h2>
            <div className="h-64 w-full md:w-2/3 mx-auto mb-4">
              <Doughnut
                data={chartData.decisionStyle}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
            <p className="text-sm md:text-base text-center">
              You tend to be more{" "}
              {reportScores.decisionStyle.rational >
              reportScores.decisionStyle.intuitive
                ? "rational"
                : "intuitive"}{" "}
              in your decision-making approach.
            </p>
          </div>

          {/* CBIC Section */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-[#B4E0E0]">
              Emotional Intelligence
            </h2>
            <div className="h-64 md:h-80 w-full mb-4">
              <Radar
                data={chartData.cbic}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      angleLines: {
                        display: true,
                      },
                      suggestedMin: 0,
                      suggestedMax: 25,
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center my-8">
            <button
              onClick={() => {
                try {
                  handlePrint();
                } catch (error) {
                  console.error("Error generating PDF:", error);
                  alert(
                    "There was an issue generating the PDF. Please try again."
                  );
                }
              }}
              className="bg-[#F0C93B] hover:bg-[#E6B92E] text-[#1E1E1E] font-semibold py-3 px-8 rounded-md transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9v12h12V9"></path>
                <path d="M6 9H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2"></path>
                <path d="M6 9l6-6 6 6"></path>
              </svg>
              <span>Download Full Report</span>
            </button>
            <button
              onClick={onRestart}
              className="border-2 border-[#B4E0E0] hover:bg-[#B4E0E0]/10 text-[#1E1E1E] font-semibold py-3 px-8 rounded-md transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
              <span>Start Over</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Print container */}
      <div id="print-section" style={{ display: "none" }}>
        <div ref={componentRef}>
          {/* PDF Content */}
          <div
            className="bg-white"
            style={{
              width: "210mm",
              minHeight: "297mm",
              margin: "0 auto",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {/* Cover Page */}
            <div
              style={{
                width: "210mm",
                height: "297mm",
                padding: "0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                backgroundColor: "white",
                position: "relative",
                pageBreakAfter: "always",
              }}
            >
              {/* Logo */}
              <div
                style={{
                  marginTop: "40mm",
                  marginBottom: "10mm",
                  textAlign: "center",
                }}
              >
                <img
                  src="/Mind_Logo.png"
                  alt="Mending Mind Logo"
                  style={{ width: "150px", height: "auto" }}
                />
                <p
                  style={{
                    fontSize: "10pt",
                    color: "#666",
                    marginTop: "5mm",
                    fontStyle: "italic",
                  }}
                >
                  Prioritizing Mental Health
                </p>
              </div>

              {/* Brain Illustration */}
              <div
                style={{
                  marginTop: "10mm",
                  marginBottom: "20mm",
                  textAlign: "center",
                }}
              >
                <img
                  src="/report.svg"
                  alt="Brain Illustration"
                  style={{ width: "200px", height: "auto" }}
                />
              </div>

              {/* Title */}
              <div
                style={{
                  marginTop: "10mm",
                  marginBottom: "10mm",
                  textAlign: "center",
                  width: "80%",
                }}
              >
                <h1
                  style={{
                    fontSize: "32pt",
                    fontWeight: "bold",
                    color: "#1E1E1E",
                    marginBottom: "5mm",
                    textTransform: "uppercase",
                  }}
                >
                  MINDSCAN,
                </h1>
                <h2
                  style={{
                    fontSize: "16pt",
                    fontWeight: "normal",
                    color: "#1E1E1E",
                    marginBottom: "10mm",
                  }}
                >
                  a mental health checkup camp
                </h2>
                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    backgroundColor: "#ccc",
                    margin: "5mm 0",
                  }}
                ></div>
                <p
                  style={{
                    fontSize: "12pt",
                    fontStyle: "italic",
                    color: "#1E1E1E",
                    marginTop: "5mm",
                  }}
                >
                  brought to you by Mending Mind.
                </p>
              </div>

              {/* Test Administrator */}
              <div
                style={{ marginTop: "30mm", width: "80%", maxWidth: "400px" }}
              >
                <p
                  style={{
                    fontSize: "14pt",
                    color: "#1E1E1E",
                    marginBottom: "15mm",
                    textAlign: "center",
                  }}
                >
                  Test Administrator:
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15mm",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <label style={{ fontSize: "12pt", width: "80px" }}>
                      Name
                    </label>
                    <div
                      style={{
                        flex: 1,
                        borderBottom: "1px solid #F0C93B",
                        marginLeft: "10mm",
                        padding: "5px",
                        fontSize: "12pt",
                      }}
                    >
                      {userInfo?.name || "Test"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <label style={{ fontSize: "12pt", width: "80px" }}>
                      Date
                    </label>
                    <div
                      style={{
                        flex: 1,
                        borderBottom: "1px solid #F0C93B",
                        marginLeft: "10mm",
                        padding: "5px",
                        fontSize: "12pt",
                      }}
                    >
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Content - starts on second page */}
            <div
              style={{
                width: "210mm",
                minHeight: "297mm",
                padding: "20mm",
                boxSizing: "border-box",
              }}
            >
              {/* Report Header */}
              <div
                style={{
                  marginBottom: "15mm",
                  borderBottom: "2px solid #F0C93B",
                  paddingBottom: "5mm",
                }}
              >
                <h1
                  style={{
                    fontSize: "24pt",
                    marginBottom: "5mm",
                    color: "#1E1E1E",
                  }}
                >
                  Mending Mind Assessment Report
                </h1>
                <div
                  style={{
                    fontSize: "12pt",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p>
                      <strong>Name:</strong> {userInfo?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Age:</strong> {userInfo?.age || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Gender:</strong> {userInfo?.gender || "N/A"}
                    </p>
                    <p>
                      <strong>Date:</strong> {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Introduction */}
              <div style={{ marginBottom: "10mm" }}>
                <p
                  style={{
                    fontSize: "11pt",
                    lineHeight: "1.5",
                    textAlign: "justify",
                  }}
                >
                  This report provides a comprehensive analysis of your
                  responses to the Mending Mind Assessment. The assessment
                  evaluates various aspects of your psychological profile
                  including personality traits, stress levels, decision-making
                  style, resilience, and emotional intelligence. The insights
                  provided can help you better understand your psychological
                  strengths and areas for growth.
                </p>
              </div>

              {/* Personality Section */}
              <div style={{ marginBottom: "15mm" }}>
                <h2
                  style={{
                    fontSize: "16pt",
                    marginBottom: "5mm",
                    color: "#1E1E1E",
                    borderBottom: "1px solid #B4E0E0",
                    paddingBottom: "2mm",
                  }}
                >
                  Personality Profile
                </h2>
                <div style={{ height: "80mm", marginBottom: "5mm" }}>
                  <Bar
                    data={chartData.personality}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 10,
                          ticks: {
                            stepSize: 2,
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  borderTop: "1px solid #eee",
                  paddingTop: "5mm",
                  marginTop: "10mm",
                  fontSize: "9pt",
                  color: "#666",
                  textAlign: "center",
                }}
              >
                <p>
                  © {new Date().getFullYear()} Mending Mind - Assessment Report
                </p>
                <p style={{ marginTop: "2mm" }}>
                  This report is based on self-reported data and should be
                  considered as one perspective on your psychological profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsReport;
