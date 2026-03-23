"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15, rotateX: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 1.05, y: -15, rotateX: -6 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
        mass: 0.8,
        bounce: 0.1,
      }}
      style={{
        originY: "50%",
        perspective: "1200px",
        willChange: "transform, opacity",
        transformStyle: "preserve-3d",
      }}
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
}
