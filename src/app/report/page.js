"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReportGenerator from "../components/ReportGenerator";

// Sample data for testing
const dummyUserInfo = {
  name: "Test User",
  age: "30",
  gender: "Female",
  email: "test@example.com",
  contact: "9876543210",
};

const dummyScores = {
  personality: {
    extraversion: 7,
    agreeableness: 8,
    conscientiousness: 6,
    neuroticism: 4,
    openness: 9,
  },
  stress: 14,
  decisionStyle: {
    rational: 16,
    intuitive: 12,
  },
  resilience: 59,
  taxpayerJudgement: 3,
  cbic: {
    empathy: 6,
    emotional: 5,
    decision: 6,
  },
};

export default function ReportPage() {
  const router = useRouter();
  const [useDummyData, setUseDummyData] = useState(true);

  // Check if we should use dummy data
  useEffect(() => {
    // Check if we have data in sessionStorage
    const userInfo = sessionStorage.getItem("userInfo");
    const scores = sessionStorage.getItem("questionnaireScores");

    if (!userInfo || !scores) {
      // Use dummy data instead of redirecting
      setUseDummyData(true);
      console.log("Using dummy data for testing");
    }
  }, [router]);

  // Get data from sessionStorage or use dummy data
  const getUserInfo = () => {
    if (useDummyData) return dummyUserInfo;

    try {
      return JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    } catch (e) {
      return dummyUserInfo;
    }
  };

  const getScores = () => {
    if (useDummyData) return dummyScores;

    try {
      return JSON.parse(sessionStorage.getItem("questionnaireScores") || "{}");
    } catch (e) {
      return dummyScores;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {useDummyData && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <p className="font-bold">Test Mode</p>
          <p>
            Using dummy data for testing purposes. This banner only appears in
            the /report route.
          </p>
        </div>
      )}
      <ReportGenerator
        userInfo={getUserInfo()}
        scores={getScores()}
        onRestart={() => router.push("/")}
      />
    </div>
  );
}
