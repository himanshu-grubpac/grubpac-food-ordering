"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Bot, Loader2, Sparkles, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MicrophoneButton } from "@/components/voice/MicrophoneButton";
import {
  useVoiceAssistant,
  type AgentUiStatus,
} from "@/hooks/useVoiceAssistant";
import { cn } from "@/lib/utils";

const commandHints = [
  "Hey, I want a cheese burger",
  "Show me pizzas",
  "What's in my cart?",
  "Place my order",
];

const statusLabels: Record<AgentUiStatus, string> = {
  idle: "Tap to talk with your ordering assistant",
  connecting: "Connecting to voice agent…",
  listening: "Listening — speak naturally",
  thinking: "Thinking…",
  speaking: "Assistant is speaking…",
  navigating: "Taking you to checkout…",
  error: "Voice agent error",
};

export function VoiceAssistantCard() {
  const {
    isListening,
    agentStatus,
    conversation,
    error,
    hasApiKey,
    isNavigatingToCheckout,
    toggleListening,
  } = useVoiceAssistant();

  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = conversationRef.current;
    if (!el || conversation.length === 0) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [conversation, agentStatus]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-card via-card to-primary/10 dark:border-primary/40 dark:from-card dark:via-secondary/40 dark:to-primary/10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium uppercase tracking-wider">
              AI Voice Agent
            </span>
          </div>
          <CardTitle>Order with conversation</CardTitle>
          <CardDescription>
            Powered by Deepgram Voice Agent. Speak naturally — the assistant
            will add items, search the menu, and take you to checkout.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pb-8">
          <MicrophoneButton
            isListening={isListening}
            disabled={!hasApiKey}
            onClick={toggleListening}
          />

          <p
            className={cn(
              "text-sm font-medium",
              agentStatus === "listening" ||
                agentStatus === "speaking" ||
                agentStatus === "navigating"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {!hasApiKey
              ? "Voice disabled — add NEXT_PUBLIC_DEEPGRAM_API_KEY to .env.local"
              : statusLabels[agentStatus]}
          </p>

          <div
            ref={conversationRef}
            className="max-h-64 w-full max-w-xl overflow-y-auto rounded-xl border border-border bg-muted/60 px-4 py-3 scroll-smooth dark:bg-secondary/70"
            role="log"
            aria-live="polite"
            aria-label="Voice conversation"
          >
            {conversation.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">
                Your conversation with the assistant will appear here.
              </p>
            ) : (
              <AnimatePresence initial={false}>
                <div className="space-y-3">
                  {conversation.map((line) => (
                    <motion.div
                      key={line.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-2 text-sm",
                        line.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {line.role === "assistant" && (
                        <Bot className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      )}
                      <p
                        className={cn(
                          "max-w-[85%] rounded-xl px-3 py-2",
                          line.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-foreground shadow-sm"
                        )}
                      >
                        {line.content}
                      </p>
                      {line.role === "user" && (
                        <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>

          <AnimatePresence>
            {isNavigatingToCheckout && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-background/85 backdrop-blur-sm"
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Preparing checkout…
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {commandHints.map((hint) => (
              <span
                key={hint}
                className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground dark:bg-secondary"
              >
                &quot;{hint}&quot;
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
