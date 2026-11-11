import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Target,
  BookOpen,
  Award,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  GraduationCap,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { db } from '../../lib/database';

export const DevelopmentPlanPage: React.FC = () => {
  const employees = db.getEmployees();
  const [showNewIDPModal, setShowNewIDPModal] = useState(false);

  // Sample IDP roadmaps data
  const [roadmaps, setRoadmaps] = useState([
    {
      id: 'IDP-2026-001',
      employeeName: 'Sarah Jenkins',
      department: 'Engineering',
      currentLevel: 'Senior Engineer (IC4)',
      targetLevel: 'Staff Engineer (IC5)',
      readinessScore: 78,
      mentor: 'David Miller',
      targetCompletion: 'Q3 2026',
      courses: [
        { name: 'Distributed Systems & Microservices (MIT OpenCourse)', status: 'Completed', provider: 'edX' },
        { name: 'AWS Certified Solutions Architect - Professional', status: 'In Progress', provider: 'AWS' },
        { name: 'Engineering Management & Technical Influence', status: 'Enrolled', provider: 'Internal Academy' },
      ],
      competencyFocus: [
        { skill: 'System Architecture', current: 4.2, target: 4.8 },
        { skill: 'Cross-Squad Leadership', current: 3.8, target: 4.5 },
        { skill: 'Mentorship & Coaching', current: 4.5, target: 4.8 },
      ],
    },
    {
      id: 'IDP-2026-002',
      employeeName: 'Robert Vance',
      department: 'Product',
      currentLevel: 'Product Manager (IC3)',
      targetLevel: 'Senior Product Manager (IC4)',
      readinessScore: 65,
      mentor: 'Marcus Sterling',
      targetCompletion: 'Q4 2026',
      courses: [
        { name: 'Product Analytics & Retention Modeling Masterclass', status: 'Completed', provider: 'Reforge' },
        { name: 'Financial Modeling & Enterprise SaaS Economics', status: 'In Progress', provider: 'Wharton Online' },
        { name: 'Executive Presentation & Strategic Alignment', status: 'Enrolled', provider: 'Pervia Academy' },
      ],
      competencyFocus: [
        { skill: 'Data-Informed Strategy', current: 4.0, target: 4.7 },
        { skill: 'Commercial Negotiation', current: 3.4, target: 4.2 },
        { skill: 'Customer Discovery', current: 4.4, target: 4.8 },
      ],
    },
    {
      id: 'IDP-2026-003',
      employeeName: 'Amina Al-Mansoor',
      department: 'Engineering',
      currentLevel: 'Senior Backend Engineer (IC4)',
      targetLevel: 'Principal Architect (IC6)',
      readinessScore: 82,
      mentor: 'David Miller',
      targetCompletion: 'Q4 2026',
      courses: [
        { name: 'High-Throughput Database Sharding & Cassandra Deep Dive', status: 'Completed', provider: 'O\'Reilly' },
        { name: 'Zero-Trust Security & PCI-DSS Compliance Architecture', status: 'In Progress', provider: 'SANS' },
      ],
      competencyFocus: [
        { skill: 'Infrastructure Resiliency', current: 4.6, target: 4.9 },
        { skill: 'Enterprise Governance', current: 3.9, target: 4.6 },
      ],
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            Talent Growth &bull; Career Pathways
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            Individual Development Plans (IDP)
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Structured career promotion ladders, skill progression roadmaps, and certified training milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowNewIDPModal(true)}
            className="rounded-full shadow-xs"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create New IDP
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Active IDP Roadmaps
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">88 Staff</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">68.7% company adoption rate</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Promotion Readiness Avg
          </span>
          <p className="text-2xl font-extrabold text-[#EA580C] mt-1">75.0%</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">Benchmark: 70% threshold</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Certifications Ingested
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">42 Completed</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">AWS, MIT, Reforge, SANS</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Target Graduation Window
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">Q3 - Q4 2026</p>
          <p className="text-[11px] text-[#EA580C] font-semibold mt-0.5">Aligned with annual appraisal</p>
        </Card>
      </div>

      {/* IDP Cards List */}
      <div className="space-y-4">
        {roadmaps.map((r) => (
          <Card key={r.id} className="p-6 border-[#E7E4DC] bg-white space-y-5">
            {/* Top row: Employee Name, Promotion Ladder & Readiness Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F5EFE6] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                    {r.id}
                  </span>
                  <h3 className="text-base font-bold text-[#18181B]">{r.employeeName}</h3>
                  <span className="text-xs text-[#78716C]">({r.department})</span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-[#57534E]">
                  <span className="font-semibold text-[#18181B]">{r.currentLevel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span className="font-bold text-[#EA580C]">{r.targetLevel}</span>
                  <span className="text-[#A8A29E]">&bull;</span>
                  <span>Mentor: <b>{r.mentor}</b></span>
                  <span className="text-[#A8A29E]">&bull;</span>
                  <span>Target: {r.targetCompletion}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#78716C] block">
                    Promotion Readiness
                  </span>
                  <span className="text-lg font-black text-[#EA580C]">{r.readinessScore}%</span>
                </div>
                <div className="w-16 h-2 bg-[#EBE9E2] rounded-full overflow-hidden">
                  <div
                    className="bg-[#EA580C] h-full rounded-full transition-all"
                    style={{ width: `${r.readinessScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Split row: Courses / Certifications & Competency Targets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Courses Column */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#EA580C]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                    Assigned Learning & Certifications
                  </h4>
                </div>

                <div className="space-y-2">
                  {r.courses.map((c, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#FDFBF9] border border-[#F5EFE6] text-xs"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-bold text-[#18181B] truncate">{c.name}</p>
                        <p className="text-[11px] text-[#78716C] mt-0.5">Provider: {c.provider}</p>
                      </div>
                      <Badge variant={c.status === 'Completed' ? 'success' : c.status === 'In Progress' ? 'warning' : 'outline'}>
                        {c.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competency Gap Target Matrix */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#EA580C]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                    Competency Rubric Benchmarks (1.0 - 5.0)
                  </h4>
                </div>

                <div className="space-y-2.5 p-3 rounded-2xl bg-[#FDFBF9] border border-[#F5EFE6]">
                  {r.competencyFocus.map((cf, idx) => {
                    const pct = (cf.current / 5.0) * 100;
                    return (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#18181B]">{cf.skill}</span>
                          <span className="text-[11px] text-[#78716C]">
                            Current: <b className="text-[#EA580C]">{cf.current}</b> &bull; Target: {cf.target}
                          </span>
                        </div>
                        <div className="w-full bg-[#EBE9E2] h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#EA580C] h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showNewIDPModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#EFE4D7] space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#18181B]">Create Individual Development Plan</h3>
            <p className="text-xs text-[#78716C]">
              Define promotion roadmap, target job level, and assigned training modules for this employee.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#292524] block mb-1">Select Candidate</label>
                <select className="w-full p-2.5 rounded-xl border border-[#DDD9CE] bg-white">
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.fullName} ({e.positionTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#292524] block mb-1">Target Promotion Role / Level</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Engineer (IC5) or Senior Product Manager"
                  className="w-full p-2.5 rounded-xl border border-[#DDD9CE]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#292524] block mb-1">Target Graduation Cycle</label>
                <select className="w-full p-2.5 rounded-xl border border-[#DDD9CE] bg-white">
                  <option>Q3 2026 Appraisal</option>
                  <option>Q4 2026 Annual Cycle</option>
                  <option>Q1 2027 Calibration</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F5EFE6]">
              <Button variant="outline" size="sm" onClick={() => setShowNewIDPModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert('IDP Roadmap successfully initialized and assigned to employee!');
                  setShowNewIDPModal(false);
                }}
              >
                Create Roadmap
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
