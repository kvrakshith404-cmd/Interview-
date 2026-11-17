import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Sparkles,
  Volume2,
  RefreshCw,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Maximize2,
  ChevronRight,
  Send,
  HelpCircle,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { VideoMockQuestion, VideoAnswerEvaluation } from '../types';

const MOCK_QUESTIONS_DATABASE: Record<string, VideoMockQuestion[]> = {
  'Full Stack Developer': [
    {
      id: 'q1',
      type: 'Technical Viva',
      question: 'Can you explain the Virtual DOM in React and why reconciliations are faster than direct DOM manipulations?',
      contextHint: 'Focus on in-memory representation, batching updates, and diffing algorithm.',
      expectedKeywords: ['diffing', 'reconciliation', 'render tree', 'batching'],
      durationSeconds: 120,
    },
    {
      id: 'q2',
      type: 'System Architecture',
      question: 'How do you design a secure RESTful API in Node.js with JWT authentication, role-based access control, and rate limiting?',
      contextHint: 'Discuss middleware, token signing, expiration, and Redis token blacklists.',
      expectedKeywords: ['middleware', 'JWT', 'RBAC', 'rate limiting', 'tokens'],
      durationSeconds: 150,
    },
    {
      id: 'q3',
      type: 'Coding Logic',
      question: 'Walk us through how you would optimize a web page experiencing slow rendering and high cumulative layout shift (CLS).',
      contextHint: 'Explain code splitting, asset preloading, image dimensions, and font swapping.',
      expectedKeywords: ['Core Web Vitals', 'CLS', 'lazy loading', 'useMemo'],
      durationSeconds: 120,
    },
    {
      id: 'q4',
      type: 'Behavioral HR',
      question: 'Tell us about a time when you received constructive code review feedback that challenged your design, and how you acted on it.',
      contextHint: 'Use the STAR method: Situation, Task, Action, Result.',
      expectedKeywords: ['STAR', 'code review', 'collaboration', 'iteration'],
      durationSeconds: 120,
    },
  ],
  'Data Scientist & Analyst': [
    {
      id: 'ds1',
      type: 'Technical Viva',
      question: 'What is the difference between L1 and L2 regularization, and when would you prefer Lasso over Ridge regression?',
      contextHint: 'Discuss feature selection, sparsity, and mathematical penalties.',
      expectedKeywords: ['Lasso', 'Ridge', 'sparsity', 'overfitting', 'penalty'],
      durationSeconds: 120,
    },
    {
      id: 'ds2',
      type: 'System Architecture',
      question: 'Explain how you address class imbalance in a fraud detection dataset containing 99% benign transactions.',
      contextHint: 'Touch upon SMOTE, precision-recall AUC, cost-sensitive learning, and stratified splits.',
      expectedKeywords: ['SMOTE', 'undersampling', 'Precision-Recall', 'F1-score'],
      durationSeconds: 150,
    },
    {
      id: 'ds3',
      type: 'Behavioral HR',
      question: 'How do you communicate complex statistical models and predictive findings to non-technical business stakeholders?',
      contextHint: 'Emphasize business value, visualizations, and plain English storytelling.',
      expectedKeywords: ['business impact', 'visualization', 'storytelling'],
      durationSeconds: 120,
    },
  ],
  'Cloud & DevOps Engineer': [
    {
      id: 'do1',
      type: 'Technical Viva',
      question: 'Explain the difference between a Docker container and a Virtual Machine, specifically regarding the kernel and resource isolation.',
      contextHint: 'Mention shared host OS kernel, cgroups, namespaces, and startup latency.',
      expectedKeywords: ['namespaces', 'cgroups', 'kernel', 'hypervisor'],
      durationSeconds: 120,
    },
    {
      id: 'do2',
      type: 'System Architecture',
      question: 'How would you architect a zero-downtime rolling deployment pipeline in Kubernetes using readiness probes?',
      contextHint: 'Discuss RollingUpdate strategy, liveness/readiness probes, and ingress routing.',
      expectedKeywords: ['readiness probe', 'RollingUpdate', 'Kubernetes', 'CI/CD'],
      durationSeconds: 150,
    },
    {
      id: 'do3',
      type: 'Behavioral HR',
      question: 'Walk us through how you would handle an unexpected production outage during peak business traffic.',
      contextHint: 'Mention incident triage, monitoring dashboards, rollbacks, and post-mortems.',
      expectedKeywords: ['triage', 'rollback', 'post-mortem', 'alerting'],
      durationSeconds: 120,
    },
  ],
  'UI/UX & Product Designer': [
    {
      id: 'ui1',
      type: 'Technical Viva',
      question: 'Explain the distinction between UX wireframes, low-fidelity prototypes, and a comprehensive Design System in Figma.',
      contextHint: 'Discuss atomic design, tokens, component states, and user testing iterations.',
      expectedKeywords: ['design tokens', 'components', 'wireframes', 'usability'],
      durationSeconds: 120,
    },
    {
      id: 'ui2',
      type: 'System Architecture',
      question: 'How do you design an interface ensuring WCAG 2.1 AA accessibility compliance for visually impaired and keyboard-only users?',
      contextHint: 'Touch upon color contrast ratios, focus visible states, and semantic hierarchy.',
      expectedKeywords: ['WCAG', 'contrast ratio', 'aria-labels', 'screen reader'],
      durationSeconds: 150,
    },
  ],
};

export const VideoMockInterviewRoom: React.FC = () => {
  const {
    user,
    isVideoRoomOpen,
    setIsVideoRoomOpen,
    videoInterviewRole,
  } = useApp();

  // Selected questions set based on role
  const questionsList =
    MOCK_QUESTIONS_DATABASE[videoInterviewRole] ||
    MOCK_QUESTIONS_DATABASE['Full Stack Developer'];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<VideoAnswerEvaluation | null>(null);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [allEvaluations, setAllEvaluations] = useState<{ question: VideoMockQuestion; eval: VideoAnswerEvaluation }[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentQuestion = questionsList[currentQuestionIndex];

  // Initialize Webcam Stream
  useEffect(() => {
    if (!isVideoRoomOpen) {
      // stop stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      return;
    }

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera access denied or unavailable, using mock video feed preview:', err);
      }
    }

    initCamera();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoRoomOpen]);

  // Setup Web Speech API for voice transcribing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let liveText = '';
          for (let i = 0; i < event.results.length; i++) {
            liveText += event.results[i][0].transcript + ' ';
          }
          setTranscript(liveText);
        };

        rec.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e.error);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  if (!isVideoRoomOpen) return null;

  const toggleMic = () => {
    setIsMicOn((prev) => {
      const next = !prev;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = next;
        });
      }
      return next;
    });
  };

  const toggleCamera = () => {
    setIsCameraOn((prev) => {
      const next = !prev;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getVideoTracks().forEach((track) => {
          track.enabled = next;
        });
      }
      return next;
    });
  };

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. You can type your response directly into the transcript box.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Error starting speech recognition:', err);
      }
    }
  };

  const speakQuestionTTS = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!transcript.trim()) {
      return;
    }

    setIsEvaluating(true);
    try {
      const response = await fetch('/api/ai/video-interview-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          studentAnswer: transcript,
          targetRole: videoInterviewRole,
          questionType: currentQuestion.type,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setEvaluation(data.data);
        setAllEvaluations((prev) => [
          ...prev,
          { question: currentQuestion, eval: data.data },
        ]);
      }
    } catch (err) {
      console.error('Error evaluating answer:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questionsList.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTranscript('');
      setEvaluation(null);
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    } else {
      setIsSessionComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setTranscript('');
    setEvaluation(null);
    setAllEvaluations([]);
    setIsSessionComplete(false);
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsVideoRoomOpen(false);
  };

  // Compute final average stats
  const avgScore =
    allEvaluations.length > 0
      ? Math.round(
          allEvaluations.reduce((sum, item) => sum + item.eval.score, 0) /
            allEvaluations.length
        )
      : 84;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full shadow-2xl flex flex-col max-h-[95vh] overflow-hidden text-white animate-in fade-in zoom-in-95 duration-200">
        {/* Top Video Room Bar */}
        <div className="bg-slate-950 px-6 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center animate-pulse">
              <Video className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">
                  AI Video Mock Convocation Room
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                  LIVE SECURE SESSION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Target Role: <strong className="text-blue-400">{videoInterviewRole}</strong> • Candidate:{' '}
                <strong className="text-slate-200">{user.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isSessionComplete && (
              <span className="hidden sm:inline-block px-3 py-1 rounded-lg bg-slate-800 text-xs font-mono text-slate-300">
                Question {currentQuestionIndex + 1} of {questionsList.length}
              </span>
            )}
            <button
              onClick={handleClose}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Leave Room</span>
            </button>
          </div>
        </div>

        {/* Room Main Content */}
        {!isSessionComplete ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Split Video Feeds: AI Proctor & Candidate Webcam */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Feed: AI Interviewer Screen */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-slate-800 to-slate-950 border border-slate-800 aspect-video flex flex-col justify-between p-4 shadow-inner">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/80">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    <span className="font-semibold text-slate-200">
                      Dr. Sarah Chen (AI Interview Board)
                    </span>
                  </div>
                  <button
                    onClick={speakQuestionTTS}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Read Question Out Loud (TTS)"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Animated AI Proctor Visualizer */}
                <div className="flex flex-col items-center justify-center my-auto space-y-3">
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-1 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      <Sparkles className="w-9 h-9 text-blue-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-blue-500 rounded-full animate-bounce" />
                    <span className="w-1 h-5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 h-6 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                    <span className="w-1 h-4 bg-purple-400 rounded-full animate-bounce [animation-delay:0.45s]" />
                    <span className="w-1 h-2 bg-blue-500 rounded-full animate-bounce" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    AI Examiner Active • Evaluating Speech & Competency
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                  <span className="text-amber-400 font-semibold">Proctor Context: </span>
                  {currentQuestion.contextHint}
                </div>
              </div>

              {/* Right Feed: Candidate Webcam & Stream */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-inner">
                {isCameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover mirror"
                  />
                ) : (
                  <div className="text-center space-y-2 p-6">
                    <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-xl font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <p className="text-xs text-slate-400">Camera Paused</p>
                  </div>
                )}

                {/* Candidate Overlay Header */}
                <div className="absolute top-3 left-3 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-700/80 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-100">{user.name} (Candidate)</span>
                </div>

                {/* Media Control Pill */}
                <div className="absolute bottom-3 flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-700/80 backdrop-blur-sm">
                  <button
                    onClick={toggleMic}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isMicOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-rose-600 text-white'
                    }`}
                    title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                  >
                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleCamera}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isCameraOn ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-rose-600 text-white'
                    }`}
                    title={isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
                  >
                    {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>

                  <div className="h-4 w-px bg-slate-700" />

                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {currentQuestion.durationSeconds}s limit
                  </span>
                </div>
              </div>
            </div>

            {/* Current Question Display Card */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  Question {currentQuestionIndex + 1} • {currentQuestion.type}
                </span>
                <button
                  onClick={speakQuestionTTS}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to Question</span>
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                &ldquo;{currentQuestion.question}&rdquo;
              </h3>

              {/* Spoken Answer Live Transcript Box */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <span>Your Spoken Answer (Live Voice Transcript)</span>
                    {isListening && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Listening... speak clearly
                      </span>
                    )}
                  </label>

                  <button
                    onClick={toggleSpeechRecognition}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isListening ? 'Stop Mic Recording' : 'Start Speaking with Mic'}</span>
                  </button>
                </div>

                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Click 'Start Speaking with Mic' to talk, or type your answer here..."
                  rows={4}
                  className="w-full p-3.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-mono"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-slate-400">
                    Expected core competencies: {currentQuestion.expectedKeywords.join(', ')}
                  </div>

                  {!evaluation && (
                    <button
                      onClick={handleEvaluateAnswer}
                      disabled={isEvaluating || !transcript.trim()}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className={`w-4 h-4 ${isEvaluating ? 'animate-spin' : ''}`} />
                      <span>{isEvaluating ? 'AI Scoring in Progress...' : 'Submit Answer for AI Scoring'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Live AI Scoring & Feedback Card (Appears after answer submitted) */}
            {evaluation && (
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-800/60 rounded-2xl p-5 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-blue-900/60">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-sm text-white">
                      AI Proctor Assessment: Score {evaluation.score} / 100
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      Confidence: {evaluation.confidenceRating}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span>
                      Accuracy: <strong className="text-emerald-400">{evaluation.technicalAccuracy}%</strong>
                    </span>
                    <span>
                      Clarity: <strong className="text-blue-400">{evaluation.communicationClarity}%</strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/50 space-y-1">
                    <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Strengths Demonstrated:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {evaluation.positiveFeedback}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/50 space-y-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      Areas for Polish:
                    </span>
                    <p className="text-slate-300 leading-relaxed">
                      {evaluation.areasForImprovement}
                    </p>
                  </div>
                </div>

                {evaluation.recommendedAnswerAddition && (
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="font-semibold text-blue-300 block mb-0.5">
                      Recommended Polished Addition:
                    </span>
                    <p className="text-slate-300 italic leading-relaxed">
                      &ldquo;{evaluation.recommendedAnswerAddition}&rdquo;
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <span>
                      {currentQuestionIndex + 1 < questionsList.length
                        ? 'Next Mock Question'
                        : 'Finish Mock Convocation & View Certificate'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Final Performance Report Card */
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Mock Convocation Completed
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Performance Evaluation Report for {user.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
                Evaluated for the role of <strong>{videoInterviewRole}</strong> across technical viva, systems design, and behavioral benchmarks.
              </p>
            </div>

            {/* Score Ring / Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="text-3xl font-extrabold text-emerald-400">{avgScore}%</div>
                <div className="text-xs font-semibold text-slate-300 mt-1">Overall Interview Readiness</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="text-3xl font-extrabold text-blue-400">89%</div>
                <div className="text-xs font-semibold text-slate-300 mt-1">Technical Viva Depth</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="text-3xl font-extrabold text-purple-400">92%</div>
                <div className="text-xs font-semibold text-slate-300 mt-1">Clarity & Delivery Pace</div>
              </div>
            </div>

            {/* Question by Question summary */}
            <div className="max-w-2xl mx-auto text-left space-y-3 pt-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Questions Answered Breakdown:
              </h4>
              <div className="space-y-2">
                {allEvaluations.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 line-clamp-1">
                        Q{idx + 1}: {item.question.question}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.eval.positiveFeedback}
                      </div>
                    </div>
                    <span className="font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 shrink-0">
                      {item.eval.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={handleRestart}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer"
              >
                Practice Again
              </button>
              <button
                onClick={handleClose}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
