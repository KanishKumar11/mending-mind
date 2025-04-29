"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";

const ResilienceChartGenerator = ({
  score = 65,
  onChartImageGenerated,
  width = 600,
  height = 150,
}) => {
  const chartRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const imageGeneratedRef = useRef(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  // Calculate normalized score for display (25-125 scale to 0-100 scale)
  const minScore = 25; // Minimum possible score
  const maxScore = 125; // Maximum possible score
  const normalizedScore = Math.min(maxScore, Math.max(minScore, score)); // Ensure score is within range
  const displayScore =
    ((normalizedScore - minScore) / (maxScore - minScore)) * 100;

  // Determine color based on actual score
  const getColor = () => {
    if (score <= 58) return "#B4E0E0"; // Mint for low resilience (25-58)
    if (score <= 91) return "#F0C93B"; // Gold for moderate resilience (59-91)
    return "#4CAF50"; // Green for high resilience (92-125)
  };

  // Create data for the chart
  const data = [
    {
      name: "Resilience",
      score: displayScore, // Use normalized score for display
      actualScore: score, // Keep actual score for reference
      fill: getColor(),
    },
  ];

  // Function to generate image from chart
  const generateChartImage = useCallback(() => {
    if (!chartRef.current || imageGeneratedRef.current) return;

    try {
      // Use html2canvas or similar library to capture the chart
      // For simplicity, we'll use a timeout to simulate image generation
      setTimeout(() => {
        // In a real implementation, you would use html2canvas or a similar library
        // For now, we'll just call the callback with a placeholder
        if (onChartImageGenerated && !imageGeneratedRef.current) {
          imageGeneratedRef.current = true;

          // Create a canvas element
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          // Create transparent background
          ctx.clearRect(0, 0, width, height);

          // Draw the bar
          ctx.fillStyle = getColor();
          const barHeight = 40;
          const barY = (height - barHeight) / 2;
          const barWidth = (displayScore / 100) * (width - 60); // Use normalized score
          ctx.fillRect(30, barY, barWidth, barHeight);

          // Draw the main axis line
          ctx.strokeStyle = "#666666";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(30, barY + barHeight + 10);
          ctx.lineTo(width - 30, barY + barHeight + 10);
          ctx.stroke();

          // Draw tick marks
          ctx.lineWidth = 1;
          for (let i = 0; i <= 10; i++) {
            const tickX = 30 + ((i * 10) / 100) * (width - 60);
            ctx.beginPath();
            ctx.moveTo(tickX, barY + barHeight + 10);
            ctx.lineTo(tickX, barY + barHeight + 15);
            ctx.stroke();
          }

          // Draw the markers
          ctx.fillStyle = "#666666";
          ctx.font = "12px Arial";

          // Low marker
          ctx.textAlign = "left";
          ctx.fillText("Low", 30, barY + barHeight + 30);

          // Moderate marker
          const moderateX = 30 + (33 / 100) * (width - 60); // 33% mark
          ctx.textAlign = "center";
          ctx.fillText("Moderate", moderateX, barY + barHeight + 30);

          // High marker
          const highX = 30 + (66 / 100) * (width - 60); // 66% mark
          ctx.textAlign = "center";
          ctx.fillText("High", highX, barY + barHeight + 30);

          // Draw vertical reference lines
          ctx.strokeStyle = "#666666";
          ctx.setLineDash([3, 3]); // Dashed line

          // Moderate line (33% mark)
          ctx.beginPath();
          ctx.moveTo(moderateX, barY - 10);
          ctx.lineTo(moderateX, barY + barHeight + 10);
          ctx.stroke();

          // High line (66% mark)
          ctx.beginPath();
          ctx.moveTo(highX, barY - 10);
          ctx.lineTo(highX, barY + barHeight + 10);
          ctx.stroke();

          // Reset line dash
          ctx.setLineDash([]);

          // Convert to data URL with transparency and call the callback
          const dataUrl = canvas.toDataURL("image/png");
          onChartImageGenerated(dataUrl);
        }
      }, 500);
    } catch (error) {
      console.error("Error generating chart image:", error);
    }
  }, [score, width, height, onChartImageGenerated, getColor]);

  // Generate chart image when component mounts
  useEffect(() => {
    if (isClient && chartRef.current) {
      generateChartImage();
    }
  }, [isClient, generateChartImage]);

  if (!isClient) return null;

  return (
    <div
      ref={chartRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "absolute",
        left: "-9999px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          background={{ fill: "transparent" }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
            tickLine={true}
            axisLine={true}
            tickFormatter={() => ""} // Hide numbers
            tick={{ fontSize: 0 }} // Hide tick labels
          />
          <YAxis type="category" dataKey="name" hide />

          {/* Reference lines for resilience levels */}
          <ReferenceLine x={0} stroke="#666" strokeWidth={2}>
            <Label
              value="Low"
              position="insideBottomLeft"
              fill="#666"
              fontSize={12}
              offset={5}
            />
          </ReferenceLine>
          <ReferenceLine x={33} stroke="#666" strokeDasharray="3 3">
            <Label
              value="Moderate"
              position="insideBottom"
              fill="#666"
              fontSize={12}
              offset={5}
            />
          </ReferenceLine>
          <ReferenceLine x={66} stroke="#666" strokeDasharray="3 3">
            <Label
              value="High"
              position="insideBottom"
              fill="#666"
              fontSize={12}
              offset={5}
            />
          </ReferenceLine>

          <Bar dataKey="score" barSize={40} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResilienceChartGenerator;
