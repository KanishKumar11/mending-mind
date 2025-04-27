"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Error is handled silently
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-[#D15B3B]">
          Something went wrong
        </h1>
        <p className="mb-8 text-gray-600">
          We apologize for the inconvenience. Please try again or return to the
          home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-[#F58D6F] hover:bg-[#D15B3B] text-white font-medium py-3 px-8 rounded-full shadow-md transition-all duration-300"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-[#B4E0E0] hover:bg-[#9A8BC5] text-[#1E1E1E] font-medium py-3 px-8 rounded-full shadow-md transition-all duration-300 inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
