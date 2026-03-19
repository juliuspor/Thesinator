import { useState, useEffect, useRef } from "react";
import { Check, ArrowRight, Send, Sparkles, Users, Briefcase, Mic, MicOff, GraduationCap, TrendingUp, MessageCircle, ExternalLink, BookOpen, Footprints } from "lucide-react";
import { Button } from "@/components/ui/button";
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
{ id: 5, label: "Ergebnisse" }];


const scenarios = [
{
  image: futureGoogle,
  company: "Google",
  role: "Senior Software Engineer",
  probability: 78,
  thesis: "Machine Learning in Search Optimization",
  thesisExplanation: "Diese Thesis untersucht, wie maschinelles Lernen die Relevanz und Effizienz von Suchalgorithmen verbessern kann – ein Kerngebiet von Googles Geschäftsmodell.",
  whyThesisFits: "Deine Stärken in KI und Datenanalyse decken sich direkt mit den Anforderungen dieser Position. Die Thesis gibt dir hands-on Erfahrung mit den Technologien, die Google täglich einsetzt.",
  careerSteps: ["Praktikum bei Google (6 Monate)", "Junior ML Engineer (1-2 Jahre)", "Mid-Level Engineer mit Spezialisierung (2-3 Jahre)", "Senior Software Engineer (ab Jahr 4)"],
  alumni: [
    { name: "Dr. Maria Schmidt", role: "Research Scientist bei Google", linkedIn: "#" },
    { name: "Jonas Weber", role: "ML Engineer bei Google DeepMind", linkedIn: "#" }
  ],
  professors: [
    { name: "Prof. Dr. Weber", field: "Machine Learning Lab, TU München", link: "#" },
    { name: "Prof. Dr. Hoffmann", field: "Data Science, TU München", link: "#" }
  ],
  simulationDescription: "In dieser Simulation startest du nach deiner Thesis als Praktikant im Google Search Quality Team in Zürich. Innerhalb von 5 Jahren entwickelst du dich zum Senior Engineer, der ein eigenes Team von 8 Personen leitet und an der nächsten Generation der Suchmaschine arbeitet."
},
{
  image: futureApple,
  company: "Apple",
  role: "UX Research Lead",
  probability: 72,
  thesis: "Human-Computer Interaction in Wearables",
  thesisExplanation: "Die Arbeit erforscht intuitive Interaktionsmuster für tragbare Geräte und deren Einfluss auf Nutzerzufriedenheit und Gesundheitsmonitoring.",
  whyThesisFits: "Dein Fokus auf Usability und Design Thinking macht dich ideal für Apples HCI-Team. Die Thesis vermittelt dir Methoden, die Apple bei der Entwicklung von Apple Watch und Vision Pro einsetzt.",
  careerSteps: ["UX Research Intern bei Apple (6 Monate)", "Junior UX Researcher (1-2 Jahre)", "UX Researcher mit Projektleitung (2-3 Jahre)", "UX Research Lead (ab Jahr 4)"],
  alumni: [
    { name: "Lisa Chen", role: "Senior UX Designer bei Apple", linkedIn: "#" },
    { name: "Anna Berger", role: "Product Designer bei Apple", linkedIn: "#" }
  ],
  professors: [
    { name: "Prof. Dr. Müller", field: "HCI Lab, TU München", link: "#" },
    { name: "Prof. Dr. Kern", field: "Usability Engineering, TU München", link: "#" }
  ],
  simulationDescription: "Du startest als UX Research Intern in Apples Human Interface Team in Cupertino. Nach 5 Jahren leitest du ein Forschungsteam, das die Interaktionskonzepte für Apples nächste Wearable-Generation entwickelt."
},
{
  image: futureAws,
  company: "Amazon AWS",
  role: "Cloud Solutions Architect",
  probability: 85,
  thesis: "Scalable Distributed Systems Architecture",
  thesisExplanation: "Diese Thesis analysiert Architekturmuster für hochskalierbare verteilte Systeme und deren Anwendung in Cloud-Infrastrukturen.",
  whyThesisFits: "Deine Erfahrung mit Cloud-Technologien und verteilten Systemen passt perfekt zu AWS. Die Thesis bereitet dich direkt auf die technischen Herausforderungen vor, die AWS-Kunden täglich lösen müssen.",
  careerSteps: ["AWS Solutions Architect Associate (1 Jahr)", "Solutions Architect mit Spezialisierung (1-2 Jahre)", "Senior Solutions Architect (2-3 Jahre)", "Principal Architect (ab Jahr 5)"],
  alumni: [
    { name: "Tom Baker", role: "Principal Architect bei AWS", linkedIn: "#" },
    { name: "Markus Stein", role: "Solutions Architect bei AWS München", linkedIn: "#" }
  ],
  professors: [
    { name: "Prof. Dr. Klein", field: "Distributed Systems, TU München", link: "#" },
    { name: "Prof. Dr. Bauer", field: "Cloud Computing, TU München", link: "#" }
  ],
  simulationDescription: "Nach deiner Thesis steigst du als Associate Solutions Architect bei AWS in München ein. Du berätst DAX-Unternehmen bei der Cloud-Migration und wirst innerhalb von 5 Jahren zum Principal Architect befördert."
},
{
  image: futureStartup,
  company: "Eigenes Startup",
  role: "CEO & Co-Founder",
  probability: 45,
  thesis: "Digital Platform Economics in EdTech",
  thesisExplanation: "Die Arbeit untersucht Geschäftsmodelle und Netzwerkeffekte digitaler Plattformen im Bildungsbereich – die theoretische Grundlage für dein eigenes EdTech-Startup.",
  whyThesisFits: "Dein unternehmerisches Denken und EdTech-Interesse könnten ein eigenes Startup ermöglichen. Die Thesis liefert dir das strategische Framework und Marktverständnis für eine Gründung.",
  careerSteps: ["Thesis als Marktvalidierung nutzen", "Teilnahme an TUM Incubator (6 Monate)", "Pre-Seed Finanzierung sichern (Jahr 1)", "Product-Market Fit erreichen (Jahr 2)", "Series A und Skalierung (Jahr 3-5)"],
  alumni: [
    { name: "Sarah Venture", role: "VC Partner bei Earlybird", linkedIn: "#" },
    { name: "Max Innovation", role: "Founder bei TechHub Munich", linkedIn: "#" }
  ],
  professors: [
    { name: "Prof. Dr. Krcmar", field: "Entrepreneurship, TU München", link: "#" },
    { name: "Prof. Dr. Welpe", field: "Strategy & Innovation, TU München", link: "#" }
  ],
  simulationDescription: "Du nutzt deine Thesis als Grundlage für ein EdTech-Startup. Über den TUM Incubator findest du einen Co-Founder, sicherst dir eine Pre-Seed-Finanzierung und baust innerhalb von 3 Jahren eine Plattform mit 50.000 Nutzern auf."
},
{
  image: futureConsulting,
  company: "McKinsey",
  role: "Associate Consultant",
  probability: 68,
  thesis: "Digital Transformation in Traditional Industries",
  thesisExplanation: "Diese Thesis analysiert Erfolgsfaktoren und Hindernisse der digitalen Transformation in etablierten Industrien – genau das Thema, das Beratungsfirmen bei ihren Kunden lösen.",
  whyThesisFits: "Deine analytischen Fähigkeiten und Branchenkenntnisse sind perfekt für Strategieberatung. Die Thesis gibt dir ein tiefes Verständnis der Herausforderungen, mit denen McKinseys Kunden konfrontiert sind.",
  careerSteps: ["McKinsey Business Analyst (1 Jahr)", "Associate Consultant (1-2 Jahre)", "Engagement Manager (Jahr 3-4)", "Associate Partner (ab Jahr 5)"],
  alumni: [
    { name: "Dr. Fischer", role: "Partner bei McKinsey Digital", linkedIn: "#" },
    { name: "Julia Krause", role: "Engagement Manager bei McKinsey", linkedIn: "#" }
  ],
  professors: [
    { name: "Prof. Dr. Braun", field: "Strategic Management, TU München", link: "#" },
    { name: "Prof. Dr. Lanzinner", field: "Digital Business, TU München", link: "#" }
  ],
  simulationDescription: "Du startest als Business Analyst bei McKinsey in München und arbeitest an Digitalisierungsprojekten für Automobilhersteller. Nach 5 Jahren bist du Engagement Manager und leitest eigene Projekte mit Millionenbudgets."
}];


const thesinatorQuestions = [
  {
    id: 1,
    question: "Welcher Bereich fasziniert dich am meisten?",
    options: ["Technologie & IT", "Wirtschaft & Management", "Design & Kreativität", "Forschung & Wissenschaft", "Soziales & Gesellschaft"]
  },
  {
    id: 2,
    question: "Wie wichtig ist dir Praxisbezug in deiner Thesis?",
    options: ["Sehr wichtig", "Wichtig", "Neutral", "Weniger wichtig", "Gar nicht wichtig"]
  },
  {
    id: 3,
    question: "Möchtest du mit einem Unternehmen zusammenarbeiten?",
    options: ["Ja, unbedingt", "Eher ja", "Weiß nicht", "Eher nein", "Nein"]
  },
  {
    id: 4,
    question: "Welche Methodik bevorzugst du?",
    options: ["Quantitativ (Daten & Statistik)", "Qualitativ (Interviews & Analyse)", "Mixed Methods", "Design-basiert (Prototyping)", "Egal"]
  },
  {
    id: 5,
    question: "Wo siehst du dich nach dem Studium?",
    options: ["Großkonzern (Google, Apple...)", "Startup gründen", "Beratung (McKinsey...)", "Forschung & Akademie", "Noch unsicher"]
  },
  {
    id: 6,
    question: "Wie lang soll deine Thesis ungefähr dauern?",
    options: ["3 Monate", "4-5 Monate", "6 Monate", "Länger als 6 Monate", "Flexibel"]
  },
  {
    id: 7,
    question: "Welches Thema reizt dich besonders?",
    options: ["Künstliche Intelligenz", "Nachhaltigkeit & Green Tech", "Digitale Transformation", "Plattformökonomie", "Cybersecurity"]
  }
];

const ThesisFinder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [textInput, setTextInput] = useState("");

  const handleNextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (questionIndex < thesinatorQuestions.length - 1) {
        setQuestionIndex((prev) => prev + 1);
      }
    }, 1200);
  };

  return (
    <div className="flex-1 min-h-screen w-full min-w-0">
      <header className="border-b border-border">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="ds-title-lg">Thesinator</h1>
          <p className="ds-small text-muted-foreground mt-1">Finde deine perfekte Abschlussarbeit in 5 Schritten</p>
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
        {currentStep === 2 &&
        <StepGenieChat
          questionIndex={questionIndex}
          answers={answers}
          onAnswer={handleAnswer}
          onNext={handleNextStep}
          isTyping={isTyping}
          textInput={textInput}
          setTextInput={setTextInput}
          allAnswered={questionIndex >= thesinatorQuestions.length - 1 && Object.keys(answers).length >= thesinatorQuestions.length} />
        }
        {currentStep === 3 && <StepMatching onNext={handleNextStep} />}
        {currentStep === 4 && <StepSimulation onNext={handleNextStep} />}
        {currentStep === 5 && <StepResults />}
      </main>
    </div>);

};

/* Step 1 */
const StepBasicInfo = ({ onNext }: {onNext: () => void;}) =>
<div className="mx-auto max-w-2xl">
    <h2 className="ds-title-md mb-6">Deine Grundinformationen</h2>
    <div className="bg-card border border-border rounded-lg p-6 max-w-lg mx-auto">
      <div className="space-y-4">
        {[
      { label: "Name", value: "Sebastian Hahn" },
      { label: "Universität", value: "Technische Universität München" },
      { label: "Studiengang", value: "Wirtschaftsinformatik (M.Sc.)" },
      { label: "Semester", value: "3. Semester" },
      { label: "E-Mail", value: "sebastian.hahn@student.tum.de" }].
      map((field) =>
      <div key={field.label}>
            <label className="ds-label text-muted-foreground">{field.label}</label>
            <p className="ds-body mt-1 text-foreground">{field.value}</p>
          </div>
      )}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Check size={16} className="text-primary" />
        <span className="ds-small text-muted-foreground">Automatisch aus deiner Registrierung übernommen</span>
      </div>
    </div>
    <Button onClick={onNext} className="mt-6 rounded-full gap-2">
      Weiter zum Thesinator <ArrowRight size={16} />
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
<div className="relative max-w-[320px] mb-4">
    








  
  </div>;


/* Voice Input Hook */
const useVoiceInput = (onResult: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Spracherkennung wird von deinem Browser nicht unterstützt.");
      return;
    }

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
  };

  return { isListening, toggleListening };
};

/* Step 2 */
const StepGenieChat = ({
  questionIndex,
  answers,
  onAnswer,
  onNext,
  isTyping,
  textInput,
  setTextInput,
  allAnswered
}: {
  questionIndex: number;
  answers: Record<number, string>;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  isTyping: boolean;
  textInput: string;
  setTextInput: (v: string) => void;
  allAnswered: boolean;
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentQuestion = thesinatorQuestions[questionIndex];

  const { isListening, toggleListening } = useVoiceInput((transcript) => {
    onAnswer(transcript);
  });

  useEffect(() => {
    setIsSpeaking(true);
    const timer = setTimeout(() => setIsSpeaking(false), 2500);
    return () => clearTimeout(timer);
  }, [questionIndex]);

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;
    onAnswer(textInput);
    setTextInput("");
  };

  return (
    <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
      {/* Thesinator avatar */}
      <div className="flex flex-col items-center gap-4 flex-shrink-0 w-full xl:w-auto">
        <ThesinatorAvatar isTyping={isTyping} isSpeaking={isSpeaking && !isTyping} />
      </div>

      {/* Question panel */}
      <div className="w-full flex-1 xl:max-w-xl">
        {/* Question header with number */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-primary text-primary-foreground w-14 h-14 rounded-lg flex items-center justify-center ds-title-md font-bold relative">
            <Sparkles size={12} className="absolute top-1.5 left-1/2 -translate-x-1/2 text-primary-foreground/60" />
            {currentQuestion.id}
            <Sparkles size={10} className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-primary-foreground/60" />
          </div>
          <div className="flex-1 bg-card border border-border rounded-lg px-5 py-4">
            <p className="ds-title-cards text-foreground">{currentQuestion.question}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 rounded-full"
              style={{ width: `${((questionIndex + (answers[questionIndex] ? 1 : 0)) / thesinatorQuestions.length) * 100}%` }}
            />
          </div>
          <span className="ds-caption text-muted-foreground">{questionIndex + 1}/{thesinatorQuestions.length}</span>
        </div>

        {/* Answer options */}
        {!isTyping && (
          <div className="space-y-3 mb-6 animate-fade-in">
            {currentQuestion.options.map((option, i) => (
              <button
                key={i}
                onClick={() => onAnswer(option)}
                className={`w-full py-4 px-6 rounded-lg border text-center ds-body font-semibold transition-all duration-200 ${
                  answers[questionIndex] === option
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-foreground hover:border-primary/50 hover:shadow-md"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {isTyping && (
          <div className="flex justify-center py-12 animate-fade-in">
            <span className="inline-flex gap-1.5">
              <span className="w-3 h-3 bg-primary rounded-full animate-bounce" />
              <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <span className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </span>
          </div>
        )}

        {/* Text/Voice input */}
        <div className="border border-border rounded-lg bg-card p-3 flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder="Oder antworte frei per Text..."
            className="flex-1 bg-transparent ds-body outline-none placeholder:text-muted-foreground px-3 py-2 rounded-full border border-input focus:ring-2 focus:ring-ring/20"
          />
          <Button
            onClick={toggleListening}
            size="icon"
            variant={isListening ? "destructive" : "outline"}
            className="rounded-full shrink-0"
            title={isListening ? "Aufnahme stoppen" : "Spracheingabe"}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </Button>
          <Button onClick={handleTextSubmit} size="icon" className="rounded-full shrink-0">
            <Send size={16} />
          </Button>
        </div>

        {isListening && (
          <div className="mt-2 flex items-center gap-2 text-destructive ds-small animate-fade-in">
            <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            Aufnahme läuft... Sprich jetzt!
          </div>
        )}

        {allAnswered && (
          <Button onClick={onNext} className="mt-4 rounded-full gap-2 animate-fade-in">
            Auswertung starten <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
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
        Basierend auf deinem Gespräch mit dem Thesinator finden wir die besten Thesis-Themen für dich.
      </p>

      {!matched ?
      <Button onClick={handleMatch} disabled={matching} className="rounded-full gap-2" size="lg">
          {matching ?
        <>
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Matching läuft...
            </> :

        <>
              <Sparkles size={18} />
              Thesis Matchen
            </>
        }
        </Button> :

      <div className="animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-primary-foreground" />
          </div>
          <p className="ds-body text-foreground mb-6">12 passende Themen gefunden!</p>
          <Button onClick={onNext} className="rounded-full gap-2">
            Weiter zur Simulation <ArrowRight size={16} />
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
      <h2 className="ds-title-md mb-4">Karriere-Simulation</h2>
      <p className="ds-body text-muted-foreground mb-8">
        Wir simulieren 5 verschiedene Karrierewege basierend auf deinen Thesis-Matches.
      </p>

      {!done ?
      <Button onClick={handleSimulate} disabled={simulating} className="rounded-full gap-2" size="lg">
          {simulating ?
        <>
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Simulation läuft...
            </> :

        <>
              <Briefcase size={18} />
              Simulation starten
            </>
        }
        </Button> :

      <div className="animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-primary-foreground" />
          </div>
          <p className="ds-body text-foreground mb-6">5 Szenarien generiert!</p>
          <Button onClick={onNext} className="rounded-full gap-2">
            Ergebnisse ansehen <ArrowRight size={16} />
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
      <h2 className="ds-title-md mb-2">Deine Zukunfts-Szenarien</h2>
      <p className="ds-body text-muted-foreground mb-8">
        Klicke auf ein Szenario für Details und chatte mit deinem zukünftigen Ich.
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
                    Dein Zukunfts-Ich bei {s.company}
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
                <GraduationCap size={16} className="text-primary" /> Thesis-Thema
              </p>
              <p className="ds-body text-foreground font-semibold">{s.thesis}</p>
              <p className="ds-small text-muted-foreground mt-1">{s.thesisExplanation}</p>
            </div>

            {/* Why it fits */}
            <div>
              <p className="ds-label text-foreground flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-primary" /> Warum diese Thesis zu dir passt
              </p>
              <p className="ds-small text-muted-foreground">{s.whyThesisFits}</p>
            </div>

            {/* Career steps */}
            <div>
              <p className="ds-label text-foreground flex items-center gap-2 mb-3">
                <Footprints size={16} className="text-primary" /> Notwendige Karriereschritte
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
                  <BookOpen size={16} className="text-primary" /> Beste Profs für deine Thesis
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
                  <Users size={16} className="text-primary" /> Verlinkte Alumni deiner Uni
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
                {chatStarted[selectedScenario!] ? "Chat mit deinem Future-You fortsetzen" : "Chat mit deinem Future-You starten"}
              </Button>
              {chatStarted[selectedScenario!] && (
                <div className="mt-4 bg-muted/30 rounded-lg p-4 animate-fade-in">
                  <div className="flex gap-3 mb-3">
                    <img src={s.image} alt={s.company} className="w-10 h-10 rounded-full object-cover" />
                    <div className="bg-card border border-border rounded-lg px-4 py-3 flex-1">
                      <p className="ds-small text-foreground">
                        Hey! Ich bin dein Zukunfts-Ich bei {s.company}. Frag mich alles über meinen Weg hierher – von der Thesis bis zum Job. Was möchtest du wissen?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Frag dein Future-You..."
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
