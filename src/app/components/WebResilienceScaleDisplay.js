"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Label,
} from "recharts";

// Helper function to determine resilience level and interpretation
const getResilienceLevelInfo = (score) => {
  // Adjust thresholds for CD-RISC-25 scale (25-125)
  if (score <= 58) {
    // 25 + (125-25) * 0.33 = 58
    return {
      level: "Low Resilience",
      subtitle: "You may be Reflective & Building Stability",
      description:
        "You are currently reflective and working toward building greater emotional stability. While you may feel more affected by external stressors, your self-awareness, honesty, and openness to growth suggest strong potential for strengthening your resilience over time.",
      impact:
        "You may currently feel more affected by stress or unexpected changes",
    };
  } else if (score <= 91) {
    // 25 + (125-25) * 0.66 = 91
    return {
      level: "Moderate Resilience",
      subtitle: "You may be Steady & Adaptively Growing",
      description:
        "You demonstrate steadiness and adaptable growth. You handle challenges thoughtfully, maintaining calmness under pressure while remaining emotionally aware and solution-focused. Your willingness to learn and improve supports continued resilience development.",
      impact: "You often handle challenges with balance and care.",
    };
  } else {
    return {
      level: "High Resilience",
      subtitle: "You may be Resilient & Resourceful",
      description:
        "You are emotionally strong, confident, and resourceful in adversity. You recover quickly from setbacks, approach challenges with clarity and optimism, and embody a grounded and proactive attitude toward change and uncertainty.",
      impact: "You likely navigate adversity with clarity and confidence.",
    };
  }
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    // Determine resilience level based on score
    let level = "Low";
    if (payload[0].payload.actualScore > 91) {
      level = "High";
    } else if (payload[0].payload.actualScore > 58) {
      level = "Moderate";
    }

    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
        <p className="font-semibold">{`Resilience Level: ${level}`}</p>
      </div>
    );
  }
  return null;
};

const WebResilienceScaleDisplay = ({ score }) => {
  const { level, subtitle, description, impact } =
    getResilienceLevelInfo(score);

  // Determine color based on normalized score range
  const getColor = () => {
    if (score <= 58) return "#B4E0E0"; // Mint for low resilience (25-58)
    if (score <= 91) return "#F0C93B"; // Gold for moderate resilience (59-91)
    return "#4CAF50"; // Green for high resilience (92-125)
  };

  // Calculate normalized score for display (25-125 scale to 0-100 scale)
  const minScore = 25; // Minimum possible score
  const maxScore = 125; // Maximum possible score
  const normalizedScore = Math.min(maxScore, Math.max(minScore, score)); // Ensure score is within range
  const displayScore =
    ((normalizedScore - minScore) / (maxScore - minScore)) * 100;

  // Create data for the bar chart
  const data = [
    {
      name: "Resilience",
      score: displayScore, // Use normalized score for display
      actualScore: score, // Keep actual score for tooltip
      fill: getColor(),
    },
  ];

  // Create domain markers for the chart
  const domainMarkers = [
    { value: 0, label: "Low" },
    { value: 33, label: "Moderate" }, // 33% of the way from 0 to 100
    { value: 66, label: "High" }, // 66% of the way from 0 to 100
    { value: 100, label: "" },
  ];

  return (
    <div
      className="space-y-4 p-6 bg-white rounded-lg shadow-sm border-l-4"
      style={{ borderLeftColor: getColor() }}
    >
      <h3 className="text-xl font-bold">Resilience Scale</h3>

      {/* Recharts Bar Chart */}
      <div className="h-[120px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
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
            <Tooltip content={<CustomTooltip />} />

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

            <Bar dataKey="score" barSize={40} radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <h4 className="text-lg font-semibold">{subtitle}</h4>
        <p className="mt-2 text-gray-700">{description}</p>
        <p className="mt-2 text-gray-700 italic">{impact}</p>
      </div>
    </div>
  );
};

export default WebResilienceScaleDisplay;
