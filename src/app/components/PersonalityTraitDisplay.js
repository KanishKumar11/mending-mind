"use client";

import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

// Define the styles for our component
const styles = StyleSheet.create({
  traitContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  traitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  traitName: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
  traitScore: {
    fontSize: 14,
    fontFamily: "Montserrat",
  },
  traitDescription: {
    fontSize: 12,
    fontFamily: "Montserrat",
    marginTop: 5,
    marginBottom: 8,
  },
  traitAttributes: {
    fontSize: 11,
    fontFamily: "Montserrat",
    marginTop: 5,
    lineHeight: 1.4,
  },
  scaleContainer: {
    flexDirection: "row",
    height: 12,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 6,
    overflow: "hidden",
  },
  scalePart: {
    height: "100%",
  },
  scaleMarker: {
    position: "absolute",
    width: 3,
    height: 16,
    backgroundColor: "#000",
    top: -2,
    borderRadius: 4,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  rangeLabel: {
    fontSize: 9,
    fontFamily: "Montserrat",
    color: "#666",
  },
});

// Helper function to determine background color based on trait
const getTraitColor = (trait) => {
  switch (trait.toLowerCase()) {
    case "extraversion":
      return "#FF5757"; // Vibrant red
    case "agreeableness":
      return "#7B68EE"; // Vibrant purple
    case "conscientiousness":
      return "#B4E0E0"; // Mint
    case "neuroticism":
      return "#00C2A8"; // Vibrant teal
    case "openness":
      return "#F0C93B"; // Gold
    default:
      return "#B4E0E0"; // Default to mint
  }
};

// Helper function to determine trait level description
const getTraitLevelDescription = (trait, score) => {
  const traitData = {
    extraversion: {
      high: "You tend to be expressive & proactive",
      medium: "You tend to be calmly engaged & situationally social",
      low: "You tend to be reserved & reflectively independent",
    },
    agreeableness: {
      high: "You tend to be highly cooperative & empathetic",
      medium: "You tend to be tactful & objectively balanced",
      low: "You tend to be task focused & logic oriented",
    },
    conscientiousness: {
      high: "You tend to be exceptionally reliable & goal oriented",
      medium: "You tend to be efficient & practically balanced",
      low: "You tend to be adaptive & flexible in structure",
    },
    neuroticism: {
      high: "You tend to be composed & emotionally grounded",
      medium: "You tend to be emotionally aware & responsive",
      low: "You tend to be sensitive & deeply reflective",
    },
    openness: {
      high: "You tend to be innovative & open-minded",
      medium: "You tend to be balanced & thoughtfully receptive",
      low: "You tend to be structured & consistency driven",
    },
  };

  // Determine level based on score
  let level;
  if (score >= 8) {
    level = "high";
  } else if (score >= 5) {
    level = "medium";
  } else {
    level = "low";
  }

  return {
    description: traitData[trait.toLowerCase()]?.[level] || "",
    level,
  };
};

// Helper function to get trait attributes
const getTraitAttributes = (trait, level) => {
  const attributes = {
    extraversion: {
      high: "You are likely energetic, outgoing, persuasive, and socially confident. You thrive in environments that require communication, collaboration, and engagement with others. Your proactive and enthusiastic nature often draws people toward you, making you naturally charismatic and approachable.",
      medium:
        "You appear composed, adaptable, and selectively social. You balance being engaging when required with maintaining personal space when needed. You are thoughtful, diplomatic, and responsive to social cues, making you an effective communicator without being overly extroverted.",
      low: "You tend to be reflective, independent, and introspective. You prefer meaningful conversations over small talk and often seek depth in your interactions. Your calm and self-contained demeanor allows you to remain centered even in socially demanding environments.",
    },
    agreeableness: {
      high: "You demonstrate compassion, emotional warmth, and a team-oriented mindset. You are likely empathetic, trusting, supportive, and nurturing toward others. You value harmony and collaboration and often prioritize the emotional well-being of people around you.",
      medium:
        "You exhibit tact, objectivity, and a balanced approach to social interactions. You can be considerate and fair without overextending emotionally. You appreciate different perspectives, practice respectful assertiveness, and maintain healthy boundaries while staying open-minded.",
      low: "You lean toward pragmatism, independence, and task-orientation. You prioritize outcomes over emotional exchanges and are comfortable making decisions that are rational rather than sentiment-driven. You value efficiency, logical reasoning, and self-sufficiency.",
    },
    conscientiousness: {
      high: " You are exceptionally reliable, goal-driven, and disciplined. You maintain high standards of organization, structure, and precision in your work. Your focus on achievement and persistence in pursuing objectives make you a dependable and dedicated individual.",
      medium:
        "You are steady, efficient, and practically structured. You demonstrate responsibility and focus while remaining adaptable to changing circumstances. You value balance between planning and flexibility, ensuring tasks are handled thoughtfully without rigidity.",
      low: "You display spontaneity, creativity, and flexibility in planning. You are comfortable operating in dynamic environments where change is constant. Your informal, adaptive style encourages innovation and responsiveness rather than strict adherence to rules.",
    },
    neuroticism: {
      high: "You exhibit emotional resilience, self-regulation, and inner steadiness. You manage emotional fluctuations effectively, remaining composed and centered under pressure. Your calmness and reflective nature support consistent and balanced emotional responses.",
      medium:
        "You show emotional awareness, thoughtful expression, and adaptability under moderate stress. You remain self-aware of your emotions and manage them constructively, maintaining a reasonable balance between expression and regulation during challenging times.",
      low: "Youare emotionally sensitive, deeply introspective, and highly reflective. You engage closely with your inner emotional world and are attuned to both internal and external changes. Your emotional openness allows you to experience and process deeper levels of self-awareness and connection.",
    },
    openness: {
      high: "You are curious, innovative, and highly receptive to new ideas and experiences. You seek opportunities to learn, explore, and grow, showing adaptability, cultural awareness, and creative problem-solving. You are naturally inclined toward imagination and broad conceptual thinking.",
      medium:
        "You maintain a balanced openness to new experiences, engaging thoughtfully with novel ideas while maintaining practical realism. You are reflective, solution-focused, and intellectually engaged, appreciating both innovation and grounded application.",
      low: "You favor structure, consistency, and proven methods. You prefer stability and routine over unpredictable or unfamiliar experiences. Your focus on reliability, organization, and tradition helps you maintain a steady and dependable environment.",
    },
  };

  return attributes[trait.toLowerCase()]?.[level] || "";
};

const PersonalityTraitDisplay = ({ trait, score }) => {
  const traitColor = getTraitColor(trait);
  const { description, level } = getTraitLevelDescription(trait, score);
  const attributes = getTraitAttributes(trait, level);

  // Calculate the position of the marker on the scale (0-10)
  const markerPosition = `${(score / 10) * 100}%`;

  return (
    <View
      style={[styles.traitContainer, { borderLeft: `4px solid ${traitColor}` }]}
    >
      <View style={styles.traitHeader}>
        <Text style={styles.traitName}>{trait}</Text>
      </View>

      {/* Visual scale */}
      <View style={{ position: "relative" }}>
        <View style={styles.scaleContainer}>
          <View
            style={[
              styles.scalePart,
              { width: "33.3%", backgroundColor: "#f0f0f0" },
            ]}
          />
          <View
            style={[
              styles.scalePart,
              { width: "33.3%", backgroundColor: "#e0e0e0" },
            ]}
          />
          <View
            style={[
              styles.scalePart,
              { width: "33.3%", backgroundColor: "#d0d0d0" },
            ]}
          />
        </View>

        {/* Simple thin rounded marker */}
        <View
          style={[
            styles.scaleMarker,
            { left: markerPosition, backgroundColor: traitColor },
          ]}
        />

        <View style={styles.rangeLabels}>
          <Text style={styles.rangeLabel}>Low </Text>
          <Text style={styles.rangeLabel}>Medium </Text>
          <Text style={styles.rangeLabel}>High </Text>
        </View>
      </View>

      <Text style={styles.traitDescription}>{description}</Text>
      <Text style={styles.traitAttributes}>{attributes}</Text>
    </View>
  );
};

export default PersonalityTraitDisplay;
