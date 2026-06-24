type SpeechCallbacks = {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
};

class SpeechService {
  private speaking = false;

  isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  speak(text: string, callbacks?: SpeechCallbacks): void {
    if (!this.isSupported() || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => v.lang === "en-IN") ??
      voices.find((v) => v.lang.startsWith("en")) ??
      voices[0];

    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      this.speaking = true;
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      this.speaking = false;
      callbacks?.onEnd?.();
    };

    utterance.onerror = () => {
      this.speaking = false;
      callbacks?.onError?.("Speech synthesis failed.");
    };

    window.speechSynthesis.speak(utterance);
  }

  cancel(): void {
    if (!this.isSupported()) return;
    window.speechSynthesis.cancel();
    this.speaking = false;
  }

  getIsSpeaking(): boolean {
    return this.speaking;
  }
}

export const speechService = new SpeechService();
