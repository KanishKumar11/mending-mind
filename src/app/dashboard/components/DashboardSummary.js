"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from "chart.js";

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title
);

export default function DashboardSummary({ users }) {
  // Calculate gender distribution
  const genderCounts = users.reduce((acc, user) => {
    const gender = user.gender || "Not Specified";
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  const genderData = {
    labels: Object.keys(genderCounts),
    datasets: [
      {
        label: "Gender Distribution",
        data: Object.values(genderCounts),
        backgroundColor: [
          "#F0C93B",
          "#B4E0E0",
          "#9A8BC5",
        ],
        borderColor: [
          "#e0b92b",
          "#8ECACA",
          "#8A7BB5",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Calculate age distribution
  const ageGroups = {
    "Under 18": 0,
    "18-24": 0,
    "25-34": 0,
    "35-44": 0,
    "45-54": 0,
    "55+": 0,
  };

  users.forEach(user => {
    const age = parseInt(user.age);
    if (isNaN(age)) return;
    
    if (age < 18) ageGroups["Under 18"]++;
    else if (age >= 18 && age <= 24) ageGroups["18-24"]++;
    else if (age >= 25 && age <= 34) ageGroups["25-34"]++;
    else if (age >= 35 && age <= 44) ageGroups["35-44"]++;
    else if (age >= 45 && age <= 54) ageGroups["45-54"]++;
    else ageGroups["55+"]++;
  });

  const ageData = {
    labels: Object.keys(ageGroups),
    datasets: [
      {
        label: "Age Distribution",
        data: Object.values(ageGroups),
        backgroundColor: "#F0C93B",
        borderColor: "#e0b92b",
        borderWidth: 1,
      },
    ],
  };

  // Calculate average personality traits
  const personalityAverages = users.reduce(
    (acc, user) => {
      if (user.scores?.personality) {
        acc.extraversion += user.scores.personality.extraversion || 0;
        acc.agreeableness += user.scores.personality.agreeableness || 0;
        acc.conscientiousness += user.scores.personality.conscientiousness || 0;
        acc.neuroticism += user.scores.personality.neuroticism || 0;
        acc.openness += user.scores.personality.openness || 0;
        acc.count++;
      }
      return acc;
    },
    { extraversion: 0, agreeableness: 0, conscientiousness: 0, neuroticism: 0, openness: 0, count: 0 }
  );

  const personalityData = {
    labels: ["Extraversion", "Agreeableness", "Conscientiousness", "Neuroticism", "Openness"],
    datasets: [
      {
        label: "Average Personality Traits",
        data: [
          personalityAverages.count ? (personalityAverages.extraversion / personalityAverages.count).toFixed(2) : 0,
          personalityAverages.count ? (personalityAverages.agreeableness / personalityAverages.count).toFixed(2) : 0,
          personalityAverages.count ? (personalityAverages.conscientiousness / personalityAverages.count).toFixed(2) : 0,
          personalityAverages.count ? (personalityAverages.neuroticism / personalityAverages.count).toFixed(2) : 0,
          personalityAverages.count ? (personalityAverages.openness / personalityAverages.count).toFixed(2) : 0,
        ],
        backgroundColor: "rgba(176, 224, 224, 0.2)",
        borderColor: "#B4E0E0",
        borderWidth: 2,
        pointBackgroundColor: "#F0C93B",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#F0C93B",
        fill: true,
      },
    ],
  };

  // Calculate assessments over time
  const assessmentsByMonth = {};
  
  users.forEach(user => {
    const date = new Date(user.createdAt);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    assessmentsByMonth[monthYear] = (assessmentsByMonth[monthYear] || 0) + 1;
  });

  // Sort by date
  const sortedMonths = Object.keys(assessmentsByMonth).sort((a, b) => {
    const [aMonth, aYear] = a.split('/').map(Number);
    const [bMonth, bYear] = b.split('/').map(Number);
    
    if (aYear !== bYear) return aYear - bYear;
    return aMonth - bMonth;
  });

  const assessmentsData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Assessments Completed",
        data: sortedMonths.map(month => assessmentsByMonth[month]),
        borderColor: "#F0C93B",
        backgroundColor: "rgba(240, 201, 59, 0.5)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Gender Distribution</CardTitle>
          <CardDescription>Breakdown of users by gender</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <Doughnut 
            data={genderData} 
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
      
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
          <CardDescription>Breakdown of users by age group</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <Bar 
            data={ageData}
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
      
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Personality Traits</CardTitle>
          <CardDescription>Average scores across all users</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <Line 
            data={personalityData}
            options={{
              responsive: true,
              scales: {
                r: {
                  min: 0,
                  max: 10,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Assessments Over Time</CardTitle>
          <CardDescription>Number of assessments completed by month</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <Line 
            data={assessmentsData}
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
    </div>
  );
}
