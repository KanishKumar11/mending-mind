"use client";

import React from "react";
import Image from "next/image";

const AnxietyTips = () => {
  return (
    <div className="max-w-3xl mx-auto my-8 p-6 rounded-lg shadow-md bg-white">
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
        <h2 className="text-3xl font-bold text-[#FFBB33]">Tips for Anxiety Relief</h2>
      </div>
      
      <div className="bg-[#FFFAF0] p-6 rounded-lg border-l-4 border-[#FFBB33]">
        <ol className="list-decimal pl-5 space-y-3">
          <li className="text-gray-800">
            <span className="font-semibold">Deep Breathing:</span> Try the 4-7-8 technique: inhale for 4 seconds, hold for 7, exhale 8.
          </li>
          <li className="text-gray-800">
            <span className="font-semibold">Grounding Techniques:</span> Use the 5-4-3-2-1 method: identify 5 things you see, 4 you touch, 3 you hear, 2 you smell, and 1 you taste.
          </li>
          <li className="text-gray-800">
            <span className="font-semibold">Limit Stimulants:</span> Reduce caffeine and sugar; choose herbal teas or water.
          </li>
          <li className="text-gray-800">
            <span className="font-semibold">Create a Routine:</span> Establish a daily routine for structure and predictability.
          </li>
          <li className="text-gray-800">
            <span className="font-semibold">Adult Coloring Books:</span> Use coloring books for a soothing, meditative activity.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default AnxietyTips;
