"use client";

import React, { useState, useEffect } from "react";
import RechartsGenerator from "./RechartsGenerator";
import StressChartGenerator from "./StressChartGenerator";
import ResilienceChartGenerator from "./ResilienceChartGenerator";
import DecisionChartGenerator from "./DecisionChartGenerator";

/**
 * Component that generates chart images for the PDF report
 * @param {Object} props - Component props
 * @param {Object} props.reportScores - The scores to display in the charts
 * @param {Function} props.onChartsGenerated - Callback function that receives the chart images
 */
const ChartImageGenerator = ({ reportScores, onChartsGenerated }) => {
  const [personalityChartImage, setPersonalityChartImage] = useState(null);
  const [stressChartImage, setStressChartImage] = useState(null);
  const [decisionChartImage, setDecisionChartImage] = useState(null);
  const [resilienceChartImage, setResilienceChartImage] = useState(null);

  // We don't need to calculate an average personality score anymore
  // as we'll show all traits in the pie chart

  // When all charts are generated, call the callback
  useEffect(() => {
    if (
      personalityChartImage &&
      stressChartImage &&
      decisionChartImage &&
      resilienceChartImage
    ) {
      onChartsGenerated({
        personalityChart: personalityChartImage,
        stressChart: stressChartImage,
        decisionChart: decisionChartImage,
        resilienceChart: resilienceChartImage,
      });
    }
  }, [
    personalityChartImage,
    stressChartImage,
    decisionChartImage,
    resilienceChartImage,
    onChartsGenerated,
  ]);
  console.log(reportScores);
  return (
    <div style={{ position: "absolute", left: "-9999px" }}>
      {/* Use Recharts for all charts */}
      <RechartsGenerator
        chartType="personality"
        reportScores={reportScores.personality}
        onChartImageGenerated={setPersonalityChartImage}
      />
      <StressChartGenerator
        score={reportScores?.stress || 14}
        onChartImageGenerated={setStressChartImage}
      />
      <DecisionChartGenerator
        rationalScore={reportScores?.decisionStyle?.rational || 18}
        intuitiveScore={reportScores?.decisionStyle?.intuitive || 22}
        onChartImageGenerated={setDecisionChartImage}
      />
      <ResilienceChartGenerator
        score={reportScores?.resilience || 65}
        onChartImageGenerated={setResilienceChartImage}
      />
    </div>
  );
};

export default ChartImageGenerator;
