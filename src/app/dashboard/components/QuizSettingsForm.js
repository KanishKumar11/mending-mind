"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { useAuth } from "@/app/lib/auth"; // To ensure only authenticated admins can access

export default function QuizSettingsForm() {
  const { token } = useAuth(); // For sending authenticated requests
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" }); // For success/error messages
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchCurrentPasscode = async () => {
      setIsFetching(true);
      try {
        const response = await fetch("/api/quiz-settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success && data.passcode !== null) {
          setCurrentPasscode(data.passcode);
          setNewPasscode(data.passcode); // Pre-fill new passcode for easier editing
        } else if (data.success && data.passcode === null) {
          setCurrentPasscode("Not set");
        } else {
          setMessage({
            type: "error",
            text: data.message || "Failed to fetch current passcode.",
          });
        }
      } catch (error) {
        setMessage({
          type: "error",
          text: "An error occurred while fetching passcode.",
        });
        console.error("Fetch passcode error:", error);
      } finally {
        setIsFetching(false);
      }
    };

    if (token) {
      fetchCurrentPasscode();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!newPasscode.trim()) {
      setMessage({ type: "error", text: "New passcode cannot be empty." });
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setMessage({ type: "error", text: "Passcodes do not match." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/quiz-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ passcode: newPasscode.trim() }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "Passcode updated successfully!" });
        setCurrentPasscode(data.passcode);
        setNewPasscode(data.passcode);
        setConfirmPasscode("");
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to update passcode.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while updating passcode.",
      });
      console.error("Update passcode error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Quiz Passcode Settings
        </CardTitle>
        <CardDescription>
          Manage the passcode required for users to start the quiz.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isFetching ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#F0C93B]"></div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Current Passcode:
            </p>
            <p
              className={`text-lg font-semibold ${
                currentPasscode === "Not set"
                  ? "text-gray-500 italic"
                  : "text-gray-900"
              }`}
            >
              {currentPasscode}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="newPasscode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Passcode
            </label>
            <Input
              id="newPasscode"
              type="password"
              placeholder="Enter new passcode"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
              className="text-lg"
              disabled={isFetching}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPasscode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Passcode
            </label>
            <Input
              id="confirmPasscode"
              type="password"
              placeholder="Confirm new passcode"
              value={confirmPasscode}
              onChange={(e) => setConfirmPasscode(e.target.value)}
              className="text-lg"
              disabled={isFetching}
            />
          </div>

          {message.text && (
            <p
              className={`text-sm text-center font-medium ${
                message.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-[#F0C93B] hover:bg-[#e0b92b] text-black text-base py-3"
            disabled={isLoading || isFetching}
          >
            {isLoading ? "Updating..." : "Update Passcode"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
