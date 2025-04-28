"use client";

import React, { useState } from "react";
import WebDecisionStyleDisplay from "../components/WebDecisionStyleDisplay";
import { Slider } from "@/components/ui/slider";

export default function DecisionTestPage() {
  const [rationalScore, setRationalScore] = useState(18);
  const [intuitiveScore, setIntuitiveScore] = useState(22);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Decision Style Test</h1>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Adjust Rational Score</h2>
        <div className="flex items-center gap-4">
          <Slider
            value={[rationalScore]}
            min={0}
            max={25}
            step={1}
            onValueChange={(value) => setRationalScore(value[0])}
            className="w-full"
          />
          <span className="font-medium text-lg min-w-[50px] text-center">
            {rationalScore}
          </span>
        </div>

        <h2 className="text-lg font-semibold mb-2 mt-4">
          Adjust Intuitive Score
        </h2>
        <div className="flex items-center gap-4">
          <Slider
            value={[intuitiveScore]}
            min={0}
            max={25}
            step={1}
            onValueChange={(value) => setIntuitiveScore(value[0])}
            className="w-full"
          />
          <span className="font-medium text-lg min-w-[50px] text-center">
            {intuitiveScore}
          </span>
        </div>
      </div>

      <WebDecisionStyleDisplay
        rationalScore={rationalScore}
        intuitiveScore={intuitiveScore}
      />
    </div>
  );
}
