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
  Legend,
  Label,
  Cell,
} from "recharts";

const DecisionChartGenerator = ({
  rationalScore = 18,
  intuitiveScore = 22,
  onChartImageGenerated,
  width = 600,
  height = 200,
}) => {
  const chartRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const imageGeneratedRef = useRef(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  // Determine colors based on scores
  const getRationalColor = () => {
    if (rationalScore >= 21) return "#7B68EE"; // High - purple
    if (rationalScore <= 12) return "#B4E0E0"; // Low - mint
    return "#F0C93B"; // Balanced - gold
  };

  const getIntuitiveColor = () => {
    if (intuitiveScore >= 21) return "#FF5757"; // High - red
    if (intuitiveScore <= 12) return "#B4E0E0"; // Low - mint
    return "#F0C93B"; // Balanced - gold
  };

  // Create data for the chart - using separate entries for each style
  const data = [
    {
      name: "Rational",
      value: rationalScore,
      fill: getRationalColor(),
    },
    {
      name: "Intuitive",
      value: intuitiveScore,
      fill: getIntuitiveColor(),
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

          // Draw the chart background grid
          ctx.strokeStyle = "#dddddd";
          ctx.setLineDash([3, 3]);

          // Draw horizontal grid lines
          const gridY = height / 2;
          for (let i = 0; i <= 5; i++) {
            const x = 50 + (i * (width - 100)) / 5;
            ctx.beginPath();
            ctx.moveTo(x, 30);
            ctx.lineTo(x, height - 50);
            ctx.stroke();
          }

          // Draw the axis
          ctx.strokeStyle = "#666666";
          ctx.lineWidth = 1;
          ctx.setLineDash([]);

          // X-axis
          ctx.beginPath();
          ctx.moveTo(50, height - 50);
          ctx.lineTo(width - 50, height - 50);
          ctx.stroke();

          // Y-axis
          ctx.beginPath();
          ctx.moveTo(50, 30);
          ctx.lineTo(50, height - 50);
          ctx.stroke();

          // Draw tick marks on X-axis
          for (let i = 0; i <= 5; i++) {
            const x = 50 + (i * (width - 100)) / 5;
            ctx.beginPath();
            ctx.moveTo(x, height - 50);
            ctx.lineTo(x, height - 45);
            ctx.stroke();

            // Draw tick marks only, no labels
          }

          // Draw reference lines and scale markers
          ctx.strokeStyle = "#666666";

          // Low marker (0)
          const lowX = 50;
          ctx.setLineDash([]);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(lowX, 30);
          ctx.lineTo(lowX, height - 50);
          ctx.stroke();

          // Medium marker (12.5)
          const mediumX = 50 + (12.5 * (width - 100)) / 25;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(mediumX, 30);
          ctx.lineTo(mediumX, height - 50);
          ctx.stroke();

          // High marker (25)
          const highX = width - 50;
          ctx.setLineDash([]);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(highX, 30);
          ctx.lineTo(highX, height - 50);
          ctx.stroke();

          // Draw scale marker labels
          ctx.fillStyle = "#666666";
          ctx.font = "10px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Low", lowX, height - 30);
          ctx.fillText("Medium", mediumX, height - 30);
          ctx.fillText("High", highX, height - 30);

          // Draw the bars
          const barHeight = 30;
          const barSpacing = 15;
          const barStartY = 50;

          // Draw bar labels outside the chart area
          ctx.fillStyle = "#000000";
          ctx.font = "bold 12px Arial";
          ctx.textAlign = "left";
          ctx.fillText("Rational", 0, barStartY + barHeight / 2 + 4);
          ctx.fillText(
            "Intuitive",
            0,
            barStartY + barHeight + barSpacing + barHeight / 2 + 4
          );

          // Rational bar - full width
          const rationalWidth = (rationalScore / 25) * (width - 100);
          ctx.fillStyle = getRationalColor();
          ctx.fillRect(50, barStartY, rationalWidth, barHeight);

          // Intuitive bar - full width
          const intuitiveWidth = (intuitiveScore / 25) * (width - 100);
          ctx.fillStyle = getIntuitiveColor();
          ctx.fillRect(
            50,
            barStartY + barHeight + barSpacing,
            intuitiveWidth,
            barHeight
          );

          // Convert to data URL and call the callback
          const dataUrl = canvas.toDataURL("image/png");
          onChartImageGenerated(dataUrl);
        }
      }, 500);
    } catch (error) {
      console.error("Error generating chart image:", error);
    }
  }, [
    rationalScore,
    intuitiveScore,
    width,
    height,
    onChartImageGenerated,
    getRationalColor,
    getIntuitiveColor,
  ]);

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
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          background={{ fill: "transparent" }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={true} />
          <XAxis
            type="number"
            domain={[0, 25]}
            ticks={[0, 5, 10, 15, 20, 25]}
            tickFormatter={() => ""} // Hide numbers
            tick={{ fontSize: 0 }} // Hide tick labels
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fontWeight: "bold" }}
            width={0}
            axisLine={false}
            tickLine={false}
            hide={true}
          />

          {/* Scale markers instead of numbers */}
          <ReferenceLine x={0} stroke="#666" strokeWidth={1}>
            <Label
              value="Low"
              position="bottom"
              fill="#666"
              fontSize={10}
              offset={5}
            />
          </ReferenceLine>
          <ReferenceLine x={12.5} stroke="#666" strokeDasharray="3 3">
            <Label
              value="Medium"
              position="bottom"
              fill="#666"
              fontSize={10}
              offset={5}
            />
          </ReferenceLine>
          <ReferenceLine x={25} stroke="#666" strokeWidth={1}>
            <Label
              value="High"
              position="bottom"
              fill="#666"
              fontSize={10}
              offset={5}
            />
          </ReferenceLine>

          <Bar dataKey="value" barSize={30} radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DecisionChartGenerator;
