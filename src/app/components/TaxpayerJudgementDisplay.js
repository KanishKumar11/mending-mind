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
      level: "Higher Scores ",
      subtitle: "You may be Insightful & System-Oriented",
      description:
        "You approach complex scenarios with emotional intelligence, strategic insight, and system-oriented thinking. You prioritize long-term goals, balance flexibility with structure, and respond to challenges with clarity and thoughtful decision-making.",
    };
  } else if (score === 3) {
    return {
      level: "Moderate Scores",
      subtitle: "You may be Responsible & Strategically Emerging",
      description:
        "You demonstrate responsibility, fairness, and practical adaptability. You are balanced in your approach, blending ethical judgment with strategic growth, and are committed to learning and evolving your decision-making over time.",
    };
  } else {
    return {
      level: "Lower Scores ",
      subtitle: "You may be Detail-Focused & Principles-Driven",
      description:
        "You are detail-focused, principle-driven, and thoughtful in your choices. You value clarity, ethical standards, and practical execution, prioritizing precision and consistency even in complex or uncertain situations.",
    };
  }
};

const TaxpayerJudgementDisplay = ({ score }) => {
  const { level, subtitle, description } = getJudgementLevelInfo(score);

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreHeader}>{level}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <Text style={styles.attributes}>{description}</Text>
      </View>
    </View>
  );
};

export default TaxpayerJudgementDisplay;
