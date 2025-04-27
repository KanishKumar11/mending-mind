"use client";

import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";

// Try to import ChartDataLabels plugin if available
let ChartDataLabels;
try {
  ChartDataLabels = require("chartjs-plugin-datalabels");
} catch (e) {
  // Create a simple fallback if the plugin is not available
  ChartDataLabels = {
    id: "datalabels",
    afterDatasetsDraw: () => {},
  };
}

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

/**
 * Component that generates a pie chart and converts it to an image
 * @param {Object} props - Component props
 * @param {number} props.value - The value to display (0-100) - used for single-value charts
 * @param {string} props.label - The label for the chart - used for single-value charts
 * @param {string} props.color - The color for the chart - used for single-value charts
 * @param {string} props.chartType - Type of chart to generate ('personality', 'stress', 'decision')
 * @param {Object} props.reportScores - The scores to display in the chart
 * @param {Function} props.onChartImageGenerated - Callback function that receives the chart image as a data URL
 */
const PieChartGenerator = ({
  value,
  label,
  color,
  chartType,
  onChartImageGenerated,
}) => {
  const chartRef = useRef(null);

  // Chart data - depends on chart type
  let data;

  if (chartType === "personality") {
    // Create data for personality traits pie chart

    data = {
      labels: [
        "Openness",
        "Conscientiousness",
        "Extraversion",
        "Agreeableness",
        "Neuroticism",
      ],
      datasets: [
        {
          data: [
            20, // Fixed values to ensure the pie chart is complete
            20,
            20,
            20,
            20,
          ],
          backgroundColor: [
            "#FF9F1C", // More vibrant orange/yellow for Openness
            "#2EC4B6", // Vibrant teal for Conscientiousness
            "#E71D36", // Bright red for Extraversion
            "#7209B7", // Vibrant purple for Agreeableness
            "#4361EE", // Bright blue for Neuroticism
          ],
          borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"],
          borderWidth: 2,
        },
      ],
    };
  } else {
    // Default single-value chart
    data = {
      labels: [label, "Remaining"],
      datasets: [
        {
          data: [value, 100 - value],
          backgroundColor: [color, "#E0E0E0"],
          borderColor: ["#ffffff", "#ffffff"],
          borderWidth: 1,
        },
      ],
    };
  }

  // Chart options - depends on chart type
  let options;

  if (chartType === "personality") {
    options = {
      responsive: true,
      maintainAspectRatio: true,
      layout: {
        padding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Personality Traits",
          font: {
            size: 18,
            weight: "bold",
            family: "Montserrat",
          },
          padding: {
            top: 10,
            bottom: 20,
          },
        },
        legend: {
          display: true,
          position: "right",
          labels: {
            font: {
              family: "Montserrat",
              size: 14,
              weight: "bold",
            },
            padding: 25,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw}%`;
            },
          },
          backgroundColor: "#333333",
          titleFont: {
            family: "Montserrat",
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            family: "Montserrat",
            size: 13,
          },
          padding: 12,
          cornerRadius: 8,
        },
        datalabels: {
          display: true,
          color: "#ffffff",
          font: {
            family: "Montserrat",
            size: 14,
            weight: "bold",
          },
          formatter: (_, ctx) => {
            return ctx.chart.data.labels[ctx.dataIndex];
          },
        },
      },
    };
  } else {
    options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw}%`;
            },
          },
        },
      },
    };
  }

  // Convert chart to image when it's rendered
  useEffect(() => {
    if (chartRef.current) {
      // Small delay to ensure chart is fully rendered
      const timer = setTimeout(() => {
        const chartInstance = chartRef.current;
        if (chartInstance) {
          // Get the canvas element
          const canvas = chartInstance.canvas;
          // Convert to data URL
          const dataUrl = canvas.toDataURL("image/png");
          // Call the callback with the data URL
          if (onChartImageGenerated) {
            onChartImageGenerated(dataUrl);
          }
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [chartRef, value, label, color, onChartImageGenerated]);

  return (
    <div
      style={{
        width: chartType === "personality" ? "600px" : "200px",
        height: chartType === "personality" ? "400px" : "200px",
        visibility: "hidden",
        position: "absolute",
      }}
    >
      <Pie ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default PieChartGenerator;
