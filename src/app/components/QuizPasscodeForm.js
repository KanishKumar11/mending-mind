"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import Image from "next/image";

export default function QuizPasscodeForm({ onAuthenticated }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [storedPasscode, setStoredPasscode] = useState(null);

  useEffect(() => {
    // Fetch the passcode when the component mounts
    const fetchPasscode = async () => {
      try {
        const response = await fetch("/api/quiz-settings");
        const data = await response.json();
        if (data.success && data.passcode) {
          setStoredPasscode(data.passcode);
        } else if (data.success && data.passcode === null) {
          // No passcode set in DB, allow access or show error based on requirements
          // For now, let's assume if no passcode is set, access is granted.
          // You might want to change this behavior.
          console.warn("No quiz passcode set in the database. Access denied.");
          setError(
            "Quiz passcode is not configured. Please contact administrator."
          );
          // Do not call onAuthenticated(true) here, effectively denying access.
        } else {
          setError(data.message || "Failed to fetch passcode settings.");
        }
      } catch (err) {
        setError("An error occurred while fetching passcode settings.");
        console.error("Fetch passcode error:", err);
      }
    };
    fetchPasscode();
  }, [onAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!pin) {
      setError("Please enter the passcode.");
      return;
    }

    if (storedPasscode === null) {
      // This case should ideally be handled by useEffect, but as a fallback:
      console.warn("No passcode was set. Access denied.");
      setError(
        "Quiz passcode is not configured. Please contact administrator."
      );
      setIsLoading(false); // Ensure loading state is reset
      return;
    }

    setIsLoading(true);

    // Simple client-side comparison.
    // For higher security, you might consider verifying against the API again.
    if (pin === storedPasscode) {
      onAuthenticated(true);
    } else {
      setError("Invalid passcode. Please try again.");
      setPin("");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-[380px] shadow-xl bg-white rounded-xl">
        <CardHeader className="space-y-2 flex flex-col items-center pt-8">
          <div className="w-full flex justify-center mb-6">
            <Image
              src="/Mind_Logo.png" // Assuming you have a logo
              alt="Mending Mind Logo"
              width={180}
              height={70}
              priority
              className="object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-center text-slate-800">
            Quiz Access
          </CardTitle>
          <CardDescription className="text-center text-slate-600 pt-1">
            Please enter the passcode to begin the assessment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-6 py-8">
          <form onSubmit={handleSubmit}>
            <div className="space-y-3">
              <Input
                id="pin"
                type="password" // Use password type for masking
                placeholder="Enter Passcode"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="text-center text-2xl tracking-widest h-14 rounded-lg border-slate-300 focus:border-sky-500 focus:ring-sky-500"
                // You might want to add maxLength if your passcodes have a fixed length
              />
              {error && (
                <p className="text-sm font-medium text-red-600 text-center pt-1">
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full mt-8 bg-[#F0C93B] hover:bg-[#e0b92b] text-black text-lg h-12 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={
                isLoading ||
                storedPasscode === undefined ||
                storedPasscode === null
              } // Disable if passcode is still loading OR not set
            >
              {isLoading ? "Verifying..." : "Start Quiz"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <p className="text-xs text-slate-500">
            If you don't have a passcode, please contact the administrator.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
