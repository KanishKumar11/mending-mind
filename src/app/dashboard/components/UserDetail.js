"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import React from "react"; // Ensure React is imported
import { Doughnut, Radar, Bar } from "react-chartjs-2";
import { format } from "date-fns";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UserDetail({ user }) {
  const [selectedAttemptIndex, setSelectedAttemptIndex] = React.useState(0); // React needs to be imported

  // Import React at the top: import React from 'react';
  if (!user || !user.quizAttempts || user.quizAttempts.length === 0) {
    return <div>User not found or no quiz attempts available.</div>;
  }

  const selectedAttempt = user.quizAttempts[selectedAttemptIndex];
  // Ensure selectedAttempt is not undefined before accessing its properties
  if (!selectedAttempt) {
    return <div>Selected quiz attempt not found.</div>;
  }

  // Format date of the selected attempt if available, otherwise user creation date
  const attemptDate = selectedAttempt.createdAt
    ? new Date(selectedAttempt.createdAt)
    : new Date(user.createdAt);
  const formattedDate = format(attemptDate, "PPP");

  // Personality data
  const personalityData = {
    labels: [
      "Extraversion",
      "Agreeableness",
      "Conscientiousness",
      "Neuroticism",
      "Openness",
    ],
    datasets: [
      {
        label: "Score",
        data: [
          selectedAttempt.personality?.extraversion,
          selectedAttempt.personality?.agreeableness,
          selectedAttempt.personality?.conscientiousness,
          selectedAttempt.personality?.neuroticism,
          selectedAttempt.personality?.openness,
        ],
        backgroundColor: "rgba(240, 201, 59, 0.2)",
        borderColor: "#F0C93B",
        borderWidth: 2,
        pointBackgroundColor: "#F0C93B",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#F0C93B",
      },
    ],
  };

  // Decision style data
  const decisionStyleData = {
    labels: ["Rational", "Intuitive"],
    datasets: [
      {
        label: "Score",
        data: [
          selectedAttempt.decisionStyle?.rational,
          selectedAttempt.decisionStyle?.intuitive,
        ],
        backgroundColor: ["#B4E0E0", "#9A8BC5"],
        borderColor: ["#8ECACA", "#8A7BB5"],
        borderWidth: 1,
      },
    ],
  };

  // CBIC data
  const cbicData = {
    labels: ["Empathy", "Emotional Intelligence", "Decision Making"],
    datasets: [
      {
        label: "CBIC Scores",
        data: [
          selectedAttempt.cbic?.empathy,
          selectedAttempt.cbic?.emotional,
          selectedAttempt.cbic?.decision,
        ],
        backgroundColor: "rgba(176, 224, 224, 0.2)",
        borderColor: "#B4E0E0",
        borderWidth: 2,
        pointBackgroundColor: "#F0C93B",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#F0C93B",
      },
    ],
  };

  // Stress and resilience data
  const otherScoresData = {
    labels: ["Stress", "Resilience", "Taxpayer Judgement"],
    datasets: [
      {
        label: "Scores",
        data: [
          selectedAttempt.stress,
          selectedAttempt.resilience,
          selectedAttempt.taxpayerJudgement,
        ],
        backgroundColor: ["#F0C93B", "#B4E0E0", "#9A8BC5"],
        borderColor: ["#e0b92b", "#8ECACA", "#8A7BB5"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {user.quizAttempts.length > 1 && (
        <div className="flex items-center space-x-2 mb-4">
          <p className="text-sm font-medium">Select Quiz Attempt:</p>
          <select
            value={selectedAttemptIndex}
            onChange={(e) =>
              setSelectedAttemptIndex(parseInt(e.target.value, 10))
            }
            className="p-2 border rounded-md"
          >
            {user.quizAttempts.map((attempt, index) => (
              <option key={index} value={index}>
                Attempt {index + 1} (
                {format(new Date(attempt.createdAt || user.createdAt), "PPP")})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Personal details and assessment date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Age
                  </p>
                  <p className="font-medium">{user.age}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Gender
                  </p>
                  <p className="font-medium">{user.gender}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Assessment Date
                  </p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Contact
                  </p>
                  <p className="font-medium">{user.contact}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stress, Resilience & Judgement</CardTitle>
            <CardDescription>Key assessment scores</CardDescription>
          </CardHeader>
          <CardContent>
            <Bar
              data={otherScoresData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personality Profile</CardTitle>
            <CardDescription>BFI-10 Personality Assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <Radar
              data={personalityData}
              options={{
                responsive: true,
                scales: {
                  r: {
                    min: 0,
                    max: 10,
                    ticks: {
                      stepSize: 2,
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Decision-Making Style</CardTitle>
            <CardDescription>Rational vs. Intuitive</CardDescription>
          </CardHeader>
          <CardContent>
            <Doughnut
              data={decisionStyleData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>CBIC Assessment</CardTitle>
            <CardDescription>
              Empathy, Emotional Intelligence & Decision Making
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Radar
              data={cbicData}
              options={{
                responsive: true,
                scales: {
                  r: {
                    min: 0,
                    max: 10,
                    ticks: {
                      stepSize: 2,
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
