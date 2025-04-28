"use client";

import React, { useState } from "react";
import { Text, View, StyleSheet, Image } from "@react-pdf/renderer";

// Define the styles for our component
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    borderLeft: "4px solid #FF5757", // Vibrant red for stress
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
  score: {
    fontSize: 14,
    fontFamily: "Montserrat",
  },
  radialChartContainer: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginVertical: -20,
    position: "relative",
  },
  radialBackground: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    borderColor: "#f0f0f0",
  },
  radialFill: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  scoreDisplay: {
    position: "absolute",
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: "Montserrat",
    color: "#666",
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  rangeLabel: {
    fontSize: 9,
    fontFamily: "Montserrat",
    color: "#666",
  },
  stressLevel: {
    fontSize: 12,
    fontFamily: "Montserrat",
    marginTop: 10,
    marginBottom: 5,
  },
  interpretation: {
    fontSize: 11,
    fontFamily: "Montserrat",
    marginBottom: 8,
  },
  attributes: {
    fontSize: 11,
    fontFamily: "Montserrat",
    marginTop: 5,
    lineHeight: 1.4,
  },
});

// Helper function to determine stress level and interpretation
const getStressLevelInfo = (score) => {
  if (score <= 13) {
    return {
      level: "You appear to manage stress effectively",
      interpretation:
        "You manage stress effectively, maintaining emotional steadiness, self-control, and clarity during demanding circumstances. Your composed mindset allows you to stay grounded under pressure, approach challenges with confidence, and bounce back with resilience.",
    };
  } else if (score <= 26) {
    return {
      level: "You seem to adapt well, with occasional emotional load",
      interpretation:
        "You adapt well to stress with occasional emotional fluctuations. You are generally steady and self-aware but may experience moments of strain requiring rest or realignment. Your awareness of when to step back and recharge supports ongoing emotional balance and growth.",
    };
  } else {
    return {
      level: "You may currently be navigating a higher mental load",
      interpretation:
        "You may currently be experiencing a heightened mental load and emotional sensitivity. You are thoughtful and reflective but may find yourself more easily affected by workload shifts or environmental pressures. Your growth mindset and willingness to self-explore can help you move through stress constructively with the right support systems.",
    };
  }
};

const StressScaleDisplay = ({ score, chartImage }) => {
  const { level, interpretation } = getStressLevelInfo(score);

  return (
    <View style={styles.container}>
      {/* Radial bar chart visualization */}
      <View style={styles.radialChartContainer}>
        {chartImage ? (
          <Image
            src={chartImage}
            style={{
              width: 250,
              height: 250,
              objectFit: "contain",
            }}
          />
        ) : (
          <View style={styles.radialBackground} />
        )}
      </View>

      <View style={{ marginTop: -80 }}>
        <Text style={styles.stressLevel}>{level}</Text>
        <Text style={styles.attributes}>{interpretation}</Text>
      </View>
    </View>
  );
};

export default StressScaleDisplay;
