import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  GraduationCap,
  Building2,
  MapPin,
  Save,
  CheckCircle,
  Briefcase,
  Sparkles,
  Layers,
  Lock,
  Mail,
  Plus,
  Trash2,
} from 'lucide-react';
import { POPULAR_CAREER_PATHS } from '../data/mockData';
import { UserSkill } from '../types';

export const AuthModal: React.FC = () => {
  const {
    user,
    updateProfile,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isSignedIn,
    signIn,
    signUp,
    addSkill,
  } = useApp();

  // Mode: 'signin' | 'signup' | 'edit'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'edit'>(isSignedIn ? 'edit' : 'signin');

  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState(user.email || '');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up / Edit inputs
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [headline, setHeadline] = useState(user.headline || `${user.targetRole || 'Software Engineering'} Aspirant`);
  const [college, setCollege] = useState(user.college || '');
  const [educationLevel, setEducationLevel] = useState<any>(user.educationLevel || 'Undergraduate / College');
  const [branch, setBranch] = useState(user.branch || '');
  const [targetRole, setTargetRole] = useState(user.targetRole || POPULAR_CAREER_PATHS[0]);
  const [location, setLocation] = useState(user.location || 'Bangalore, India');
  const [minStipend, setMinStipend] = useState(user.minStipend || 15000);
  const [bio, setBio] = useState(user.bio || '');

  // Skills input for sign up / edit
  const [currentSkills, setCurrentSkills] = useState<UserSkill[]>(user.skills || []);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      setAuthMode('edit');
    }
    setName(user.name);
    setEmail(user.email);
    setHeadline(user.headline || `${user.targetRole} Enthusiast`);
    setCollege(user.college);
    setEducationLevel(user.educationLevel || 'Undergraduate / College');
    setBranch(user.branch);
    setTargetRole(user.targetRole);
    setLocation(user.location);
    setMinStipend(user.minStipend);
    setBio(user.bio);
    setCurrentSkills(user.skills || []);
  }, [user, isSignedIn, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleAddSkillToDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    const exists = currentSkills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
    if (!exists) {
      const updated = [
        ...currentSkills,
        {
          name: newSkillName.trim(),
          level: newSkillLevel,
          category: 'Frontend' as const,
        },
      ];
      setCurrentSkills(updated);
    }
    setNewSkillName('');
  };

  const handleRemoveSkillFromDraft = (skillName: string) => {
    setCurrentSkills((prev) => prev.filter((s) => s.name.toLowerCase() !== skillName.toLowerCase()));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(loginEmail);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsAuthModalOpen(false);
    }, 800);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp({
      name,
      email,
      headline,
      college,
      educationLevel,
      branch,
      targetRole,
      location,
      minStipend: Number(minStipend),
      skills: currentSkills,
      bio,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsAuthModalOpen(false);
    }, 800);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      headline,
      college,
      educationLevel,
      branch,
      targetRole,
      location,
      minStipend: Number(minStipend),
      skills: currentSkills,
      bio,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsAuthModalOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* LinkedIn-Style Top Modal Header */}
        <div className="p-6 bg-slate-950 text-white border-b border-slate-800 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-sm text-white">
              in
            </span>
            <span className="font-bold text-sm tracking-tight text-white">
              YouthSkill Professional Network
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">
            {authMode === 'signin'
              ? 'Sign in to your account'
              : authMode === 'signup'
              ? 'Join & Create Your Candidate Profile'
              : `Edit Profile: ${user.name}`}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {authMode === 'signin'
              ? 'Stay updated on matching opportunities and practice mock interviews.'
              : authMode === 'signup'
              ? 'Create your account to showcase your skills and get AI interview preparation.'
              : 'Update your verified skills, education, and target career goals.'}
          </p>

          {/* Mode Tabs */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs">
            {isSignedIn ? (
              <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-semibold">
                Account Holder Profile
              </span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create New Account
                </button>
              </>
            )}
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 max-h-[62vh] overflow-y-auto">
          {authMode === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Sign In
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">New to the platform? </span>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Join now
                </button>
              </div>
            </form>
          ) : (
            /* Sign Up / Edit Profile Form */
            <form
              onSubmit={authMode === 'signup' ? handleSignUpSubmit : handleEditSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="candidate@example.com"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* LinkedIn Headline */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Computer Science Student | Aspiring Full Stack Developer"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. Institute of Technology"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Career Path
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                  >
                    {POPULAR_CAREER_PATHS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Verified Skills Management Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-500" />
                    Add Your Skills ({currentSkills.length})
                  </span>
                  <span className="text-[11px] text-slate-500">Used for match scoring</span>
                </div>

                {/* Inline add skill in modal */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Add skill (e.g. React, Docker, Python)"
                    className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white"
                  />
                  <select
                    value={newSkillLevel}
                    onChange={(e: any) => setNewSkillLevel(e.target.value)}
                    className="px-2 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-800 dark:text-slate-200"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddSkillToDraft}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                {/* Skill tag list */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentSkills.map((sk) => (
                    <span
                      key={sk.name}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      <span>{sk.name}</span>
                      <span className="text-[10px] text-slate-400">({sk.level})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkillFromDraft(sk.name)}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bangalore, Mumbai, Remote"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Min Stipend Expectation (₹)
                  </label>
                  <input
                    type="number"
                    value={minStipend}
                    onChange={(e) => setMinStipend(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated! Now showing account holder: {name}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm transition"
                >
                  {authMode === 'signup' ? 'Create Account & Sign In' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
