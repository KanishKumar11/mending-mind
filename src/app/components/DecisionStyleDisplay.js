"use client";

import React from "react";
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";

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
  const isRationalBalanced = rationalScore >= 13 && rationalScore <= 20;
  const isIntuitiveBalanced = intuitiveScore >= 13 && intuitiveScore <= 20;

  // Determine overall style
  let styleType = "";
  let styleDescription = "";

  if (isRationalHigh && isIntuitiveLow) {
    styleType = "Dominant Rational Style";
    styleDescription =
      "You approach decision-making through strategic evaluation, methodical analysis, and policy-oriented thinking. You prefer well-defined structures, plans, and policies to guide your choices.";
  } else if (isIntuitiveHigh && isRationalLow) {
    styleType = "Dominant Intuitive Style";
    styleDescription =
      "You make decisions through visionary, adaptable, and conceptual thinking. You trust your internal compass, relying on foresight and instinct to shape your actions, often favoring innovation over rigid systems.";
  } else if (isRationalBalanced && isIntuitiveBalanced) {
    styleType = "Balanced Style";
    styleDescription =
      "You demonstrate versatility by integrating both rational analysis and intuitive insight. You adapt your decision-making style depending on the situation, balancing structure and flexibility to make contextually appropriate choices.";
  } else {
    // If no specific pattern, just use the higher score
    styleType =
      rationalScore > intuitiveScore ? "Rational Style" : "Intuitive Style";
  }

  return {
    styleType,
    styleDescription,
    rationalDescription: isRationalHigh
      ? "You favor a logical, analytical, and structured approach to decision-making. You systematically evaluate facts, consider evidence, and make deliberate, calculated choices that prioritize accuracy and strategic planning."
      : isRationalLow
      ? "You demonstrate a preference for flexibility, spontaneity, and experiential learning when making decisions. You rely more on lived experiences and real-time adaptability rather than exhaustive analysis and overplanning."
      : "You balance analytical thinking with flexibility in your decision-making approach. You can evaluate information systematically while remaining adaptable to changing circumstances.",
    intuitiveDescription: isIntuitiveHigh
      ? "You trust your instincts, emotional attunement, and perceptive abilities to make quick, confident decisions. Your capacity to connect deeply with situations enables you to respond rapidly with insight and decisiveness."
      : isIntuitiveLow
      ? "You tend to be cautious, structured, and data-sensitive in your decision-making. You prefer verifying details and weighing information before arriving at a conclusion, ensuring that risks are carefully considered."
      : "You balance intuitive insights with careful consideration in your decision-making. You can trust your instincts while still taking time to verify information when needed.",
  };
};

const DecisionStyleDisplay = ({
  rationalScore,
  intuitiveScore,
  chartImage,
}) => {
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
      {/* Decision Style Chart */}
      <View style={[styles.styleContainer]}>
        {/* Chart image if available, otherwise fallback to simple bars */}
        {chartImage ? (
          <View style={{ marginVertical: 10, alignItems: "center" }}>
            <Image
              src={chartImage}
              style={{
                width: 400,
                height: 150,
                objectFit: "contain",
              }}
            />
          </View>
        ) : (
          <View>
            {/* Rational Style Bar */}
            <Text style={[styles.styleDescription, { marginTop: 10 }]}>
              Rational
            </Text>
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

            {/* Intuitive Style Bar */}
            <Text style={[styles.styleDescription, { marginTop: 10 }]}>
              Intuitive
            </Text>
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
          </View>
        )}

        {/* Overall Style Type and Description */}
        <View style={{ marginTop: 15 }}>
          <Text style={[styles.styleName, { marginBottom: 5 }]}>
            {styleType}
          </Text>
          <Text style={styles.attributes}>{styleDescription}</Text>
        </View>
      </View>

      {/* Rational Style Description */}
      <View
        style={[
          styles.styleContainer,
          { borderLeft: "4px solid #7B68EE", marginTop: -15 },
        ]}
      >
        <View style={styles.styleHeader}>
          <Text style={styles.styleName}>Rational </Text>
        </View>
        <Text style={styles.attributes}>{rationalDescription}</Text>
      </View>

      {/* Intuitive Style Description */}
      <View
        style={[
          styles.styleContainer,
          { borderLeft: "4px solid #FF5757", marginTop: 15 },
        ]}
      >
        <View style={styles.styleHeader}>
          <Text style={styles.styleName}>Intuitive </Text>
        </View>
        <Text style={styles.attributes}>{intuitiveDescription}</Text>
      </View>
    </View>
  );
};

export default DecisionStyleDisplay;
