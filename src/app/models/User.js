import mongoose from "mongoose";

// Define the schema for personality scores
const personalitySchema = new mongoose.Schema({
  extraversion: { type: Number, required: true },
  agreeableness: { type: Number, required: true },
  conscientiousness: { type: Number, required: true },
  neuroticism: { type: Number, required: true },
  openness: { type: Number, required: true },
});

// Define the schema for decision style scores
const decisionStyleSchema = new mongoose.Schema({
  rational: { type: Number, required: true },
  intuitive: { type: Number, required: true },
});

// Define the schema for CBIC scores
const cbicSchema = new mongoose.Schema({
  empathy: { type: Number, required: true },
  emotional: { type: Number, required: true },
  decision: { type: Number, required: true },
});

// Define the schema for all scores
const scoresSchema = new mongoose.Schema({
  personality: { type: personalitySchema, required: true },
  stress: { type: Number, required: true },
  decisionStyle: { type: decisionStyleSchema, required: true },
  resilience: { type: Number, required: true },
  taxpayerJudgement: { type: Number, required: true },
  cbic: { type: cbicSchema, required: true },
});

// Define the main user schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  scores: { type: scoresSchema, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the model if it doesn't exist already
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
