"use client";

import { useEffect, useRef } from "react";
import Lottie from "lottie-react";
import bulbAnimation from "../../../public/1.json";

const LottieAnimation = ({ width = 80, height = 80 }) => {
  return (
    <div style={{ width, height }} className="mix-blend-multiply">
      <Lottie
        animationData={bulbAnimation}
        loop={true}
        autoplay={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottieAnimation;
