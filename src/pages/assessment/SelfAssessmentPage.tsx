import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Send,
  Target,
  FileCheck2,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { db } from '../../lib/database';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const SelfAssessmentPage: React.FC = () => {
  const { user, role } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  // Self-ratings state
  const [kpiDeliverables, setKpiDeliverables] = useState([
    {
      id: 'kpi-1',
      code: 'ENG-KPI-01',
      name: 'Sprint Story Points & Delivery Reliability',
      target: '80 pts',
      actual: '85 pts',
      selfScore: 106,
      selfNotes: 'Successfully completed 85 story points across sprints 14 to 18 with 0 sprint rollovers.',
    },
    {
      id: 'kpi-2',
      code: 'ENG-KPI-02',
      name: 'Production Defect Density & SLA MTTR',
      target: '2.0 hrs',
      actual: '1.5 hrs',
      selfScore: 120,
      selfNotes: 'Resolved tier-1 platform defects within an average of 1.5 hours, well within the SLA.',
    },
    {
      id: 'kpi-3',
      code: 'ENG-KPI-03',
      name: 'Architecture & Microservice Scalability',
      target: '100 %',
      actual: '92 %',
      selfScore: 92,
      selfNotes: 'Migrated 4 of 5 core services to modular microservice architecture. Final service staged for Q2.',
    },
  ]);

  // Qualitative reflection
  const [keyAchievements, setKeyAchievements] = useState(
    'Led cross-team technical architecture review for tokenized design system. Mentored 2 junior engineers through their first major production PRs.'
  );
  const [blockers, setBlockers] = useState(
    'Cross-team staging environment stability issues caused a 3-day test delay in Sprint 16.'
  );
  const [growthGoals, setGrowthGoals] = useState(
    'Achieve AWS Certified Solutions Architect Professional certification and take ownership of RFC architecture reviews.'
  );

  const handleSubmitSelfReview = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    db.addAuditLog({
      userId: user?.id || 'emp-self',
      userName: user?.fullName || 'Employee',
      userRole: role,
      action: 'SUBMIT_SELF_ASSESSMENT',
      module: 'Assessment Workflow',
      details: 'Employee submitted self-evaluation scorecard and reflection for 2026 Q1 cycle.',
    });
  };

  const avgSelfScore = Math.round(
    kpiDeliverables.reduce((acc, curr) => acc + curr.selfScore, 0) / kpiDeliverables.length
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Stage 1: Self Reflection (Employee Portal)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight mt-1">
            Formulir Evaluasi Diri (Self-Assessment Form)
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5 max-w-2xl">
            Siklus Kinerja 2026 Q1 &bull; Isi refleksi capaian kinerja, klaim realisasi target KPI, dan komitmen pengembangan diri sebelum verifikasi atasan langsung.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/assessment/dossier">
            <Button variant="outline" size="sm" className="rounded-full text-xs">
              Preview Dossier Resmi
            </Button>
          </Link>
        </div>
      </div>

      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-sm font-black">Formulir Evaluasi Diri Berhasil Dikirim!</p>
              <p className="text-[11px] text-emerald-700 font-normal">
                Berkas telah diteruskan ke atasan langsung (Supervisor Review) untuk proses verifikasi bukti dan penilaian kualitatif.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
            STATUS: SUBMITTED
          </span>
        </div>
      )}

      {/* Cycle Status Strip */}
      <div className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
              Batas Waktu Pengisian (Submission Deadline)
            </span>
            <span className="text-sm font-extrabold text-[#18181B]">Jumat, 5 Juni 2026 &bull; 23:59 WIB</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
              Rata-rata Skor Diri
            </span>
            <span className="text-base font-black text-[#EA580C]">{avgSelfScore}%</span>
          </div>
          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full font-bold text-[11px]">
            {submitted ? 'Sudah Diajukan' : 'Draft Tersimpan'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmitSelfReview} className="space-y-6">
        {/* KPI Deliverables Self-Rating Table */}
        <div className="bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3">
            <h3 className="text-sm font-black text-[#18181B] uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-[#EA580C]" />
              1. Penilaian Mandiri Deliverables KPI (Bobot 60%)
            </h3>
            <span className="text-[11px] text-[#78716C]">
              {kpiDeliverables.length} Indikator Kuantitatif Terdaftar
            </span>
          </div>

          <div className="space-y-4">
            {kpiDeliverables.map((kpi, idx) => (
              <div key={kpi.id} className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#EA580C]">{kpi.code}</span>
                    <h4 className="text-xs font-bold text-[#18181B]">{kpi.name}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-[#78716C]">Target: <strong>{kpi.target}</strong></span>
                    <span className="text-[#18181B]">Realisasi: <strong className="text-emerald-700">{kpi.actual}</strong></span>
                    <span className="bg-[#FFEDD5] text-[#C2410C] font-black px-2 py-0.5 rounded-full text-[11px]">
                      {kpi.selfScore}% Capaian
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#78716C] mb-1">
                    Catatan Refleksi Diri & Bukti Deliverable:
                  </label>
                  <textarea
                    rows={2}
                    value={kpi.selfNotes}
                    disabled={submitted}
                    onChange={(e) => {
                      const newNotes = e.target.value;
                      setKpiDeliverables((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, selfNotes: newNotes } : item))
                      );
                    }}
                    className="w-full bg-white border border-[#E7E4DC] rounded-xl p-2.5 text-xs text-[#18181B] focus:outline-none focus:border-[#EA580C]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qualitative Reflection */}
        <div className="bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3">
            <h3 className="text-sm font-black text-[#18181B] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#EA580C]" />
              2. Refleksi Kualitatif & Target Pertumbuhan Diri
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#18181B] mb-1">
                Kekuatan Utama & Pencapaian Terbesar Periode Ini:
              </label>
              <textarea
                rows={3}
                value={keyAchievements}
                disabled={submitted}
                onChange={(e) => setKeyAchievements(e.target.value)}
                placeholder="Deskripsikan kontribusi terbesar Anda, proyek yang tuntas, atau efisiensi yang diciptakan..."
                className="w-full bg-[#FAF9F6] border border-[#E7E4DC] rounded-2xl p-3 focus:outline-none focus:border-[#EA580C] text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#18181B] mb-1">
                Kendala Utama & Solusi yang Diterapkan (Blockers & Mitigations):
              </label>
              <textarea
                rows={2}
                value={blockers}
                disabled={submitted}
                onChange={(e) => setBlockers(e.target.value)}
                placeholder="Tantangan teknis/operasional dan bagaimana Anda mengatasinya..."
                className="w-full bg-[#FAF9F6] border border-[#E7E4DC] rounded-2xl p-3 focus:outline-none focus:border-[#EA580C] text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-[#18181B] mb-1">
                Sasaran Pengembangan Kompetensi (IDP Commitments):
              </label>
              <textarea
                rows={2}
                value={growthGoals}
                disabled={submitted}
                onChange={(e) => setGrowthGoals(e.target.value)}
                placeholder="Sertifikasi, keterampilan baru, atau keahlian kepemimpinan yang ingin Anda capai di kuartal berikutnya..."
                className="w-full bg-[#FAF9F6] border border-[#E7E4DC] rounded-2xl p-3 focus:outline-none focus:border-[#EA580C] text-xs"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        {!submitted && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="rounded-full text-xs font-semibold"
            >
              Simpan Sebagai Draft
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="rounded-full text-xs font-bold shadow-md shadow-orange-500/20"
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Kirim Evaluasi Diri ke Atasan
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
