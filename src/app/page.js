"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { LanguageProvider } from "./contexts/LanguageContext";

// Dynamically import components with client-side only execution
const QuestionnaireProvider = dynamic(
  () =>
    import("./contexts/QuestionnaireContext").then(
      (mod) => mod.QuestionnaireProvider
    ),
  { ssr: false }
);

const Questionnaire = dynamic(() => import("./components/Questionnaire"), {
  ssr: false,
});

const UserForm = dynamic(() => import("./components/UserForm"), { ssr: false });

const PageTransition = dynamic(() => import("./components/PageTransition"), {
  ssr: false,
});

const ResultsScreen = dynamic(() => import("./components/ResultsScreen"), {
  ssr: false,
});

export default function Home() {
  // App state to control which screen is visible
  const [currentScreen, setCurrentScreen] = useState("home"); // home, userInfo, questionnaire, results
  const [userInfo, setUserInfo] = useState(null);
  const [questionnaireScores, setQuestionnaireScores] = useState();

  // Handle navigation between screens
  const handleGetStarted = () => {
    setCurrentScreen("userInfo");
  };

  const handleUserInfoComplete = (formData) => {
    setUserInfo(formData);
    setCurrentScreen("questionnaire");
  };

  const handleQuestionnaireComplete = (scores) => {
    setQuestionnaireScores(scores);

    // Store data in sessionStorage for the report page
    try {
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      sessionStorage.setItem("questionnaireScores", JSON.stringify(scores));
    } catch (e) {
      // Handle storage error silently
    }

    setCurrentScreen("results");
  };

  const handleRestart = () => {
    setCurrentScreen("home");
    setUserInfo(null);
    setQuestionnaireScores(null);
  };

  return (
    <LanguageProvider>
      <div className=" overflow-hidden font-montserrat relative h-full">
        <PageTransition>
          {currentScreen === "home" && (
            <div className="flex flex-col items-center justify-between min-h-[98vh] h-full bg-[#FDF9F1]">
              <div className="w-full max-w-4xl flex flex-col items-center justify-between h-full pb-8 pt-2">
                {/* Main Content Section */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 px-4 md:px-8 h-full  min-h-[90vh]">
                  {/* Left Side - Illustration */}
                  <div className="w-full md:w-1/2  h-[38vh] min-h-[230px]  relative">
                    <Image
                      src="/welcome.png"
                      alt="Welcome Banner"
                      fill
                      priority
                      className="object-contain  mx-auto h-[300px]"
                    />
                  </div>
                  <div className="w-full max-w-[200px] mx-auto mb-4">
                    <Image
                      src="/Mind_Logo.png"
                      alt="Mending Mind Logo"
                      width={200}
                      height={67}
                      priority
                      className="w-full"
                    />
                  </div>
                  {/* Right Side - Text Content */}
                  <div className="w-full md:w-1/2 text-left max-w-xl">
                    <h1 className="text-2xl font-semibold text-[#1e1e1e] mb-1">
                      Welcome to
                    </h1>
                    <h1 className="text-3xl font-bold tracking-tighter mb-2">
                      SKILL BASED PSYCHOMETRIC ASSESSMENT,
                    </h1>
                    <p className="text-base text-[#1E1E1E] italic font-medium mb-8">
                      brought to you by Mending Mind.
                    </p>

                    {/* Get Started Button */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleGetStarted}
                        className="bg-[#F0C93B] hover:bg-[#E6B92E] text-[#1E1E1E] font-semibold py-3 px-8 rounded-md transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                      >
                        <span>LET&#39;S GET STARTED</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
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
              <ResultsScreen userInfo={userInfo} scores={questionnaireScores} />
            </PageTransition>
          )}
        </PageTransition>
      </div>
    </LanguageProvider>
  );
}
