"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import PDFViewer from "./PDFViewer";

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
const ReportDownloader = ({
  userInfo,
  scores,
  onRestart,
  disabled = false,
}) => {
  const [chartData, setChartData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [refreshPdfTrigger, setRefreshPdfTrigger] = useState(0);

  // Use provided scores
  const reportScores = scores;
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

  // PDF generation is now handled by @react-pdf/renderer directly via PDFDownloadLink

  // These functions are used in the PDF generation
  // // Calculate stress level category
  // const getStressLevel = (score) => {
  //   if (score <= 13) return "Low";
  //   if (score <= 26) return "Moderate";
  //   return "High";
  // };

  // // Calculate resilience level category
  // const getResilienceLevel = (score) => {
  //   const maxPossible = 100; // Assuming max possible score is 100
  //   const percentage = (score / maxPossible) * 100;

  //   if (percentage >= 75) return "High";
  //   if (percentage >= 50) return "Moderate";
  //   return "Low";
  // };

  // These values are used in the PDF generation
  // const stressLevel = reportScores
  //   ? getStressLevel(reportScores.stress)
  //   : "N/A";
  // const resilienceLevel = reportScores
  //   ? getResilienceLevel(reportScores.resilience)
  //   : "N/A";

  if (
    !reportScores ||
    !chartData ||
    !chartData.personality ||
    !chartData.decisionStyle ||
    !chartData.cbic
  ) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#B4E0E0] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your results...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-center mb-4">
        <Button
          onClick={async () => {
            if (isGeneratingPDF) return;

            try {
              setIsGeneratingPDF(true);

              // Refresh the PDF first to ensure it has the latest data
              setRefreshPdfTrigger((prev) => prev + 1);

              // Wait a moment for the PDF to regenerate
              await new Promise((resolve) => setTimeout(resolve, 500));

              // Check if the PDF blob is available from the PDFViewer
              if (window.pdfBlob) {
                // Create a download link
                const url = URL.createObjectURL(window.pdfBlob);

                // Create a temporary link element
                const link = document.createElement("a");
                link.href = url;
                link.download =
                  "Skill_Based_Psychometric_Assessment_Report:Mending_Mind.pdf";

                // Append to the document, click it, and remove it
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up the URL object
                setTimeout(() => URL.revokeObjectURL(url), 100);
              } else {
                throw new Error(
                  "PDF not ready yet. Please wait for the preview to load."
                );
              }
            } catch (error) {
              // Handle error silently
              alert(
                "There was an error downloading the PDF. Please try again after the preview has loaded."
              );
            } finally {
              setIsGeneratingPDF(false);
            }
          }}
          disabled={isGeneratingPDF || disabled}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#B4E0E0] hover:bg-[#8ECACA] text-black h-10 px-4 py-2"
        >
          {isGeneratingPDF ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-black"
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
              Generating PDF...
            </>
          ) : disabled ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-black"
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
              Preparing Report...
            </>
          ) : (
            <>
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
                className="mr-2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF Report
            </>
          )}
        </Button>
      </div>

      {/* Real PDF Preview using PDFViewer component */}
      <div className="pdf-preview-container hidden">
        <PDFViewer
          userInfo={userInfo}
          reportScores={reportScores}
          refreshTrigger={refreshPdfTrigger}
        />
      </div>
    </div>
  );
};

export default ReportDownloader;
