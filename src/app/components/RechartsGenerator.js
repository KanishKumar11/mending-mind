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
    canvas.width = chartType === "personality" ? 400 : 300;
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
          rotation: -30, // Specific rotation angle
        },
        {
          name: "Conscientiousness",
          color: "#B4E0E0", // mint
          value: reportScores?.conscientiousness || 6,
          rotation: 40, // Rotate by -10 degrees as requested
        },
        {
          name: "Extraversion",
          color: "#FF5757", // vibrant red
          value: reportScores?.extraversion || 7,
          rotation: -65, // Rotate by 45 degrees as requested
        },
        {
          name: "Agreeableness",
          color: "#7B68EE", // vibrant purple
          value: reportScores?.agreeableness || 8,
          rotation: 0,
        },
        {
          name: "Neuroticism",
          color: "#00C2A8", // vibrant teal
          value: reportScores?.neuroticism || 4,
          rotation: 50, // Rotate by 10 degrees as requested
        },
      ];

      // Calculate total value for proper proportions
      const totalValue = traits.reduce((sum, trait) => sum + trait.value, 0);

      let startAngle = 0;

      // Draw pie slices
      traits.forEach((trait, index) => {
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

        // Draw label with custom rotated text
        const labelAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 1.2; // Reduced radius to save space
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

        // Save the current context state
        ctx.save();

        // Move to where we want to draw the text
        ctx.translate(labelX, labelY);

        // Apply the custom rotation angle in radians
        const rotationAngle = trait.rotation * (Math.PI / 180);
        ctx.rotate(rotationAngle);

        // Draw the text
        ctx.fillStyle = "#000000";
        ctx.font = "bold 16px Montserrat, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${trait.name}`, 0, 0);

        // Restore the context to its original state
        ctx.restore();

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
  // Reduced chart size to save space
  let chartWidth = "550px";
  let chartHeight = "350px";

  if (chartType === "personality") {
    // Personality chart data with actual values from reportScores
    chartData = [
      {
        name: "Openness",
        value: reportScores?.openness || 9,
        rotation: 0,
      },
      {
        name: "Conscientiousness",
        value: reportScores?.conscientiousness || 6,
        rotation: -10, // Rotate by -10 degrees as requested
      },
      {
        name: "Extraversion",
        value: reportScores?.extraversion || 7,
        rotation: 45, // Rotate by 45 degrees as requested
      },
      {
        name: "Agreeableness",
        value: reportScores?.agreeableness || 8,
        rotation: 0,
      },
      {
        name: "Neuroticism",
        value: reportScores?.neuroticism || 4,
        rotation: 10, // Rotate by 10 degrees as requested
      },
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

  // Custom Label Component with specific rotations for each label
  const CustomRotatedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Get the specific rotation for this trait
    const customRotation = chartData[index]?.rotation || 0;

    return (
      <g>
        {/* Line from pie to label */}
        <path
          d={`M${cx + innerRadius * Math.cos(-midAngle * RADIAN)},${
            cy + innerRadius * Math.sin(-midAngle * RADIAN)
          }L${cx + radius * 0.85 * Math.cos(-midAngle * RADIAN)},${
            cy + radius * 0.85 * Math.sin(-midAngle * RADIAN)
          }`}
          stroke={chartColors[index % chartColors.length]}
          fill="none"
          strokeWidth={2}
        />
        {/* Text with custom rotation */}
        <text
          x={x}
          y={y}
          fill="#000000"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12}
          fontWeight="bold"
          transform={`rotate(${customRotation}, ${x}, ${y})`}
        >
          {name}
        </text>
      </g>
    );
  };

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
            labelLine={false} // Remove default label lines
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
                  fill: "#000000",
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
              outerRadius={170} // Reduced to save space
              innerRadius={140}
              fill="#8884d8"
              dataKey="value"
              label={(props) => (
                <CustomRotatedLabel {...props} index={props.index} />
              )} // Pass index to identify which trait
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
          {/* Compact legend */}
          <Legend
            layout={chartType === "personality" ? "horizontal" : "horizontal"}
            align="center"
            verticalAlign="bottom"
            iconSize={10}
            wrapperStyle={{
              fontSize: "11px",
              fontFamily: "Montserrat",
              paddingTop: "10px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsGenerator;
