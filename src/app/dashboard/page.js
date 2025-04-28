"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/auth";
import LoginForm from "./components/LoginForm";
import { DataTable } from "./components/DataTable";
import { columns } from "./components/columns";
import DashboardSummary from "./components/DashboardSummary";
import { Button } from "@/app/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const { isAuthenticated, logout, loading: authLoading, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("summary"); // "summary" or "users"

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
        console.log("API Response:", data.users);
        setUsers(data.users);
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
          {activeTab === "summary" ? (
            <DashboardSummary users={users} />
          ) : (
            <DataTable columns={columns} data={users} />
          )}
        </>
      )}
    </div>
  );
}
