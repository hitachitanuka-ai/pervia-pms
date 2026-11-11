import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Calendar,
  FileCheck2,
  Plus,
  Shield,
  User,
  ExternalLink,
} from 'lucide-react';
import { db } from '../../lib/database';
import { exportPIPClearanceCertificatePdf } from '../../utils/exportHelpers';

export const PIPRecordsPage: React.FC = () => {
  const employees = db.getEmployees();
  const [showNewPIPModal, setShowNewPIPModal] = useState(false);

  const [pipRecords, setPipRecords] = useState([
    {
      id: 'PIP-2026-001',
      employeeName: 'Devon Lee',
      department: 'Customer Success',
      role: 'Support Escalation Specialist',
      mentor: 'Elena Rostova (HR Admin)',
      startDate: 'Mar 01, 2026',
      reviewDate: 'Apr 28, 2026',
      endDate: 'May 01, 2026',
      status: 'On Track',
      riskLevel: 'Moderate',
      complianceScore: '94%',
      objectives: [
        { desc: 'Achieve average ticket resolution time < 2.5 hours', current: '2.1h', status: 'Met' },
        { desc: 'Maintain customer satisfaction (CSAT) rating above 92%', current: '94.2%', status: 'Met' },
        { desc: 'Zero unexcused absences in daily standup and weekly 1-on-1s', current: '100% attendance', status: 'Met' },
        { desc: 'Complete 2 internal escalation training modules in LMS', current: '2 of 2 completed', status: 'Met' },
      ],
      weeklyCheckins: [
        { week: 'Week 1', note: 'Clear goals established; Devon committed to SLA overhaul.' },
        { week: 'Week 3', note: 'Resolution time dropped to 2.3h; noticeable improvement.' },
        { week: 'Week 5', note: 'CSAT trending at 94.2%; peer feedback positive.' },
      ],
    },
    {
      id: 'PIP-2026-002',
      employeeName: 'Julian Thorne',
      department: 'Sales Operations',
      role: 'Sales Data Analyst',
      mentor: 'Marcus Sterling (HR Manager)',
      startDate: 'Feb 15, 2026',
      reviewDate: 'Apr 15, 2026',
      endDate: 'Apr 30, 2026',
      status: 'Ready for Clearance',
      riskLevel: 'Low',
      complianceScore: '98%',
      objectives: [
        { desc: 'Deliver weekly CRM pipeline reconcile by Friday 3:00 PM', current: '100% on time', status: 'Met' },
        { desc: 'Zero data discrepancies in monthly commission audit spreadsheet', current: 'Audit passed with 0 errors', status: 'Met' },
        { desc: 'Publish standardized SQL snippet library for sales reporting', current: 'Published to repository', status: 'Met' },
      ],
      weeklyCheckins: [
        { week: 'Week 2', note: 'Automated CRM reconcile scripts; error rate eliminated.' },
        { week: 'Week 6', note: 'Commission audit submitted ahead of schedule.' },
        { week: 'Week 8', note: 'Recommended for full clearance by supervisor.' },
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            Governance &bull; Remedial Performance
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            Performance Improvement Plans (PIP)
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Structured 60/90-day remedial programs, SLA target milestones, bi-weekly reviews, and clearance sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowNewPIPModal(true)}
            className="rounded-full shadow-xs"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Initiate PIP Protocol
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Active PIP Cases
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">2 Employees</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">1.5% of total headcount</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Historical Clearance Rate
          </span>
          <p className="text-2xl font-extrabold text-[#16A34A] mt-1">92.0%</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">Employees returned to high performance</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Ready for Clearance
          </span>
          <p className="text-2xl font-extrabold text-[#0284C7] mt-1">1 Case</p>
          <p className="text-[11px] text-[#0284C7] font-semibold mt-0.5">Julian Thorne (98% compliance)</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            HR Protocol Compliance
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">100% Audit</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">All weekly check-ins documented</p>
        </Card>
      </div>

      {/* PIP Records List */}
      <div className="space-y-4">
        {pipRecords.map((pip) => (
          <Card key={pip.id} className="p-6 border-[#E7E4DC] bg-white space-y-5">
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5EFE6] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                    {pip.id}
                  </span>
                  <h3 className="text-base font-bold text-[#18181B]">{pip.employeeName}</h3>
                  <span className="text-xs text-[#78716C]">
                    ({pip.role} &bull; {pip.department})
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-[#57534E]">
                  <span>HR Lead: <b>{pip.mentor}</b></span>
                  <span className="text-[#A8A29E]">&bull;</span>
                  <span>Timeline: {pip.startDate} to {pip.endDate}</span>
                  <span className="text-[#A8A29E]">&bull;</span>
                  <span>Next Gate: <b>{pip.reviewDate}</b></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={pip.status === 'Ready for Clearance' ? 'success' : 'warning'}>
                  {pip.status}
                </Badge>
                <span className="text-xs font-black text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded-full">
                  Score: {pip.complianceScore}
                </span>
              </div>
            </div>

            {/* Target Objectives Checklist */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                Mandatory Deliverables & Measurable Metrics
              </h4>
              <div className="space-y-2">
                {pip.objectives.map((obj, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-[#FDFBF9] border border-[#F5EFE6] text-xs gap-1"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                      <span className="font-semibold text-[#18181B]">{obj.desc}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:self-auto self-end">
                      <span className="text-[#78716C] text-[11px]">Achieved: <b>{obj.current}</b></span>
                      <Badge variant="success">Passed</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Review Timeline Notes */}
            <div className="pt-3 border-t border-[#F5EFE6]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B] mb-2">
                Bi-Weekly Supervisory Review Log
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {pip.weeklyCheckins.map((check, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-[#F6F5F0] border border-[#E7E4DC] text-xs">
                    <p className="font-bold text-[#EA580C] text-[11px]">{check.week}</p>
                    <p className="text-[#57534E] mt-1 leading-snug">{check.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#F5EFE6] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#78716C]">Enforced under Enterprise Labor Governance Policy</span>
              <Button
                variant={pip.status === 'Ready for Clearance' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => {
                  exportPIPClearanceCertificatePdf({
                    id: pip.id,
                    employeeName: pip.employeeName,
                    department: pip.department,
                    mentor: pip.mentor,
                    startDate: pip.startDate,
                    endDate: pip.endDate,
                    notes: 'Pegawai berhasil menyelesaikan seluruh target peningkatan kinerja dan lulus evaluasi komprehensif.',
                  });
                }}
                className="rounded-full"
              >
                {pip.status === 'Ready for Clearance' ? 'Unduh Sertifikat Kelulusan (PDF)' : 'Unduh Berkas Review (PDF)'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showNewPIPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#EFE4D7] space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#18181B]">Initiate Performance Improvement Plan</h3>
            <p className="text-xs text-[#78716C]">
              Launch a formal 60-day remedial plan with documented SLA objectives and supervisory milestones.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#292524] block mb-1">Select Employee</label>
                <select className="w-full p-2.5 rounded-xl border border-[#DDD9CE] bg-white">
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} ({e.departmentName} - {e.positionTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#292524] block mb-1">Primary Performance Gap</label>
                <input
                  type="text"
                  placeholder="e.g. Failure to meet resolution SLA and ticket delivery quality"
                  className="w-full p-2.5 rounded-xl border border-[#DDD9CE]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#292524] block mb-1">Assigned HR Sponsor & Mentor</label>
                <select className="w-full p-2.5 rounded-xl border border-[#DDD9CE] bg-white">
                  <option>Elena Rostova (HR Admin)</option>
                  <option>Marcus Sterling (HR Manager)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F5EFE6]">
              <Button variant="outline" size="sm" onClick={() => setShowNewPIPModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert('PIP protocol formally initialized with legal audit logging!');
                  setShowNewPIPModal(false);
                }}
              >
                Initiate Plan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
