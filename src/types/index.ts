export type OpportunityType = 'Internship' | 'Apprenticeship' | 'Skill Training Program';
export type WorkMode = 'Remote' | 'On-site' | 'Hybrid';
export type ApplicationStatus = 'Saved' | 'Applied' | 'Under Review' | 'Interview Scheduled' | 'Offer Received' | 'Rejected';

export interface UserSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'AI & ML' | 'Mobile' | 'Tools' | 'Core CS';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  headline?: string; // LinkedIn style headline
  avatarUrl?: string;
  bannerUrl?: string;
  institutionId?: string; // Student ID, Roll No, or USN (optional)
  college: string; // University, College, School, or Bootcamp/Self-Taught
  educationLevel: 'Undergraduate / College' | 'Diploma / Polytechnic' | 'Postgraduate' | 'High School' | 'Self-Taught / Career Switcher';
  branch: string; // Field of study / major
  graduationYear: string;
  targetRole: string;
  location: string;
  preferredLocations: string[];
  openToRemote: boolean;
  minStipend: number;
  skills: UserSkill[];
  interests: string[];
  bio: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface VideoMockQuestion {
  id: string;
  type: 'Technical Viva' | 'System Architecture' | 'Coding Logic' | 'Behavioral HR';
  question: string;
  contextHint: string;
  expectedKeywords: string[];
  durationSeconds: number;
}

export interface VideoAnswerEvaluation {
  score: number;
  confidenceRating: string;
  technicalAccuracy: number;
  communicationClarity: number;
  positiveFeedback: string;
  areasForImprovement: string;
  recommendedAnswerAddition: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  logoBg: string;
  type: OpportunityType;
  mode: WorkMode;
  location: string;
  city: string;
  state: string;
  stipend: string;
  stipendNumeric: number; // e.g. 15000 (0 for unpaid)
  duration: string;
  deadline: string;
  postedDate: string;
  industry: string;
  skillsRequired: string[];
  description: string;
  responsibilities: string[];
  eligibility: string;
  perks: string[];
  providerType: 'Industry' | 'Government / AICTE' | 'Startup' | 'MNC' | 'Regional Hub';
  applyUrl?: string;
  isFeatured?: boolean;
}

export interface ApplicationItem {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  company: string;
  type: OpportunityType;
  location: string;
  stipend: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  notes: string;
  interviewDate?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  provider: 'NPTEL / Swayam' | 'Coursera' | 'freeCodeCamp' | 'MIT OCW' | 'YouTube / Open Source' | 'Google Cloud';
  skillCovered: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  url: string;
  isFree: boolean;
  rating: number;
  certificateOffered: boolean;
  enrolled: boolean;
  completed: boolean;
}

export interface SkillGapCriticalItem {
  name: string;
  reason: string;
  difficulty: string;
  estimatedHours: number;
}

export interface SkillGapActionPlanStep {
  step: number;
  week: string;
  focus: string;
  action: string;
}

export interface SkillGapResult {
  targetRole: string;
  readinessScore: number;
  summary: string;
  matchedSkills: string[];
  missingCriticalSkills: SkillGapCriticalItem[];
  missingRecommendedSkills: SkillGapCriticalItem[];
  actionPlan: SkillGapActionPlanStep[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'application' | 'opportunity' | 'skill' | 'system';
  targetTab?: string;
}
