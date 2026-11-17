import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  SlidersHorizontal,
  Bookmark,
  Building2,
  Calendar,
  Zap,
  Sparkles,
  ExternalLink,
  ChevronDown,
  X,
  CheckCircle,
} from 'lucide-react';
import { OpportunityType, WorkMode, Opportunity } from '../types';

export const OpportunitiesTab: React.FC = () => {
  const {
    opportunities,
    user,
    setSelectedOpportunity,
    saveOpportunity,
    isOpportunitySaved,
    setInterviewTarget,
    calculateMatchScore,
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [minStipend, setMinStipend] = useState<number>(0);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'stipend' | 'deadline'>('match');

  // List of all unique locations and skills for filter dropdowns
  const availableLocations = [
    { value: 'All', label: 'All Locations' },
    { value: 'Remote', label: 'Remote / Work from Anywhere' },
    { value: 'Bangalore', label: 'Bangalore' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Pune', label: 'Pune / Mumbai' },
    { value: 'Delhi', label: 'Delhi NCR' },
    { value: 'Mangalore', label: 'Mangalore / Coastal' },
    { value: 'Pan-India', label: 'Pan-India' },
  ];
  const availableSkills = ['All', 'React', 'Node.js', 'Python', 'SQL', 'Docker', 'Linux', 'Machine Learning', 'Figma', 'Git'];

  const filteredOpportunities = useMemo(() => {
    return opportunities
      .map((op) => ({
        ...op,
        matchScore: calculateMatchScore(op),
      }))
      .filter((op) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = op.title.toLowerCase().includes(q);
          const matchCompany = op.company.toLowerCase().includes(q);
          const matchIndustry = op.industry.toLowerCase().includes(q);
          const matchSkills = op.skillsRequired.some((s) => s.toLowerCase().includes(q));
          const matchLoc = op.location.toLowerCase().includes(q);
          if (!matchTitle && !matchCompany && !matchIndustry && !matchSkills && !matchLoc) {
            return false;
          }
        }

        // Type filter
        if (selectedType !== 'All' && op.type !== selectedType) {
          return false;
        }

        // Location filter
        if (selectedLocation !== 'All') {
          if (selectedLocation === 'Remote' && op.mode !== 'Remote') return false;
          if (selectedLocation !== 'Remote' && !op.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }
        }

        // Mode filter
        if (selectedMode !== 'All' && op.mode !== selectedMode) {
          return false;
        }

        // Provider filter
        if (selectedProvider !== 'All' && op.providerType !== selectedProvider) {
          return false;
        }

        // Min Stipend filter
        if (minStipend > 0 && op.stipendNumeric < minStipend) {
          return false;
        }

        // Skill filter
        if (selectedSkillFilter !== 'All') {
          const hasSkill = op.skillsRequired.some((s) =>
            s.toLowerCase().includes(selectedSkillFilter.toLowerCase())
          );
          if (!hasSkill) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return b.matchScore - a.matchScore;
        if (sortBy === 'stipend') return b.stipendNumeric - a.stipendNumeric;
        if (sortBy === 'deadline') return a.deadline.localeCompare(b.deadline);
        return 0;
      });
  }, [
    opportunities,
    searchQuery,
    selectedType,
    selectedLocation,
    selectedMode,
    selectedProvider,
    minStipend,
    selectedSkillFilter,
    sortBy,
    user.skills,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSelectedLocation('All');
    setSelectedMode('All');
    setSelectedProvider('All');
    setMinStipend(0);
    setSelectedSkillFilter('All');
    setSortBy('match');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedType !== 'All' ||
    selectedLocation !== 'All' ||
    selectedMode !== 'All' ||
    selectedProvider !== 'All' ||
    minStipend > 0 ||
    selectedSkillFilter !== 'All';

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Internships, Apprenticeships & Training Programs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse verified opportunities from leading startups, MNCs, and national government apprenticeship initiatives.
          </p>
        </div>

        {/* Opportunity Type Pill Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {['All', 'Internship', 'Apprenticeship', 'Skill Training Program'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedType === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {type === 'Skill Training Program' ? 'Training' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Main search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, skills (e.g. React, Python), or keywords..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Location filter */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[150px]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-8 pr-6 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {availableLocations.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Mode filter */}
            <div className="relative min-w-[120px]">
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="All">All Modes</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort by */}
            <div className="relative min-w-[130px]">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
              >
                <option value="match">Highest Match %</option>
                <option value="stipend">Highest Stipend</option>
                <option value="deadline">Nearest Deadline</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Secondary Filter Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Filter by Skill:
            </span>
            {availableSkills.map((sk) => (
              <button
                key={sk}
                onClick={() => setSelectedSkillFilter(sk)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
                  selectedSkillFilter === sk
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {sk}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Min stipend filter */}
            <select
              value={minStipend}
              onChange={(e) => setMinStipend(Number(e.target.value))}
              className="px-2.5 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value={0}>Any Stipend</option>
              <option value={15000}>Min ₹15,000 / mo</option>
              <option value={25000}>Min ₹25,000 / mo</option>
              <option value={35000}>Min ₹35,000 / mo</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-500 hover:text-rose-600 font-medium transition cursor-pointer ml-1"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-900 dark:text-white">{filteredOpportunities.length}</strong> opportunities
          {selectedLocation !== 'All' && ` in ${selectedLocation}`}
        </span>
        <span className="text-[11px]">
          Match scores computed against {user.name} ({user.skills.length} skills)
        </span>
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto stroke-[1.5]" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
            No opportunities match your current filters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try resetting your search query, expanding your location radius, or exploring related skill tags.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((op) => {
            const isSaved = isOpportunitySaved(op.id);
            return (
              <div
                key={op.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
              >
                {op.isFeatured && (
                  <div className="absolute -top-2.5 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
                    Featured
                  </div>
                )}

                <div className="space-y-3">
                  {/* Top card bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl ${op.logoBg} text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm`}
                      >
                        {op.company.charAt(0)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3
                            onClick={() => setSelectedOpportunity(op)}
                            className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-sm cursor-pointer transition"
                          >
                            {op.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{op.company}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {op.providerType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1 shrink-0">
                      <Zap className="w-3 h-3 fill-emerald-500" />
                      <span>{op.matchScore}% Match</span>
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {op.location} ({op.mode})
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/40">
                      {op.stipend}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {op.duration}
                    </span>
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {op.description}
                  </p>

                  {/* Skills required tags with highlight */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-medium text-slate-400">Required Skills:</div>
                    <div className="flex flex-wrap items-center gap-1">
                      {op.skillsRequired.map((skill) => {
                        const hasSkill = user.skills.some(
                          (s) => s.name.toLowerCase() === skill.toLowerCase()
                        );
                        return (
                          <span
                            key={skill}
                            className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                              hasSkill
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {hasSkill ? '✓ ' : ''}{skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => saveOpportunity(op)}
                      className={`p-2 rounded-lg border transition text-xs cursor-pointer flex items-center gap-1 ${
                        isSaved
                          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title={isSaved ? 'Bookmarked' : 'Save opportunity'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-blue-500' : ''}`} />
                      <span className="text-[11px] hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                      onClick={() => setInterviewTarget(op)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-400 text-slate-700 dark:text-slate-300 hover:text-amber-500 text-[11px] font-medium transition flex items-center gap-1 cursor-pointer"
                      title="Generate AI mock interview questions for this specific role"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span className="hidden sm:inline">AI Interview Prep</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedOpportunity(op)}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition cursor-pointer shadow-sm"
                  >
                    Details & Apply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
