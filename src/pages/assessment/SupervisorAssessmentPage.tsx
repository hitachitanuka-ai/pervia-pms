import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  UserCheck,
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  Send,
  Star,
  FileCheck2,
  TrendingUp,
  Award,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { db } from '../../lib/database';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const SupervisorAssessmentPage: React.FC = () => {
  const { user, role } = useAuth();
  const employees = db.getEmployees();

  // Direct reports state
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || 'EMP-006');
  const [submittedRosters, setSubmittedRosters] = useState<string[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Appraiser scoring state
  const [kpiRating, setKpiRating] = useState(96);
  const [compRating, setCompRating] = useState(92);
  const [behavioralRating, setBehavioralRating] = useState(95);
  const [recommendation, setRecommendation] = useState<'Promote' | 'Retain & Reward' | 'Develop' | 'PIP'>(
    'Retain & Reward'
  );
  const [managerRemarks, setManagerRemarks] = useState(
    'Demonstrates exceptional engineering rigor and solid accountability. Consistently exceeds expectations on architecture delivery.'
  );

  const selectedEmployee = employees.find((e) => e.id === selectedEmpId) || employees[0];
  const isSelectedSubmitted = submittedRosters.includes(selectedEmpId);

  const handleEndorseAppraisal = () => {
    setSubmittedRosters((prev) => [...prev, selectedEmpId]);
    setSuccessToast(`Penilaian Atasan untuk ${selectedEmployee.fullName} berhasil disahkan!`);
    setTimeout(() => setSuccessToast(null), 4000);

    db.addAuditLog({
      userId: user?.id || 'supervisor',
      userName: user?.fullName || 'Supervisor',
      userRole: role,
      action: 'ENDORSE_SUPERVISOR_EVALUATION',
      module: 'Assessment Workflow',
      details: `Supervisor submitted appraisal for ${selectedEmployee.fullName} (${selectedEmployee.id}) with recommendation: ${recommendation}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              Stage 2: Supervisor Appraisal & Manager Endorsement
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight mt-1">
            Penilaian Atasan Langsung (Supervisor Review)
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5 max-w-2xl">
            Ruang kerja evaluasi atasan untuk memverifikasi pencapaian bawahan langsung, memberikan skor kualitatif kompetensi & perilaku, serta menentukan rekomendasi kompensasi/promosi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/assessment/dossier">
            <Button variant="outline" size="sm" className="rounded-full text-xs">
              Lihat Dossier PDF Resmi &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">STATUS: ENDORSED</span>
        </div>
      )}

      {/* Direct Reports Selector Cards */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider block">
          Pilih Anggota Tim yang Dinilai (Direct Reports):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {employees.slice(0, 4).map((emp) => {
            const isDone = submittedRosters.includes(emp.id);
            const isSelected = emp.id === selectedEmpId;

            return (
              <div
                key={emp.id}
                onClick={() => setSelectedEmpId(emp.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#EA580C] shadow-md shadow-orange-500/10 ring-2 ring-[#EA580C]/20'
                    : 'bg-[#FAF9F6] border-[#E7E4DC] hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-[#18181B] truncate">{emp.fullName}</h4>
                    <p className="text-[11px] text-[#78716C] truncate">{emp.role}</p>
                    <span className="text-[10px] text-[#A8A29E] font-mono mt-0.5 block">{emp.id}</span>
                  </div>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#FFEDD5] text-[#C2410C]'
                    }`}
                  >
                    {isDone ? '✓ Dinilai' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Scoring Workspace for Selected Employee */}
      <div className="bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] text-white flex items-center justify-center font-black text-sm shadow-sm">
              {selectedEmployee.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-black text-[#18181B]">{selectedEmployee.fullName}</h3>
              <p className="text-xs text-[#78716C]">
                {selectedEmployee.role} &bull; {selectedEmployee.departmentName} &bull; Cost Center: TECH-01
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/kpi/evidence`}
              className="text-xs text-[#EA580C] font-bold hover:underline flex items-center gap-1 bg-[#FFF7ED] px-3 py-1.5 rounded-full border border-[#FED7AA]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verifikasi Bukti Kinerja &rarr;</span>
            </Link>
          </div>
        </div>

        {/* 3 Scoring Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* KPI Actuals Slider */}
          <div className="bg-[#FAF9F6] border border-[#E7E4DC] p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#18181B]">1. Capaian KPI (60% Bobot)</span>
              <span className="text-sm font-black text-[#EA580C]">{kpiRating}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="125"
              step="1"
              value={kpiRating}
              disabled={isSelectedSubmitted}
              onChange={(e) => setKpiRating(parseInt(e.target.value))}
              className="w-full accent-[#EA580C] cursor-pointer"
            />
            <p className="text-[10px] text-[#78716C]">Skor tertimbang: {(kpiRating * 0.6).toFixed(1)} / 60.0 pts</p>
          </div>

          {/* Competency Slider */}
          <div className="bg-[#FAF9F6] border border-[#E7E4DC] p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#18181B]">2. Kompetensi Teknis (20%)</span>
              <span className="text-sm font-black text-[#EA580C]">{compRating}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="100"
              step="1"
              value={compRating}
              disabled={isSelectedSubmitted}
              onChange={(e) => setCompRating(parseInt(e.target.value))}
              className="w-full accent-[#EA580C] cursor-pointer"
            />
            <p className="text-[10px] text-[#78716C]">Skor tertimbang: {(compRating * 0.2).toFixed(1)} / 20.0 pts</p>
          </div>

          {/* Behavioral Slider */}
          <div className="bg-[#FAF9F6] border border-[#E7E4DC] p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#18181B]">3. Nilai Budaya (10%)</span>
              <span className="text-sm font-black text-[#EA580C]">{behavioralRating}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="100"
              step="1"
              value={behavioralRating}
              disabled={isSelectedSubmitted}
              onChange={(e) => setBehavioralRating(parseInt(e.target.value))}
              className="w-full accent-[#EA580C] cursor-pointer"
            />
            <p className="text-[10px] text-[#78716C]">Skor tertimbang: {(behavioralRating * 0.1).toFixed(1)} / 10.0 pts</p>
          </div>
        </div>

        {/* Qualitative Feedback & Promotion Recommendation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-[#18181B] mb-1">
              Catatan Kualitatif & Rekomendasi Atasan (Appraiser Remarks):
            </label>
            <textarea
              rows={3}
              value={managerRemarks}
              disabled={isSelectedSubmitted}
              onChange={(e) => setManagerRemarks(e.target.value)}
              className="w-full bg-[#FAF9F6] border border-[#E7E4DC] rounded-2xl p-3 text-xs focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#18181B] mb-1">
              Rekomendasi Karir & Kompensasi:
            </label>
            <select
              value={recommendation}
              disabled={isSelectedSubmitted}
              onChange={(e) => setRecommendation(e.target.value as any)}
              className="w-full bg-[#FAF9F6] border border-[#E7E4DC] rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#EA580C]"
            >
              <option value="Promote">Promote to Next Level (Siap Promosi ke IC5)</option>
              <option value="Retain & Reward">Retain & Reward (Kompensasi / Bonus Maksimal)</option>
              <option value="Develop">Standard Development Plan (Pertahankan Kinerja)</option>
              <option value="PIP">Remedial Plan (Perlu Monitoring Perbaikan)</option>
            </select>
            <p className="text-[10px] text-[#78716C] mt-2">
              Rekomendasi ini akan masuk ke pertimbangan sidang pleno Komite Kalibrasi 9-Box Grid.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E7E4DC]">
          <div className="text-xs text-[#78716C]">
            Estimasi Nilai Total: <strong className="text-[#EA580C] text-sm">{(kpiRating * 0.6 + compRating * 0.2 + behavioralRating * 0.1 + 9.5).toFixed(1)}%</strong>
          </div>

          {!isSelectedSubmitted ? (
            <Button
              variant="primary"
              size="md"
              onClick={handleEndorseAppraisal}
              className="rounded-full text-xs font-bold shadow-md shadow-orange-500/20"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Sahkan & Kirim Penilaian Atasan
            </Button>
          ) : (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Penilaian untuk pegawai ini telah disahkan & masuk tahap kalibrasi.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
