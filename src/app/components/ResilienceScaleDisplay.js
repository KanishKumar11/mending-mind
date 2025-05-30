"use client";

import React from "react";
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Define the styles for our component
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  styleContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderLeft: "4px solid #4CAF50", // Green for resilience
  },
  barContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  barBackground: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    marginBottom: 10,
    marginTop: 5,
  },
  barFill: {
    height: "100%",
    borderRadius: 6,
  },
  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 10,
  },
  scaleLabel: {
    fontSize: 9,
    fontFamily: "Montserrat",
    color: "#666",
  },
  styleDescription: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    marginTop: 5,
    marginBottom: 8,
  },
  attributes: {
    fontSize: 11,
    fontFamily: "Montserrat",
    marginTop: 5,
    lineHeight: 1.4,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Montserrat",
    marginTop: 2,
    marginBottom: 5,
  },
});

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
    };
  } else if (score <= 91) {
    // 25 + (125-25) * 0.66 = 91
    return {
      level: "Moderate Resilience",
      subtitle: "You may be Steady & Adaptively Growing",
      description:
        "You demonstrate steadiness and adaptable growth. You handle challenges thoughtfully, maintaining calmness under pressure while remaining emotionally aware and solution-focused. Your willingness to learn and improve supports continued resilience development.",
    };
  } else {
    return {
      level: "High Resilience",
      subtitle: "You may be Resilient & Resourceful",
      description:
        "You are emotionally strong, confident, and resourceful in adversity. You recover quickly from setbacks, approach challenges with clarity and optimism, and embody a grounded and proactive attitude toward change and uncertainty.",
    };
  }
};

const ResilienceScaleDisplay = ({ score, chartImage }) => {
  const { subtitle, description } = getResilienceLevelInfo(score);

  // Calculate percentage for the bar (based on CD-RISC-25 scale: 25-125)
  const minScore = 25; // Minimum possible score
  const maxScore = 125; // Maximum possible score
  const normalizedScore = Math.min(maxScore, Math.max(minScore, score)); // Ensure score is within range
  const percentage =
    ((normalizedScore - minScore) / (maxScore - minScore)) * 100;

  // Determine color based on normalized score range
  const getColor = () => {
    if (score <= 58) return "#B4E0E0"; // Mint for low resilience (25-58)
    if (score <= 91) return "#F0C93B"; // Gold for moderate resilience (59-91)
    return "#4CAF50"; // Green for high resilience (92-125)
  };

  return (
    <View style={styles.container}>
      {/* Resilience Scale */}
      <View
        style={[
          styles.styleContainer,
          { borderLeft: `4px solid ${getColor()}` },
        ]}
      >
        {/* Chart image if available, otherwise fallback to simple bar */}
        {chartImage ? (
          <View style={{ marginVertical: 10, alignItems: "center" }}>
            <Image
              src={chartImage}
              style={{
                width: 800,
                height: 120,
                objectFit: "contain",
              }}
            />
          </View>
        ) : (
          <View style={styles.barContainer}>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${percentage}%`,
                    backgroundColor: getColor(),
                  },
                ]}
              />
            </View>

            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>Low</Text>
              <Text style={styles.scaleLabel}>Moderate</Text>
              <Text style={styles.scaleLabel}>High</Text>
            </View>
          </View>
        )}

        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.attributes}>{description}</Text>
      </View>
    </View>
  );
};

export default ResilienceScaleDisplay;
