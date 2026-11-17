import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  GraduationCap,
  FileText,
  User,
  Award,
  Layers,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Building2,
  Calendar,
} from 'lucide-react';

export const SynopsisModal: React.FC = () => {
  const { isSynopsisOpen, setIsSynopsisOpen, user } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'pdf'>('overview');

  if (!isSynopsisOpen) return null;

  const pdfUrl = '/assets/aistudio/7_dd248136.pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white relative border-b border-slate-800">
          <button
            onClick={() => setIsSynopsisOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/30 text-blue-300 border border-blue-400/30">
              1BCP308 • COMMUNITY PROJECT SYNOPSIS
            </span>
            <span className="text-xs text-slate-400 font-mono">2026-27</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
            Youth Skill Development and Internship Finder App
          </h2>

          <div className="text-xs text-slate-300 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="flex items-center gap-1 font-semibold text-blue-300">
              <Building2 className="w-3.5 h-3.5" />
              K.V.G. College of Engineering, Sullia, D.K. – 574 327
            </span>
            <span>VTU Belagavi</span>
          </div>

          {/* Navigation tabs */}
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Synopsis & Authors
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'modules'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              System Architecture & Scope
            </button>
            <button
              onClick={() => setActiveTab('pdf')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'pdf'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Original PDF Document</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Abstract */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  Project Abstract
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  Practical skills and real-world experience are crucial for career success, yet students often find it difficult to discover relevant internships, apprenticeships and skill-training programs. The Youth Skill Development and Internship Finder App brings internship discovery, skill development and application management into one unified web platform. Students can register, identify missing competencies through AI skill-gap analysis, access curated learning resources, and monitor their application pipeline on a centralized dashboard.
                </p>
              </div>

              {/* Community Mission & Universal Career Empowerment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Universal Mission Card */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-500" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                      Universal Youth Empowerment Mission
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Designed as an open, democratized career acceleration platform for students and job-seekers across all universities and disciplines. Built to eliminate the experience-opportunity paradox by uniting skill validation, AI video mock preparation, and verified opportunities.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Open to All Students
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      LinkedIn-Style Profiles
                    </span>
                  </div>
                </div>

                {/* Account Holder Active Profile */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/70 dark:from-slate-800/90 dark:to-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                        Active Account Holder
                      </h4>
                    </div>

                    <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-blue-100 dark:border-slate-700/70 space-y-1">
                      <div className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-semibold">Registered Candidate</div>
                      <div className="font-bold text-slate-900 dark:text-white text-base">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">{user.headline}</div>
                      <div className="text-[11px] text-slate-500 pt-1">
                        {user.college} • {user.branch}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                    All skills, applications, and video mock evaluations are linked to your profile
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-500" />
                Implemented System Architecture & Modules (Chapter 2.2)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    A. Authentication & Profiles
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    LinkedIn-style authentication, custom profile creation, and dynamic skill management displaying only the active account holder.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    B. Opportunity Search & Location
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Search engine for internships, apprenticeships, and training programs across Bangalore, Mangalore, Sullia, and Remote.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    C. AI Recommendation Engine
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Dynamic matching scoring (60-98%) powered by Gemini API based on student skills and target career path.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    D. Skill-Gap Analysis
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Compares student skills against target roles, highlights critical and secondary gaps, and provides an actionable 6-week roadmap.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    E. Curated Learning Resources
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    NPTEL, Swayam, freeCodeCamp, and Coursera links directly bridging identified gaps with auto-skill graduation.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    F. Application Pipeline Tracker
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Centralized Kanban board & table tracking: Saved, Applied, Under Review, Interview, and Offers with notes.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 sm:col-span-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    G. Future Extensions (Section 1.2 Implemented)
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    AI Resume ATS scanner with keyword gap analysis, plus interactive AI Technical Mock Interview Coach.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Official Submitted Synopsis Document
                  </h3>
                  <p className="text-xs text-slate-500">
                    Department of CS&E, KVGCE Sullia (Pages 1 - 9)
                  </p>
                </div>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open PDF in New Window</span>
                </a>
              </div>

              <div className="w-full h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="Project Synopsis PDF"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            VTU Belagavi • Dept of CS&E, KVGCE
          </span>
          <button
            onClick={() => setIsSynopsisOpen(false)}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
