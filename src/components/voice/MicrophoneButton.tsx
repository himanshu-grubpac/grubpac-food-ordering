"use client";

import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicrophoneButtonProps {
  isListening: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function MicrophoneButton({
  isListening,
  disabled,
  onClick,
}: MicrophoneButtonProps) {
  return (
    <div className="relative flex items-center justify-center">
      {isListening && (
        <>
          <motion.span
            className="absolute h-24 w-24 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
          <motion.span
            className="absolute h-32 w-32 rounded-full bg-primary/10"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: 0.2 }}
          />
        </>
      )}
      <button
        type="button"
        aria-label={isListening ? "Stop listening" : "Start voice ordering"}
        aria-pressed={isListening}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary to-orange-500 text-primary-foreground shadow-2xl transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50",
          isListening && "ring-4 ring-primary/30"
        )}
      >
        <Mic className="h-10 w-10" />
      </button>
    </div>
  );
}
