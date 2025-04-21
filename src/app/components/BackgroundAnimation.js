"use client";

import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import backgroundAnimation from "../../../public/2.json";

const BackgroundAnimation = () => {
  return (
    <div className="absolute bottom-0 z-0 w-full left-0 bg-background overflow-hidden">
      <Lottie
        animationData={backgroundAnimation}
        loop={true}
        autoplay={true}
        style={{
          width: "100%",
          height: "auto",
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
};

export default BackgroundAnimation;
