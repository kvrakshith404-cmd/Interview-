import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Opportunity,
  ApplicationItem,
  LearningResource,
  NotificationItem,
  UserSkill,
  ApplicationStatus,
} from '../types';
import {
  DEFAULT_STUDENT_PROFILES,
  MOCK_OPPORTUNITIES,
  MOCK_LEARNING_RESOURCES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface AppContextType {
  user: UserProfile;
  switchProfile: (userId: string) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  addSkill: (skill: UserSkill) => void;
  removeSkill: (skillName: string) => void;
  opportunities: Opportunity[];
  applications: ApplicationItem[];
  saveOpportunity: (opportunity: Opportunity) => void;
  applyToOpportunity: (opportunity: Opportunity, customNotes?: string) => void;
  updateApplicationStatus: (appId: string, status: ApplicationStatus, notes?: string, interviewDate?: string) => void;
  deleteApplication: (appId: string) => void;
  isOpportunitySaved: (opId: string) => boolean;
  getOpportunityApplication: (opId: string) => ApplicationItem | undefined;
  learningResources: LearningResource[];
  toggleEnrollResource: (resId: string) => void;
  toggleCompleteResource: (resId: string) => void;
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedOpportunity: Opportunity | null;
  setSelectedOpportunity: (op: Opportunity | null) => void;
  interviewTarget: Opportunity | null;
  setInterviewTarget: (op: Opportunity | null) => void;
  isSynopsisOpen: boolean;
  setIsSynopsisOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  calculateMatchScore: (op: Opportunity) => number;
  isSignedIn: boolean;
  signIn: (email: string, name?: string) => void;
  signUp: (data: Partial<UserProfile>) => void;
  signOut: () => void;
  isVideoRoomOpen: boolean;
  setIsVideoRoomOpen: (open: boolean) => void;
  videoInterviewRole: string;
  setVideoInterviewRole: (role: string) => void;
  startVideoMockInterview: (role?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. User Profile State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('youth_career_user_profile') || localStorage.getItem('kvgce_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_STUDENT_PROFILES[0]; // Aarav Sharma
  });

  // 2. Active Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // 3. Opportunities
  const [opportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);

  // 4. Applications
  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    const saved = localStorage.getItem('youth_career_applications') || localStorage.getItem('kvgce_applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    // Seed initial realistic application entries
    return [
      {
        id: 'app-seed-1',
        opportunityId: 'op-01',
        opportunityTitle: 'Frontend Engineering Intern',
        company: 'Zomato Tech Hub',
        type: 'Internship',
        location: 'Bangalore / Remote-Friendly',
        stipend: '₹35,000 / month',
        status: 'Under Review',
        appliedDate: '2026-10-26',
        lastUpdated: '2026-10-28',
        notes: 'Submitted resume and portfolio. Received automated confirmation email from talent acquisition.',
      },
      {
        id: 'app-seed-2',
        opportunityId: 'op-02',
        opportunityTitle: 'Full Stack Web Developer Apprentice',
        company: 'National Skill Development & Digital Mission',
        type: 'Apprenticeship',
        location: 'Hyderabad / Pan-India',
        stipend: '₹20,000 / month',
        status: 'Interview Scheduled',
        appliedDate: '2026-10-24',
        lastUpdated: '2026-10-29',
        interviewDate: '2026-11-08T14:30',
        notes: 'Round 1 technical screening cleared. Scheduled online technical interview with Lead Architect.',
      },
      {
        id: 'app-seed-3',
        opportunityId: 'op-06',
        opportunityTitle: 'Regional Digital Fellow (Full Stack)',
        company: 'Rural & Regional Innovation Network',
        type: 'Internship',
        location: 'Mangalore, Mysore & Tier-2 Centers',
        stipend: '₹18,000 / month',
        status: 'Applied',
        appliedDate: '2026-10-28',
        lastUpdated: '2026-10-28',
        notes: 'Regional digital inclusion initiative. Application submitted for the summer cohort.',
      },
    ];
  });

  // 5. Learning Resources
  const [learningResources, setLearningResources] = useState<LearningResource[]>(() => {
    const saved = localStorage.getItem('youth_career_learning_resources') || localStorage.getItem('kvgce_learning_resources');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return MOCK_LEARNING_RESOURCES;
  });

  // 6. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // 7. Modals & Authentication
  const [isSignedIn, setIsSignedIn] = useState<boolean>(() => {
    return localStorage.getItem('youth_career_is_signed_in') !== 'false';
  });
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [interviewTarget, setInterviewTarget] = useState<Opportunity | null>(null);
  const [isSynopsisOpen, setIsSynopsisOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // 8. Video Convocation / Mock Prep Room
  const [isVideoRoomOpen, setIsVideoRoomOpen] = useState<boolean>(false);
  const [videoInterviewRole, setVideoInterviewRole] = useState<string>(user.targetRole || 'Full Stack Developer');

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('youth_career_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('youth_career_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('youth_career_learning_resources', JSON.stringify(learningResources));
  }, [learningResources]);

  useEffect(() => {
    localStorage.setItem('youth_career_is_signed_in', isSignedIn ? 'true' : 'false');
  }, [isSignedIn]);

  // Actions
  const signIn = (email: string, name?: string) => {
    setIsSignedIn(true);
    if (name) {
      setUser((prev) => ({ ...prev, name, email }));
    }
    setIsAuthModalOpen(false);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Welcome Back!',
        message: `Signed in successfully as ${name || user.name}.`,
        time: 'Just now',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);
  };

  const signUp = (data: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: data.name || 'Account Holder',
      email: data.email || 'user@example.com',
      headline: data.headline || `${data.targetRole || 'Software Engineering'} Enthusiast`,
      targetRole: data.targetRole || 'Full Stack Developer',
      college: data.college || 'University',
      educationLevel: data.educationLevel || 'Undergraduate / College',
      branch: data.branch || 'Computer Science',
      graduationYear: data.graduationYear || '2027',
      location: data.location || 'Bangalore, India',
      preferredLocations: [data.location || 'Bangalore', 'Remote'],
      openToRemote: true,
      minStipend: data.minStipend || 15000,
      skills: data.skills && data.skills.length > 0 ? data.skills : [
        { name: 'JavaScript', level: 'Intermediate', category: 'Frontend' },
        { name: 'React', level: 'Beginner', category: 'Frontend' },
        { name: 'Git', level: 'Intermediate', category: 'Tools' },
      ],
      interests: data.interests || ['Software Engineering', 'Internships'],
      bio: data.bio || `Passionate about building scalable applications as a ${data.targetRole || 'developer'}.`,
    };
    setUser(newUser);
    setIsSignedIn(true);
    setIsAuthModalOpen(false);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Profile Created!',
        message: `Welcome ${newUser.name}! Your career profile and skill tracking is ready.`,
        time: 'Just now',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);
  };

  const signOut = () => {
    setIsSignedIn(false);
    setIsAuthModalOpen(true);
  };

  const startVideoMockInterview = (role?: string) => {
    if (role) {
      setVideoInterviewRole(role);
    } else if (user.targetRole) {
      setVideoInterviewRole(user.targetRole);
    }
    setIsVideoRoomOpen(true);
  };

  const switchProfile = (userId: string) => {
    const target = DEFAULT_STUDENT_PROFILES.find((p) => p.id === userId);
    if (target) {
      setUser(target);
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: 'Profile Switched',
          message: `Active persona switched to ${target.name} (${target.targetRole}).`,
          time: 'Just now',
          read: false,
          type: 'system',
        },
        ...prev,
      ]);
    }
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const addSkill = (newSkill: UserSkill) => {
    setUser((prev) => {
      const exists = prev.skills.some((s) => s.name.toLowerCase() === newSkill.name.toLowerCase());
      if (exists) {
        return {
          ...prev,
          skills: prev.skills.map((s) => (s.name.toLowerCase() === newSkill.name.toLowerCase() ? newSkill : s)),
        };
      }
      return {
        ...prev,
        skills: [...prev.skills, newSkill],
      };
    });
  };

  const removeSkill = (skillName: string) => {
    setUser((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name.toLowerCase() !== skillName.toLowerCase()),
    }));
  };

  const calculateMatchScore = (op: Opportunity): number => {
    if (!user.skills || user.skills.length === 0) return 40;
    const userSkillNames = new Set(user.skills.map((s) => s.name.toLowerCase()));
    let matchedCount = 0;
    op.skillsRequired.forEach((reqSkill) => {
      const reqLower = reqSkill.toLowerCase();
      if (userSkillNames.has(reqLower) || Array.from(userSkillNames).some((s) => s.includes(reqLower) || reqLower.includes(s))) {
        matchedCount++;
      }
    });

    const skillRatio = op.skillsRequired.length > 0 ? matchedCount / op.skillsRequired.length : 0.5;
    let score = Math.round(skillRatio * 70 + 20);

    // Location bonus
    if (
      op.mode === 'Remote' ||
      user.preferredLocations.some((loc) => op.location.toLowerCase().includes(loc.toLowerCase()))
    ) {
      score += 10;
    }

    return Math.min(98, Math.max(35, score));
  };

  const isOpportunitySaved = (opId: string): boolean => {
    return applications.some((a) => a.opportunityId === opId);
  };

  const getOpportunityApplication = (opId: string): ApplicationItem | undefined => {
    return applications.find((a) => a.opportunityId === opId);
  };

  const saveOpportunity = (opportunity: Opportunity) => {
    const existing = applications.find((a) => a.opportunityId === opportunity.id);
    if (existing) {
      return;
    }

    const newApp: ApplicationItem = {
      id: `app-${Date.now()}`,
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      company: opportunity.company,
      type: opportunity.type,
      location: opportunity.location,
      stipend: opportunity.stipend,
      status: 'Saved',
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      notes: 'Bookmarked for review and resume preparation.',
    };

    setApplications((prev) => [newApp, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Opportunity Bookmarked',
        message: `Saved "${opportunity.title}" at ${opportunity.company} to your application tracker.`,
        time: 'Just now',
        read: false,
        type: 'application',
        targetTab: 'applications',
      },
      ...prev,
    ]);
  };

  const applyToOpportunity = (opportunity: Opportunity, customNotes?: string) => {
    const existingIndex = applications.findIndex((a) => a.opportunityId === opportunity.id);

    if (existingIndex >= 0) {
      const updated = [...applications];
      updated[existingIndex] = {
        ...updated[existingIndex],
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        notes: customNotes || updated[existingIndex].notes || 'Application submitted with updated profile credentials.',
      };
      setApplications(updated);
    } else {
      const newApp: ApplicationItem = {
        id: `app-${Date.now()}`,
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        company: opportunity.company,
        type: opportunity.type,
        location: opportunity.location,
        stipend: opportunity.stipend,
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        notes: customNotes || 'Application submitted through Youth Skill & Internship Portal.',
      };
      setApplications((prev) => [newApp, ...prev]);
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Application Submitted!',
        message: `You applied for ${opportunity.title} at ${opportunity.company}. Track your progress on the dashboard.`,
        time: 'Just now',
        read: false,
        type: 'application',
        targetTab: 'applications',
      },
      ...prev,
    ]);
  };

  const updateApplicationStatus = (
    appId: string,
    status: ApplicationStatus,
    notes?: string,
    interviewDate?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status,
            notes: notes !== undefined ? notes : app.notes,
            interviewDate: interviewDate !== undefined ? interviewDate : app.interviewDate,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return app;
      })
    );
  };

  const deleteApplication = (appId: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== appId));
  };

  const toggleEnrollResource = (resId: string) => {
    setLearningResources((prev) =>
      prev.map((res) => {
        if (res.id === resId) {
          const nextEnrolled = !res.enrolled;
          return {
            ...res,
            enrolled: nextEnrolled,
            completed: nextEnrolled ? res.completed : false,
          };
        }
        return res;
      })
    );
  };

  const toggleCompleteResource = (resId: string) => {
    setLearningResources((prev) =>
      prev.map((res) => {
        if (res.id === resId) {
          const nextCompleted = !res.completed;
          if (nextCompleted) {
            // Also automatically add or level up this skill in user profile!
            addSkill({
              name: res.skillCovered,
              level: 'Intermediate',
              category: 'Backend',
            });
            setNotifications((n) => [
              {
                id: `notif-${Date.now()}`,
                title: 'Skill Mastered!',
                message: `You completed "${res.title}". Added/upgraded "${res.skillCovered}" in your profile!`,
                time: 'Just now',
                read: false,
                type: 'skill',
                targetTab: 'skills',
              },
              ...n,
            ]);
          }
          return {
            ...res,
            enrolled: true,
            completed: nextCompleted,
          };
        }
        return res;
      })
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        switchProfile,
        updateProfile,
        addSkill,
        removeSkill,
        opportunities,
        applications,
        saveOpportunity,
        applyToOpportunity,
        updateApplicationStatus,
        deleteApplication,
        isOpportunitySaved,
        getOpportunityApplication,
        learningResources,
        toggleEnrollResource,
        toggleCompleteResource,
        notifications,
        markAllNotificationsRead,
        activeTab,
        setActiveTab,
        selectedOpportunity,
        setSelectedOpportunity,
        interviewTarget,
        setInterviewTarget,
        isSynopsisOpen,
        setIsSynopsisOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        calculateMatchScore,
        isSignedIn,
        signIn,
        signUp,
        signOut,
        isVideoRoomOpen,
        setIsVideoRoomOpen,
        videoInterviewRole,
        setVideoInterviewRole,
        startVideoMockInterview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
