"use client";

import { useState } from "react";
import Image from "next/image";
import { LanguageProvider } from "./contexts/LanguageContext";
import { QuestionnaireProvider } from "./contexts/QuestionnaireContext";
import Questionnaire from "./components/Questionnaire";

import UserForm from "./components/UserForm";
import PageTransition from "./components/PageTransition";
import Results from "./components/Results";
import LottieAnimation from "./components/LottieAnimation";
import BackgroundAnimation from "./components/BackgroundAnimation";

export default function Home() {
  // App state to control which screen is visible
  const [currentScreen, setCurrentScreen] = useState("home"); // home, userInfo, questionnaire, results
  const [userInfo, setUserInfo] = useState(null);
  const [questionnaireResults, setQuestionnaireResults] = useState(null);

  // Handle navigation between screens
  const handleGetStarted = () => {
    setCurrentScreen("userInfo");
  };

  const handleUserInfoComplete = (formData) => {
    setUserInfo(formData);
    setCurrentScreen("questionnaire");
  };

  const handleQuestionnaireComplete = (answers) => {
    setQuestionnaireResults(answers);
    setCurrentScreen("results");
  };

  const handleRestart = () => {
    setCurrentScreen("home");
    setUserInfo(null);
    setQuestionnaireResults(null);
  };

  return (
    <LanguageProvider>
      <div className="h-auto overflow-hidden font-montserrat relative">
        <PageTransition>
          {currentScreen === "home" && (
            <div className="flex flex-col items-center justify-between h-[98vh]">
              <div className="w-full max-w-4xl flex flex-col items-start justify-between h-full">
                {/* Welcome Banner */}
                <div className="w-full max-h-[500px] h-[400px] relative ">
                  <Image
                    src="/welcome.svg"
                    alt="Welcome Banner"
                    fill
                    priority
                    className="object-contain "
                  />
                </div>
                <div className="w-full max-w-[200px] mx-auto ">
                  <Image
                    src="/Mind_Logo.png"
                    alt="Mending Mind Logo"
                    width={200}
                    height={67}
                    priority
                    className="w-full"
                  />
                </div>
                {/* Welcome Text */}
                <div className="text-left  max-w-2xl px-8">
                  <h1 className="text-2xl font-semibold text-[#D15B3B]">
                    Welcome to
                  </h1>
                  <h1 className="text-3xl font-bold tracking-tighter bg-gradient-to-r ">
                    SKILL BASED PSYCHOMETRIC ASSESSMENT,
                  </h1>
                  <p className="text-base text-[#1E1E1E] italic font-medium">
                    brought to you by Mending Mind.
                  </p>
                </div>

                {/* Get Started Button */}
                <div className="mt-16 px-8 mb-8 mx-auto ">
                  <button
                    onClick={handleGetStarted}
                    className="flex items-center justify-center bg-transparent text-[#1E1E1E] rounded-full font-semibold py-4 text-[20px] mx-auto transition-colors w-[280px] group cursor-pointer hover:text-[#D15B3B]"
                  >
                    <span>LET&#39;S GET STARTED</span>
                    <div className="ml-4 bg-[#B4E0E0] group-hover:bg-[#9A8BC5] rounded-full w-12 h-12 flex items-center justify-center transition-colors shadow-md">
                      <span className="text-[#1E1E1E] text-[32px] group-hover:translate-x-1 transition-all">
                        &gt;
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentScreen === "userInfo" && (
            <PageTransition>
              <QuestionnaireProvider>
                <UserForm onComplete={handleUserInfoComplete} />
              </QuestionnaireProvider>
            </PageTransition>
          )}

          {currentScreen === "questionnaire" && (
            <PageTransition>
              <QuestionnaireProvider>
                <Questionnaire onComplete={handleQuestionnaireComplete} />
              </QuestionnaireProvider>
            </PageTransition>
          )}

          {currentScreen === "results" && (
            <PageTransition>
              <Results
                userInfo={userInfo}
                answers={questionnaireResults}
                onRestart={handleRestart}
              />
            </PageTransition>
          )}
        </PageTransition>
      </div>
    </LanguageProvider>
  );
}
