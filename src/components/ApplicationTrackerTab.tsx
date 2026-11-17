import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Clock,
  Calendar,
  Building2,
  MapPin,
  ChevronRight,
  MoreVertical,
  Trash2,
  Edit3,
  Sparkles,
  Search,
  Filter,
  Columns,
  List,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { ApplicationItem, ApplicationStatus, Opportunity } from '../types';

const STATUS_COLUMNS: { status: ApplicationStatus; title: string; color: string; badgeBg: string }[] = [
  { status: 'Saved', title: 'Saved / Wishlist', color: 'border-slate-300 dark:border-slate-700', badgeBg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300' },
  { status: 'Applied', title: 'Applied', color: 'border-blue-400 dark:border-blue-700', badgeBg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300' },
  { status: 'Under Review', title: 'Under Review', color: 'border-purple-400 dark:border-purple-700', badgeBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300' },
  { status: 'Interview Scheduled', title: 'Interview Scheduled', color: 'border-amber-400 dark:border-amber-700', badgeBg: 'bg-amber-500/15 text-amber-800 dark:text-amber-300' },
  { status: 'Offer Received', title: 'Offer Received', color: 'border-emerald-400 dark:border-emerald-700', badgeBg: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300' },
  { status: 'Rejected', title: 'Archived / Rejected', color: 'border-rose-300 dark:border-rose-900', badgeBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300' },
];

export const ApplicationTrackerTab: React.FC = () => {
  const {
    applications,
    opportunities,
    updateApplicationStatus,
    deleteApplication,
    setInterviewTarget,
    setSelectedOpportunity,
    setActiveTab,
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editInterviewDate, setEditInterviewDate] = useState('');

  const filteredApplications = applications.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.opportunityTitle.toLowerCase().includes(q) ||
      app.company.toLowerCase().includes(q) ||
      app.location.toLowerCase().includes(q) ||
      app.notes.toLowerCase().includes(q)
    );
  });

  const handleStartEdit = (app: ApplicationItem) => {
    setEditingAppId(app.id);
    setEditNotes(app.notes || '');
    setEditInterviewDate(app.interviewDate || '');
  };

  const handleSaveEdit = (app: ApplicationItem) => {
    updateApplicationStatus(app.id, app.status, editNotes, editInterviewDate || undefined);
    setEditingAppId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Application Pipeline & Status Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Centralized management for all your submitted, reviewed, and scheduled interviews across companies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table View</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTab('opportunities')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Find More</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter tracked applications by company, position, or notes..."
          className="flex-1 text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none"
        />
        <span className="text-xs text-slate-400 mr-2">
          {filteredApplications.length} tracked
        </span>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((col) => {
            const colApps = filteredApplications.filter((a) => a.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3 flex flex-col min-h-[450px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    {col.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badgeBg}`}
                  >
                    {colApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colApps.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs italic">
                      No applications
                    </div>
                  ) : (
                    colApps.map((app) => {
                      const op = opportunities.find((o) => o.id === app.opportunityId);
                      const isEditing = editingAppId === app.id;

                      return (
                        <div
                          key={app.id}
                          className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3.5 shadow-xs hover:shadow-md transition space-y-2.5 relative group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4
                                onClick={() => {
                                  if (op) setSelectedOpportunity(op);
                                }}
                                className="font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2"
                              >
                                {app.opportunityTitle}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                {app.company}
                              </p>
                            </div>

                            <button
                              onClick={() => deleteApplication(app.id)}
                              className="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition p-1"
                              title="Delete from tracker"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{app.location}</span>
                          </div>

                          {/* Interview date reminder badge */}
                          {app.interviewDate && (
                            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-amber-500" />
                              <span>
                                {new Date(app.interviewDate).toLocaleString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          )}

                          {/* Notes snippet or edit */}
                          {isEditing ? (
                            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-700">
                              <textarea
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                placeholder="Add notes, recruiter email, test scores..."
                                className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                                rows={2}
                              />
                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">
                                  Interview Date/Time:
                                </label>
                                <input
                                  type="datetime-local"
                                  value={editInterviewDate}
                                  onChange={(e) => setEditInterviewDate(e.target.value)}
                                  className="w-full p-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white"
                                />
                              </div>
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingAppId(null)}
                                  className="px-2 py-0.5 text-[11px] text-slate-400 hover:text-slate-600"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveEdit(app)}
                                  className="px-2.5 py-0.5 bg-blue-600 text-white text-[11px] font-semibold rounded-md"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg line-clamp-2">
                              {app.notes || 'No custom notes added.'}
                            </div>
                          )}

                          {/* Status Shift dropdown & Actions */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-1">
                            <select
                              value={app.status}
                              onChange={(e: any) =>
                                updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                              }
                              className="text-[10px] font-semibold py-1 px-1.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-200 cursor-pointer"
                            >
                              <option value="Saved">Saved</option>
                              <option value="Applied">Applied</option>
                              <option value="Under Review">In Review</option>
                              <option value="Interview Scheduled">Interview</option>
                              <option value="Offer Received">Offer 🎉</option>
                              <option value="Rejected">Archived</option>
                            </select>

                            <div className="flex items-center gap-1">
                              {!isEditing && (
                                <button
                                  onClick={() => handleStartEdit(app)}
                                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                  title="Edit notes & date"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              )}

                              {op && (
                                <button
                                  onClick={() => setInterviewTarget(op)}
                                  className="p-1 text-amber-500 hover:text-amber-600"
                                  title="AI Interview Questions"
                                >
                                  <Sparkles className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Position & Company</th>
                  <th className="p-3.5">Type & Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Applied Date</th>
                  <th className="p-3.5">Interview / Notes</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredApplications.map((app) => {
                  const op = opportunities.find((o) => o.id === app.opportunityId);
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5">
                        <div
                          onClick={() => {
                            if (op) setSelectedOpportunity(op);
                          }}
                          className="font-bold text-slate-900 dark:text-white hover:text-blue-600 cursor-pointer text-sm"
                        >
                          {app.opportunityTitle}
                        </div>
                        <div className="text-slate-500 font-medium">{app.company}</div>
                      </td>
                      <td className="p-3.5">
                        <div>{app.type}</div>
                        <div className="text-slate-400 text-[11px]">{app.location}</div>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={app.status}
                          onChange={(e: any) =>
                            updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                          }
                          className="text-xs font-semibold py-1 px-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                          <option value="Saved">Saved</option>
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Offer Received">Offer Received</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-500">
                        {app.appliedDate}
                      </td>
                      <td className="p-3.5 max-w-xs">
                        {app.interviewDate && (
                          <div className="text-amber-600 dark:text-amber-400 font-semibold mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(app.interviewDate).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        )}
                        <p className="text-slate-500 dark:text-slate-400 line-clamp-1">{app.notes}</p>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {op && (
                            <button
                              onClick={() => setInterviewTarget(op)}
                              className="p-1.5 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition"
                              title="AI Interview Prep"
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteApplication(app.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
