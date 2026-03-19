import { useState, useRef, useCallback } from "react";
import { transcribeAudio } from "@/services/voice";

interface UseVoiceInputOptions {
  onResult: (text: string) => void;
  preferBackend?: boolean;
}

export function useVoiceInput({ onResult, preferBackend }: UseVoiceInputOptions) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<unknown>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);

  const startBrowserRecognition = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return false;

    const recognition = new SpeechRecognition();
    recognition.lang = "de-DE";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    return true;
  }, [onResult]);

  const startBackendRecognition = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: recorder.mimeType });
        try {
          const res = await transcribeAudio(blob);
          onResult(res.transcript);
        } catch (err) {
          console.error("Backend transcription error:", err);
        }
        setIsListening(false);
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsListening(true);
      return true;
    } catch {
      return false;
    }
  }, [onResult]);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      (recognitionRef.current as any)?.stop();
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (preferBackend) {
      const ok = await startBackendRecognition();
      if (ok) return;
    }

    const browserOk = startBrowserRecognition();
    if (!browserOk) {
      // Browser API not available, try backend as fallback
      const ok = await startBackendRecognition();
      if (!ok) {
        alert("Spracherkennung wird von deinem Browser nicht unterstützt.");
      }
    }
  }, [
    isListening,
    preferBackend,
    startBrowserRecognition,
    startBackendRecognition,
  ]);

  return { isListening, toggleListening };
}
