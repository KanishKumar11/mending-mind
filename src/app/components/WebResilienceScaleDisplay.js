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
  if (score <= 50) {
    return {
      level: "Low Resilience",
      subtitle: "You may be Reflective & Building Stability",
      description:
        "Your results suggest that you may be Emotionally sensitive, Honest, Self-aware, Open to support, Deep thinker, Growth-minded, Curious, In progress, Thoughtful, Observant",
      impact:
        "You may currently feel more affected by stress or unexpected changes",
    };
  } else if (score <= 75) {
    return {
      level: "Moderate Resilience",
      subtitle: "You may be Steady & Adaptively Growing",
      description:
        "Your results suggest that you may be Reliable, Cautiously optimistic, Reflective, Adaptable, Grounded, Calm under pressure, Self-improving, Emotionally aware, Solution-inclined, Willing to learn",
      impact: "You often handle challenges with balance and care.",
    };
  } else {
    return {
      level: "High Resilience",
      subtitle: "You may be Resilient & Resourceful",
      description:
        "Your results suggest that you may be Confident, Emotionally strong, Optimistic, Flexible, Composed, Proactive, Grounded, Quick to recover, Empowered, Self-assured",
      impact: "You likely navigate adversity with clarity and confidence.",
    };
  }
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
        <p className="font-semibold">{`Score: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const WebResilienceScaleDisplay = ({ score }) => {
  const { level, subtitle, description, impact } =
    getResilienceLevelInfo(score);

  // Determine color based on score
  const getColor = () => {
    if (score <= 50) return "#B4E0E0"; // Mint for low resilience
    if (score <= 75) return "#F0C93B"; // Gold for moderate resilience
    return "#4CAF50"; // Green for high resilience
  };

  // Create data for the bar chart
  const data = [
    {
      name: "Resilience",
      score: score,
      fill: getColor(),
    },
  ];

  // Create domain markers for the chart
  const domainMarkers = [
    { value: 0, label: "Low" },
    { value: 50, label: "Moderate" },
    { value: 75, label: "High" },
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
            <ReferenceLine x={50} stroke="#666" strokeDasharray="3 3">
              <Label
                value="Moderate"
                position="insideBottom"
                fill="#666"
                fontSize={12}
                offset={5}
              />
            </ReferenceLine>
            <ReferenceLine x={75} stroke="#666" strokeDasharray="3 3">
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
