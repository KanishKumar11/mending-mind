"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import confettiAnimation from "../../../public/confetti.json";

const SectionPopup = ({ data, language, onContinue, isOpen }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Show confetti animation after a short delay
      const timer = setTimeout(() => {
        setShowConfetti(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onContinue}
          />

          {/* Confetti animation */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <Lottie
                animationData={confettiAnimation}
                loop={false}
                autoplay={true}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          )}

          {/* Popup content */}
          <motion.div
            className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden w-full max-w-md z-20 relative border border-[#B4E0E0]/30"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Decorative top bar with gradient */}
            <div className="h-2 bg-gradient-to-r from-[#B4E0E0] via-[#9A8BC5] to-[#F58D6F]" />

            {/* Background decorative elements */}
            <div className="absolute top-12 right-6 w-20 h-20 rounded-full bg-[#B4E0E0]/10 -z-10" />
            <div className="absolute bottom-12 left-6 w-16 h-16 rounded-full bg-[#F58D6F]/10 -z-10" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-[#9A8BC5]/5 -z-10" />

            <div className="p-6 flex flex-col items-center">
              {/* Section image */}
              <motion.h2
                className="text-2xl font-bold mb-3 text-center bg-gradient-to-r from-[#D15B3B] to-[#9A8BC5] text-transparent bg-clip-text"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {data[language].title}
              </motion.h2>

              {/* Section subtitle */}
              <motion.p
                className="text-[#1E1E1E]/70 text-center font-medium mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {data[language].subtitle}
              </motion.p>
              <motion.div
                className="relative w-64 h-64 mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Image
                  src={data[language].image}
                  alt="Section illustration"
                  fill
                  className="object-contain"
                />

                {/* Animated ring around the image */}
                <motion.div
                  className="absolute inset-0 border-4 border-[#B4E0E0]/30 rounded-full"
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
              </motion.div>

              {/* Section title */}

              {/* Continue button */}
              <motion.button
                onClick={onContinue}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-full font-medium shadow-md hover:shadow-lg relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 17,
                  delay: 0.5,
                  duration: 0.5,
                }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.4 }}
                />
                <span className="relative flex items-center justify-center">
                  {language === "en" ? "Continue" : "जारी रखें"}
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ x: 0 }}
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </motion.svg>
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SectionPopup;
