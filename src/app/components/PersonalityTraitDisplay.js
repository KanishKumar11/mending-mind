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
      high: "You tend to be Expressive & Proactive",
      medium: "You tend to be Calmly Engaged & Situationally Social",
      low: "You tend to be Reserved & Reflectively Independent",
    },
    agreeableness: {
      high: "You tend to be Highly Cooperative & Empathetic",
      medium: "You tend to be Tactful & Objectively Balanced",
      low: "You tend to be Task-Focused & Logic-Oriented",
    },
    conscientiousness: {
      high: "You tend to be Exceptionally Reliable & Goal-Oriented",
      medium: "You tend to be Efficient & Practically Balanced",
      low: "You tend to be Adaptive & Flexible in Structure",
    },
    neuroticism: {
      high: "You tend to be Composed & Emotionally Grounded",
      medium: "You tend to be Emotionally Aware & Responsive",
      low: "You tend to be Sensitive & Deeply Reflective",
    },
    openness: {
      high: "You tend to be Innovative & Open-Minded",
      medium: "You tend to be Balanced & Thoughtfully Receptive",
      low: "You tend to be Structured & Consistency-Driven",
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
      high: "Energetic, Extroverted, Proactive, Persuasive, Charismatic, Talkative, Socially confident, Enthusiastic, Assertive, Outgoing",
      medium:
        "Approachable, Composed, Observant, Thoughtful, Adaptable, Diplomatic, Emotionally steady, Attuned to social cues, Selectively expressive",
      low: "Introverted, Reflective, Independent, Focused, Discreet, Deep listener, Introspective, Self-contained, Calm under pressure",
    },
    agreeableness: {
      high: "Compassionate, Trusting, Supportive, Emotionally understanding, Warm, Team-oriented, Generous, Conflict-avoidant, Respectful, Nurturing",
      medium:
        "Tactful, Fair, Objective, Respectfully assertive, Situationally accommodating, Open-minded, Reasonable, Considerate, Discerning",
      low: "Pragmatic, Independent, Direct, Results-driven, Rational, Reserved in empathy, Less emotionally expressive, Self-reliant, Candid",
    },
    conscientiousness: {
      high: "Organized, Responsible, Detail-oriented, Disciplined, Structured, Achievement-focused, Dependable, Meticulous, Persistent, Self-motivated",
      medium:
        "Reliable, Adaptable, Moderately structured, Realistic, Focused, Steady, Responsive, Goal-aware, Thoughtfully organized, Accountable",
      low: "Flexible, Spontaneous, Responsive to guidance, Informal in planning, Creative in approach, Comfortable in dynamic environments, Curious",
    },
    neuroticism: {
      high: "Resilient, Calm under pressure, Self-regulated, Steady, Reflective, Emotionally aware, Centered, Even-tempered, Grounded",
      medium:
        "Balanced, Thoughtfully expressive, Self-aware, In tune with emotions, Reasonable under pressure, Adaptive, Honest, Introspective",
      low: "Empathetic, Emotionally open, Responsive to environment, Deep thinker, Growth-oriented, Self-explorative, Learns through emotion",
    },
    openness: {
      high: "Curious, Imaginative, Open to change, Creative, Insightful, Adaptive, Culturally aware, Explorative, Conceptual thinker, Receptive",
      medium:
        "Thoughtful, Discerning, Balanced risk-taker, Reflective, Practically creative, Intellectually engaged, Learns from experience",
      low: "Practical, Routine-focused, Organized, Steady, Systematic, Loyal to proven methods, Reliable, Methodical, Detail-attentive",
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
      <Text style={styles.traitAttributes}>
        Based on your responses, you may be someone who {attributes}
      </Text>
    </View>
  );
};

export default PersonalityTraitDisplay;
