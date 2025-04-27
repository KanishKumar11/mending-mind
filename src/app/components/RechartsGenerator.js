"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * Component that generates a pie chart using Recharts and converts it to an image
 * @param {Object} props - Component props
 * @param {string} props.chartType - Type of chart to generate ('personality', 'stress', 'decision')
 * @param {Object} props.reportScores - The scores to display in the chart
 * @param {number} props.value - Value for single-value charts (stress, decision)
 * @param {string} props.label - Label for single-value charts
 * @param {Function} props.onChartImageGenerated - Callback function that receives the chart image as a data URL
 */
const RechartsGenerator = ({
  chartType = "personality",
  reportScores,
  value,
  label,
  onChartImageGenerated,
}) => {
  const [RechartsComponents, setRechartsComponents] = useState(null);
  const chartRef = useRef(null);
  const [isRechartsAvailable, setIsRechartsAvailable] = useState(false);
  // Add a ref to track if we've already generated the image
  const imageGeneratedRef = useRef(false);
  console.log(reportScores);
  // Try to dynamically import Recharts
  useEffect(() => {
    const loadRecharts = async () => {
      try {
        const recharts = await import("recharts");
        setRechartsComponents(recharts);
        setIsRechartsAvailable(true);
        console.log("Recharts loaded successfully");
      } catch (error) {
        console.error("Failed to load Recharts:", error);
        setIsRechartsAvailable(false);

        // Generate a fallback image and send it back
        generateFallbackImage();
      }
    };

    loadRecharts();
  }, []);

  // Generate a fallback image using HTML Canvas
  const generateFallbackImage = useCallback(() => {
    // Only generate the image once
    if (imageGeneratedRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = chartType === "personality" ? 600 : 300;
    canvas.height = chartType === "personality" ? 400 : 300;
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // No title as requested
    ctx.fillStyle = "#333";
    ctx.font = "bold 24px Montserrat, Arial, sans-serif";
    ctx.textAlign = "center";

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = chartType === "personality" ? 120 : 100;

    if (chartType === "personality") {
      // Draw personality chart without title

      // Define traits and colors - using mint, gold and more vibrant colors
      const traits = [
        {
          name: "Openness",
          color: "#F0C93B", // gold
          value: reportScores?.openness || 9,
        },
        {
          name: "Conscientiousness",
          color: "#B4E0E0", // mint
          value: reportScores?.conscientiousness || 6,
        },
        {
          name: "Extraversion",
          color: "#FF5757", // vibrant red
          value: reportScores?.extraversion || 7,
        },
        {
          name: "Agreeableness",
          color: "#7B68EE", // vibrant purple
          value: reportScores?.agreeableness || 8,
        },
        {
          name: "Neuroticism",
          color: "#00C2A8", // vibrant teal
          value: reportScores?.neuroticism || 4,
        },
      ];

      // Calculate total value for proper proportions
      const totalValue = traits.reduce((sum, trait) => sum + trait.value, 0);

      let startAngle = 0;

      // Draw pie slices
      traits.forEach((trait) => {
        // Calculate slice angle based on proportion of total
        const sliceAngle = (trait.value / totalValue) * 2 * Math.PI;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();

        ctx.fillStyle = trait.color;
        ctx.fill();

        // Draw value inside the slice
        const valueAngle = startAngle + sliceAngle / 2;
        const valueRadius = radius * 0.6; // Position inside the slice
        const valueX = centerX + Math.cos(valueAngle) * valueRadius;
        const valueY = centerY + Math.sin(valueAngle) * valueRadius;

        // Draw value text with shadow for better visibility
        ctx.fillStyle = "#000000";
        ctx.font = "bold 16px Montserrat, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2;
        // ctx.strokeText(trait.value.toString(), valueX, valueY);
        // ctx.fillText(trait.value.toString(), valueX, valueY);

        // Draw label
        const labelAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 1.3;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;

        // Draw line from slice to label
        ctx.beginPath();
        const lineStartX = centerX + Math.cos(labelAngle) * radius;
        const lineStartY = centerY + Math.sin(labelAngle) * radius;
        ctx.moveTo(lineStartX, lineStartY);
        ctx.lineTo(labelX, labelY);
        ctx.strokeStyle = trait.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw label text without value in black
        ctx.fillStyle = "#000000";
        ctx.font = "bold 16px Montserrat, Arial, sans-serif";
        ctx.textAlign = labelX > centerX ? "left" : "right";
        ctx.fillText(`${trait.name}`, labelX, labelY);

        startAngle += sliceAngle;
      });
    } else {
      // Draw stress or decision chart
      ctx.fillText(
        label || (chartType === "stress" ? "Stress Level" : "Decision Style"),
        centerX,
        40
      );

      // Draw two-slice pie chart
      const actualValue = value || 60; // Default to 60% if no value provided

      // First slice (the value)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, 0, (actualValue / 100) * 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = chartType === "stress" ? "#FF5757" : "#7B68EE";
      ctx.fill();

      // Second slice (remaining)
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(
        centerX,
        centerY,
        radius,
        (actualValue / 100) * 2 * Math.PI,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.fillStyle = "#E0E0E0";
      ctx.fill();

      // Draw center text in black
      ctx.fillStyle = "#000000";
      ctx.font = "bold 28px Montserrat, Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${actualValue}%`, centerX, centerY + 10);

      // Draw label
      ctx.fillStyle = "#333";
      ctx.font = "16px Montserrat, Arial, sans-serif";
      ctx.fillText(
        label || (chartType === "stress" ? "Stress" : "Decision"),
        centerX,
        centerY + 50
      );
    }

    // Convert to data URL and send back
    const dataUrl = canvas.toDataURL("image/png");
    if (onChartImageGenerated) {
      onChartImageGenerated(dataUrl);
      // Mark as generated to prevent multiple calls
      imageGeneratedRef.current = true;
    }
  }, [chartType, reportScores, value, label, onChartImageGenerated]);

  // Generate chart image when Recharts is loaded
  useEffect(() => {
    if (isRechartsAvailable && RechartsComponents && chartRef.current) {
      // Small delay to ensure chart is rendered
      const timer = setTimeout(() => {
        try {
          // Use html2canvas or similar library to capture the chart
          // For now, we'll use a fallback since we can't guarantee html2canvas is available
          generateFallbackImage();
        } catch (error) {
          console.error("Error generating chart image:", error);
          generateFallbackImage();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isRechartsAvailable, RechartsComponents]);

  // If Recharts is not available, render nothing visible
  if (!isRechartsAvailable || !RechartsComponents) {
    return null;
  }

  // Destructure Recharts components
  const { PieChart, Pie, Cell, Tooltip, Legend, Label, ResponsiveContainer } =
    RechartsComponents;

  // Prepare chart data based on chart type
  let chartData;
  let chartColors;
  // Restore original chart sizes
  let chartWidth = "600px";
  let chartHeight = "400px";

  if (chartType === "personality") {
    // Personality chart data with actual values from reportScores
    chartData = [
      { name: "Openness", value: reportScores?.openness || 9 },
      {
        name: "Conscientiousness",
        value: reportScores?.conscientiousness || 6,
      },
      { name: "Extraversion", value: reportScores?.extraversion || 7 },
      { name: "Agreeableness", value: reportScores?.agreeableness || 8 },
      { name: "Neuroticism", value: reportScores?.neuroticism || 4 },
    ];
    // Use mint, gold and more vibrant colors
    chartColors = ["#F0C93B", "#B4E0E0", "#FF5757", "#7B68EE", "#00C2A8"];
  } else {
    // Stress or Decision chart data
    const actualValue = value || (chartType === "stress" ? 60 : 80);
    chartData = [
      {
        name: label || (chartType === "stress" ? "Stress" : "Decision"),
        value: actualValue,
      },
      { name: "Remaining", value: 100 - actualValue },
    ];
    // Use more vibrant colors for stress and decision charts
    chartColors = [chartType === "stress" ? "#FF5757" : "#7B68EE", "#E0E0E0"];
    chartWidth = "300px";
    chartHeight = "300px";
  }

  return (
    <div
      ref={chartRef}
      style={{
        width: chartWidth,
        height: chartHeight,
        position: "absolute",
        left: "-9999px",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={
              chartType === "personality"
                ? { stroke: "#333333", strokeWidth: 1 }
                : false
            }
            outerRadius={chartType === "personality" ? 120 : 100}
            fill="#8884d8"
            dataKey="value"
            label={
              chartType === "personality"
                ? ({
                    name,
                    value,
                    percent,
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                  }) => {
                    // Calculate position for the value label inside the slice
                    const RADIAN = Math.PI / 180;
                    // Position the label in the middle of the slice
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                      <text
                        x={x}
                        y={y}
                        fill="#FFFFFF"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontWeight="bold"
                        fontSize={14}
                        stroke="#000000"
                        strokeWidth={0.5}
                      >
                        {value}
                      </text>
                    );
                  }
                : false
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
            {chartType !== "personality" && (
              <Label
                value={`${chartData[0].value}%`}
                position="center"
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  fontFamily: "Montserrat",
                  fill: "#000000", // Changed to black text
                }}
              />
            )}
          </Pie>
          <Tooltip formatter={(value) => `${value}`} />
          {chartType === "personality" && (
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={180}
              innerRadius={140}
              fill="#8884d8"
              dataKey="value"
              label={({ name, cx, cy, midAngle, innerRadius, outerRadius }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="#000000"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontWeight="bold"
                    fontSize={12}
                  >
                    {name}
                  </text>
                );
              }}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-outer-${index}`}
                  fill="transparent"
                  stroke={chartColors[index % chartColors.length]}
                  strokeWidth={2}
                />
              ))}
            </Pie>
          )}
          <Legend
            layout={chartType === "personality" ? "vertical" : "horizontal"}
            align={chartType === "personality" ? "right" : "center"}
            verticalAlign={chartType === "personality" ? "middle" : "bottom"}
            wrapperStyle={{ fontSize: "12px", fontFamily: "Montserrat" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsGenerator;
