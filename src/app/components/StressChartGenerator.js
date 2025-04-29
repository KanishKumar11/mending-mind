"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

const StressGauge = ({
  score = 0,
  onChartImageGenerated,
  width = 300,
  height = 300,
}) => {
  const chartRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const imageGeneratedRef = useRef(false);
  // Ensure we're on client side
  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  // Normalize score to ensure it's in valid range
  const normalizedScore = Math.max(0, Math.min(40, score));
  // Determine stress level and color
  const getStressLevelInfo = (score) => {
    if (score <= 13) {
      return {
        level: "Low",
        color: "#4CAF50", // Green
        gradient: ["#81c784", "#4CAF50", "#2e7d32"],
      };
    } else if (score <= 26) {
      return {
        level: "Moderate",
        color: "#FFC107", // Amber
        gradient: ["#ffd54f", "#FFC107", "#ff8f00"],
      };
    } else {
      return {
        level: "High",
        color: "#FF5757", // Red
        gradient: ["#ff8a80", "#FF5757", "#d32f2f"],
      };
    }
  };

  const { level, color, gradient } = getStressLevelInfo(normalizedScore);

  // Prepare chart data with gradient sections
  const data = [
    {
      name: "Low",
      value: 13,
      fill: "#4CAF50",
    },
    {
      name: "Moderate",
      value: 13,
      fill: "#FFC107",
    },
    {
      name: "High",
      value: 14,
      fill: "#FF5757",
    },
  ];

  // Define tick values for the gauge
  // [0, 10, 20, 30, 40];

  // Create needle for the gauge
  const generateNeedle = (value, radius, color) => {
    // Convert value to angle (0-40 scale to -90 to 90 degrees)
    const angle = (value / 40) * 180;
    const angleRad = (angle * Math.PI) / 180;
    const needleLength = radius * 0.8;

    // Calculate needle endpoint
    const x2 = width / 2 + needleLength * Math.cos(angleRad);
    const y2 = height / 2 + needleLength * Math.sin(angleRad);

    // Calculate control points for slight curve in needle
    const controlAngleRad = ((angle - 5) * Math.PI) / 180;
    const controlX = width / 2 + needleLength * 0.5 * Math.cos(controlAngleRad);
    const controlY =
      height / 2 + needleLength * 0.5 * Math.sin(controlAngleRad);

    return `
      <defs>
        <filter id="needle-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="2" flood-opacity="0.3" />
        </filter>
      </defs>
      <path
        d="M ${width / 2} ${height / 2} Q ${controlX} ${controlY} ${x2} ${y2}"
        stroke="${color}"
        stroke-width="3"
        fill="none"
        filter="url(#needle-shadow)"
      />
      <circle cx="${width / 2}" cy="${
      height / 2
    }" r="8" fill="#666" filter="url(#needle-shadow)" />
      <circle cx="${width / 2}" cy="${height / 2}" r="5" fill="#ddd" />
    `;
  };

  // Generate a fallback image using HTML Canvas
  const generateFallbackImage = useCallback(() => {
    if (imageGeneratedRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Draw background
    ctx.fillStyle = "#f8f9fa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(width, height) * 0.4;
    const innerRadius = outerRadius * 0.7;

    // Draw gauge background
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, Math.PI, 0, false);
    ctx.fillStyle = "#e0e0e0";
    ctx.fill();

    // Draw color segments
    const segmentAngles = [
      { end: 13 / 40, color: "#FF5757" }, // Low (green)
      { end: 26 / 40, color: "#FFC107" }, // Moderate (amber)
      { end: 1, color: "#4CAF50" }, // High (red)
    ];

    let startAngle = 0;
    segmentAngles.forEach((segment) => {
      const endAngle = 0 - segment.end * Math.PI;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle, true);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, false);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();

      startAngle = endAngle;
    });

    // Draw tick marks
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";
    ctx.font = "12px Arial";
    ctx.fillStyle = "#333";

    for (let i = 0; i <= 4; i++) {
      const value = i * 10;
      const angle = Math.PI + (value / 40) * Math.PI;

      // Calculate tick positions
      // const tickEnd = outerRadius + 15;

      const startX = centerX + Math.cos(angle) * innerRadius;
      const startY = centerY + Math.sin(angle) * innerRadius;
      const endX = centerX + Math.cos(angle) * outerRadius;
      const endY = centerY + Math.sin(angle) * outerRadius;
      // Text positions (if needed in the future)
      // const tickEnd = outerRadius + 15;
      // const textX = centerX + Math.cos(angle) * (outerRadius + 15);
      // const textY = centerY + Math.sin(angle) * (outerRadius + 15);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Draw needle
    const needleAngle = Math.PI + (normalizedScore / 40) * Math.PI;
    const needleLength = outerRadius * 0.9;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(needleAngle);

    // Needle
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(needleLength, 0);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Needle base
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#666";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#ddd";
    ctx.fill();

    ctx.restore();

    // Draw center stats
    ctx.font = "bold 24px Montserrat, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = color;
    // ctx.fillText(
    //   normalizedScore.toString(),
    //   centerX,
    //   centerY + outerRadius * 0.6
    // );

    // Convert to data URL and send back
    const dataUrl = canvas.toDataURL("image/png");
    if (onChartImageGenerated) {
      onChartImageGenerated(dataUrl);
      imageGeneratedRef.current = true;
    }
  }, [normalizedScore, level, color, width, height, onChartImageGenerated]);

  // Generate SVG representation of the gauge
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="gradient-low" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${gradient[0]}" />
          <stop offset="100%" stop-color="${gradient[1]}" />
        </linearGradient>
        <linearGradient id="gradient-moderate" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${gradient[1]}" />
          <stop offset="100%" stop-color="${gradient[2]}" />
        </linearGradient>
        <filter id="gauge-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2" />
        </filter>
      </defs>

      ${generateNeedle(normalizedScore, Math.min(width, height) * 0.4, color)}

      <text x="${width / 2}" y="${
    height * 0.75
  }" text-anchor="middle" font-size="24px" font-weight="bold" fill="${color}">
        ${normalizedScore}
      </text>
      <text x="${width / 2}" y="${
    height * 0.75 + 25
  }" text-anchor="middle" font-size="14px" fill="#666">
        out of 40
      </text>
      <text x="${width / 2}" y="${
    height * 0.75 + 50
  }" text-anchor="middle" font-size="16px" font-weight="bold" fill="${color}">
        ${level} Stress
      </text>
    </svg>
  `;

  // Generate chart image when component mounts
  useEffect(() => {
    if (isClient && chartRef.current) {
      // Small delay to ensure chart is rendered
      const timer = setTimeout(() => {
        try {
          // Get SVG element and convert to image
          const svgElement = chartRef.current.container.querySelector("svg");

          // Create an overlay with the needle and text
          const svgOverlay = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          svgOverlay.setAttribute("width", width);
          svgOverlay.setAttribute("height", height);
          svgOverlay.innerHTML = svgContent;

          // Combine the chart SVG with our overlay
          const combinedSvg = svgElement.cloneNode(true);
          const overlayNodes = Array.from(svgOverlay.childNodes);
          overlayNodes.forEach((node) => {
            combinedSvg.appendChild(node.cloneNode(true));
          });

          const svgString = new XMLSerializer().serializeToString(combinedSvg);
          const svg = new Blob([svgString], { type: "image/svg+xml" });
          const url = URL.createObjectURL(svg);

          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL("image/png");
            if (onChartImageGenerated) {
              onChartImageGenerated(dataUrl);
              imageGeneratedRef.current = true;
            }
            URL.revokeObjectURL(url);
          };
          img.src = url;
        } catch (error) {
          console.error("Error generating chart image:", error);
          generateFallbackImage();
        }
      }, 500);

      return () => clearTimeout(timer);
    } else if (isClient) {
      generateFallbackImage();
    }
  }, [
    isClient,
    generateFallbackImage,
    svgContent,
    width,
    height,
    onChartImageGenerated,
  ]);

  if (!isClient) {
    return null;
  }

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        position: "relative",
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="60%"
          outerRadius="80%"
          data={data}
          startAngle={180}
          endAngle={0}
          barSize={20}
          ref={chartRef}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 40]}
            angleAxisId={0}
            tick={{ fill: "#666", fontSize: 12 }}
            tickCount={5}
            stroke="#666"
          />
          <RadialBar
            background={{ fill: "#e6e6e6" }}
            dataKey="value"
            angleAxisId={0}
            stackId="stress"
            cornerRadius={5}
            stroke="none"
          />
          <svg>
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="1"
                  stdDeviation="2"
                  flood-opacity="0.3"
                />
              </filter>
            </defs>
          </svg>
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StressGauge;
