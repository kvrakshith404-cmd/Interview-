import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Award,
  Clock,
  Star,
  ExternalLink,
  CheckCircle,
  Filter,
  Search,
  Sparkles,
  PlayCircle,
  GraduationCap,
} from 'lucide-react';

export const LearningResourcesTab: React.FC = () => {
  const { learningResources, toggleEnrollResource, toggleCompleteResource } = useApp();

  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Enrolled' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const skillsList = ['All', 'React', 'Node.js', 'SQL', 'Docker', 'Kubernetes', 'Python', 'Machine Learning', 'Linux', 'Figma', 'Flutter', 'Data Structures'];
  const providersList = ['All', 'NPTEL / Swayam', 'Coursera', 'freeCodeCamp', 'MIT OCW', 'Google Cloud', 'YouTube / Open Source'];

  const filteredResources = learningResources.filter((res) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchSkill = res.skillCovered.toLowerCase().includes(q);
      const matchProvider = res.provider.toLowerCase().includes(q);
      if (!matchTitle && !matchSkill && !matchProvider) return false;
    }

    if (selectedSkill !== 'All' && res.skillCovered.toLowerCase() !== selectedSkill.toLowerCase()) {
      return false;
    }

    if (selectedProvider !== 'All' && res.provider !== selectedProvider) {
      return false;
    }

    if (statusFilter === 'Enrolled' && !res.enrolled) return false;
    if (statusFilter === 'Completed' && !res.completed) return false;

    return true;
  });

  const enrolledCount = learningResources.filter((r) => r.enrolled).length;
  const completedCount = learningResources.filter((r) => r.completed).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-amber-500" />
              Curated Skill Learning Hub
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
              Free & Certified
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official courses from NPTEL/Swayam, freeCodeCamp, MIT OCW, and Coursera specifically aligned to bridge internship skill gaps.
          </p>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 shadow-sm text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400">Enrolled: </span>
            <strong className="text-blue-600 dark:text-blue-400">{enrolledCount}</strong>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div>
            <span className="text-slate-500 dark:text-slate-400">Mastered: </span>
            <strong className="text-emerald-600 dark:text-emerald-400">{completedCount}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search learning materials, skills, or platforms..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
            />
          </div>

          {/* Provider Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer"
            >
              {providersList.map((p) => (
                <option key={p} value={p}>
                  {p === 'All' ? 'All Platforms' : p}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
              {(['All', 'Enrolled', 'Completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    statusFilter === status
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Skills:</span>
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
                selectedSkill === skill
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => {
          return (
            <div
              key={res.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between ${
                res.completed
                  ? 'border-emerald-300 dark:border-emerald-800/70 bg-emerald-50/20'
                  : res.enrolled
                  ? 'border-blue-300 dark:border-blue-800/70 bg-blue-50/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Top provider and level row */}
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {res.provider}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{res.rating}</span>
                  </div>
                </div>

                {/* Course Title */}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                    {res.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      Skill: {res.skillCovered}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {res.level}
                    </span>
                  </div>
                </div>

                {/* Meta details */}
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {res.duration}
                  </span>
                  {res.certificateOffered && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <Award className="w-3.5 h-3.5" />
                      Certificate
                    </span>
                  )}
                  {res.isFree && (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">100% Free</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Portal</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleEnrollResource(res.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      res.enrolled
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    {res.enrolled ? 'Enrolled' : 'Enroll'}
                  </button>

                  <button
                    onClick={() => toggleCompleteResource(res.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                      res.completed
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 hover:text-emerald-700'
                    }`}
                    title={
                      res.completed
                        ? 'Mastered! Click to unmark'
                        : 'Mark as Completed to add this skill to your profile'
                    }
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{res.completed ? 'Mastered ✓' : 'Complete'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
