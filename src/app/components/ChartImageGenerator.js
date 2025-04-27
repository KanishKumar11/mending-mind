"use client";

import React, { useState, useEffect } from "react";
import RechartsGenerator from "./RechartsGenerator";
import StressChartGenerator from "./StressChartGenerator";

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

  // We don't need to calculate an average personality score anymore
  // as we'll show all traits in the pie chart

  // When all charts are generated, call the callback
  useEffect(() => {
    if (personalityChartImage && stressChartImage && decisionChartImage) {
      onChartsGenerated({
        personalityChart: personalityChartImage,
        stressChart: stressChartImage,
        decisionChart: decisionChartImage,
      });
    }
  }, [
    personalityChartImage,
    stressChartImage,
    decisionChartImage,
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
      <RechartsGenerator
        chartType="decision"
        value={reportScores?.decisionStyle?.score || 80}
        label="Decision"
        onChartImageGenerated={setDecisionChartImage}
      />
    </div>
  );
};

export default ChartImageGenerator;
