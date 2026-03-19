import { useState, useEffect, useRef, useCallback } from "react";
import { Check, ArrowRight, Send, Sparkles, Users, Briefcase, Mic, MicOff, GraduationCap, TrendingUp, MessageCircle, ExternalLink, BookOpen, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  sendThesinatorTurn,
  startThesinatorSession,
  type ContextSnapshot,
  type InputMode,
  type ThesinatorQuestion as BackendQuestion
} from "@/services/thesinator";
import thesinatorTalk1 from "@/assets/thesinator-talk1.png";
import thesinatorTalk2 from "@/assets/thesinator-talk2.png";
import thesinatorThinking from "@/assets/thesinator-thinking.png";
import speechBubbleBg from "@/assets/speech-bubble.png";
import futureGoogle from "@/assets/future-google.jpg";
import futureApple from "@/assets/future-apple.jpg";
import futureAws from "@/assets/future-aws.jpg";
import futureStartup from "@/assets/future-startup.jpg";
import futureConsulting from "@/assets/future-consulting.jpg";

const steps = [
{ id: 1, label: "Basic Info" },
{ id: 2, label: "Thesinator" },
{ id: 3, label: "Thesis Matching" },
{ id: 4, label: "Simulation" },
{ id: 5, label: "Results" }];


const scenarios = [
{
  image: futureGoogle,
  company: "Google",
  role: "Senior Software Engineer",
  probability: 78,
  thesis: "Machine Learning in Search Optimization",
  thesisExplanation: "This thesis explores how machine learning can improve the relevance and efficiency of search algorithms, a core part of Google's business model.",
  whyThesisFits: "Your strengths in AI and data analysis align directly with this role. The thesis gives you hands-on experience with technologies Google uses every day.",
  careerSteps: ["Internship at Google (6 months)", "Junior ML Engineer (1-2 years)", "Mid-Level Engineer with specialization (2-3 years)", "Senior Software Engineer (from year 4)"],
  alumni: [
    { name: "Dr. Maria Schmidt", role: "Research Scientist at Google", linkedIn: "#" },
    { name: "Jonas Weber", role: "ML Engineer at Google DeepMind", linkedIn: "#" }
  ],
  professors: [
    { name: "Prof. Dr. Weber", field: "Machine Learning Lab, TU Munich", link: "#" },
    { name: "Prof. Dr. Hoffmann", field: "Data Science, TU Munich", link: "#" }
  ],
  simulationDescription: "In this simulation, you start after your thesis as an intern on the Google Search Quality team in Zurich. Within 5 years, you grow into a Senior Engineer leading a team of 8 and building the next generation of search."
},
{
  image: futureApple,
  company: "Apple",
  role: "UX Research Lead",
  probability: 72,
  thesis: "Human-Computer Interaction in Wearables",
  thesisExplanation: "This thesis explores intuitive interaction patterns for wearable devices and their impact on user satisfaction and health monitoring.",
  whyThesisFits: "Your focus on usability and design thinking makes you a great fit for Apple's HCI team. The thesis teaches methods Apple uses when developing products like Apple Watch and Vision Pro.",
  careerSteps: ["UX Research Intern at Apple (6 months)", "Junior UX Researcher (1-2 years)", "UX Researcher with project leadership (2-3 years)", "UX Research Lead (from year 4)"],
  alumni: [
    { name: "Lisa Chen", role: "Senior UX Designer at Apple", linkedIn: "#" },
    { name: "Anna Berger", role: "Product Designer at Apple", linkedIn: "#" }
  ],
  professors: [
    { name: "Prof. Dr. Müller", field: "HCI Lab, TU Munich", link: "#" },
    { name: "Prof. Dr. Kern", field: "Usability Engineering, TU Munich", link: "#" }
  ],
  simulationDescription: "You begin as a UX Research Intern in Apple's Human Interface team in Cupertino. After 5 years, you lead a research team shaping interaction concepts for Apple's next generation of wearables."
},
{
  image: futureAws,
  company: "Amazon AWS",
  role: "Cloud Solutions Architect",
  probability: 85,
  thesis: "Scalable Distributed Systems Architecture",
  thesisExplanation: "This thesis analyzes architecture patterns for highly scalable distributed systems and their use in cloud infrastructure.",
  whyThesisFits: "Your experience with cloud technologies and distributed systems is a strong fit for AWS. This thesis prepares you for the technical challenges AWS customers solve every day.",
  careerSteps: ["AWS Solutions Architect Associate (1 year)", "Solutions Architect with specialization (1-2 years)", "Senior Solutions Architect (2-3 years)", "Principal Architect (from year 5)"],
  alumni: [
    { name: "Tom Baker", role: "Principal Architect at AWS", linkedIn: "#" },
    { name: "Markus Stein", role: "Solutions Architect at AWS Munich", linkedIn: "#" }
  ],
  professors: [
    { name: "Prof. Dr. Klein", field: "Distributed Systems, TU Munich", link: "#" },
    { name: "Prof. Dr. Bauer", field: "Cloud Computing, TU Munich", link: "#" }
  ],
  simulationDescription: "After your thesis, you join AWS in Munich as an Associate Solutions Architect. You advise enterprise clients on cloud migration and are promoted to Principal Architect within 5 years."
},
{
  image: futureStartup,
  company: "Own Startup",
  role: "CEO & Co-Founder",
  probability: 45,
  thesis: "Digital Platform Economics in EdTech",
  thesisExplanation: "This thesis examines business models and network effects of digital platforms in education, providing a theoretical foundation for your own EdTech startup.",
  whyThesisFits: "Your entrepreneurial mindset and interest in EdTech can translate into building your own startup. The thesis gives you a strategic framework and market understanding for launching.",
  careerSteps: ["Use thesis as market validation", "Join the TUM Incubator (6 months)", "Secure pre-seed funding (year 1)", "Reach product-market fit (year 2)", "Series A and scaling (years 3-5)"],
  alumni: [
    { name: "Sarah Venture", role: "VC Partner at Earlybird", linkedIn: "#" },
    { name: "Max Innovation", role: "Founder at TechHub Munich", linkedIn: "#" }
  ],
  professors: [
    { name: "Prof. Dr. Krcmar", field: "Entrepreneurship, TU Munich", link: "#" },
    { name: "Prof. Dr. Welpe", field: "Strategy & Innovation, TU Munich", link: "#" }
  ],
  simulationDescription: "You use your thesis as the foundation for an EdTech startup. Through the TUM Incubator, you find a co-founder, secure pre-seed funding, and build a platform with 50,000 users within 3 years."
},
{
  image: futureConsulting,
  company: "McKinsey",
  role: "Associate Consultant",
  probability: 68,
  thesis: "Digital Transformation in Traditional Industries",
  thesisExplanation: "This thesis analyzes success factors and barriers in digital transformation across established industries, the exact challenge consulting firms tackle with clients.",
  whyThesisFits: "Your analytical skills and industry perspective are a strong fit for strategy consulting. This thesis gives you a deep understanding of the challenges McKinsey clients face.",
  careerSteps: ["McKinsey Business Analyst (1 year)", "Associate Consultant (1-2 years)", "Engagement Manager (years 3-4)", "Associate Partner (from year 5)"],
  alumni: [
    { name: "Dr. Fischer", role: "Partner at McKinsey Digital", linkedIn: "#" },
    { name: "Julia Krause", role: "Engagement Manager at McKinsey", linkedIn: "#" }
  ],
  professors: [
    { name: "Prof. Dr. Braun", field: "Strategic Management, TU Munich", link: "#" },
    { name: "Prof. Dr. Lanzinner", field: "Digital Business, TU Munich", link: "#" }
  ],
  simulationDescription: "You start as a Business Analyst at McKinsey in Munich and work on digital transformation projects for automotive clients. After 5 years, you are an Engagement Manager leading multi-million budget projects."
}];


const thesinatorQuestions = [
  {
    id: 1,
    question: "Which area fascinates you the most?",
    options: ["Technology & IT", "Business & Management", "Design & Creativity", "Research & Science", "Social Impact & Society"]
  },
  {
    id: 2,
    question: "How important is practical relevance in your thesis?",
    options: ["Very important", "Important", "Neutral", "Less important", "Not important"]
  },
  {
    id: 3,
    question: "Do you want to collaborate with a company?",
    options: ["Yes, definitely", "Probably yes", "Not sure", "Probably not", "No"]
  },
  {
    id: 4,
    question: "Which methodology do you prefer?",
    options: ["Quantitative (Data & Statistics)", "Qualitative (Interviews & Analysis)", "Mixed Methods", "Design-Based (Prototyping)", "No Preference"]
  },
  {
    id: 5,
    question: "Where do you see yourself after graduation?",
    options: ["Large Company (Google, Apple...)", "Founding a Startup", "Consulting (McKinsey...)", "Research & Academia", "Still Unsure"]
  },
  {
    id: 6,
    question: "How long should your thesis approximately take?",
    options: ["3 months", "4-5 months", "6 months", "Longer than 6 months", "Flexible"]
  },
  {
    id: 7,
    question: "Which topic excites you the most?",
    options: ["Artificial Intelligence", "Sustainability & Green Tech", "Digital Transformation", "Platform Economics", "Cybersecurity"]
  }
];

const ThesisFinder = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  return (
    <div className="flex-1 min-h-screen w-full min-w-0">
      <header className="border-b border-border">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="ds-title-lg">Thesinator</h1>
          <p className="ds-small text-muted-foreground mt-1">Find your ideal thesis in 5 steps</p>
        </div>
      </header>

      {/* Progress bar */}
      <div className="border-b border-border">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <div className="flex min-w-[640px] items-center justify-between">
              {steps.map((step, i) =>
              <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ds-label transition-all duration-300 ${
                    step.id < currentStep ?
                    "bg-primary text-primary-foreground" :
                    step.id === currentStep ?
                    "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                    "bg-muted text-muted-foreground"}`
                    }>
                    
                      {step.id < currentStep ? <Check size={18} /> : step.id}
                    </div>
                    <span className={`ds-caption mt-2 ${step.id <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 &&
                <div
                  className={`w-16 h-0.5 mx-2 mt-[-20px] transition-colors duration-300 ${
                  step.id < currentStep ? "bg-primary" : "bg-border"}`
                  } />

                }
              </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step content */}
      <main className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 animate-fade-in" key={currentStep}>
        {currentStep === 1 && <StepBasicInfo onNext={handleNextStep} />}
        {currentStep === 2 && <StepGenieChat onNext={handleNextStep} />}
        {currentStep === 3 && <StepMatching onNext={handleNextStep} />}
        {currentStep === 4 && <StepSimulation onNext={handleNextStep} />}
        {currentStep === 5 && <StepResults />}
      </main>
    </div>);

};

/* Step 1 */
const StepBasicInfo = ({ onNext }: {onNext: () => void;}) =>
<div className="mx-auto max-w-2xl">
    <h2 className="ds-title-md mb-6">Your Basic Information</h2>
    <div className="bg-card border border-border rounded-lg p-6 max-w-lg mx-auto">
      <div className="space-y-4">
        {[
      { label: "Name", value: "Sebastian Hahn" },
      { label: "University", value: "Technical University of Munich" },
      { label: "Program", value: "Information Systems (M.Sc.)" },
      { label: "Semester", value: "3rd semester" },
      { label: "Email", value: "sebastian.hahn@student.tum.de" }].
      map((field) =>
      <div key={field.label}>
            <label className="ds-label text-muted-foreground">{field.label}</label>
            <p className="ds-body mt-1 text-foreground">{field.value}</p>
          </div>
      )}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Check size={16} className="text-primary" />
        <span className="ds-small text-muted-foreground">Automatically imported from your registration</span>
      </div>
    </div>
    <Button onClick={onNext} className="mt-6 rounded-full gap-2">
      Continue to Thesinator <ArrowRight size={16} />
    </Button>
  </div>;


/* Thesinator Avatar with animated states */
const ThesinatorAvatar = ({ isTyping, isSpeaking }: {isTyping: boolean;isSpeaking: boolean;}) => {
  const [talkFrame, setTalkFrame] = useState(0);

  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setTalkFrame((prev) => prev === 0 ? 1 : 0);
      }, 400);
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);

  const currentImage = isTyping ?
  thesinatorThinking :
  isSpeaking ?
  talkFrame === 0 ?
  thesinatorTalk1 :
  thesinatorTalk2 :
  thesinatorTalk1;

  return (
    <div className="flex-shrink-0 flex flex-col items-center">
      <div className="animate-genie-float relative">
         <img
           src={currentImage}
           alt="Thesinator"
           className="h-56 w-56 object-contain transition-opacity duration-200 sm:h-72 sm:w-72 xl:h-80 xl:w-80" />
        
        <div className="absolute -top-2 -right-2 animate-sparkle">
          <Sparkles size={20} className="text-ai-from" />
        </div>
        <div className="absolute -bottom-1 -left-3 animate-sparkle" style={{ animationDelay: "0.7s" }}>
          <Sparkles size={16} className="text-ai-from" />
        </div>
        <div className="absolute top-4 -left-4 animate-sparkle" style={{ animationDelay: "1.4s" }}>
          <Sparkles size={14} className="text-ai-from" />
        </div>
      </div>
      <p className="ds-label text-foreground mt-3">Thesinator</p>
    </div>);

};

/* Speech Bubble */
const SpeechBubble = ({ text }: {text: string;}) =>
<div className="relative mb-4 max-w-2xl">
    <img
    src={speechBubbleBg}
    alt="Speech bubble"
    className="absolute inset-0 h-full w-full object-cover opacity-20 pointer-events-none" />
  <div className="relative rounded-xl border border-border bg-card/90 px-5 py-4 shadow-sm">
    <p className="ds-body whitespace-pre-line text-foreground">{text}</p>
  </div>
  </div>;

const inputModeLabels: Record<InputMode, string> = {
  mcq: "MCQ",
  text: "TEXT",
  speech: "SPEECH",
};

const UserSpeechBubble = ({
  text,
  isLive,
  modeLabel,
}: {
  text: string;
  isLive?: boolean;
  modeLabel?: string;
}) =>
<div className="relative mb-4 ml-auto max-w-2xl">
    <div className="relative rounded-xl border border-primary/30 bg-primary/5 px-5 py-4 shadow-sm">
      {modeLabel &&
      <p className="mb-1 ds-caption text-primary font-semibold tracking-wide">{modeLabel}</p>
      }
      <p className="ds-body whitespace-pre-line text-foreground">{text}</p>
      {isLive &&
      <p className="mt-1 ds-caption text-muted-foreground">Listening...</p>
      }
    </div>
  </div>;


/* Voice Input Hook */
type SpeechRecognitionResultItem = {
  transcript: string;
};

type SpeechRecognitionResultShape = ArrayLike<SpeechRecognitionResultItem> & {
  isFinal: boolean;
};

type SpeechRecognitionEventShape = {
  results: ArrayLike<SpeechRecognitionResultShape>;
};

type SpeechRecognitionErrorEventShape = {
  error: string;
  message?: string;
};

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventShape) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventShape) => void) | null;
  onend: (() => void) | null;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

const useVoiceInput = (onResult: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const manuallyStoppedRef = useRef(false);
  const finalTranscriptRef = useRef("");
  const lastLiveTranscriptRef = useRef("");
  const transcriptDeliveredRef = useRef(false);

  const clearSpeechError = () => setSpeechError(null);

  const stopListening = () => {
    if (recognitionRef.current) {
      manuallyStoppedRef.current = true;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      return;
    }

    const speechWindow = window as Window & {
      SpeechRecognition?: BrowserSpeechRecognitionConstructor;
      webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
    };

    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError(
        "Speech recognition is not supported in this browser. You can still answer with text or options.",
      );
      return;
    }

    clearSpeechError();
    setLiveTranscript("");
    finalTranscriptRef.current = "";
    lastLiveTranscriptRef.current = "";
    transcriptDeliveredRef.current = false;
    manuallyStoppedRef.current = false;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEventShape) => {
      const finalParts: string[] = [];
      const interimParts: string[] = [];

      for (let index = 0; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result?.[0]?.transcript?.trim() ?? "";
        if (!transcript) {
          continue;
        }

        if (result.isFinal) {
          finalParts.push(transcript);
        } else {
          interimParts.push(transcript);
        }
      }

      const finalTranscript = finalParts.join(" ").trim();
      if (finalTranscript) {
        finalTranscriptRef.current = finalTranscript;
      }

      const live = [finalTranscript || finalTranscriptRef.current, interimParts.join(" ").trim()]
        .filter(Boolean)
        .join(" ")
        .trim();
      lastLiveTranscriptRef.current = live;
      setLiveTranscript(live);
      clearSpeechError();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventShape) => {
      setIsListening(false);
      setLiveTranscript("");
      lastLiveTranscriptRef.current = "";
      recognitionRef.current = null;

      if (event.error === "aborted" && manuallyStoppedRef.current) {
        manuallyStoppedRef.current = false;
        return;
      }

      manuallyStoppedRef.current = false;

      switch (event.error) {
        case "not-allowed":
        case "service-not-allowed":
          setSpeechError("Microphone access was denied. Please allow microphone access and try again.");
          break;
        case "no-speech":
          setSpeechError("No speech detected. Please speak clearly and try again.");
          break;
        case "aborted":
          setSpeechError("Voice input was interrupted. Please try again.");
          break;
        default:
          setSpeechError("Voice recognition failed. Please try again or answer with text.");
          break;
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      manuallyStoppedRef.current = false;

      const finalTranscript = finalTranscriptRef.current.trim() || lastLiveTranscriptRef.current.trim();
      if (finalTranscript && !transcriptDeliveredRef.current) {
        transcriptDeliveredRef.current = true;
        setLiveTranscript(finalTranscript);
        onResult(finalTranscript);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      recognitionRef.current = null;
      setIsListening(false);
      setLiveTranscript("");
      lastLiveTranscriptRef.current = "";
      manuallyStoppedRef.current = false;
      setSpeechError("Could not start voice input. Please try again or answer with text.");
    }
  };

  return { isListening, liveTranscript, speechError, toggleListening, stopListening };
};

/* Step 2 */
type ConversationTurn = {
  question: BackendQuestion;
  assistantMessage: string;
  userAnswer: {
    text: string;
    inputMode: InputMode;
  } | null;
};

const StepGenieChat = ({ onNext }: {onNext: () => void;}) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalAssistantMessage, setFinalAssistantMessage] = useState<string | null>(null);
  const [contextSnapshot, setContextSnapshot] = useState<ContextSnapshot | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const conversationScrollRef = useRef<HTMLDivElement | null>(null);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  const activeTurn = !isComplete && turns.length > 0 ? turns[turns.length - 1] : null;
  const activeQuestion = activeTurn?.question ?? null;

  const playAudio = useCallback((audioBase64: string | null) => {
    if (!audioBase64) {
      setIsSpeaking(false);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
    audioRef.current = audio;
    setIsSpeaking(true);

    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => setIsSpeaking(false);
    void audio.play().catch(() => setIsSpeaking(false));
  }, []);

  const bootstrapSession = useCallback(async () => {
    setIsLoadingSession(true);
    setError(null);
    setIsComplete(false);
    setTurns([]);
    setCurrentQuestionIndex(0);
    setFinalAssistantMessage(null);
    setSessionId(null);
    setClientToken(null);
    setContextSnapshot(null);
    setTextInput("");

    try {
      const start = await startThesinatorSession();
      setSessionId(start.session_id);
      setClientToken(start.client_token);
      setTurns([
        {
          question: start.question,
          assistantMessage: start.assistant_reply,
          userAnswer: null,
        },
      ]);
      setCurrentQuestionIndex(start.question_index);
      playAudio(start.audio_b64);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start Thesinator.");
    } finally {
      setIsLoadingSession(false);
    }
  }, [playAudio]);

  useEffect(() => {
    void bootstrapSession();
  }, [bootstrapSession]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const submitAnswer = useCallback(async (answer: string, inputMode: InputMode) => {
    if (!sessionId || !activeQuestion || isSubmitting || isComplete) {
      return;
    }

    const trimmed = answer.trim();
    if (!trimmed) {
      return;
    }

    setError(null);
    setTextInput("");
    setIsSubmitting(true);
    setTurns((prev) => {
      if (prev.length === 0) {
        return prev;
      }

      const next = [...prev];
      const lastTurn = next[next.length - 1];
      next[next.length - 1] = {
        ...lastTurn,
        userAnswer: {
          text: trimmed,
          inputMode,
        },
      };
      return next;
    });

    try {
      const result = await sendThesinatorTurn({
        sessionId,
        questionId: activeQuestion.id,
        userAnswer: trimmed,
        inputMode,
        clientToken,
      });

      setClientToken((prev) => result.client_token ?? prev);
      setCurrentQuestionIndex(result.question_index);
      playAudio(result.audio_b64);

      if (result.is_complete) {
        setIsComplete(true);
        setFinalAssistantMessage(result.assistant_reply);
        setContextSnapshot(result.context_snapshot ?? null);
      } else {
        const nextQuestion = result.next_question ?? thesinatorQuestions[result.question_index] ?? null;
        if (!nextQuestion) {
          throw new Error("Missing next question from Thesinator.");
        }

        setTurns((prev) => [
          ...prev,
          {
            question: nextQuestion,
            assistantMessage: result.assistant_reply,
            userAnswer: null,
          },
        ]);
      }
    } catch (err) {
      setTurns((prev) => {
        if (prev.length === 0) {
          return prev;
        }

        const next = [...prev];
        const lastTurn = next[next.length - 1];
        next[next.length - 1] = {
          ...lastTurn,
          userAnswer: null,
        };
        return next;
      });
      setError(err instanceof Error ? err.message : "Could not send answer.");
    } finally {
      setIsSubmitting(false);
    }
  }, [activeQuestion, clientToken, isComplete, isSubmitting, playAudio, sessionId]);

  const captureSpeechTranscript = useCallback((transcript: string) => {
    if (isSubmitting || isComplete || !activeQuestion) {
      return;
    }

    const trimmed = transcript.trim();
    if (!trimmed) {
      return;
    }

    setError(null);
    void submitAnswer(trimmed, "speech");
  }, [activeQuestion, isComplete, isSubmitting, submitAnswer]);

  const { isListening, liveTranscript, speechError, toggleListening, stopListening } = useVoiceInput(captureSpeechTranscript);

  useEffect(() => {
    if (isSubmitting || isComplete) {
      stopListening();
    }
  }, [isComplete, isSubmitting, stopListening]);

  useEffect(() => {
    const container = conversationScrollRef.current;
    if (!container) {
      return;
    }

    const behavior: ScrollBehavior = isListening ? "auto" : "smooth";
    container.scrollTo({ top: container.scrollHeight, behavior });
    conversationEndRef.current?.scrollIntoView({ block: "end", behavior });
  }, [turns, isSubmitting, isListening, liveTranscript, finalAssistantMessage, isComplete]);

  const totalQuestions = thesinatorQuestions.length;
  const answeredCount = turns.filter((turn) => turn.userAnswer !== null).length;
  const progress = Math.min((answeredCount / totalQuestions) * 100, 100);
  const displayStep = isComplete ? totalQuestions : currentQuestionIndex + 1;

  const handleTextSubmit = () => {
    void submitAnswer(textInput, "text");
  };

  return (
    <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
      {/* Thesinator avatar */}
      <div className="flex flex-col items-center gap-4 flex-shrink-0 w-full xl:w-auto">
        <ThesinatorAvatar isTyping={isLoadingSession || isSubmitting} isSpeaking={isSpeaking && !(isLoadingSession || isSubmitting)} />
      </div>

      {/* Question panel */}
      <div className="w-full flex-1 xl:max-w-xl">
        {isLoadingSession &&
        <div className="flex justify-center py-10">
            <span className="inline-flex gap-1.5">
              <span className="w-3 h-3 bg-primary rounded-full animate-bounce" />
              <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </span>
          </div>
        }

        {/* Progress */}
        {!isLoadingSession &&
        <div className="mb-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }} />
            </div>
            <span className="ds-caption text-muted-foreground">{displayStep}/{totalQuestions}</span>
          </div>
        }

        {!isLoadingSession &&
        <div className="relative rounded-2xl border border-border bg-card/40 shadow-sm">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-card/95 to-transparent" />
            <div
            ref={conversationScrollRef}
            role="log"
            aria-live="polite"
            className="max-h-[68vh] overflow-y-auto px-3 py-3 pr-4 space-y-4 overscroll-contain scroll-smooth [scrollbar-gutter:stable]">
            {turns.map((turn, index) => {
              const isActiveTurn = !isComplete && index === turns.length - 1;

              return (
                <div
                  key={`${turn.question.id}-${index}`}
                  className="space-y-3 animate-fade-in rounded-xl border border-border/70 bg-background/70 p-4">
                  <SpeechBubble text={turn.assistantMessage} />

                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground min-w-12 h-12 rounded-lg flex items-center justify-center ds-title-cards font-bold relative px-3">
                      <Sparkles size={12} className="absolute top-1.5 left-1/2 -translate-x-1/2 text-primary-foreground/60" />
                      Q{turn.question.id}
                      <Sparkles size={10} className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-primary-foreground/60" />
                    </div>
                    <div className="flex-1 bg-card border border-border rounded-lg px-5 py-4">
                      <p className="ds-title-cards text-foreground">{turn.question.question}</p>
                    </div>
                  </div>

                  {turn.userAnswer &&
                  <UserSpeechBubble
                    text={turn.userAnswer.text}
                    modeLabel={inputModeLabels[turn.userAnswer.inputMode]} />
                  }

                  {isActiveTurn && !turn.userAnswer && (
                    <>
                      {!isSubmitting &&
                      <div className="space-y-3 animate-fade-in">
                          {turn.question.options.map((option, optionIndex) =>
                        <button
                          key={optionIndex}
                          onClick={() => {
                            void submitAnswer(option, "mcq");
                          }}
                          disabled={isSubmitting}
                          className="w-full py-4 px-6 rounded-lg border text-center ds-body font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed bg-card border-border text-foreground hover:border-primary/50 hover:shadow-md">
                              {option}
                            </button>
                        )}
                        </div>
                      }

                      {!isSubmitting && isListening && liveTranscript &&
                      <UserSpeechBubble
                        text={liveTranscript}
                        isLive
                        modeLabel={inputModeLabels.speech} />
                      }

                      {isSubmitting &&
                      <div className="flex justify-center py-8 animate-fade-in">
                          <span className="inline-flex gap-1.5">
                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" />
                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                            <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                          </span>
                        </div>
                      }

                      <div className="sticky bottom-0 z-20 -mx-4 border-t border-border/70 bg-background/95 px-4 pb-2 pt-3 backdrop-blur">
                        <div className="border border-border rounded-lg bg-card p-3 flex gap-2">
                          <input
                            type="text"
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
                            placeholder="Or answer freely via text..."
                            disabled={isSubmitting || isComplete}
                            className="flex-1 bg-transparent ds-body outline-none placeholder:text-muted-foreground px-3 py-2 rounded-full border border-input focus:ring-2 focus:ring-ring/20 disabled:opacity-60" />
                          <Button
                            onClick={toggleListening}
                            size="icon"
                            variant={isListening ? "destructive" : "outline"}
                            className="rounded-full shrink-0"
                            disabled={isSubmitting || isComplete}
                            title={isListening ? "Stop recording" : "Speech input"}>
                            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                          </Button>
                          <Button
                            onClick={handleTextSubmit}
                            size="icon"
                            className="rounded-full shrink-0"
                            disabled={isSubmitting || isComplete}>
                            <Send size={16} />
                          </Button>
                        </div>

                        {isListening &&
                        <div className="mt-1 flex items-center gap-2 text-destructive ds-small animate-fade-in">
                            <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                            Recording... speak now!
                          </div>
                        }
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {isComplete && finalAssistantMessage && <SpeechBubble text={finalAssistantMessage} />}
            <div ref={conversationEndRef} />
          </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-card/95 to-transparent" />
          </div>
        }

        {speechError &&
        <div className="mt-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 animate-fade-in">
            <p className="ds-small text-destructive">{speechError}</p>
          </div>
        }

        {error &&
        <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
            <p className="ds-small text-destructive">{error}</p>
            <Button onClick={() => void bootstrapSession()} variant="outline" className="mt-3 rounded-full">
              Restart Thesinator
            </Button>
          </div>
        }

        {isComplete && contextSnapshot &&
        <div className="mt-6 space-y-4 animate-fade-in">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="ds-label text-foreground mb-2">5. context_snapshot shape</p>
              <p className="ds-small text-muted-foreground mb-3">Built up during the conversation, one stage at a time:</p>
              <pre className="overflow-auto rounded-md bg-muted/40 p-3 ds-small leading-relaxed">
                {JSON.stringify(contextSnapshot, null, 2)}
              </pre>
            </div>
            <Button onClick={onNext} className="rounded-full gap-2">
              Start evaluation <ArrowRight size={16} />
            </Button>
          </div>
        }
      </div>
    </div>);
};

/* Step 3 */
const StepMatching = ({ onNext }: {onNext: () => void;}) => {
  const [matching, setMatching] = useState(false);
  const [matched, setMatched] = useState(false);

  const handleMatch = () => {
    setMatching(true);
    setTimeout(() => {
      setMatching(false);
      setMatched(true);
    }, 2000);
  };

  return (
    <div className="text-center max-w-md mx-auto">
      <h2 className="ds-title-md mb-4">Thesis Matching</h2>
      <p className="ds-body text-muted-foreground mb-8">
        Based on your conversation with Thesinator, we find the best thesis topics for you.
      </p>

      {!matched ?
      <Button onClick={handleMatch} disabled={matching} className="rounded-full gap-2" size="lg">
          {matching ?
        <>
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Matching in progress...
            </> :

        <>
              <Sparkles size={18} />
              Run thesis matching
            </>
        }
        </Button> :

      <div className="animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-primary-foreground" />
          </div>
          <p className="ds-body text-foreground mb-6">12 matching topics found!</p>
          <Button onClick={onNext} className="rounded-full gap-2">
            Continue to simulation <ArrowRight size={16} />
          </Button>
        </div>
      }
    </div>);

};

/* Step 4 */
const StepSimulation = ({ onNext }: {onNext: () => void;}) => {
  const [simulating, setSimulating] = useState(false);
  const [done, setDone] = useState(false);

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setDone(true);
    }, 2500);
  };

  return (
    <div className="text-center max-w-md mx-auto">
      <h2 className="ds-title-md mb-4">Career Simulation</h2>
      <p className="ds-body text-muted-foreground mb-8">
        We simulate 5 different career paths based on your thesis matches.
      </p>

      {!done ?
      <Button onClick={handleSimulate} disabled={simulating} className="rounded-full gap-2" size="lg">
          {simulating ?
        <>
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Simulation in progress...
            </> :

        <>
              <Briefcase size={18} />
              Start simulation
            </>
        }
        </Button> :

      <div className="animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-primary-foreground" />
          </div>
          <p className="ds-body text-foreground mb-6">5 scenarios generated!</p>
          <Button onClick={onNext} className="rounded-full gap-2">
            View results <ArrowRight size={16} />
          </Button>
        </div>
      }
    </div>);

};

/* Step 5 */
const StepResults = () => {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [chatStarted, setChatStarted] = useState<Record<number, boolean>>({});

  const s = selectedScenario !== null ? scenarios[selectedScenario] : null;

  return (
    <div>
      <h2 className="ds-title-md mb-2">Your Future Scenarios</h2>
      <p className="ds-body text-muted-foreground mb-8">
        Click a scenario to view details and chat with your future self.
      </p>

      {/* Scenario cards grid */}
      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 xl:grid-cols-5">
        {scenarios.map((sc, i) => (
          <button
            key={i}
            onClick={() => setSelectedScenario(i)}
            className={`border rounded-lg overflow-hidden transition-all duration-300 text-left ${
              selectedScenario === i
                ? "border-primary ring-2 ring-primary/20 shadow-lg"
                : "border-border hover:shadow-md"
            }`}
          >
            <img src={sc.image} alt={sc.company} className="w-full aspect-square object-cover" />
            <div className="p-3">
              <p className="ds-label text-foreground">{sc.company}</p>
              <p className="ds-caption text-muted-foreground">{sc.role}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${sc.probability}%` }} />
                </div>
                <span className="ds-caption text-primary font-semibold">{sc.probability}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Expanded detail card */}
      {s && (
        <div className="animate-fade-in border border-border rounded-lg bg-card max-w-3xl w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-6 p-6 border-b border-border sm:flex-row">
            <img src={s.image} alt={s.company} className="w-28 h-28 rounded-lg object-cover" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="ds-title-cards text-foreground">
                    Your Future Self at {s.company}
                  </h3>
                  <p className="ds-label text-muted-foreground mt-1">{s.role}</p>
                </div>
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <TrendingUp size={16} className="text-primary" />
                  <span className="ds-title-cards text-primary">{s.probability}%</span>
                </div>
              </div>
              <p className="ds-small text-muted-foreground mt-3">{s.simulationDescription}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Thesis */}
            <div>
              <p className="ds-label text-foreground flex items-center gap-2 mb-2">
                <GraduationCap size={16} className="text-primary" /> Thesis Topic
              </p>
              <p className="ds-body text-foreground font-semibold">{s.thesis}</p>
              <p className="ds-small text-muted-foreground mt-1">{s.thesisExplanation}</p>
            </div>

            {/* Why it fits */}
            <div>
              <p className="ds-label text-foreground flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-primary" /> Why This Thesis Fits You
              </p>
              <p className="ds-small text-muted-foreground">{s.whyThesisFits}</p>
            </div>

            {/* Career steps */}
            <div>
              <p className="ds-label text-foreground flex items-center gap-2 mb-3">
                <Footprints size={16} className="text-primary" /> Required Career Steps
              </p>
              <div className="space-y-2">
                {s.careerSteps.map((step, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center ds-caption font-bold flex-shrink-0">
                      {j + 1}
                    </div>
                    <p className="ds-small text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Professors & Alumni side by side */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Best professors */}
              <div>
                <p className="ds-label text-foreground flex items-center gap-2 mb-3">
                  <BookOpen size={16} className="text-primary" /> Best Professors for Your Thesis
                </p>
                <div className="space-y-2">
                  {s.professors.map((prof, j) => (
                    <a key={j} href={prof.link} className="flex items-center gap-2 group p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap size={14} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="ds-small text-foreground font-medium group-hover:text-primary transition-colors">{prof.name}</p>
                        <p className="ds-caption text-muted-foreground truncate">{prof.field}</p>
                      </div>
                      <ExternalLink size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Alumni */}
              <div>
                <p className="ds-label text-foreground flex items-center gap-2 mb-3">
                  <Users size={16} className="text-primary" /> Linked Alumni from Your University
                </p>
                <div className="space-y-2">
                  {s.alumni.map((alum, j) => (
                    <a key={j} href={alum.linkedIn} className="flex items-center gap-2 group p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users size={14} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="ds-small text-foreground font-medium group-hover:text-primary transition-colors">{alum.name}</p>
                        <p className="ds-caption text-muted-foreground truncate">{alum.role}</p>
                      </div>
                      <ExternalLink size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat with Future You button */}
            <div className="pt-2 border-t border-border">
              <Button
                onClick={() => setChatStarted((prev) => ({ ...prev, [selectedScenario!]: true }))}
                className="rounded-full gap-2 w-full"
                size="lg"
                variant={chatStarted[selectedScenario!] ? "outline" : "default"}
              >
                <MessageCircle size={18} />
                {chatStarted[selectedScenario!] ? "Continue chat with your future self" : "Start chat with your future self"}
              </Button>
              {chatStarted[selectedScenario!] && (
                <div className="mt-4 bg-muted/30 rounded-lg p-4 animate-fade-in">
                  <div className="flex gap-3 mb-3">
                    <img src={s.image} alt={s.company} className="w-10 h-10 rounded-full object-cover" />
                    <div className="bg-card border border-border rounded-lg px-4 py-3 flex-1">
                      <p className="ds-small text-foreground">
                        Hey! I am your future self at {s.company}. Ask me anything about my path here, from thesis to job. What would you like to know?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask your future self..."
                      className="flex-1 bg-card ds-small outline-none placeholder:text-muted-foreground px-4 py-2.5 rounded-full border border-input focus:ring-2 focus:ring-ring/20"
                    />
                    <Button size="icon" className="rounded-full shrink-0">
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThesisFinder;
