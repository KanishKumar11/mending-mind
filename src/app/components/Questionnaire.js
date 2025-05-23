"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";
import { useQuestionnaire } from "../contexts/QuestionnaireContext";
import { motion, AnimatePresence } from "framer-motion";
import SectionPopup from "./SectionPopup";
import ImagePreloader from "./ImagePreloader";

export default function Questionnaire({ onComplete }) {
  const { language } = useLanguage();
  const {
    questions,
    currentQuestion,
    setCurrentQuestion,
    answers,
    handleAnswer,
    totalQuestions,
    scores, // Add scores from the context
  } = useQuestionnaire();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [showSectionPopup, setShowSectionPopup] = useState(false);
  const [sectionData, setSectionData] = useState(null);

  // Calculate images to preload based on current question
  const imagesToPreload = useMemo(() => {
    const nextImages = [];

    // Get the next two questions' images
    for (let i = 1; i <= 2; i++) {
      const nextQuestionIndex = currentQuestion + i;
      if (nextQuestionIndex < questions.length) {
        const nextQuestion = questions[nextQuestionIndex];
        // Skip section start questions
        if (nextQuestion.type !== "section_start") {
          const nextQuestionContent = nextQuestion[language];
          if (nextQuestionContent?.image) {
            nextImages.push(nextQuestionContent.image);
          }
        } else if (nextQuestion.type === "section_start") {
          // For section start, also preload the section image
          if (nextQuestion[language]?.image) {
            nextImages.push(nextQuestion[language].image);
          }
        }
      }
    }

    return nextImages;
  }, [currentQuestion, questions, language]);

  // Track previous question to determine direction
  const [prevQuestion, setPrevQuestion] = useState(currentQuestion);

  useEffect(() => {
    if (prevQuestion !== currentQuestion) {
      setDirection(currentQuestion > prevQuestion ? 1 : -1);
      setPrevQuestion(currentQuestion);
    }
  }, [currentQuestion, prevQuestion]);

  // Get current question data
  const currentQuestionData = questions[currentQuestion];

  // Handle section transitions - show popup for any section_start type question
  useEffect(() => {
    if (currentQuestionData?.type === "section_start") {
      setSectionData(currentQuestionData);
      setShowSectionPopup(true);
    } else {
      setShowSectionPopup(false);
    }
  }, [currentQuestion, currentQuestionData]);

  // Handle section popup continue
  const handleSectionContinue = () => {
    setShowSectionPopup(false);
    // Delay the answer submission to allow for animation
    setTimeout(() => {
      handleAnswer(currentQuestionData.id, "section_complete");
    }, 300);
  };

  // Get translated question data
  const questionContent = currentQuestionData?.[language];

  // Check if questionnaire is complete
  useEffect(() => {
    if (answers.length === totalQuestions && onComplete) {
      // Only call onComplete when the questionnaire is actually complete
      onComplete(scores);
    }
  }, [answers, totalQuestions, onComplete, scores]);

  const handleOptionSelect = (optionValue) => {
    setSelectedOption(optionValue);
    setIsTransitioning(true);

    // Delay the actual answer submission to allow for animation
    setTimeout(() => {
      handleAnswer(questions[currentQuestion].id, optionValue);
      setSelectedOption(null);
      setIsTransitioning(false);
    }, 600);
  };

  // Function to go back to the previous question
  const handleGoBack = () => {
    if (currentQuestion > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setDirection(-1); // Set direction to backward

      // Check if the previous question is a section breaker
      let stepsBack = 1;
      const prevQuestionIndex = currentQuestion - 1;

      if (
        prevQuestionIndex >= 0 &&
        questions[prevQuestionIndex]?.type === "section_start"
      ) {
        // If previous question is a section breaker, go back one more step
        stepsBack = 2;
      }

      // Make sure we don't go below 0
      const targetQuestion = Math.max(0, currentQuestion - stepsBack);

      // Delay to allow for animation
      setTimeout(() => {
        setCurrentQuestion(targetQuestion);
        setIsTransitioning(false);
      }, 300);
    }
  };

  // Function to determine the current section based on the current question
  const getCurrentSection = () => {
    // Get all section indices
    const sectionIndices = questions
      .map((q, i) => (q.type === "section_start" ? i : null))
      .filter((i) => i !== null);

    // Find which section the current question belongs to
    for (let i = sectionIndices.length - 1; i >= 0; i--) {
      if (currentQuestion >= sectionIndices[i]) {
        return i + 1; // Section numbers start from 1
      }
    }

    return 1; // Default to first section
  };

  // Get current section number
  const currentSection = getCurrentSection();

  // Determine background color based on section number
  // Odd sections (1, 3, 5) get white background, even sections (2, 4) get light yellow
  const bgColor =
    currentSection % 2 === 1
      ? "bg-gradient-to-b from-white to-gray-50"
      : "bg-[#FDF9F1]";

  // Only return null if we have no question content and it's not a section start
  if (!questionContent && currentQuestionData?.type !== "section_start") {
    return null;
  }

  return (
    <div
      className={`min-h-svh flex flex-col items-center py-4 px-6 ${bgColor}`}
    >
      {/* Image Preloader - invisible component that preloads the next images */}
      <ImagePreloader imagesToPreload={imagesToPreload} />

      {/* Section Popup */}
      {sectionData && (
        <SectionPopup
          data={sectionData}
          language={language}
          onContinue={handleSectionContinue}
          isOpen={showSectionPopup}
        />
      )}
      {/* Progress Bar */}
      {/* <div className="w-full max-w-lg bg-gray-100 h-3 rounded-full relative mb-4 shadow-sm">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#F0C93B] to-[#F0C93B] rounded-full"
          style={{
            width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
          }}
          initial={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          animate={{
            width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="absolute -right-2 -top-1 w-5 h-5 bg-[#F0C93B] rounded-full shadow-md flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        </motion.div>
      </div> */}

      {/* <motion.div
        className="flex items-center justify-center mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-6">
          {questions
            .filter((q) => q.type === "section_start")
            .map((section, index) => {
              // Get all section indices
              const sectionIndices = questions
                .map((q, i) => (q.type === "section_start" ? i : null))
                .filter((i) => i !== null);

              // Get current section index
              const currentSectionIndex = sectionIndices.findIndex(
                (sectionStart) => {
                  const nextSectionStart =
                    sectionIndices[sectionIndices.indexOf(sectionStart) + 1];
                  return (
                    currentQuestion >= sectionStart &&
                    (nextSectionStart === undefined ||
                      currentQuestion < nextSectionStart)
                  );
                }
              );

              // Determine if this section is active or completed
              const isActive = index === currentSectionIndex;
              const isCompleted = index < currentSectionIndex;

              return (
                <motion.div
                  key={section.id}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    className={`rounded-full flex items-center justify-center ${
                      isActive
                        ? "bg-[#F0C93B] w-6 h-6 ring-2 ring-[#F0C93B]"
                        : isCompleted
                        ? "bg-[#F58D6F] w-5 h-5"
                        : "bg-gray-200 w-5 h-5"
                    }`}
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.8, repeat: 0 }}
                  >
                    {isCompleted && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </motion.div>
                  <motion.span
                    className={`text-xs font-medium mt-1 ${
                      isActive
                        ? "text-[#F0C93B]"
                        : isCompleted
                        ? "text-[#F58D6F]"
                        : "text-gray-400"
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {index + 1}
                  </motion.span>
                </motion.div>
              );
            })}
        </div>
      </motion.div> */}

      {/* Navigation Buttons */}
      {!showSectionPopup && currentQuestion > 0 && (
        <motion.button
          onClick={handleGoBack}
          disabled={isTransitioning}
          className="absolute left-4 bottom-16 transform -translate-y-1/2 w-10 h-10 rounded-full bg-[#F0C93B] flex items-center justify-center shadow-md hover:bg-[#E6B92E] transition-colors z-10"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#1E1E1E]"
          >
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </motion.button>
      )}

      {/* Question Content Container */}
      <div className="w-full max-w-lg overflow-hidden relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentQuestion}
            initial={{
              opacity: 0,
              x: direction > 0 ? 100 : -100,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: direction > 0 ? -100 : 100,
              transition: { duration: 0.4 },
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex flex-col items-center justify-between w-full"
          >
            {/* Question Number with encouraging message - hide when section popup is shown */}
            {!showSectionPopup && (
              <motion.div
                className="flex flex-col items-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <motion.p className="text-[#D15B3B] uppercase text-xs tracking-widest font-semibold">
                  {language === "en" ? "QUESTION" : "प्रश्न"}{" "}
                  {questionContent.number}
                </motion.p>

                {/* Encouraging message - changes based on progress */}
                <motion.p
                  className="text-[#9A8BC5] text-xs mt-1 italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {currentQuestion < totalQuestions * 0.25
                    ? language === "en"
                      ? "Great start! Keep going!"
                      : "शानदार शुरुआत! जारी रखें!"
                    : currentQuestion < totalQuestions * 0.5
                    ? language === "en"
                      ? "You're doing well!"
                      : "आप अच्छा कर रहे हैं!"
                    : currentQuestion < totalQuestions * 0.75
                    ? language === "en"
                      ? "Keep up the good work!"
                      : "अच्छा काम जारी रखें!"
                    : language === "en"
                    ? "Almost there!"
                    : "बस थोड़ा और!"}
                </motion.p>
              </motion.div>
            )}

            {/* Question Text - hide when section popup is shown */}
            {!showSectionPopup && (
              <motion.h2
                className="text-xl md:text-2xl font-medium text-center mb-4 text-gray-800 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {questionContent.text}
              </motion.h2>
            )}

            {/* Question Image or Description - hide when section popup is shown */}
            {currentQuestionData.type !== "description" &&
            !showSectionPopup &&
            questionContent.image ? (
              <motion.div
                className="w-full max-w-xs mb-4 flex justify-center relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute -z-10 w-40 h-40 rounded-full bg-[#F0C93B] opacity-40"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <Image
                  src={questionContent.image}
                  alt="Question illustration"
                  width={200}
                  height={200}
                  priority
                  className="w-auto h-auto max-h-[200px] drop-shadow-md"
                />
              </motion.div>
            ) : (
              <motion.div
                className="w-full max-w-lg mb-12 p-6 bg-gray-50 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <p className="text-gray-600 leading-relaxed">
                  {questionContent.description}
                </p>
              </motion.div>
            )}

            {/* Answer Options - hide when section popup is shown */}
            {!showSectionPopup && (
              <motion.div
                className="w-full space-y-3 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {questionContent.type == null &&
                  questionContent?.options?.map((option, index) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.15, duration: 0.5 }}
                      onClick={() =>
                        !isTransitioning && handleOptionSelect(option.value)
                      }
                      disabled={isTransitioning}
                      className={`w-full py-3 px-6 border-2 rounded-lg text-center transition-all duration-300 relative font-semibold overflow-hidden text-sm shadow-sm ${
                        selectedOption === option.value
                          ? "border-[#F0C93B] bg-gradient-to-r from-[#F0C93B]/20 to-[#F0C93B]/10 text-[#1E1E1E] font-bold shadow-md"
                          : "border-[#F0C93B]/30 hover:border-[#9A8BC5]/50 hover:bg-gradient-to-r hover:from-[#F0C93B]/5 hover:to-[#9A8BC5]/5 text-gray-700 hover:shadow"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {selectedOption === option.value && (
                        <>
                          <motion.div
                            className="absolute inset-0 bg-[#F0C93B]/20"
                            initial={{ scale: 0, borderRadius: "100%" }}
                            animate={{ scale: 20, opacity: 0 }}
                            transition={{ duration: 0.6 }}
                          />
                          <motion.div
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#F0C93B] flex items-center justify-center"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 text-white"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.div>
                        </>
                      )}
                      <span className="relative z-10">{option.label}</span>
                    </motion.button>
                  ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
