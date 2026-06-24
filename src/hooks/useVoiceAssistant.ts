"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AgentMicrophone,
  AgentPlayer,
  AgentSession,
  type ConversationTextMessage,
} from "@deepgram/agents";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import {
  executeAgentFunction,
  type AgentActionContext,
} from "@/lib/voice/agentActions";
import { buildAgentSettings } from "@/lib/voice/agentConfig";
import {
  hasVoiceAgentCredentials,
  resolveAgentAuth,
} from "@/lib/voice/resolveAgentAuth";

export type AgentUiStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking"
  | "error";

export interface ConversationLine {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function useVoiceAssistant() {
  const router = useRouter();
  const cart = useCart();

  const [isActive, setIsActive] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentUiStatus>("idle");
  const [conversation, setConversation] = useState<ConversationLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(hasVoiceAgentCredentials());

  const sessionRef = useRef<AgentSession | null>(null);
  const micRef = useRef<AgentMicrophone | null>(null);
  const playerRef = useRef<AgentPlayer | null>(null);
  const lineIdRef = useRef(0);

  const scrollToCart = useCallback(() => {
    document.getElementById("cart-panel")?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, []);

  const appendConversation = useCallback((message: ConversationTextMessage) => {
    if (!message.content?.trim()) return;
    const role = message.role === "user" ? "user" : "assistant";
    lineIdRef.current += 1;
    setConversation((prev) => [
      ...prev,
      {
        id: `${role}-${lineIdRef.current}`,
        role,
        content: message.content.trim(),
      },
    ]);
  }, []);

  const buildActionContext = useCallback((): AgentActionContext => {
    return {
      menuItems: cart.menuItems,
      items: cart.items,
      itemCount: cart.itemCount,
      grandTotal: cart.grandTotal,
      addItem: cart.addItem,
      removeItem: cart.removeItem,
      clearCart: cart.clearCart,
      setSearchQuery: cart.setSearchQuery,
      setCategoryFilter: cart.setCategoryFilter,
      scrollToCart,
      goToCheckout: () => router.push("/checkout"),
    };
  }, [cart, scrollToCart, router]);

  // Session handlers are registered once at connect; keep cart reads fresh.
  const buildActionContextRef = useRef(buildActionContext);
  useEffect(() => {
    buildActionContextRef.current = buildActionContext;
  }, [buildActionContext]);

  const stopMedia = useCallback(() => {
    micRef.current?.stop();
    micRef.current = null;
    playerRef.current?.dispose();
    playerRef.current = null;
  }, []);

  const teardown = useCallback(() => {
    const session = sessionRef.current;
    sessionRef.current = null;
    stopMedia();
    session?.disconnect();
    setIsActive(false);
    setAgentStatus("idle");
  }, [stopMedia]);

  const toggleListening = useCallback(async () => {
    setError(null);

    if (isActive) {
      teardown();
      return;
    }

    setAgentStatus("connecting");

    let auth;
    try {
      auth = await resolveAgentAuth();
      setHasApiKey(true);
    } catch (err) {
      setHasApiKey(false);
      setAgentStatus("error");
      setError(
        err instanceof Error ? err.message : "Voice agent is not configured."
      );
      return;
    }

    try {
      const session = new AgentSession({
        auth,
        agent: buildAgentSettings(cart.menuItems),
        audio: {
          input: { encoding: "linear16", sampleRate: 48000 },
          output: { encoding: "linear16", sampleRate: 24000 },
        },
        reconnect: { enabled: false },
        tags: ["grubpac-kitchen"],
      });

      const player = new AgentPlayer({ sampleRate: 24000 });
      const mic = new AgentMicrophone(
        (data) => session.sendAudio(data),
        {
          sampleRate: 48000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      );

      session.on("connecting", () => setAgentStatus("connecting"));
      session.on("connected", () => {
        setIsActive(true);
        setAgentStatus("listening");
      });

      session.on("conversation-text", (message) => {
        appendConversation(message);
      });

      session.on("user-started-speaking", () => {
        player.interrupt();
        setAgentStatus("listening");
      });

      session.on("agent-thinking", () => setAgentStatus("thinking"));

      session.on("agent-started-speaking", () => setAgentStatus("speaking"));

      session.on("agent-audio-done", () => {
        if (session.state === "connected") setAgentStatus("listening");
      });

      session.on("audio", (chunk) => player.queue(chunk));

      session.on("function-call-request", (message) => {
        const ctx = buildActionContextRef.current();
        for (const fn of message.functions) {
          if (!fn.client_side) continue;

          let args: Record<string, unknown> = {};
          try {
            args = JSON.parse(fn.arguments) as Record<string, unknown>;
          } catch {
            args = {};
          }

          const result = executeAgentFunction(fn.name, args, ctx);
          session.sendFunctionCallResponse(fn.id, fn.name, result);
        }
      });

      session.on("error", (message) => {
        setError(message.description ?? "Voice agent error.");
        setAgentStatus("error");
        teardown();
      });

      session.on("sdk-error", (err) => {
        setError(err.message);
        setAgentStatus("error");
        teardown();
      });

      session.on("disconnected", () => {
        // Intentional teardown clears sessionRef before disconnect; only handle remote drops.
        if (!sessionRef.current) return;
        sessionRef.current = null;
        stopMedia();
        setIsActive(false);
        setAgentStatus("idle");
      });

      sessionRef.current = session;
      playerRef.current = player;
      micRef.current = mic;

      setConversation([]);
      await session.connect();
      await mic.start();
    } catch (err) {
      teardown();
      setAgentStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Failed to start the voice agent."
      );
    }
  }, [
    isActive,
    cart.menuItems,
    appendConversation,
    stopMedia,
    teardown,
  ]);

  useEffect(() => {
    return () => {
      teardown();
    };
  }, [teardown]);

  const latestUserLine = [...conversation]
    .reverse()
    .find((line) => line.role === "user");
  const latestAssistantLine = [...conversation]
    .reverse()
    .find((line) => line.role === "assistant");

  return {
    isListening: isActive,
    isActive,
    agentStatus,
    conversation,
    interimTranscript:
      agentStatus === "listening" ? latestUserLine?.content ?? "" : "",
    finalTranscript: latestUserLine?.content ?? "",
    voiceFeedback: latestAssistantLine?.content ?? null,
    error,
    hasApiKey,
    toggleListening,
  };
}
