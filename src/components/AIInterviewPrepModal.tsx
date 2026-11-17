import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Lightbulb,
  Building2,
  RefreshCw,
  Award,
  BookOpen,
} from 'lucide-react';

export const AIInterviewPrepModal: React.FC = () => {
  const { interviewTarget, setInterviewTarget } = useApp();

  const [loading, setLoading] = useState(false);
  const [prepData, setPrepData] = useState<any>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const fetchInterviewQuestions = async () => {
    if (!interviewTarget) return;
    setLoading(true);
    try {
      const response = await fetch('/api/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roleTitle: interviewTarget.title,
          company: interviewTarget.company,
          keySkills: interviewTarget.skillsRequired,
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      if (data.success && data.data) {
        setPrepData(data.data);
      }
    } catch (err) {
      console.error('Error fetching interview prep:', err);
      // Fallback
      setPrepData({
        questions: [
          {
            type: 'Technical Architecture',
            question: `How would you design a scalable state management architecture in React for an application like ${interviewTarget.company}'s dashboard?`,
            hint: 'Interviewer wants to evaluate if you understand props drilling, context api, memoization, and server vs client state separation.',
            keyPointsToMention: [
              'Distinguish between ephemeral UI state and cached server state',
              'Use memoization (useMemo/useCallback) only where expensive computations occur',
              'Modular component boundaries to limit re-render scope',
            ],
          },
          {
            type: 'Core Skills',
            question: `Explain how asynchronous operations, Promises, and the Event Loop work when fetching REST API endpoints in ${interviewTarget.skillsRequired[0] || 'JavaScript'}.`,
            hint: 'Tests runtime execution model and microtask vs macrotask understanding.',
            keyPointsToMention: [
              'Call stack, Web APIs, and Microtask queue priority',
              'Error handling with try/catch and async/await',
              'Preventing race conditions or hanging requests with AbortController',
            ],
          },
          {
            type: 'Problem Solving Scenario',
            question: `If a production user reports that a page or data table is freezing on mobile devices, what diagnostic steps do you take?`,
            hint: 'Interviewer checks your engineering methodology and devtools familiarity.',
            keyPointsToMention: [
              'Reproduce locally using mobile emulation & Chrome DevTools Performance Profiler',
              'Inspect JS heap allocations and identify long-running main thread tasks',
              'Apply pagination, virtualization, or debounced search handlers',
            ],
          },
          {
            type: 'Behavioral (STAR Method)',
            question: `Tell us about a challenging bug or technical obstacle you encountered in a software project and how you collaborated with others to diagnose and resolve it.`,
            hint: 'Assesses communication, problem decomposition, and perseverance under deadlines.',
            keyPointsToMention: [
              'Situation & Task: Project objective and scope of the blocker',
              'Action: Systematic debugging, testing, and tool use',
              'Result: Successful resolution, quantifiable fix, and lessons learned',
            ],
          },
        ],
        tipsForSuccess: [
          'Frame your answers using the STAR method: Situation, Task, Action, Result.',
          'Always clarify constraints and edge cases before jumping into solution details.',
          'Highlight hands-on project implementations, architecture decisions, and code craftsmanship.',
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewTarget) {
      fetchInterviewQuestions();
    }
  }, [interviewTarget]);

  if (!interviewTarget) return null;

  const currentQ = prepData?.questions?.[activeQuestionIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 text-white border-b border-amber-800/40 relative">
          <button
            onClick={() => setInterviewTarget(null)}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Technical Interview Coach</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Interview Prep: {interviewTarget.title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{interviewTarget.company}</span>
            <span>•</span>
            <span>Skills: {interviewTarget.skillsRequired.slice(0, 4).join(', ')}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Generating targeted interview questions for {interviewTarget.company}...
              </p>
            </div>
          ) : prepData && currentQ ? (
            <div className="space-y-4">
              {/* Question Navigator tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {prepData.questions.map((q: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveQuestionIndex(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      activeQuestionIndex === i
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Q{i + 1}: {q.type}
                  </button>
                ))}
              </div>

              {/* Question Card */}
              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                    {currentQ.type} Question
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Question {activeQuestionIndex + 1} of {prepData.questions.length}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  &ldquo;{currentQ.question}&rdquo;
                </h3>
              </div>

              {/* Evaluator Hint */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  What the Interviewer is Evaluating:
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {currentQ.hint}
                </p>
              </div>

              {/* Key points to articulate */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Key Points to Include in Your Answer:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {currentQ.keyPointsToMention?.map((pt: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              {prepData.tipsForSuccess && (
                <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1.5 text-xs">
                  <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-blue-500" />
                    Interview Best Practice Tips:
                  </span>
                  <div className="text-slate-600 dark:text-slate-400 space-y-1">
                    {prepData.tipsForSuccess.map((tip: string, idx: number) => (
                      <p key={idx}>✓ {tip}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={fetchInterviewQuestions}
            disabled={loading}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate Questions</span>
          </button>

          <button
            onClick={() => setInterviewTarget(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Done Practicing
          </button>
        </div>
      </div>
    </div>
  );
};
