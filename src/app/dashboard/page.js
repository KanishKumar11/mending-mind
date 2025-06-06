"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/auth";
import LoginForm from "./components/LoginForm";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/columns";
import DashboardSummary from "./components/DashboardSummary";
import QuizSettingsForm from "./components/QuizSettingsForm"; // Import the new component
import { Button } from "@/app/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const { isAuthenticated, logout, loading: authLoading, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("summary"); // "summary", "users", or "settings"

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchUsers();
    }
  }, [isAuthenticated, token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Include the auth token in the request headers
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Transform data to create separate rows for each quiz attempt
        const transformedData = [];

        data.users.forEach((user) => {
          if (user.quizAttempts && user.quizAttempts.length > 0) {
            user.quizAttempts.forEach((attempt, index) => {
              transformedData.push({
                ...user,
                attemptNumber: index + 1,
                attemptDate: attempt.createdAt || user.createdAt,
                currentAttempt: attempt,
                totalAttempts: user.quizAttempts.length,
                // Create a unique ID for each row
                id: `${user._id}_attempt_${index + 1}`,
                originalUserId: user._id,
              });
            });
          } else {
            // Users with no attempts
            transformedData.push({
              ...user,
              attemptNumber: 0,
              attemptDate: user.createdAt,
              currentAttempt: null,
              totalAttempts: 0,
              id: `${user._id}_no_attempt`,
              originalUserId: user._id,
            });
          }
        });

        setUsers(transformedData);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F0C93B]"></div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="container mx-auto p-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Image
            src="/Mind_Logo.png"
            alt="Mending Mind Logo"
            width={120}
            height={48}
            priority
            className="object-contain mr-4"
          />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Summary Cards */}
      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    users.reduce((acc, user) => {
                      if (!acc.includes(user.originalUserId)) {
                        acc.push(user.originalUserId);
                      }
                      return acc;
                    }, []).length
                  }
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.239"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Attempts
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter((user) => user.attemptNumber > 0).length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Repeat Users
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((acc, user) => {
                    const userId = user.originalUserId;
                    if (!acc[userId]) acc[userId] = 0;
                    if (user.attemptNumber > 0) acc[userId]++;
                    return acc;
                  }, {})
                    ? Object.values(
                        users.reduce((acc, user) => {
                          const userId = user.originalUserId;
                          if (!acc[userId]) acc[userId] = 0;
                          if (user.attemptNumber > 0) acc[userId]++;
                          return acc;
                        }, {})
                      ).filter((count) => count > 1).length
                    : 0}
                </p>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Attempts/User
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(() => {
                    const uniqueUsers = users.reduce((acc, user) => {
                      if (!acc.includes(user.originalUserId)) {
                        acc.push(user.originalUserId);
                      }
                      return acc;
                    }, []);
                    const totalAttempts = users.filter(
                      (user) => user.attemptNumber > 0
                    ).length;
                    return uniqueUsers.length > 0
                      ? (totalAttempts / uniqueUsers.length).toFixed(1)
                      : "0";
                  })()}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("summary")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "summary"
                  ? "border-[#F0C93B] text-[#F0C93B]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dashboard Summary
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-[#F0C93B] text-[#F0C93B]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              User Data
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-[#F0C93B] text-[#F0C93B]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Quiz Settings
            </button>
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F0C93B]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <>
          {activeTab === "summary" && <DashboardSummary users={users} />}
          {activeTab === "users" && (
            <DataTable columns={columns} data={users} />
          )}
          {activeTab === "settings" && <QuizSettingsForm />}
        </>
      )}
    </div>
  );
}
