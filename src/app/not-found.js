"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-[#D15B3B]">Page Not Found</h1>
        <p className="mb-8 text-gray-600">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link href="/" className="bg-[#B4E0E0] hover:bg-[#9A8BC5] text-[#1E1E1E] font-medium py-3 px-8 rounded-full shadow-md transition-all duration-300 inline-block">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
