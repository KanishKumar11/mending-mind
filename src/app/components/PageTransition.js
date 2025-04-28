// "use client";

// import { motion, AnimatePresence } from "motion/react";

// export default function PageTransition({ children }) {
//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         key={Math.random()}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -20 }}
//         transition={{ duration: 0.3 }}
//       >
//         {children}
//       </motion.div>
//     </AnimatePresence>
//   );
// }
import React from "react";

export default function PageTransition() {
  return <div>PageTransition</div>;
}
