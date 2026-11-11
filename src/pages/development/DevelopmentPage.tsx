import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  TrendingUp,
  Target,
  AlertCircle,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Sparkles,
  BookOpen,
  Award,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { db } from '../../lib/database';

export const DevelopmentPage: React.FC = () => {
  const location = useLocation();
  const employees = db.getEmployees();
  const departments = db.getDepartments();

  // Determine active tab from URL or fallback
  const getInitialTab = () => {
    if (location.pathname.includes('/plan')) return 'plan';
    if (location.pathname.includes('/pip')) return 'pip';
    return 'coaching';
  };

  const [activeTab, setActiveTab] = useState<'coaching' | 'plan' | 'pip'>(getInitialTab());
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [showNewModal, setShowNewModal] = useState(false);

  // Sample structured data for coaching sessions
  const [coachingSessions, setCoachingSessions] = useState([
    {
      id: 'CS-101',
      employeeName: 'Sarah Jenkins',
      role: 'Staff Frontend Engineer',
      supervisorName: 'David Miller',
      date: 'Apr 12, 2026',
      topic: 'Q2 Technical Leadership & System Architecture Mentorship',
      status: 'Completed',
      actionItems: [
        { task: 'Lead architecture review for design system tokens', done: true },
        { task: 'Complete AWS Cloud Solutions Architect certification module', done: true },
        { task: 'Mentor 2 junior frontend engineers on test automation', done: false },
      ],
    },
    {
      id: 'CS-102',
      employeeName: 'Michael Chang',
      role: 'Product Analytics Lead',
      supervisorName: 'Marcus Sterling',
      date: 'Apr 18, 2026',
      topic: 'Executive Stakeholder Storytelling & Quarterly KPI Synthesis',
      status: 'Scheduled',
      actionItems: [
        { task: 'Prepare executive deck on cohort retention metrics', done: false },
        { task: 'Shadow VP of Product in board alignment sync', done: false },
      ],
    },
    {
      id: 'CS-103',
      employeeName: 'Amina Al-Mansoor',
      role: 'Senior Backend Engineer',
      supervisorName: 'David Miller',
      date: 'Mar 28, 2026',
      topic: 'Distributed Database Partitioning & Microservice Decoupling',
      status: 'Completed',
      actionItems: [
        { task: 'Draft RFC on Postgres read-replica scaling', done: true },
        { task: 'Conduct chaos engineering drill for payment webhooks', done: true },
      ],
    },
  ]);

  // Sample IDP roadmaps
  const idpRoadmaps = [
    {
      id: 'IDP-2026-01',
      employeeName: 'Sarah Jenkins',
      department: 'Engineering',
      currentLevel: 'Senior Engineer (IC4)',
      targetLevel: 'Staff Engineer (IC5)',
      progress: 75,
      goals: [
        { title: 'Enterprise Architecture Mastery', type: 'Skill', status: 'In Progress' },
        { title: 'Tech Talk on React 19 Performance', type: 'Visibility', status: 'Completed' },
        { title: 'Team Hiring & Technical Interviews', type: 'Leadership', status: 'Completed' },
      ],
    },
    {
      id: 'IDP-2026-02',
      employeeName: 'Robert Vance',
      department: 'Product',
      currentLevel: 'Product Manager (IC3)',
      targetLevel: 'Senior Product Manager (IC4)',
      progress: 60,
      goals: [
        { title: 'Financial Modeling & Unit Economics', type: 'Domain', status: 'In Progress' },
        { title: 'Customer Discovery Sprint Leadership', type: 'Execution', status: 'Completed' },
        { title: 'Roadmap Calibration Automation', type: 'Productivity', status: 'In Progress' },
      ],
    },
  ];

  // Sample PIP records
  const pipRecords = [
    {
      id: 'PIP-001',
      employeeName: 'Devon Lee',
      department: 'Customer Success',
      mentor: 'Elena Rostova',
      startDate: 'Mar 01, 2026',
      endDate: 'May 01, 2026',
      status: 'On Track',
      score: '84%',
      objectives: [
        'Achieve SLA ticket resolution time < 2.5 hours (Current: 2.1h)',
        'Maintain customer CSAT score above 92% (Current: 94%)',
        'Complete weekly 1-on-1 performance coaching syncs without absence',
      ],
    },
  ];

  const toggleActionItem = (sessionId: string, taskIdx: number) => {
    setCoachingSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const newActions = [...s.actionItems];
        newActions[taskIdx] = { ...newActions[taskIdx], done: !newActions[taskIdx].done };
        return { ...s, actionItems: newActions };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            People Enablement Suite
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            Growth & Development Workspace
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Structured 1-on-1 coaching logs, individual development roadmaps (IDP), and performance improvement plans (PIP).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Capsule Tab Switcher */}
          <div className="bg-[#EBE9E2] border border-[#DDD9CE] rounded-full p-1 flex items-center gap-1 shadow-xs">
            <button
              onClick={() => setActiveTab('coaching')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'coaching'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              Coaching Logs
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'plan'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              Development Plans (IDP)
            </button>
            <button
              onClick={() => setActiveTab('pip')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'pip'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              Remedial (PIP)
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowNewModal(true)}
            className="rounded-full shadow-xs"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            {activeTab === 'coaching' ? 'Log Session' : activeTab === 'plan' ? 'New IDP' : 'Initiate PIP'}
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
              1-on-1 Sessions Logged
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#18181B] mt-2">24 Sessions</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">
            ↑ +18% vs previous evaluation cycle
          </p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
              Enrolled in IDP Roadmaps
            </span>
            <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#18181B] mt-2">88 Employees</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">
            68.7% of total company headcount
          </p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
              Active PIP Monitoring
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#18181B] mt-2">1 Employee</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">
            92% Historical PIP Clearance Rate
          </p>
        </Card>
      </div>

      {/* Tab Content 1: Coaching Records */}
      {activeTab === 'coaching' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#18181B]">Recent Mentoring & Coaching Logs</h3>
            <span className="text-xs text-[#78716C]">Click any checklist item to toggle status</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coachingSessions.map((session) => (
              <Card key={session.id} className="p-4 border-[#E7E4DC] bg-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2 py-0.5 rounded-full">
                      {session.id}
                    </span>
                    <Badge variant={session.status === 'Completed' ? 'success' : 'warning'}>
                      {session.status}
                    </Badge>
                  </div>

                  <h4 className="text-sm font-bold text-[#18181B] mt-3 leading-snug">
                    {session.topic}
                  </h4>

                  <div className="mt-3 py-2 border-y border-[#F5EFE6] space-y-1.5 text-xs text-[#57534E]">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#A8A29E]" />
                      <span className="font-semibold text-[#18181B]">{session.employeeName}</span>
                      <span className="text-[10px] text-[#78716C]">({session.role})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#A8A29E]" />
                      <span>Coach: {session.supervisorName} &bull; {session.date}</span>
                    </div>
                  </div>

                  {/* Action items checklist */}
                  <div className="mt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] mb-1.5">
                      Mutual Action Commitments
                    </p>
                    <div className="space-y-1.5">
                      {session.actionItems.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleActionItem(session.id, idx)}
                          className="w-full text-left flex items-start gap-2 p-1.5 rounded-xl hover:bg-[#FDFBF9] cursor-pointer transition-colors"
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                              item.done
                                ? 'bg-[#EA580C] border-[#EA580C] text-white'
                                : 'border-[#DDD9CE] bg-white'
                            }`}
                          >
                            {item.done && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                          <span
                            className={`text-xs ${
                              item.done ? 'line-through text-[#A8A29E]' : 'text-[#292524] font-medium'
                            }`}
                          >
                            {item.task}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F5EFE6] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#78716C]">Enterprise Verified</span>
                  <button
                    onClick={() => alert(`Opening detailed coaching notes for ${session.id}`)}
                    className="text-[#EA580C] font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View Notes</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Development Plans (IDP) */}
      {activeTab === 'plan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#18181B]">Individual Development Roadmaps (IDP)</h3>
            <span className="text-xs text-[#78716C]">Career path milestones & skill matrix targets</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {idpRoadmaps.map((idp) => (
              <Card key={idp.id} className="p-5 border-[#E7E4DC] bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#18181B]">{idp.employeeName}</h4>
                    <p className="text-xs text-[#78716C]">
                      {idp.department} &bull; Promoting: {idp.currentLevel} → <span className="text-[#EA580C] font-bold">{idp.targetLevel}</span>
                    </p>
                  </div>
                  <span className="text-sm font-black text-[#EA580C] bg-[#FFEDD5] px-2.5 py-1 rounded-full">
                    {idp.progress}% Ready
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#EBE9E2] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#EA580C] h-full rounded-full transition-all duration-500"
                    style={{ width: `${idp.progress}%` }}
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-[#F5EFE6]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">
                    Development Milestones
                  </p>
                  {idp.goals.map((g, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-[#FDFBF9] border border-[#F5EFE6] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-[#EA580C]" />
                        <span className="font-semibold text-[#18181B]">{g.title}</span>
                      </div>
                      <Badge variant={g.status === 'Completed' ? 'success' : 'outline'}>
                        {g.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Performance Improvement Plan (PIP) */}
      {activeTab === 'pip' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#18181B]">Performance Improvement Plans (PIP)</h3>
            <span className="text-xs text-[#78716C]">Structured remedial reviews & escalation gates</span>
          </div>

          {pipRecords.map((pip) => (
            <Card key={pip.id} className="p-5 border-[#E7E4DC] bg-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5EFE6] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                      {pip.id}
                    </span>
                    <h4 className="text-base font-bold text-[#18181B]">{pip.employeeName}</h4>
                    <span className="text-xs text-[#78716C]">({pip.department})</span>
                  </div>
                  <p className="text-xs text-[#78716C] mt-1">
                    Supervised by <span className="font-semibold text-[#18181B]">{pip.mentor}</span> &bull; {pip.startDate} to {pip.endDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success">Status: {pip.status}</Badge>
                  <span className="text-xs font-black text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
                    Compliance: {pip.score}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-[#292524]">Mandatory Target Milestones:</p>
                <ul className="space-y-1.5 text-xs text-[#57534E]">
                  {pip.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Add Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#EFE4D7] space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#18181B]">
              {activeTab === 'coaching' ? 'Schedule New Coaching Session' : activeTab === 'plan' ? 'Draft New IDP Roadmap' : 'Initiate PIP Protocol'}
            </h3>
            <p className="text-xs text-[#78716C]">
              Select an employee and record milestones. Changes are persisted into the system audit trail.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#292524] block mb-1">Select Employee</label>
                <select className="w-full p-2.5 rounded-xl border border-[#DDD9CE] bg-white focus:outline-none focus:border-[#EA580C]">
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} &bull; {e.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#292524] block mb-1">Focus Topic / Core Objective</label>
                <input
                  type="text"
                  placeholder="e.g. Q2 Architecture mentorship & team leadership"
                  className="w-full p-2.5 rounded-xl border border-[#DDD9CE] focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F5EFE6]">
              <Button variant="outline" size="sm" onClick={() => setShowNewModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert('Session recorded successfully!');
                  setShowNewModal(false);
                }}
              >
                Save Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
