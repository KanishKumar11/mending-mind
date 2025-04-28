"use client";

import React, { useState } from "react";
import WebResilienceScaleDisplay from "../components/WebResilienceScaleDisplay";
import { Slider } from "@/components/ui/slider";

export default function ResilienceTestPage() {
  const [score, setScore] = useState(65);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Resilience Scale Test</h1>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Adjust Resilience Score</h2>
        <div className="flex items-center gap-4">
          <Slider
            value={[score]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setScore(value[0])}
            className="w-full"
          />
          <span className="font-medium text-lg min-w-[50px] text-center">
            {score}
          </span>
        </div>
      </div>

      <WebResilienceScaleDisplay score={score} />
    </div>
  );
}
