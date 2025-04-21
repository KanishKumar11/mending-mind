"use client";

import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { QuestionnaireProvider } from "../../contexts/QuestionnaireContext";
import Questionnaire from "../../components/Questionnaire";

export default function QuestionnairePage() {
  const { language } = useLanguage();
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState(null);

  const handleCompletion = (answers) => {
    setCompleted(true);
    setResults(answers);
    // Here you would typically process the answers and show results
    console.log("Questionnaire completed with answers:", answers);
  };

  return (
    <div className="min-h-screen bg-white">
      <QuestionnaireProvider>
        <Questionnaire onComplete={handleCompletion} />
      </QuestionnaireProvider>

      {completed && results && (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {language === "en" ? "Thank You!" : "धन्यवाद!"}
            </h2>
            <p className="mb-4">
              {language === "en"
                ? "Your responses have been recorded."
                : "आपकी प्रतिक्रियाएँ दर्ज कर ली गई हैं।"}
            </p>
            <button
              onClick={() => setCompleted(false)}
              className="bg-[#FFB800] text-black px-6 py-2 rounded-full font-medium"
            >
              {language === "en" ? "Close" : "बंद करें"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
