import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Award,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { POPULAR_CAREER_PATHS, SKILL_CATEGORIES } from '../data/mockData';
import { SkillGapResult, UserSkill } from '../types';

export const SkillGapTab: React.FC = () => {
  const { user, updateProfile, addSkill, removeSkill, setActiveTab } = useApp();

  const [selectedRole, setSelectedRole] = useState<string>(user.targetRole || POPULAR_CAREER_PATHS[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SkillGapResult | null>(null);

  // Quick skill add form state
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState<any>('Backend');

  // Trigger analysis
  const runSkillGapAnalysis = async (roleToAnalyze: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: roleToAnalyze,
          userSkills: user.skills.map((s) => s.name),
          userInterests: user.interests,
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      if (data.success && data.data) {
        setAnalysisResult(data.data);
      }
    } catch (err) {
      console.error('Error running skill gap analysis:', err);
      // Fallback local calculation
      const fallbackSkills: Record<string, string[]> = {
        'Full Stack Developer': ['React', 'Node.js', 'Express', 'TypeScript', 'SQL', 'Git', 'Tailwind CSS', 'Docker', 'MongoDB'],
        'Data Scientist': ['Python', 'Pandas', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Scikit-Learn'],
        'Cloud & DevOps Engineer': ['Linux', 'Docker', 'Kubernetes', 'AWS', 'Python', 'Git', 'CI/CD Pipelines'],
        'Cybersecurity Analyst': ['Network Security', 'Linux', 'Wireshark', 'Python', 'Cryptography Basics', 'Ethical Hacking'],
        'Mobile App Developer': ['Flutter', 'React Native', 'REST APIs', 'Firebase', 'State Management'],
        'AI/ML Engineer': ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Data Structures', 'Linux'],
        'UI/UX Designer': ['Figma', 'Wireframing', 'User Research', 'Prototyping', 'Design Systems'],
      };

      const required = fallbackSkills[roleToAnalyze] || ['Core Programming', 'Data Structures', 'Git', 'Problem Solving'];
      const userSkillSet = new Set(user.skills.map((s) => s.name.toLowerCase()));

      const matched = required.filter((s) => userSkillSet.has(s.toLowerCase()));
      const missing = required.filter((s) => !userSkillSet.has(s.toLowerCase()));

      const score = Math.round((matched.length / Math.max(required.length, 1)) * 100);

      setAnalysisResult({
        targetRole: roleToAnalyze,
        readinessScore: Math.min(95, Math.max(35, score)),
        summary: `You possess ${matched.length} out of ${required.length} foundational competencies expected by hiring teams for ${roleToAnalyze}. Completing the missing technical modules will significantly boost your interview callback rate.`,
        matchedSkills: matched,
        missingCriticalSkills: missing.slice(0, 3).map((name) => ({
          name,
          reason: `High-frequency core requirement across 85%+ of ${roleToAnalyze} entry-level positions.`,
          difficulty: 'Intermediate',
          estimatedHours: 25,
        })),
        missingRecommendedSkills: missing.slice(3).map((name) => ({
          name,
          reason: `Modern differentiator that gives candidates an edge during technical assessments.`,
          difficulty: 'Beginner',
          estimatedHours: 15,
        })),
        actionPlan: [
          { step: 1, week: 'Week 1-2', focus: missing[0] || 'Core Stack', action: `Complete hands-on tutorials and build a basic proof-of-concept repository on GitHub.` },
          { step: 2, week: 'Week 3-4', focus: missing[1] || 'Applied Project', action: `Integrate ${missing[0] || 'core tools'} into a portfolio web application with documentation.` },
          { step: 3, week: 'Week 5-6', focus: 'Evaluation & Applications', action: `Test code against real test suites and apply to 3 matched internships on the platform.` },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  // Run on mount or when user changes targetRole
  useEffect(() => {
    runSkillGapAnalysis(selectedRole);
  }, [user.id]);

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
    updateProfile({ targetRole: newRole });
    runSkillGapAnalysis(newRole);
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    addSkill({
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: newSkillCategory,
    });

    setNewSkillName('');
    setIsAddingSkill(false);

    // Re-run analysis with updated skills
    setTimeout(() => {
      runSkillGapAnalysis(selectedRole);
    }, 100);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              AI Skill-Gap Analysis Engine
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold">
              Gemini 3.8 Powered
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare your verified competencies against industry hiring benchmarks and generate a tailored study roadmap.
          </p>
        </div>

        {/* Career Selector Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
            Target Career:
          </label>
          <select
            value={selectedRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="flex-1 sm:w-64 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            {POPULAR_CAREER_PATHS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button
            onClick={() => runSkillGapAnalysis(selectedRole)}
            disabled={loading}
            className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition disabled:opacity-50 cursor-pointer shadow-sm"
            title="Refresh Analysis"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Student's Current Skills Drawer / Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-500" />
              Your Current Verified Skills ({user.skills.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Update your skills whenever you finish a project or college lab course.
            </p>
          </div>

          <button
            onClick={() => setIsAddingSkill(!isAddingSkill)}
            className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 text-blue-600 dark:text-blue-300 font-semibold text-xs transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>

        {/* Add Skill Form */}
        {isAddingSkill && (
          <form
            onSubmit={handleAddSkillSubmit}
            className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Docker, TypeScript, PyTorch"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Proficiency Level
                </label>
                <select
                  value={newSkillLevel}
                  onChange={(e: any) => setNewSkillLevel(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Beginner">Beginner (Basic Syntax & Labs)</option>
                  <option value="Intermediate">Intermediate (Built Mini Projects)</option>
                  <option value="Advanced">Advanced (Production / Deployment)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                  Category
                </label>
                <select
                  value={newSkillCategory}
                  onChange={(e: any) => setNewSkillCategory(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {SKILL_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddingSkill(false)}
                className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm"
              >
                Save Skill
              </button>
            </div>
          </form>
        )}

        {/* Skills Tag Cloud */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {user.skills.map((skill) => (
            <div
              key={skill.name}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs border border-slate-200 dark:border-slate-700 group"
            >
              <span className="font-semibold">{skill.name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                • {skill.level}
              </span>
              <button
                onClick={() => {
                  removeSkill(skill.name);
                  setTimeout(() => runSkillGapAnalysis(selectedRole), 100);
                }}
                className="text-slate-400 hover:text-rose-500 transition opacity-60 group-hover:opacity-100 cursor-pointer ml-1"
                title="Remove skill"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis Result Display */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Gemini AI is analyzing your skill profile against {selectedRole} industry criteria...
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Extracting matching competencies, prioritizing critical bottlenecks, and generating a 6-week curriculum.
          </p>
        </div>
      ) : analysisResult ? (
        <div className="space-y-6">
          {/* Readiness Score Card */}
          <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/40 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Analysis Summary
                </span>
                <span className="text-xs text-slate-400">• For {analysisResult.targetRole}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Career Readiness Index: {analysisResult.readinessScore}%
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysisResult.summary}
              </p>
            </div>

            {/* Circular Gauge / Indicator */}
            <div className="flex items-center gap-4 bg-slate-900/80 border border-white/10 rounded-2xl p-4 self-stretch md:self-auto justify-center">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">
                  {analysisResult.readinessScore}%
                </div>
                <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                  {analysisResult.readinessScore >= 75
                    ? 'Interview Ready 🚀'
                    : analysisResult.readinessScore >= 50
                    ? 'Good Trajectory 📈'
                    : 'Foundation Needed 📚'}
                </div>
              </div>
            </div>
          </div>

          {/* Three Competency Breakdown Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Matched Skills */}
            <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-950/80 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-950">
                <h3 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Matched Competencies ({analysisResult.matchedSkills.length})
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Skills you already possess that meet employer prerequisites.
              </p>
              <div className="space-y-2">
                {analysisResult.matchedSkills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No direct matches yet. Start with foundational skills below.</p>
                ) : (
                  analysisResult.matchedSkills.map((skill) => (
                    <div
                      key={skill}
                      className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                        {skill}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 2. Critical Skill Gaps */}
            <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950/80 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-rose-950">
                <h3 className="font-bold text-rose-700 dark:text-rose-400 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Critical Gaps ({analysisResult.missingCriticalSkills.length})
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                High-priority skills required in initial screening rounds.
              </p>
              <div className="space-y-2.5">
                {analysisResult.missingCriticalSkills.map((item) => (
                  <div
                    key={item.name}
                    className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900 dark:text-rose-200">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> ~{item.estimatedHours} hrs
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                      {item.reason}
                    </p>
                    <button
                      onClick={() => setActiveTab('learning')}
                      className="mt-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" />
                      Bridge with Learning Resource
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Recommended Secondary Skills */}
            <div className="bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-950/80 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-amber-100 dark:border-amber-950">
                <h3 className="font-bold text-amber-700 dark:text-amber-400 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  Advantage Skills ({analysisResult.missingRecommendedSkills.length})
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Value-add competencies that give you competitive edge.
              </p>
              <div className="space-y-2.5">
                {analysisResult.missingRecommendedSkills.map((item) => (
                  <div
                    key={item.name}
                    className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 dark:text-amber-200">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        ~{item.estimatedHours} hrs
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                      {item.reason}
                    </p>
                    <button
                      onClick={() => setActiveTab('learning')}
                      className="mt-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3 h-3" />
                      Find Free Course
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI 6-Week Action Roadmap */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  AI-Curated 6-Week Action Roadmap
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Follow this structured timeline to bridge all critical skill gaps before applying.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('learning')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Browse Curated Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {analysisResult.actionPlan.map((step) => (
                <div
                  key={step.step}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-md">
                      {step.week}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Step {step.step}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {step.focus}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
