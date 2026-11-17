import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Briefcase,
  Target,
  BookOpen,
  CheckSquare,
  FileText,
  Bell,
  User,
  GraduationCap,
  Sparkles,
  ChevronDown,
  Info,
  ExternalLink,
  Video,
  LogOut,
  UserPlus,
  Plus,
  Search,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    applications,
    notifications,
    markAllNotificationsRead,
    setIsSynopsisOpen,
    setIsAuthModalOpen,
    startVideoMockInterview,
    signOut,
    isSignedIn,
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const activeApplicationsCount = applications.filter((a) => a.status !== 'Saved' && a.status !== 'Rejected').length;

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Compass },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'skillgap', label: 'Skill-Gap AI', icon: Target },
    { id: 'videomock', label: 'Video Mock Prep', icon: Video, highlight: true },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    {
      id: 'applications',
      label: 'Applications',
      icon: CheckSquare,
      badge: activeApplicationsCount > 0 ? activeApplicationsCount : undefined,
    },
    { id: 'resume', label: 'Resume ATS', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xs">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded font-bold text-[10px] bg-blue-600 text-white">
            in
          </span>
          <span className="font-semibold text-slate-200">
            SkillBridge • Youth Professional & Internship Network
          </span>
          <span className="hidden sm:inline text-slate-400">
            • AI Skill-Gap Roadmaps & Video Convocation Mock Preparation
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSynopsisOpen(true)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-amber-300 transition text-[11px] cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Academic Reference & Project Synopsis</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xl text-white tracking-tighter shadow-sm">
              in
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                YouthSkill
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  PRO
                </span>
              </span>
            </div>
          </div>

          {/* Center Navigation Links (LinkedIn Style Icons + Labels) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'videomock') {
                      startVideoMockInterview();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`relative flex flex-col items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer min-w-[64px] ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${item.highlight ? 'text-rose-500 animate-pulse' : ''}`} />
                    {item.badge !== undefined && (
                      <span className="absolute -top-1 -right-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
                  {item.highlight && (
                    <span className="absolute -top-1 right-0 text-[8px] font-extrabold uppercase px-1 rounded bg-rose-500 text-white">
                      LIVE
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Header: Video Mock Button + Account Holder Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Button to Launch Video Mock Interview */}
            <button
              onClick={() => startVideoMockInterview()}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Mock Prep</span>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 text-slate-800 dark:text-slate-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-blue-500" />
                      Notifications & Updates
                    </span>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 mt-2">
                    {notifications.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-4">No notifications yet</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            if (n.targetTab) setActiveTab(n.targetTab);
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 rounded-xl cursor-pointer transition text-xs ${
                            n.read
                              ? 'hover:bg-slate-50 dark:hover:bg-slate-800/50 opacity-80'
                              : 'bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Account Holder Profile Dropdown (SHOWS ONLY ACCOUNT HOLDER NAME) */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-left max-w-[120px]">
                  {/* SHOWS ONLY ACCOUNT HOLDER NAME */}
                  <div className="text-xs font-bold leading-tight text-slate-900 dark:text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {user.targetRole}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                  {/* Account Holder Badge */}
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate">
                          {user.college}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsAuthModalOpen(true);
                      }}
                      className="mt-2.5 w-full py-1.5 px-3 rounded-lg border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 text-xs font-semibold text-center transition cursor-pointer"
                    >
                      View & Edit Profile / Add Skills
                    </button>
                  </div>

                  {/* Quick Profile Actions */}
                  <div className="py-2 space-y-1 text-xs">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        startVideoMockInterview();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer transition font-medium"
                    >
                      <Video className="w-4 h-4 text-rose-500" />
                      <span>Start Video Mock Convocation</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setActiveTab('skillgap');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer transition font-medium"
                    >
                      <Target className="w-4 h-4 text-purple-500" />
                      <span>Analyze My Skill Gaps</span>
                    </button>
                  </div>

                  {/* Sign Out / Switch Account */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        signOut();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2 text-xs font-semibold cursor-pointer transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out / Switch Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'videomock') {
                    startVideoMockInterview();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.highlight && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
