"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function SuccessAnimation() {
  return (
    <div className="relative flex items-center justify-center py-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"
      >
        <CheckCircle2 className="h-16 w-16" />
      </motion.div>
      {Array.from({ length: 8 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-3 w-3 rounded-full bg-primary"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            x: Math.cos((index / 8) * Math.PI * 2) * 80,
            y: Math.sin((index / 8) * Math.PI * 2) * 80,
          }}
          transition={{
            duration: 1.2,
            delay: 0.2 + index * 0.05,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
