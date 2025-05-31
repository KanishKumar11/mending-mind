import mongoose from "mongoose";

const quizSettingSchema = new mongoose.Schema(
  {
    passcode: {
      type: String,
      required: true,
      trim: true,
    },
    // You can add other quiz-related settings here in the future
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create the model if it doesn't exist already, otherwise use the existing one
const QuizSetting =
  mongoose.models.QuizSetting ||
  mongoose.model("QuizSetting", quizSettingSchema);

export default QuizSetting;
