import { DeepgramClient } from "@deepgram/sdk";

export type TranscriptHandler = (text: string, isFinal: boolean) => void;
export type ErrorHandler = (message: string) => void;
export type StatusHandler = (listening: boolean) => void;

type ListenConnection = Awaited<
  ReturnType<DeepgramClient["listen"]["v1"]["connect"]>
>;

export class DeepgramService {
  private connection: ListenConnection | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private listening = false;
  private isStopping = false;

  hasApiKey(): boolean {
    return Boolean(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);
  }

  isListening(): boolean {
    return this.listening;
  }

  async start(
    onTranscript: TranscriptHandler,
    onError: ErrorHandler,
    onStatus: StatusHandler
  ): Promise<void> {
    const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;

    if (!apiKey) {
      onError(
        "Deepgram API key is missing. Add NEXT_PUBLIC_DEEPGRAM_API_KEY to .env.local"
      );
      return;
    }

    if (this.listening) return;

    this.isStopping = false;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      const client = new DeepgramClient({ apiKey });
      this.connection = await client.listen.v1.connect({
        model: "nova-2",
        language: "en-IN",
        smart_format: "true",
        interim_results: "true",
        punctuate: "true",
        Authorization: apiKey,
      });

      this.connection.on("open", () => {
        if (!this.mediaStream || !this.connection) return;

        const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm";

        this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType });

        this.mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0 && this.connection) {
            this.connection.sendMedia(event.data);
          }
        });

        this.mediaRecorder.start(250);
        this.listening = true;
        onStatus(true);
      });

      this.connection.on("message", (data) => {
        if (data.type !== "Results") return;

        const transcript =
          data.channel?.alternatives?.[0]?.transcript?.trim() ?? "";

        if (transcript) {
          onTranscript(transcript, Boolean(data.is_final));
        }
      });

      this.connection.on("error", (error) => {
        onError(error.message || "Deepgram connection error. Please try again.");
        void this.stop(onStatus);
      });

      this.connection.on("close", () => {
        if (this.isStopping) return;
        void this.stop(onStatus);
      });

      this.connection.connect();
      await this.connection.waitForOpen();
    } catch {
      onError("Microphone access denied or unavailable.");
      await this.stop(onStatus);
    }
  }

  async stop(onStatus?: StatusHandler): Promise<void> {
    if (this.isStopping) return;
    this.isStopping = true;

    this.listening = false;
    onStatus?.(false);

    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    this.mediaRecorder = null;

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    const connection = this.connection;
    this.connection = null;

    if (connection) {
      try {
        connection.sendCloseStream({ type: "CloseStream" });
      } catch {
        // Connection may already be closed.
      }
      try {
        connection.close();
      } catch {
        // Connection may already be closed.
      }
    }

    this.isStopping = false;
  }
}

export const deepgramService = new DeepgramService();
