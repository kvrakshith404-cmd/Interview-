import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Bookmark,
  Share2,
  Check,
  Send,
  BookOpen,
} from 'lucide-react';

export const OpportunityDetailModal: React.FC = () => {
  const {
    selectedOpportunity,
    setSelectedOpportunity,
    user,
    applyToOpportunity,
    saveOpportunity,
    isOpportunitySaved,
    getOpportunityApplication,
    setInterviewTarget,
    setActiveTab,
    calculateMatchScore,
  } = useApp();

  const [coverNote, setCoverNote] = useState('');
  const [showApplyBox, setShowApplyBox] = useState(false);
  const [appliedJustNow, setAppliedJustNow] = useState(false);

  if (!selectedOpportunity) return null;

  const op = selectedOpportunity;
  const matchScore = calculateMatchScore(op);
  const isSaved = isOpportunitySaved(op.id);
  const existingApp = getOpportunityApplication(op.id);

  const handleApply = () => {
    applyToOpportunity(op, coverNote);
    setAppliedJustNow(true);
    setTimeout(() => {
      setAppliedJustNow(false);
      setShowApplyBox(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
          <button
            onClick={() => setSelectedOpportunity(null)}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 pr-10">
            <div
              className={`w-14 h-14 rounded-2xl ${op.logoBg} text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-md`}
            >
              {op.company.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  {op.type}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {op.providerType}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white leading-tight">
                {op.title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  {op.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {op.location} ({op.mode})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar inside Header */}
          <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
            <div className="bg-white/5 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Stipend</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">{op.stipend}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Duration</div>
              <div className="text-xs font-bold text-white mt-0.5">{op.duration}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Apply By</div>
              <div className="text-xs font-bold text-amber-300 mt-0.5">{op.deadline}</div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Match Score & Skill Gap Comparison */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-4 h-4 fill-emerald-500" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    Your Match Readiness: {matchScore}%
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Calculated for student {user.name} ({user.skills.length} verified skills)
                  </p>
                </div>
              </div>

              {existingApp && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                  Status: {existingApp.status}
                </span>
              )}
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Required Competencies Breakdown:
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {op.skillsRequired.map((skill) => {
                  const hasSkill = user.skills.some(
                    (s) => s.name.toLowerCase() === skill.toLowerCase()
                  );
                  return (
                    <span
                      key={skill}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        hasSkill
                          ? 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50'
                      }`}
                    >
                      {hasSkill ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                      )}
                      <span>{skill}</span>
                      {!hasSkill && (
                        <span className="text-[9px] font-bold text-rose-600 dark:text-rose-400 underline ml-0.5">
                          (Gap)
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Opportunity Overview
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {op.description}
            </p>
          </div>

          {/* Responsibilities */}
          {op.responsibilities && op.responsibilities.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Key Responsibilities
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {op.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Eligibility & Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block">
                Eligibility & Qualifications
              </span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {op.eligibility}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block">
                Perks & Benefits
              </span>
              <div className="flex flex-wrap gap-1">
                {op.perks.map((p, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-semibold"
                  >
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Inline Application Box if opened */}
          {showApplyBox && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Submit Application with Student Credentials
                </span>
                <span className="text-[11px] text-slate-500">
                  {user.name} {user.institutionId ? `(${user.institutionId})` : `• ${user.college}`}
                </span>
              </div>
              <textarea
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Include a short note or highlights of your projects to the hiring team..."
                className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowApplyBox(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={appliedJustNow}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition"
                >
                  {appliedJustNow ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Application Recorded!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm & Apply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => saveOpportunity(op)}
              className={`p-2.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                isSaved
                  ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-blue-500' : ''}`} />
              <span>{isSaved ? 'Bookmarked' : 'Save for Later'}</span>
            </button>

            <button
              onClick={() => {
                setSelectedOpportunity(null);
                setInterviewTarget(op);
              }}
              className="px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Interview Prep</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!showApplyBox && (
              <button
                onClick={() => setShowApplyBox(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{existingApp?.status === 'Applied' ? 'Update Application' : 'Apply Now'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
