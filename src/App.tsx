/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { OpportunitiesTab } from './components/OpportunitiesTab';
import { SkillGapTab } from './components/SkillGapTab';
import { LearningResourcesTab } from './components/LearningResourcesTab';
import { ApplicationTrackerTab } from './components/ApplicationTrackerTab';
import { AIResumeAnalyzerTab } from './components/AIResumeAnalyzerTab';
import { VideoMockInterviewRoom } from './components/VideoMockInterviewRoom';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { AIInterviewPrepModal } from './components/AIInterviewPrepModal';
import { SynopsisModal } from './components/SynopsisModal';
import { AuthModal } from './components/AuthModal';
import { GraduationCap, Heart, Info, ArrowUpRight } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, setIsSynopsisOpen } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'opportunities' && <OpportunitiesTab />}
        {activeTab === 'skillgap' && <SkillGapTab />}
        {activeTab === 'learning' && <LearningResourcesTab />}
        {activeTab === 'applications' && <ApplicationTrackerTab />}
        {activeTab === 'resume' && <AIResumeAnalyzerTab />}
      </main>

      {/* Global Modals & AI Video Mock Room */}
      <VideoMockInterviewRoom />
      <OpportunityDetailModal />
      <AIInterviewPrepModal />
      <SynopsisModal />
      <AuthModal />

      {/* Universal Footer */}
      <footer className="mt-auto bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-slate-200 text-sm">
                Youth Skill Development & Internship Finder
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-xl">
              A unified, accessible platform bridging education and the workforce through AI-guided skill-gap analysis, curated free learning resources, and centralized opportunity tracking for all youth.
            </p>
            <p className="text-[11px] text-slate-500">
              Open to students from all universities, colleges, polytechnics, and self-taught learners nationwide.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
            <div className="flex flex-wrap items-center justify-center gap-3 text-slate-300">
              <button
                onClick={() => setActiveTab('opportunities')}
                className="hover:text-blue-400 transition cursor-pointer"
              >
                Opportunities Directory
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('skillgap')}
                className="hover:text-blue-400 transition cursor-pointer"
              >
                AI Skill-Gap
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('learning')}
                className="hover:text-blue-400 transition cursor-pointer"
              >
                Learning Hub
              </button>
              <span>•</span>
              <button
                onClick={() => setIsSynopsisOpen(true)}
                className="hover:text-amber-400 transition font-medium flex items-center gap-1 cursor-pointer text-slate-300"
              >
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Academic Reference / Synopsis</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Inspired by VTU Academic Research • Open Source Career Advancement
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
