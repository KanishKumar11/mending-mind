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
import WebResilienceScaleDisplay from "./WebResilienceScaleDisplay";

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
const ReportGenerator = ({ userInfo, scores, onRestart }) => {
  const [chartData, setChartData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [refreshPdfTrigger, setRefreshPdfTrigger] = useState(0);

  // Use provided scores
  const reportScores = scores;
  console.log(scores);
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

  const stressLevel = reportScores
    ? getStressLevel(reportScores.stress)
    : "N/A";
  const resilienceLevel = reportScores
    ? getResilienceLevel(reportScores.resilience)
    : "N/A";

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
      <Tabs
        defaultValue="preview"
        className="w-full"
        onValueChange={(value) => {
          // Refresh PDF when switching to PDF preview tab
          if (value === "preview") {
            setRefreshPdfTrigger((prev) => prev + 1);
          }
        }}
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="summary">Report Summary</TabsTrigger>
          <TabsTrigger value="preview">PDF Preview</TabsTrigger>
        </TabsList>

        {/* Summary Tab - Current Report View */}
        <TabsContent value="summary">
          {chartData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h1 className="text-3xl font-bold text-center mb-8">
                Your Assessment Results
              </h1>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    Personal Details
                  </h2>
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {userInfo?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Age:</span>{" "}
                    {userInfo?.age || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {userInfo?.gender || "N/A"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    Assessment Summary
                  </h2>
                  <p>
                    <span className="font-medium">Stress Level:</span>{" "}
                    {stressLevel}
                  </p>
                  <p>
                    <span className="font-medium">Resilience:</span>{" "}
                    {resilienceLevel}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Personality Section */}
              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200">
                  Personality Profile
                </h2>
                <div className="h-80 mb-4">
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
                <p className="text-gray-700">
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

              {/* Decision Style Section */}
              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200">
                  Decision-Making Style
                </h2>
                <div className="h-80 mb-4">
                  <Doughnut
                    data={chartData.decisionStyle}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
                <p className="text-gray-700">
                  Your decision-making style tends to be more{" "}
                  {reportScores.decisionStyle.rational >
                  reportScores.decisionStyle.intuitive
                    ? "rational and analytical"
                    : "intuitive and instinctive"}
                  .
                </p>
              </div>

              {/* Resilience Section */}
              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200">
                  Resilience Assessment
                </h2>
                <WebResilienceScaleDisplay score={reportScores.resilience} />
              </div>

              {/* CBIC Section */}
              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-200">
                  Cognitive-Behavioral Intelligence Composite
                </h2>
                <div className="h-80 mb-4">
                  <Radar
                    data={chartData.cbic}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          min: 0,
                          max: 10,
                          ticks: {
                            stepSize: 2,
                          },
                        },
                      },
                    }}
                  />
                </div>
                <p className="text-gray-700">
                  Your CBIC profile indicates strengths in{" "}
                  {Math.max(
                    reportScores.cbic.empathy,
                    reportScores.cbic.emotional,
                    reportScores.cbic.decision
                  ) === reportScores.cbic.empathy
                    ? "empathy"
                    : Math.max(
                        reportScores.cbic.empathy,
                        reportScores.cbic.emotional,
                        reportScores.cbic.decision
                      ) === reportScores.cbic.emotional
                    ? "emotional intelligence"
                    : "decision making"}
                  .
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 mb-4">
                <div className="flex justify-center">
                  <Button
                    onClick={async () => {
                      if (isGeneratingPDF) return;

                      try {
                        setIsGeneratingPDF(true);

                        // Refresh the PDF first to ensure it has the latest data
                        setRefreshPdfTrigger((prev) => prev + 1);

                        // Wait a moment for the PDF to regenerate
                        await new Promise((resolve) =>
                          setTimeout(resolve, 500)
                        );

                        // Check if the PDF blob is available from the PDFViewer
                        if (window.pdfBlob) {
                          // Create a download link
                          const url = URL.createObjectURL(window.pdfBlob);

                          // Create a temporary link element
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = "Mending_Mind_Assessment_Report.pdf";

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
                        console.error("Error downloading PDF:", error);
                        alert(
                          "There was an error downloading the PDF. Please try again after the preview has loaded."
                        );
                      } finally {
                        setIsGeneratingPDF(false);
                      }
                    }}
                    disabled={isGeneratingPDF}
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
                <Button
                  onClick={onRestart}
                  className="border-2 border-[#B4E0E0] hover:bg-[#B4E0E0]/10 bg-transparent shadow-none"
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
                    className="mr-2"
                  >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                  Start Over
                </Button>
              </div>
            </motion.div>
          )}
        </TabsContent>

        {/* PDF Preview Tab */}
        <TabsContent value="preview">
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">PDF Preview</h2>
            <p className="text-gray-600 mb-4">
              This is exactly how your PDF will look when downloaded. You can
              view the preview below.
            </p>
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
                      link.download = "Mending_Mind_Assessment_Report.pdf";

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
                    console.error("Error downloading PDF:", error);
                    alert(
                      "There was an error downloading the PDF. Please try again after the preview has loaded."
                    );
                  } finally {
                    setIsGeneratingPDF(false);
                  }
                }}
                disabled={isGeneratingPDF}
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
          </div>

          {/* Real PDF Preview using PDFViewer component */}
          <div className="pdf-preview-container">
            <PDFViewer
              userInfo={userInfo}
              reportScores={reportScores}
              refreshTrigger={refreshPdfTrigger}
            />
          </div>

          {/* Refresh PDF button */}
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setRefreshPdfTrigger((prev) => prev + 1)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200 hover:bg-gray-300 text-black h-10 px-4 py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
              Refresh PDF Preview
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportGenerator;
