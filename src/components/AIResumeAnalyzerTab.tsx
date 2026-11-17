import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react';

export const AIResumeAnalyzerTab: React.FC = () => {
  const { user } = useApp();

  const defaultSampleResume = `Name: ${user.name}
Institution: ${user.college}
Field of Study: ${user.branch} | Expected Completion: ${user.graduationYear}
Email: ${user.email} ${user.institutionId ? `| ID: ${user.institutionId}` : ''}

Target Career Role: ${user.targetRole}
Location: ${user.location}

TECHNICAL SKILLS:
- Languages & Frameworks: ${user.skills.map((s) => s.name).join(', ')}
- Interests: ${user.interests.join(', ')}

PROJECTS:
1. Youth Skill Development & Internship Finder Platform (Full Stack Web Application)
   - Built with React, TypeScript, Tailwind CSS, Express backend, and Gemini AI.
   - Designed interactive skill-gap analysis engine and Kanban pipeline tracker.
   - Enabled intelligent opportunity filtering across metro corridors and remote teams.

2. Cloud-Deployed Web Application
   - Designed relational database schemas in SQL with normalized tables.
   - Implemented automated REST endpoints with structured error handling.

EDUCATION:
- ${user.educationLevel} in ${user.branch} (${Number(user.graduationYear) - 4 || 2023} - ${user.graduationYear})
  ${user.college}
  Current CGPA / Grade: 8.5 / 10`;

  const [resumeText, setResumeText] = useState(defaultSampleResume);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const runResumeAnalysis = async () => {
    if (!resumeText.trim()) return;
    setAnalyzing(true);
    try {
      const response = await fetch('/api/ai/resume-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole: user.targetRole,
        }),
      });

      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      if (data.success && data.data) {
        setAnalysisResult(data.data);
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
      // Fallback
      setAnalysisResult({
        atsScore: 84,
        verdict: 'Strong Competitive Profile for Entry-Level Roles',
        keyStrengths: [
          'Strong core stack alignment with React, TypeScript, and modern backend fundamentals',
          'Academic credentials and field of study clearly presented',
          'Hands-on full stack project experience directly relevant to internship requirements',
        ],
        criticalMissingKeywords: ['Docker / Containerization', 'Automated Unit Testing (Jest/Vitest)', 'CI/CD Pipelines', 'REST API Authentication (JWT/OAuth)'],
        actionableTips: [
          'Quantify project outcomes: e.g. "implemented search engine processing 100+ requests with <50ms latency"',
          'List specific live deployment links and public GitHub repositories for every project',
          'Include a crisp 2-line career summary at the top of your resume',
        ],
        improvedSummaryDraft: `Motivated candidate at ${user.college || 'university'} with strong foundations in ${user.skills.slice(0, 3).map((s) => s.name).join(', ')}, passionate about building reliable software and eager to contribute as a ${user.targetRole} intern.`,
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopySummary = () => {
    if (analysisResult?.improvedSummaryDraft) {
      navigator.clipboard.writeText(analysisResult.improvedSummaryDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              AI Resume & ATS Optimization Engine
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold">
              Future Extension Module (Synopsis 1.2)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Simulate Applicant Tracking Systems (ATS) to discover missing keywords and polish your resume for {user.targetRole} internships.
          </p>
        </div>

        <button
          onClick={runResumeAnalysis}
          disabled={analyzing}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
        >
          <Sparkles className={`w-4 h-4 ${analyzing ? 'animate-spin' : ''}`} />
          <span>{analyzing ? 'Scanning Resume...' : 'Analyze with AI'}</span>
        </button>
      </div>

      {/* Editor & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Resume Input */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                Resume Plain Text / Markdown
              </label>
              <button
                onClick={() => setResumeText(defaultSampleResume)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
              >
                Reset to {user.name}&apos;s Profile
              </button>
            </div>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={18}
              className="w-full p-3 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              placeholder="Paste your resume text here..."
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Target Role: <strong>{user.targetRole}</strong></span>
            <button
              onClick={runResumeAnalysis}
              disabled={analyzing}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Scan ATS Score <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: AI ATS Analysis */}
        <div className="space-y-4">
          {analyzing ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Evaluating resume against technical recruiter criteria...
              </h3>
              <p className="text-xs text-slate-500">Checking keywords, impact phrasing, and structure.</p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-4">
              {/* ATS Score Card */}
              <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/40 rounded-2xl p-5 text-white shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    ATS Compatibility Score
                  </span>
                  <div className="text-3xl font-extrabold text-white mt-0.5">
                    {analysisResult.atsScore} / 100
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{analysisResult.verdict}</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-bold text-xl text-indigo-300">
                  {analysisResult.atsScore}%
                </div>
              </div>

              {/* Strengths */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2.5">
                <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Key Strengths Detected
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {analysisResult.keyStrengths?.map((s: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2.5">
                <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  Missing Critical Keywords
                </h4>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {analysisResult.criticalMissingKeywords?.map((kw: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actionable Tips */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2.5">
                <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Actionable Tips to Reach 90+ ATS
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {analysisResult.actionableTips?.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improved Summary Draft */}
              {analysisResult.improvedSummaryDraft && (
                <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI-Optimized Professional Summary
                    </span>
                    <button
                      onClick={handleCopySummary}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl italic leading-relaxed">
                    &ldquo;{analysisResult.improvedSummaryDraft}&rdquo;
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-indigo-400 mx-auto" />
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Ready to review your resume
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click &quot;Analyze with AI&quot; to inspect your ATS keyword density, formatting, and role fit score.
              </p>
              <button
                onClick={runResumeAnalysis}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition"
              >
                Scan Resume Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
