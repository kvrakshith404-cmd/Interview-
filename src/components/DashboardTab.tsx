import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Briefcase,
  Target,
  BookOpen,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building2,
  Award,
  Zap,
  Bookmark,
  Video,
  Plus,
  Trash2,
  Layers,
  Clock,
  Eye,
  Share2,
  FileText,
  UserCheck,
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/mockData';

export const DashboardTab: React.FC = () => {
  const {
    user,
    opportunities,
    applications,
    learningResources,
    setActiveTab,
    setSelectedOpportunity,
    saveOpportunity,
    isOpportunitySaved,
    setInterviewTarget,
    calculateMatchScore,
    startVideoMockInterview,
    addSkill,
    removeSkill,
    setIsAuthModalOpen,
  } = useApp();

  const [isAddingSkillInline, setIsAddingSkillInline] = useState(false);
  const [inlineSkillName, setInlineSkillName] = useState('');
  const [inlineSkillLevel, setInlineSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  // Stats
  const totalOpportunities = opportunities.length;
  const appliedCount = applications.filter((a) => a.status === 'Applied').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview Scheduled').length;
  const savedCount = applications.filter((a) => a.status === 'Saved').length;

  const scores = opportunities.map((op) => calculateMatchScore(op));
  const avgReadiness = Math.round(scores.reduce((a, b) => a + b, 0) / (scores.length || 1));

  // Top matching opportunities
  const sortedOpportunities = [...opportunities]
    .map((op) => ({ ...op, matchScore: calculateMatchScore(op) }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  const upcomingInterviewApp = applications.find((a) => a.status === 'Interview Scheduled');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineSkillName.trim()) return;
    addSkill({
      name: inlineSkillName.trim(),
      level: inlineSkillLevel,
      category: 'Frontend',
    });
    setInlineSkillName('');
    setIsAddingSkillInline(false);
  };

  return (
    <div className="pb-12">
      {/* 3-Column LinkedIn-Style Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Account Holder Profile Card (col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            {/* Banner Photo */}
            <div className="h-20 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-900 relative" />

            {/* Profile Avatar & Details */}
            <div className="px-4 pb-4 -mt-10 text-center">
              <div className="w-18 h-18 rounded-full bg-white dark:bg-slate-900 p-1 mx-auto shadow-md">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-2xl text-white">
                  {user.name.charAt(0)}
                </div>
              </div>

              {/* ONLY ACCOUNT HOLDER'S NAME */}
              <h2 className="mt-2 text-base font-bold text-slate-900 dark:text-white leading-tight">
                {user.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                {user.headline || `${user.targetRole} Enthusiast`}
              </p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                {user.college}
              </p>
              <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{user.location}</span>
              </div>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="mt-3 w-full py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Edit Profile
              </button>
            </div>

            {/* LinkedIn-Style Profile Analytics */}
            <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-3 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  Profile views
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">142</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  Skill Readiness
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{avgReadiness}%</span>
              </div>
            </div>

            {/* Account Holder's Verified Skills Section */}
            <div className="border-t border-slate-100 dark:border-slate-800 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  My Skills ({user.skills.length})
                </span>
                <button
                  onClick={() => setIsAddingSkillInline(!isAddingSkillInline)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Inline Skill Add Input */}
              {isAddingSkillInline && (
                <form onSubmit={handleAddSkill} className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700">
                  <input
                    type="text"
                    value={inlineSkillName}
                    onChange={(e) => setInlineSkillName(e.target.value)}
                    placeholder="Enter skill (e.g. React, Python)"
                    className="w-full px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                    autoFocus
                  />
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={inlineSkillLevel}
                      onChange={(e: any) => setInlineSkillLevel(e.target.value)}
                      className="px-2 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingSkillInline(false)}
                        className="px-2 py-1 text-[11px] text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-48 overflow-y-auto">
                {user.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 group"
                  >
                    <span>{skill.name}</span>
                    <button
                      onClick={() => removeSkill(skill.name)}
                      className="text-slate-400 hover:text-rose-500 opacity-60 group-hover:opacity-100 transition cursor-pointer"
                      title="Remove skill"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Action in Left Profile Card */}
            <div className="border-t border-slate-100 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-850">
              <button
                onClick={() => startVideoMockInterview()}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <Video className="w-4 h-4 text-rose-300 animate-pulse" />
                <span>Video Mock Room</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Column: Feed / Action Box / Top Matches (col-span-6) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Quick Action Prompt Box (LinkedIn Style Post/Action prompt) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                {user.name.charAt(0)}
              </div>
              <div
                onClick={() => startVideoMockInterview()}
                className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-xs text-slate-500 dark:text-slate-400 font-medium cursor-pointer transition flex items-center justify-between"
              >
                <span>Ready to practice for your next interview, {user.name.split(' ')[0]}?</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>

            <div className="flex items-center justify-around pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                onClick={() => startVideoMockInterview()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition"
              >
                <Video className="w-4 h-4 text-rose-500" />
                <span>Video Convocation</span>
              </button>
              <button
                onClick={() => setActiveTab('skillgap')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition"
              >
                <Target className="w-4 h-4 text-purple-500" />
                <span>Skill-Gap AI</span>
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer transition"
              >
                <FileText className="w-4 h-4 text-blue-500" />
                <span>Resume ATS</span>
              </button>
            </div>
          </div>

          {/* Upcoming Interview Banner if scheduled */}
          {upcomingInterviewApp && (
            <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                    Upcoming Interview Scheduled
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    {upcomingInterviewApp.opportunityTitle} at {upcomingInterviewApp.company}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {upcomingInterviewApp.notes}
                  </p>
                </div>
              </div>

              <button
                onClick={() => startVideoMockInterview(upcomingInterviewApp.opportunityTitle)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join AI Video Prep</span>
              </button>
            </div>
          )}

          {/* Recommended Opportunities Stream */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Opportunities Matched for You
              </h3>
              <button
                onClick={() => setActiveTab('opportunities')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View all ({totalOpportunities})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {sortedOpportunities.map((op) => {
              const isSaved = isOpportunitySaved(op.id);
              return (
                <div
                  key={op.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 rounded-2xl p-4 shadow-xs hover:shadow-md transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl ${op.logoBg} text-white flex items-center justify-center font-bold text-base shrink-0 shadow-xs`}
                      >
                        {op.company.charAt(0)}
                      </div>
                      <div>
                        <h4
                          onClick={() => setSelectedOpportunity(op)}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer transition line-clamp-1"
                        >
                          {op.title}
                        </h4>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{op.company}</span>
                          <span>•</span>
                          <span className="text-[11px] text-slate-500">{op.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1 shrink-0">
                      <Zap className="w-3 h-3 fill-emerald-500" />
                      <span>{op.matchScore}% Match</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {op.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {op.stipend}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => startVideoMockInterview(op.title)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-rose-500 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                        title="AI Mock Video Interview for this role"
                      >
                        <Video className="w-3 h-3 text-rose-500" />
                        <span>Mock Prep</span>
                      </button>

                      <button
                        onClick={() => saveOpportunity(op)}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          isSaved
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 text-blue-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500'
                        }`}
                        title={isSaved ? 'Saved' : 'Save'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-500' : ''}`} />
                      </button>

                      <button
                        onClick={() => setSelectedOpportunity(op)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Video Convocation Spotlight & Skill Insights (col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Spotlight Card: Video Convocation Mock Preparation */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 border border-blue-800/60 rounded-2xl p-5 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">AI Video Convocation</h4>
                <span className="text-[10px] text-emerald-400 font-semibold">Webcam & Voice Enabled</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Practice real-time technical viva and behavioral rounds with our AI interviewer. Uses real microphone speech transcription and instant scoring.
            </p>

            <button
              onClick={() => startVideoMockInterview()}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
            >
              <Video className="w-4 h-4" />
              <span>Launch Video Mock Room</span>
            </button>
          </div>

          {/* Skill Readiness Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-500" />
                Target Readiness
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{avgReadiness}%</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${avgReadiness}%` }}
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                <span>Target: <strong>{user.targetRole}</strong></span>
              </div>
              <button
                onClick={() => setActiveTab('skillgap')}
                className="w-full py-1.5 px-3 rounded-lg border border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-semibold text-center transition cursor-pointer"
              >
                Run AI Skill-Gap Analysis
              </button>
            </div>
          </div>

          {/* Trending Industry Skills Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Trending Skills in 2026
            </h4>
            <div className="space-y-2">
              {[
                { name: 'TypeScript & Next.js', growth: '+42% demand' },
                { name: 'Docker & Kubernetes', growth: '+38% demand' },
                { name: 'Python & Generative AI', growth: '+65% demand' },
                { name: 'SQL & Database Indexing', growth: '+29% demand' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{item.growth}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
