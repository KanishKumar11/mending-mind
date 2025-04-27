"use client";

import React from "react";
import Image from "next/image";

const FinalReflections = () => {
  return (
    <div className="max-w-3xl mx-auto my-8">
      <div className="flex items-center mb-4">
        <div className="relative w-10 h-10 mr-3">
          <Image
            src="/bulb.png"
            alt="Light bulb"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold text-[#F0C93B]">Final Reflections</h2>
      </div>

      <div className="bg-[#FFFAF0] p-6 rounded-lg shadow-sm">
        <ol className="list-decimal pl-5 space-y-3">
          <li className="text-gray-800">
            <span className="font-semibold">Self-awareness sparks growth:</span>{" "}
            Noticing patterns is the first step toward change.
          </li>
          <li className="text-gray-800">
            <span className="font-semibold">There's no perfect score:</span>{" "}
            This is about progress, not perfection.
          </li>
          <li className="text-gray-800">
            <span className="font-semibold">Small steps shape big shifts:</span>{" "}
            Tiny actions lead to long-term impact.
          </li>
          <li className="text-gray-800">
            <span className="font-semibold">Support builds strength:</span> You
            don't have to do it all alone.
          </li>
          <li className="text-gray-800">
            <span className="font-semibold">Flexibility is power:</span>{" "}
            Adapting doesn't mean losing direction.
          </li>
          <li className="text-gray-800">
            <span className="font-semibold">
              You already have what you need:
            </span>{" "}
            Resilience, insight, and potential are all within you.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default FinalReflections;
