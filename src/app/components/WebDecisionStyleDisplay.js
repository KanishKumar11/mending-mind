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
  ReferenceLine,
  Legend,
  Label,
} from "recharts";

// Helper function to determine decision style and interpretation
const getDecisionStyleInfo = (rationalScore, intuitiveScore) => {
  // Determine if scores are high, balanced, or low
  const isRationalHigh = rationalScore >= 21;
  const isRationalLow = rationalScore <= 12;
  const isIntuitiveHigh = intuitiveScore >= 21;
  const isIntuitiveLow = intuitiveScore <= 12;

  // Determine overall style
  let styleType = "";
  let styleDescription = "";

  if (isRationalHigh && isIntuitiveLow) {
    styleType = "Dominant Rational Style";
    styleDescription =
      "Your responses suggest that you tend to be Evaluative, Detail-oriented, Strategic, Policy-focused, Insightful";
  } else if (isIntuitiveHigh && isRationalLow) {
    styleType = "Dominant Intuitive Style";
    styleDescription =
      "Your responses suggest that you tend to be Strategic, Decisive, Adaptable, Visionary, Conceptual";
  } else if (
    !isRationalHigh &&
    !isRationalLow &&
    !isIntuitiveHigh &&
    !isIntuitiveLow
  ) {
    styleType = "Balanced Style";
    styleDescription =
      "Your responses suggest that you tend to be Adaptable, Context-sensitive, Versatile, Strategic, Situationally aware";
  } else {
    // If no specific pattern, just use the higher score
    styleType =
      rationalScore > intuitiveScore ? "Rational Style" : "Intuitive Style";
    if (rationalScore > intuitiveScore) {
      styleDescription = isRationalHigh
        ? "Your responses suggest that you tend to be Systematic, Analytical, Methodical, Deliberate, Evidence-oriented"
        : "Your responses suggest that you tend to be Flexible, Spontaneous, Experiential, Minimalist, Less analytical";
    } else {
      styleDescription = isIntuitiveHigh
        ? "Your responses suggest that you tend to be Perceptive, Instinctive, Decisive, Emotionally attuned, Rapid-response"
        : "Your responses suggest that you tend to be Structured, Calculative, Cautious, Data-sensitive, Deliberation-focused";
    }
  }

  return {
    styleType,
    styleDescription,
    rationalDescription: isRationalHigh
      ? "Your responses suggest that you tend to be Systematic, Analytical, Methodical, Deliberate, Evidence-oriented"
      : isRationalLow
      ? "Your responses suggest that you tend to be Flexible, Spontaneous, Experiential, Minimalist, Less analytical"
      : "Your responses suggest that you tend to be Adaptable, Context-sensitive, Versatile, Strategic, Situationally aware",
    intuitiveDescription: isIntuitiveHigh
      ? "Your responses suggest that you tend to be Perceptive, Instinctive, Decisive, Emotionally attuned, Rapid-response"
      : isIntuitiveLow
      ? "Your responses suggest that you tend to be Structured, Calculative, Cautious, Data-sensitive, Deliberation-focused"
      : "Your responses suggest that you tend to be Adaptable, Context-sensitive, Versatile, Strategic, Situationally aware",
  };
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
        <p className="font-semibold">{payload[0].payload.name}</p>
      </div>
    );
  }
  return null;
};

const WebDecisionStyleDisplay = ({ rationalScore, intuitiveScore }) => {
  const {
    styleType,
    styleDescription,
    rationalDescription,
    intuitiveDescription,
  } = getDecisionStyleInfo(rationalScore, intuitiveScore);

  // Determine colors based on scores
  const getRationalColor = () => {
    if (rationalScore >= 21) return "#7B68EE"; // High - purple
    if (rationalScore <= 12) return "#B4E0E0"; // Low - mint
    return "#F0C93B"; // Balanced - gold (changed from amber to match theme)
  };

  const getIntuitiveColor = () => {
    if (intuitiveScore >= 21) return "#FF5757"; // High - red
    if (intuitiveScore <= 12) return "#B4E0E0"; // Low - mint
    return "#F0C93B"; // Balanced - gold (changed from amber to match theme)
  };

  // Create data for the bar chart - using separate entries for each style
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

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-xl font-bold mb-4">Decision-Making Style</h3>

        {/* Recharts Bar Chart */}
        <div className="relative h-[200px] w-full mb-4">
          {/* Custom labels outside the chart */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-around pr-2 font-semibold text-sm">
            <div>Rational</div>
            <div>Intuitive</div>
          </div>
          <div className="pl-16 h-full">
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
                <Tooltip content={<CustomTooltip />} />

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
        </div>

        <div className="mt-4 text-center">
          <h4 className="text-lg font-semibold">{styleType}</h4>
          <p className="mt-2 text-gray-700">{styleDescription}</p>
        </div>
      </div>

      {/* Rational Style Description */}
      <div
        className="p-6 bg-white rounded-lg shadow-sm border-l-4"
        style={{ borderLeftColor: getRationalColor() }}
      >
        <h4 className="text-lg font-semibold">Rational Style</h4>
        <p className="mt-2 text-gray-700">{rationalDescription}</p>
      </div>

      {/* Intuitive Style Description */}
      <div
        className="p-6 bg-white rounded-lg shadow-sm border-l-4"
        style={{ borderLeftColor: getIntuitiveColor() }}
      >
        <h4 className="text-lg font-semibold">Intuitive Style</h4>
        <p className="mt-2 text-gray-700">{intuitiveDescription}</p>
      </div>
    </div>
  );
};

export default WebDecisionStyleDisplay;
