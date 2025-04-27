"use client";

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

// Define the styles for our component
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  styleContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  styleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  styleName: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  barContainer: {
    marginVertical: 10,
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
    fontSize: 12,
    fontFamily: "Montserrat",
    marginTop: 5,
    // marginBottom: 3,
  },
  attributes: {
    fontSize: 11,
    fontFamily: "Montserrat",
    marginTop: 5,
    lineHeight: 1.4,
    marginBottom: 5,
  },
  overallContainer: {
    marginTop: 15,
    padding: 10,
    borderRadius: 5,
    borderLeft: "4px solid #F0C93B", // Gold for overall style
  },
  overallTitle: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    marginBottom: 5,
  },
});

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

const DecisionStyleDisplay = ({ rationalScore, intuitiveScore }) => {
  const {
    styleType,
    styleDescription,
    rationalDescription,
    intuitiveDescription,
  } = getDecisionStyleInfo(rationalScore, intuitiveScore);

  // Calculate percentages for the bars (assuming max score is 25)
  const rationalPercentage = Math.min(
    100,
    Math.max(0, (rationalScore / 25) * 100)
  );
  const intuitivePercentage = Math.min(
    100,
    Math.max(0, (intuitiveScore / 25) * 100)
  );

  // Determine colors based on scores
  const getRationalColor = () => {
    if (rationalScore >= 21) return "#7B68EE"; // High - purple
    if (rationalScore <= 12) return "#B4E0E0"; // Low - mint
    return "#FFC107"; // Balanced - amber
  };

  const getIntuitiveColor = () => {
    if (intuitiveScore >= 21) return "#FF5757"; // High - red
    if (intuitiveScore <= 12) return "#B4E0E0"; // Low - mint
    return "#FFC107"; // Balanced - amber
  };

  return (
    <View style={styles.container}>
      {/* Rational Style */}
      <View
        style={[
          styles.styleContainer,
          { borderLeft: "4px solid #7B68EE", marginTop: 15 },
        ]}
      >
        <View style={styles.styleHeader}>
          <Text style={styles.styleName}>Rational Style</Text>
        </View>

        {/* Visual bar */}
        <View style={styles.barContainer}>
          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${rationalPercentage}%`,
                  backgroundColor: getRationalColor(),
                },
              ]}
            />
          </View>

          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Low </Text>
            <Text style={styles.scaleLabel}>Balanced </Text>
            <Text style={styles.scaleLabel}>High </Text>
          </View>
        </View>

        <Text style={styles.styleDescription}>
          {rationalScore >= 21 ? "" : rationalScore <= 12 ? "" : ""}
        </Text>
        <Text style={styles.attributes}>{rationalDescription}</Text>
      </View>

      {/* Intuitive Style */}
      <View
        style={[
          styles.styleContainer,
          { borderLeft: "4px solid #FF5757", marginTop: 15 },
        ]}
      >
        <View style={styles.styleHeader}>
          <Text style={styles.styleName}>Intuitive Style</Text>
        </View>

        {/* Visual bar */}
        <View style={styles.barContainer}>
          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${intuitivePercentage}%`,
                  backgroundColor: getIntuitiveColor(),
                },
              ]}
            />
          </View>

          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>Low </Text>
            <Text style={styles.scaleLabel}>Balanced </Text>
            <Text style={styles.scaleLabel}>High </Text>
          </View>
        </View>

        <Text style={styles.styleDescription}>
          {intuitiveScore >= 21 ? "" : intuitiveScore <= 12 ? "" : ""}
        </Text>
        <Text style={styles.attributes}>{intuitiveDescription}</Text>
      </View>
    </View>
  );
};

export default DecisionStyleDisplay;
