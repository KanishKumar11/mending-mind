"use client";

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

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

const ResilienceScaleDisplay = ({ score }) => {
  const { level, subtitle, description, impact } =
    getResilienceLevelInfo(score);

  // Calculate percentage for the bar (assuming max score is 100)
  const percentage = Math.min(100, Math.max(0, score));

  // Determine color based on score
  const getColor = () => {
    if (score <= 50) return "#B4E0E0"; // Mint for low resilience
    if (score <= 75) return "#FFC107"; // Amber for moderate resilience
    return "#4CAF50"; // Green for high resilience
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
        <Text style={styles.styleDescription}>Resilience Scale</Text>

        {/* Visual bar */}
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

        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.attributes}>{description}</Text>
        <Text
          style={[styles.attributes, { fontStyle: "italic", marginTop: 8 }]}
        >
          {impact}
        </Text>
      </View>
    </View>
  );
};

export default ResilienceScaleDisplay;
