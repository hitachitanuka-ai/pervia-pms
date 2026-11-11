import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  CalendarDays,
  CalendarCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { db } from '../../lib/database';
import { Link } from 'react-router-dom';

interface MilestoneEvent {
  id: string;
  phase: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  owner: string;
  description: string;
  deliverableBadge: string;
}

export const EvaluationCalendarPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('May / June 2026');

  const milestones: MilestoneEvent[] = [
    {
      id: 'MS-01',
      phase: 'Phase 1: Goal Setting',
      title: 'KPI Target Setting & Alignment Cutoff',
      startDate: 'Jan 15, 2026',
      endDate: 'Feb 10, 2026',
      status: 'Completed',
      owner: 'Department Managers & HR',
      description: 'Penetapan target KPI kuantitatif deliverables dan pembagian bobot 60% KPI.',
      deliverableBadge: '100% Targets Locked',
    },
    {
      id: 'MS-02',
      phase: 'Phase 2: Self & Peer',
      title: 'Self-Assessment & 360 Feedback Window',
      startDate: 'May 15, 2026',
      endDate: 'June 5, 2026',
      status: 'In Progress',
      owner: 'All Employees & Peers',
      description: 'Pengisian evaluasi diri, klaim bukti deliverables, dan survei anonim 360 multi-rater.',
      deliverableBadge: 'Active Window',
    },
    {
      id: 'MS-03',
      phase: 'Phase 3: Manager Appraisal',
      title: 'Supervisor Qualitative Review & Scoring',
      startDate: 'June 6, 2026',
      endDate: 'June 18, 2026',
      status: 'Upcoming',
      owner: 'Direct Supervisors & Appraisers',
      description: 'Atasan langsung menilai kompetensi teknis, nilai budaya, dan memberikan endorsement.',
      deliverableBadge: 'Opens in 12 Days',
    },
    {
      id: 'MS-04',
      phase: 'Phase 4: Calibration',
      title: '9-Box Talent Calibration Committee Sessions',
      startDate: 'June 20, 2026',
      endDate: 'June 25, 2026',
      status: 'Upcoming',
      owner: 'HR Director & Division Heads',
      description: 'Sidang pleno kalibrasi matriks 9-box, normalisasi bell-curve, dan kuota grade A.',
      deliverableBadge: 'Committee Plenary',
    },
    {
      id: 'MS-05',
      phase: 'Phase 5: Final Ratification',
      title: 'Tri-Party Signature & Appraisal Dossier Publication',
      startDate: 'June 26, 2026',
      endDate: 'June 30, 2026',
      status: 'Upcoming',
      owner: 'CEO, HR Director & Employee',
      description: 'Penandatanganan berkas resmi digital SHA-256 dan pencairan bonus kinerja.',
      deliverableBadge: 'Official Seal Release',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              Siklus Kinerja 2026 Q1
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight mt-1">
            Kalender Evaluasi Kinerja (Evaluation Calendar)
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5 max-w-2xl">
            Jadwal milestone menyeluruh, batas waktu pengisian mandiri, sidang komite kalibrasi 9-box, dan tanggal rilis berkas appraisal resmi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/cycle/periods">
            <Button variant="outline" size="sm" className="rounded-full text-xs">
              Atur Periode Kinerja &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {/* Cycle Progress Bar */}
      <div className="bg-white rounded-3xl border border-[#E7E4DC] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#18181B]">Progres Siklus Evaluasi 2026 Q1</span>
          <span className="text-[#EA580C] font-black">Fase 2 Berjalan (42% Selesai)</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#FAF9F6] border border-[#E7E4DC] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FB923C] to-[#EA580C] rounded-full" style={{ width: '42%' }} />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#78716C]">
          <span>Mulai: 15 Jan 2026</span>
          <span className="font-bold text-[#18181B]">Tahap Saat Ini: Self & 360 Peer Review</span>
          <span>Selesai: 30 Jun 2026</span>
        </div>
      </div>

      {/* Milestone Timeline List */}
      <div className="space-y-4">
        {milestones.map((ms, idx) => (
          <div
            key={ms.id}
            className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs transition-all relative overflow-hidden ${
              ms.status === 'In Progress'
                ? 'border-[#EA580C] ring-2 ring-[#EA580C]/15 bg-[#FFFDFB]'
                : ms.status === 'Completed'
                ? 'border-[#E7E4DC] bg-[#FAF9F6]/60'
                : 'border-[#E7E4DC]'
            }`}
          >
            {ms.status === 'In Progress' && (
              <div className="absolute top-0 right-0 bg-[#EA580C] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                Sedang Berlangsung (Active Phase)
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
                    {ms.phase}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ms.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ms.status === 'In Progress'
                        ? 'bg-[#FFEDD5] text-[#C2410C]'
                        : 'bg-[#F4F4F5] text-[#71717A]'
                    }`}
                  >
                    {ms.deliverableBadge}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#18181B]">{ms.title}</h3>
                <p className="text-xs text-[#52525B] leading-relaxed">{ms.description}</p>
                <div className="text-[11px] text-[#78716C] pt-1">
                  Penanggung Jawab: <strong className="text-[#18181B]">{ms.owner}</strong>
                </div>
              </div>

              <div className="bg-[#FAF9F6] border border-[#E7E4DC] p-4 rounded-2xl text-xs space-y-1 md:text-right shrink-0">
                <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                  Jadwal Waktu Pelaksanaan
                </span>
                <span className="text-sm font-black text-[#18181B] block">
                  {ms.startDate} &ndash; {ms.endDate}
                </span>
                <span className="text-[11px] text-[#78716C] block">
                  Status: <strong>{ms.status}</strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
