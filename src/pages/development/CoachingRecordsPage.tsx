import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  TrendingUp,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Filter,
  Search,
  CheckSquare,
  FileText,
  UserCheck,
} from 'lucide-react';
import { db } from '../../lib/database';

export const CoachingRecordsPage: React.FC = () => {
  const employees = db.getEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Scheduled'>('All');
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedSessionNotes, setSelectedSessionNotes] = useState<string | null>(null);

  // Initial Coaching Sessions dataset
  const [sessions, setSessions] = useState([
    {
      id: 'CS-2026-001',
      employeeName: 'Sarah Jenkins',
      role: 'Staff Frontend Engineer',
      supervisorName: 'David Miller',
      date: 'Apr 14, 2026',
      time: '10:00 AM - 10:45 AM',
      topic: 'Q2 Technical Leadership, RFC Review & System Architecture Mentorship',
      status: 'Completed',
      notes: 'Sarah demonstrated strong progress on design system tokenization. Discussed transitioning to team-level RFC reviews and mentoring junior engineers. Follow up on AWS Solutions Architect certification.',
      sentiment: 'High Engagement',
      actionItems: [
        { task: 'Lead architecture review for design system tokens across squads', done: true },
        { task: 'Complete AWS Cloud Solutions Architect certification module', done: true },
        { task: 'Conduct bi-weekly pairing session with 2 junior frontend engineers', done: false },
      ],
    },
    {
      id: 'CS-2026-002',
      employeeName: 'Michael Chang',
      role: 'Product Analytics Lead',
      supervisorName: 'Marcus Sterling',
      date: 'Apr 18, 2026',
      time: '02:00 PM - 02:45 PM',
      topic: 'Executive Stakeholder Storytelling & Quarterly KPI Synthesis',
      status: 'Scheduled',
      notes: 'Prepare cohort retention deep-dive presentation for VP review. Align on ARR attribution model for Enterprise tier.',
      sentiment: 'On Track',
      actionItems: [
        { task: 'Draft executive summary slide deck on cohort retention curves', done: false },
        { task: 'Shadow VP of Product in quarterly board alignment sync', done: false },
      ],
    },
    {
      id: 'CS-2026-003',
      employeeName: 'Amina Al-Mansoor',
      role: 'Senior Backend Engineer',
      supervisorName: 'David Miller',
      date: 'Apr 08, 2026',
      time: '11:30 AM - 12:15 PM',
      topic: 'Distributed Database Partitioning & Read-Replica Optimization',
      status: 'Completed',
      notes: 'Reviewed Postgres failover latency benchmarks. Architecture design approved for Q2 deployment.',
      sentiment: 'Outstanding',
      actionItems: [
        { task: 'Publish RFC on Postgres read-replica pooling to internal wiki', done: true },
        { task: 'Conduct chaos testing drill for payment gateway webhooks', done: true },
      ],
    },
    {
      id: 'CS-2026-004',
      employeeName: 'Carlos Ramirez',
      role: 'Enterprise Account Executive',
      supervisorName: 'Sarah Chen',
      date: 'Apr 02, 2026',
      time: '04:00 PM - 04:30 PM',
      topic: 'High-Value Pipeline Acceleration & Deal Negotiation Strategy',
      status: 'Completed',
      notes: 'Reviewed 3 Fortune 500 enterprise pipeline accounts. Carlos hit 115% of Q1 quota targets.',
      sentiment: 'Exceptional',
      actionItems: [
        { task: 'Finalize multi-year contract proposal for Global Retail tenant', done: true },
        { task: 'Schedule executive sponsor introductory call with buyer CTO', done: true },
      ],
    },
  ]);

  const toggleActionItem = (sessionId: string, taskIdx: number) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        const newActions = [...s.actionItems];
        newActions[taskIdx] = { ...newActions[taskIdx], done: !newActions[taskIdx].done };
        return { ...s, actionItems: newActions };
      })
    );
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.supervisorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            People Development &bull; 1-on-1 Mentorship
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            Coaching & Mentoring Records
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Document supervisory coaching sessions, mutual action commitments, and follow-up milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowLogModal(true)}
            className="rounded-full shadow-xs"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Log New 1-on-1
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
              Total Sessions Logged
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#18181B] mt-2">24 Sessions</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">↑ +18% vs previous cycle</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
              Commitment Completion
            </span>
            <div className="w-8 h-8 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#18181B] mt-2">87.5%</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">28 / 32 action items cleared</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
              Active Supervisors
            </span>
            <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#18181B] mt-2">8 Mentors</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">100% supervisory compliance</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
              Next Upcoming Sync
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-sm font-bold text-[#18181B] mt-2">Michael Chang</p>
          <p className="text-[11px] text-[#EA580C] font-semibold mt-0.5">Apr 18, 02:00 PM</p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by employee, mentor, or topic..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-[#DDD9CE] bg-white focus:outline-none focus:border-[#EA580C]"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['All', 'Completed', 'Scheduled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'bg-white border border-[#DDD9CE] text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Coaching Session Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSessions.map((s) => (
          <Card key={s.id} className="p-5 border-[#E7E4DC] bg-white flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                    {s.id}
                  </span>
                  <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                    {s.sentiment}
                  </span>
                </div>
                <Badge variant={s.status === 'Completed' ? 'success' : 'warning'}>
                  {s.status}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-[#18181B] mt-2.5 leading-snug">
                {s.topic}
              </h3>

              <div className="mt-3 py-2 border-y border-[#F5EFE6] space-y-1.5 text-xs text-[#57534E]">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span className="font-bold text-[#18181B]">{s.employeeName}</span>
                  <span className="text-[10px] text-[#78716C]">({s.role})</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-[#A8A29E]" />
                  <span>
                    Mentor: <b className="text-[#18181B]">{s.supervisorName}</b> &bull; {s.date} ({s.time})
                  </span>
                </div>
              </div>

              {/* Action Commitments Checklist */}
              <div className="mt-3 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] block">
                  Agreed Action Commitments (Click to toggle)
                </span>
                {s.actionItems.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleActionItem(s.id, idx)}
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

            <div className="pt-3 border-t border-[#F5EFE6] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#78716C]">Confidential 1-on-1 Record</span>
              <button
                onClick={() => setSelectedSessionNotes(s.notes)}
                className="text-[#EA580C] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Read Coach Notes</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Notes Modal */}
      {selectedSessionNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#EFE4D7] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#EA580C]" />
              <h3 className="text-base font-bold text-[#18181B]">Supervisor Mentorship Notes</h3>
            </div>
            <p className="text-xs text-[#57534E] leading-relaxed bg-[#FDFBF9] p-4 rounded-2xl border border-[#F5EFE6]">
              {selectedSessionNotes}
            </p>
            <div className="flex justify-end pt-2">
              <Button variant="primary" size="sm" onClick={() => setSelectedSessionNotes(null)}>
                Close Notes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Log Session Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#EFE4D7] space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#18181B]">Log New Coaching Session</h3>
            <p className="text-xs text-[#78716C]">
              Record discussion agenda, commitments, and feedback notes for your direct report.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#292524] block mb-1">Select Direct Report</label>
                <select className="w-full p-2.5 rounded-xl border border-[#DDD9CE] bg-white">
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} &bull; {e.positionTitle}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#292524] block mb-1">Discussion Topic / Agenda</label>
                <input
                  type="text"
                  placeholder="e.g. Q2 Architecture mentorship & team leadership"
                  className="w-full p-2.5 rounded-xl border border-[#DDD9CE]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#292524] block mb-1">Key Takeaway / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Summary of feedback, growth opportunities, and guidance..."
                  className="w-full p-2.5 rounded-xl border border-[#DDD9CE]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F5EFE6]">
              <Button variant="outline" size="sm" onClick={() => setShowLogModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert('Coaching session saved and commitments sent to employee dashboard!');
                  setShowLogModal(false);
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
