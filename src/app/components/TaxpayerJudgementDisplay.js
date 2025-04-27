"use client";

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

// Define the styles for our component
const styles = StyleSheet.create({
  container: {},
  scoreContainer: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderLeft: "4px solid #7B68EE", // Purple for judgement test
  },
  scoreHeader: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Montserrat",
    marginTop: 2,
    marginBottom: 5,
  },
  attributes: {
    fontSize: 11,
    fontFamily: "Montserrat",
    marginTop: 5,
    lineHeight: 1.4,
    marginBottom: 5,
  },
  impact: {
    fontSize: 11,
    fontStyle: "italic",
    fontFamily: "Montserrat",
    marginTop: 8,
    marginBottom: 5,
  },
});

// Helper function to determine judgement level and interpretation
const getJudgementLevelInfo = (score) => {
  if (score >= 4) {
    return {
      level: "Higher Scores",
      subtitle: "You may be Insightful & System-Oriented",
      description:
        "Your results suggest that you may be Perceptive, Emotionally aware, Strategic, Composed, Efficient, Vision-driven, Flexible, Prioritization-savvy, System thinker, Long-term focused",
      impact:
        "You likely approach complex scenarios with clarity, strategy, and emotional intelligence.",
    };
  } else if (score === 3) {
    return {
      level: "Moderate Scores",
      subtitle: "You may be Responsible & Strategically Emerging",
      description:
        "Your results suggest that you may be Reliable, Fair, Diligent, Balanced, Reasonable, Practically adaptive, Strategic in progress, Level-headed, Purposeful, Growth-minded",
      impact:
        "Your decision-making shows a blend of responsibility and adaptability.",
    };
  } else {
    return {
      level: "Lower Scores",
      subtitle: "You may be Detail-Focused & Principles-Driven",
      description:
        "Your results suggest that you may be Precise, Thoughtful, Considerate, Cautious, Values clarity, Rule-conscious, Practical, Detail-oriented, Ethical, Steady",
      impact:
        "You tend to focus on immediate needs and uphold principles with care.",
    };
  }
};

const TaxpayerJudgementDisplay = ({ score }) => {
  const { level, subtitle, description, impact } = getJudgementLevelInfo(score);

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreHeader}>{level}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.attributes}>{description}</Text>
        <Text style={styles.impact}>{impact}</Text>
      </View>
    </View>
  );
};

export default TaxpayerJudgementDisplay;
