import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Sparkles,
  Award,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  ShieldCheck,
  FileText,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Info,
  Layers,
  Printer,
} from 'lucide-react';
import { db } from '../../lib/database';
import { TalentGridItem, PotentialRating, PerformanceRating, FlightRisk, SuccessionReadiness } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { downloadExcel } from '../../utils/exportHelpers';

interface QuadrantConfig {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  potential: PotentialRating;
  performance: PerformanceRating;
  bgTint: string;
  borderTint: string;
  badgeBg: string;
  badgeText: string;
  strategy: string;
}

const QUADRANTS: QuadrantConfig[] = [
  // Row 3: High Potential
  {
    id: 'q-rough-diamond',
    code: '3A',
    title: 'Rough Diamond / Enigma',
    subtitle: 'High Potential • Low Performance',
    potential: 'High',
    performance: 'Low',
    bgTint: 'bg-amber-50/70',
    borderTint: 'border-amber-200',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    strategy: 'Coaching intensif, identifikasi hambatan delivery, evaluasi kesesuaian peran.',
  },
  {
    id: 'q-rising-star',
    code: '3B',
    title: 'Rising Star / Future Leader',
    subtitle: 'High Potential • Med Performance',
    potential: 'High',
    performance: 'Medium',
    bgTint: 'bg-orange-50/70',
    borderTint: 'border-orange-200',
    badgeBg: 'bg-orange-100',
    badgeText: 'text-[#EA580C]',
    strategy: 'Berikan tugas strategis (stretch assignments), bimbingan pimpinan eksekutif.',
  },
  {
    id: 'q-star',
    code: '3C',
    title: 'Star / Top Talent',
    subtitle: 'High Potential • High Performance',
    potential: 'High',
    performance: 'High',
    bgTint: 'bg-emerald-50/70',
    borderTint: 'border-emerald-300',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    strategy: 'Pilar utama kepemimpinan masa depan. Prioritas retensi & promosi berjenjang.',
  },

  // Row 2: Medium Potential
  {
    id: 'q-dilemma',
    code: '2A',
    title: 'Dilemma / Inconsistent',
    subtitle: 'Med Potential • Low Performance',
    potential: 'Medium',
    performance: 'Low',
    bgTint: 'bg-rose-50/60',
    borderTint: 'border-rose-200',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    strategy: 'Intervensi terstruktur, target 60 hari, klarifikasi ekspektasi deliverable.',
  },
  {
    id: 'q-core-player',
    code: '2B',
    title: 'Core Performer / Solid',
    subtitle: 'Med Potential • Med Performance',
    potential: 'Medium',
    performance: 'Medium',
    bgTint: 'bg-stone-50/70',
    borderTint: 'border-stone-200',
    badgeBg: 'bg-stone-200',
    badgeText: 'text-stone-800',
    strategy: 'Tulang punggung operasional. Pertahankan engagement dan apresiasi konsistensi.',
  },
  {
    id: 'q-high-pro',
    code: '2C',
    title: 'High Professional / Star Contributor',
    subtitle: 'Med Potential • High Performance',
    potential: 'Medium',
    performance: 'High',
    bgTint: 'bg-blue-50/70',
    borderTint: 'border-blue-200',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-800',
    strategy: 'Spesialis teknis tingkat tinggi. Kembangkan jalur karier Fellow / Principal.',
  },

  // Row 1: Low Potential
  {
    id: 'q-risk',
    code: '1A',
    title: 'Risk / Underperformer',
    subtitle: 'Low Potential • Low Performance',
    potential: 'Low',
    performance: 'Low',
    bgTint: 'bg-red-50/80',
    borderTint: 'border-red-300',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-800',
    strategy: 'Wajib PIP 60 hari (remedial plan). Re-skilling peran atau keputusan perpisahan.',
  },
  {
    id: 'q-steady',
    code: '1B',
    title: 'Effective / Steady Worker',
    subtitle: 'Low Potential • Med Performance',
    potential: 'Low',
    performance: 'Medium',
    bgTint: 'bg-amber-50/50',
    borderTint: 'border-amber-100',
    badgeBg: 'bg-amber-100/70',
    badgeText: 'text-amber-700',
    strategy: 'Stabil dalam lingkup tugas yang jelas. Pantau risiko kejenuhan kerja.',
  },
  {
    id: 'q-workhorse',
    code: '1C',
    title: 'Trusted Specialist / Workhorse',
    subtitle: 'Low Potential • High Performance',
    potential: 'Low',
    performance: 'High',
    bgTint: 'bg-indigo-50/60',
    borderTint: 'border-indigo-200',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
    strategy: 'Sangat andal dalam keahlian spesifik. Hindari paksaan rotasi ke posisi manajerial.',
  },
];

export const TalentMatrix9BoxPage: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  // Grid items state from database
  const [talentItems, setTalentItems] = useState<TalentGridItem[]>(db.getTalentGridItems());
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedFlightRisk, setSelectedFlightRisk] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTalent, setActiveTalent] = useState<TalentGridItem | null>(null);

  // Committee Mode & Calibration states
  const [committeeMode, setCommitteeMode] = useState<boolean>(true);
  const [overrideReason, setOverrideReason] = useState<string>('');
  const [calibrationOverrides, setCalibrationOverrides] = useState(db.getCalibrationOverrides());
  const [ratifiedBanner, setRatifiedBanner] = useState<string | null>(null);

  // Edit drawer state for calibration
  const [editPerf, setEditPerf] = useState<PerformanceRating>('Medium');
  const [editPot, setEditPot] = useState<PotentialRating>('Medium');
  const [editRisk, setEditRisk] = useState<FlightRisk>('Low');
  const [editReadiness, setEditReadiness] = useState<SuccessionReadiness>('Ready in 1-2 Years');
  const [editFocus, setEditFocus] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Departments list
  const departments = ['All', 'Engineering & Technology', 'Human Resources & Talent', 'Product & Design', 'Sales & Business Development', 'Business Operations'];

  // Filtering
  const filteredItems = talentItems.filter((item) => {
    if (selectedDept !== 'All' && item.departmentName !== selectedDept) return false;
    if (selectedFlightRisk !== 'All' && item.flightRisk !== selectedFlightRisk) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.fullName.toLowerCase().includes(q);
      const matchRole = item.positionTitle.toLowerCase().includes(q);
      const matchDept = item.departmentName.toLowerCase().includes(q);
      if (!matchName && !matchRole && !matchDept) return false;
    }
    return true;
  });

  // Open calibration modal
  const handleSelectTalent = (item: TalentGridItem) => {
    setActiveTalent(item);
    setEditPerf(item.performanceBand);
    setEditPot(item.potentialBand);
    setEditRisk(item.flightRisk);
    setEditReadiness(item.successionReadiness);
    setEditFocus(item.developmentFocus);
    setOverrideReason(`Konsensus sidang kalibrasi komite 2026 Q1: penyesuaian evaluasi untuk ${item.fullName}`);
    setSaveSuccessMsg(null);
  };

  // Save calibration changes
  const handleSaveCalibration = () => {
    if (!activeTalent) return;
    const oldQuad = activeTalent.quadrantName;

    const updated = db.updateTalentGridItem(activeTalent.id, {
      performanceBand: editPerf,
      potentialBand: editPot,
      flightRisk: editRisk,
      successionReadiness: editReadiness,
      developmentFocus: editFocus,
    });

    if (updated) {
      // If quadrant changed, record official calibration override log
      if (updated.quadrantName !== oldQuad) {
        db.addCalibrationOverride({
          employeeId: activeTalent.employeeId,
          employeeName: activeTalent.fullName,
          previousQuadrant: oldQuad,
          newQuadrant: updated.quadrantName,
          calibratorName: `${user?.fullName || 'Alexander Vance'} (${role || 'Super Admin'})`,
          overrideReason: overrideReason || 'Penyesuaian konsensus sidang kalibrasi Direksi & HR.',
        });
        setCalibrationOverrides(db.getCalibrationOverrides());
      }

      setTalentItems(db.getTalentGridItems());
      setActiveTalent(updated);
      setSaveSuccessMsg(`Kalibrasi talenta berhasil diperbarui ke ${updated.quadrantName}!`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  const handleRatifySession = () => {
    setRatifiedBanner('Sidang Kalibrasi 2026 Q1 resmi disahkan oleh Komite Kalibrasi. Semua kuadran terkunci & tersimpan dalam log audit ISO 9001.');
    setTimeout(() => setRatifiedBanner(null), 7000);
  };

  // Metrics summary
  const totalCount = talentItems.length;
  const starsCount = talentItems.filter((t) => t.quadrantId === 'q-star' || t.quadrantId === 'q-rising-star').length;
  const starsPct = Math.round((starsCount / (totalCount || 1)) * 100);
  const coreCount = talentItems.filter((t) => t.quadrantId === 'q-core-player' || t.quadrantId === 'q-high-pro' || t.quadrantId === 'q-workhorse').length;
  const corePct = Math.round((coreCount / (totalCount || 1)) * 100);
  const riskCount = talentItems.filter((t) => t.quadrantId === 'q-risk' || t.quadrantId === 'q-dilemma' || t.quadrantId === 'q-rough-diamond').length;
  const riskPct = Math.round((riskCount / (totalCount || 1)) * 100);
  const hasRatingInflation = starsPct > 28; // Bell curve threshold warning

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1">
            <span className="font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
              Executive Talent Calibration
            </span>
            <span>&bull;</span>
            <span>Siklus 2026 Q1</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight">
            9-Box Grid Talent Matrix & Succession Calibration
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Pemetaan objektif Matriks Kinerja vs. Potensi talenta perusahaan untuk rencana suksesi, retensi kunci, dan kalibrasi rating.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCommitteeMode(!committeeMode)}
            className={`text-xs px-3.5 py-2 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              committeeMode
                ? 'bg-[#18181B] text-white'
                : 'bg-[#F5F4EF] text-[#57534E] hover:bg-[#EBE9E2]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Mode Sidang Kalibrasi: {committeeMode ? 'AKTIF' : 'NONAKTIF'}</span>
          </button>

          {committeeMode && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleRatifySession}
              className="rounded-full shadow-xs text-xs font-bold"
              leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
            >
              Sahkan Hasil Sidang (Ratify)
            </Button>
          )}

          <Link
            to="/assessment/dossier?employeeId=EMP-006"
            className="text-xs font-bold text-[#EA580C] bg-[#FFEDD5] border border-[#FED7AA] px-3.5 py-2 rounded-full hover:bg-[#FED7AA] transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            Buka Appraisal Dossier
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const dateStr = new Date().toISOString().slice(0, 10);
              const data = talentItems.map((item: TalentGridItem) => ({
                'Employee ID': item.employeeId,
                'Employee Name': item.fullName,
                Department: item.departmentName,
                Position: item.positionTitle,
                'Performance Band': item.performanceBand,
                'Potential Band': item.potentialBand,
                '9-Box Quadrant ID': item.quadrantId,
                'Flight Risk': item.flightRisk,
                'Succession Readiness': item.successionReadiness,
              }));
              downloadExcel(`Pervia_9Box_Talent_Matrix_${dateStr}.xlsx`, [
                { name: 'Talent Grid 9-Box', data },
              ]);
            }}
            className="rounded-full shadow-xs"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Unduh Data Matriks (.xlsx)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="rounded-full shadow-xs"
            leftIcon={<Printer className="w-3.5 h-3.5 text-[#EA580C]" />}
          >
            Print Dialog
          </Button>
        </div>
      </div>

      {/* Ratified Session Confirmation Banner */}
      {ratifiedBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">{ratifiedBanner}</p>
              <p className="text-[11px] text-emerald-700">Tercatat dalam log audit ISO 9001 & komite remunerasi.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            COMMISSION RATIFIED
          </span>
        </div>
      )}

      {/* Bell-Curve Normalization & Quota Enforcement Gauge (Area 2 Core Feature) */}
      {committeeMode && (
        <div className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E4DC] pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#18181B]">
                Bell-Curve Normalization Enforcer & Rating Inflation Watchdog
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  hasRatingInflation
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {hasRatingInflation ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-700" />
                    Peringatan: Rating Inflation Terdeteksi ({starsPct}% Top Tier &gt; 25%)
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    Distribusi Bell-Curve Sehat & Seimbang
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-3 rounded-2xl border border-[#E7E4DC] space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-emerald-800">Top Tier (Stars / 3C & 3B)</span>
                <span className="text-[#EA580C] font-mono">{starsPct}% ({starsCount} staf)</span>
              </div>
              <div className="w-full h-2 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#E7E4DC]">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(100, starsPct * 3)}%` }} />
              </div>
              <span className="text-[10px] text-[#78716C] block">Pedoman Kuota Kuadran: Maksimal 15% - 20%</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-[#E7E4DC] space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-stone-800">Core Performers (Solid / 2B, 2C, 1C)</span>
                <span className="text-[#18181B] font-mono">{corePct}% ({coreCount} staf)</span>
              </div>
              <div className="w-full h-2 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#E7E4DC]">
                <div className="h-full bg-stone-600 rounded-full" style={{ width: `${Math.min(100, corePct)}%` }} />
              </div>
              <span className="text-[10px] text-[#78716C] block">Pedoman Kuota Kuadran: 60% - 70%</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-[#E7E4DC] space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-rose-800">Underperformers / Risk (1A, 2A)</span>
                <span className="text-rose-700 font-mono">{riskPct}% ({riskCount} staf)</span>
              </div>
              <div className="w-full h-2 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#E7E4DC]">
                <div className="h-full bg-rose-600 rounded-full" style={{ width: `${Math.min(100, riskPct * 5)}%` }} />
              </div>
              <span className="text-[10px] text-[#78716C] block">Pedoman Kuota Kuadran: 5% - 10% (PIP Mandatory)</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Executive Talent KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-[#E7E4DC] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
              Total Talenta Terkalibrasi
            </span>
            <Users className="w-4 h-4 text-[#78716C]" />
          </div>
          <div className="text-2xl font-black text-[#18181B] mt-1.5">{totalCount} Pegawai</div>
          <span className="text-[11px] text-[#78716C] mt-0.5 block">100% dari baseline Q1 terdaftar</span>
        </div>

        <div className="bg-white rounded-3xl border border-[#E7E4DC] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Top Talent & Future Leaders
            </span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1.5">
            {starsCount}{' '}
            <span className="text-xs font-bold text-[#78716C]">({Math.round((starsCount / totalCount) * 100)}%)</span>
          </div>
          <span className="text-[11px] text-[#78716C] mt-0.5 block">Kuadran 3C & 3B &bull; Target kuota: 20-25%</span>
        </div>

        <div className="bg-white rounded-3xl border border-[#E7E4DC] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              Core Operational Backbone
            </span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 mt-1.5">
            {coreCount}{' '}
            <span className="text-xs font-bold text-[#78716C]">({Math.round((coreCount / totalCount) * 100)}%)</span>
          </div>
          <span className="text-[11px] text-[#78716C] mt-0.5 block">Kuadran 2B, 2C, 1C &bull; Kinerja stabil andal</span>
        </div>

        <div className="bg-white rounded-3xl border border-[#E7E4DC] p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Perlu Intervensi / PIP
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1.5">
            {riskCount}{' '}
            <span className="text-xs font-bold text-[#78716C]">({Math.round((riskCount / totalCount) * 100)}%)</span>
          </div>
          <span className="text-[11px] text-[#78716C] mt-0.5 block">Kuadran 1A, 2A, 3A &bull; Butuh evaluasi kendala</span>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E7E4DC] p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, jabatan, divisi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F9F5F0] border border-[#E7E4DC] rounded-full pl-8 pr-3 py-1.5 text-xs text-[#18181B] focus:outline-none focus:border-[#EA580C]"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#78716C] font-semibold">Departemen:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-[#F9F5F0] border border-[#E7E4DC] rounded-full px-3 py-1.5 text-xs font-bold text-[#18181B] focus:outline-none focus:border-[#EA580C]"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'Semua Departemen' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Flight Risk Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#78716C] font-semibold">Flight Risk:</span>
            <select
              value={selectedFlightRisk}
              onChange={(e) => setSelectedFlightRisk(e.target.value)}
              className="bg-[#F9F5F0] border border-[#E7E4DC] rounded-full px-3 py-1.5 text-xs font-bold text-[#18181B] focus:outline-none focus:border-[#EA580C]"
            >
              <option value="All">Semua Tingkat Risiko</option>
              <option value="High">Risiko Tinggi (High)</option>
              <option value="Medium">Risiko Sedang (Med)</option>
              <option value="Low">Risiko Rendah (Low)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {(selectedDept !== 'All' || selectedFlightRisk !== 'All' || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedDept('All');
                setSelectedFlightRisk('All');
                setSearchQuery('');
              }}
              className="text-xs text-[#78716C]"
              leftIcon={<RotateCcw className="w-3 h-3" />}
            >
              Reset Filter
            </Button>
          )}

          <span className="text-xs font-bold text-[#78716C]">
            Menampilkan: <strong className="text-[#18181B]">{filteredItems.length} talenta</strong>
          </span>
        </div>
      </div>

      {/* 4. The Interactive 9-Box Matrix Grid Canvas */}
      <div className="bg-white rounded-3xl border border-[#E7E4DC] p-5 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E4DC] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#EA580C]" />
            <h2 className="text-sm font-black text-[#18181B] tracking-tight uppercase">
              Kanvas Matriks Kinerja vs. Potensi (9-Box Grid)
            </h2>
          </div>
          <span className="text-[11px] text-[#78716C] bg-[#FAF9F6] px-3 py-1 rounded-full border border-[#E7E4DC]">
            Klik pada kartu talenta untuk membuka panel kalibrasi dan dossier
          </span>
        </div>

        {/* Axis Orientation Guide (Zero Collision, Structured) */}
        <div className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] border border-[#FED7AA] px-2.5 py-0.5 rounded-full">
              Sumbu Vertikal (Y)
            </span>
            <span className="font-bold text-[#18181B]">Potensi Perkembangan:</span>
            <span className="text-[#78716C]">Baris Atas (Tinggi) &bull; Baris Tengah (Sedang) &bull; Baris Bawah (Rendah)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#18181B] uppercase tracking-wider bg-white border border-[#E7E4DC] px-2.5 py-0.5 rounded-full">
              Sumbu Horizontal (X)
            </span>
            <span className="font-bold text-[#18181B]">Kinerja Aktual:</span>
            <span className="text-[#78716C]">Kolom Kiri (Rendah) &bull; Kolom Tengah (Sedang) &bull; Kolom Kanan (Tinggi)</span>
          </div>
        </div>

        {/* The Matrix Container with Clean Structured Grid */}
        <div className="space-y-3">
          {/* 3x3 Grid of Quadrants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {QUADRANTS.map((quadrant) => {
              const itemsInQuadrant = filteredItems.filter(
                (item) => item.potentialBand === quadrant.potential && item.performanceBand === quadrant.performance
              );

              return (
                <div
                  key={quadrant.id}
                  className={`rounded-2xl border-2 ${quadrant.borderTint} ${quadrant.bgTint} p-3.5 flex flex-col justify-between min-h-[220px] transition-all hover:shadow-md`}
                >
                  {/* Quadrant Header */}
                  <div className="space-y-1 border-b border-black/5 pb-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${quadrant.badgeBg} ${quadrant.badgeText}`}>
                        [{quadrant.code}] {quadrant.title}
                      </span>
                      <span className="text-xs font-black text-[#18181B] bg-white/80 border border-black/5 px-2 py-0.5 rounded-full">
                        {itemsInQuadrant.length}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#78716C] font-semibold">{quadrant.subtitle}</p>
                  </div>

                  {/* Employee Cards List in this Quadrant */}
                  <div className="my-2.5 space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {itemsInQuadrant.length > 0 ? (
                      itemsInQuadrant.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectTalent(item)}
                          className="bg-white rounded-xl border border-[#E7E4DC] p-2.5 shadow-2xs hover:border-[#EA580C] hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-2.5 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {item.avatarUrl ? (
                              <img
                                src={item.avatarUrl}
                                alt={item.fullName}
                                className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#E7E4DC]"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center text-xs font-bold shrink-0">
                                {item.fullName.slice(0, 2)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-[#18181B] block truncate group-hover:text-[#EA580C] transition-colors">
                                {item.fullName}
                              </span>
                              <span className="text-[10px] text-[#78716C] block truncate">
                                {item.positionTitle}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-[#EA580C] block font-mono">
                              {item.performanceScore.toFixed(1)}%
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full inline-block ${
                                item.flightRisk === 'High'
                                  ? 'bg-rose-100 text-rose-800'
                                  : item.flightRisk === 'Medium'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              Risk: {item.flightRisk}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-[11px] text-[#A8A29E] italic">
                        Tidak ada pegawai di kuadran ini
                      </div>
                    )}
                  </div>

                  {/* Quadrant Strategy Note */}
                  <div className="text-[10px] text-[#52525B] bg-white/70 border border-black/5 rounded-lg p-1.5 line-clamp-2">
                    <strong className="text-[#18181B]">Strategi:</strong> {quadrant.strategy}
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-Axis Indicator Columns (Bottom Horizontal) */}
          <div className="hidden md:grid grid-cols-3 gap-3.5 pt-2 text-center text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
            <div className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-xl py-1.5 text-rose-800 font-bold">
              &larr; Kinerja Rendah (Low)
            </div>
            <div className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-xl py-1.5 text-stone-700 font-bold">
              &bull; Kinerja Sesuai Target (Medium) &bull;
            </div>
            <div className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-xl py-1.5 text-emerald-800 font-bold">
              Kinerja Melampaui Target (High) &rarr;
            </div>
          </div>
        </div>
      </div>

      {/* 5. Succession Planning & Talent Risk Table */}
      <div className="bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-black text-[#18181B] tracking-tight uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-[#EA580C]" />
              Rencana Suksesi & Manajemen Risiko Talenta Kunci (Succession Bench)
            </h2>
            <p className="text-xs text-[#78716C]">
              Daftar posisi krusial perusahaan yang dipetakan dengan calon suksesor dari Kuadran Star & Rising Star.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const dateStr = new Date().toISOString().slice(0, 10);
              const benchData = [
                {
                  'Critical Position': 'Chief Technology Officer (CTO)',
                  Incumbent: 'David Miller (IC6 Director)',
                  'Primary Successor Candidate': 'Aria Montgomery (EMP-006)',
                  'Succession Readiness': 'Ready in 1-2 Years',
                  'Flight Risk': 'Low',
                  'Action Roadmap': 'Executive coaching & enterprise cloud architecture delegation',
                },
                {
                  'Critical Position': 'VP of Sales & Revenue',
                  Incumbent: 'Sarah Chen (VP Commercial)',
                  'Primary Successor Candidate': 'Budi Santoso (EMP-007)',
                  'Succession Readiness': 'Ready in 6-12 Months',
                  'Flight Risk': 'Medium',
                  'Action Roadmap': 'Key strategic accounts rotation & quarterly executive mentoring',
                },
                {
                  'Critical Position': 'Head of Product Management',
                  Incumbent: 'Marcus Sterling (Principal)',
                  'Primary Successor Candidate': 'Citra Dewi (EMP-008)',
                  'Succession Readiness': 'Ready in 1-2 Years',
                  'Flight Risk': 'Low',
                  'Action Roadmap': 'Product portfolio strategy sponsorship & board presentation prep',
                },
              ];
              downloadExcel(`Pervia_Succession_Bench_Roster_${dateStr}.xlsx`, [
                { name: 'Succession Pipeline', data: benchData },
              ]);
            }}
            className="rounded-full text-xs shadow-xs"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Ekspor Bench Suksesi (.xlsx)
          </Button>
        </div>

        <div className="overflow-x-auto border border-[#E7E4DC] rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F6] text-[#78716C] border-b border-[#E7E4DC] text-[10px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Posisi Kritis Organisasi</th>
                <th className="py-3 px-3">Pejabat Saat Ini (Incumbent)</th>
                <th className="py-3 px-3">Calon Suksesor Terpilih</th>
                <th className="py-3 px-3">Kesiapan Suksesi</th>
                <th className="py-3 px-3">Tingkat Risiko Flight</th>
                <th className="py-3 px-4">Rencana Aksi Pengembangan</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4DC] text-[#18181B]">
              <tr>
                <td className="py-3 px-4 font-bold text-[#18181B]">
                  Chief Technology Officer (CTO)
                  <span className="block text-[10px] text-[#78716C] font-normal">Departemen: Engineering</span>
                </td>
                <td className="py-3 px-3 font-semibold text-[#52525B]">Alexander Vance</td>
                <td className="py-3 px-3 font-bold text-[#EA580C]">
                  Aria Montgomery (Senior Software Eng)
                </td>
                <td className="py-3 px-3">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Ready Now (100% Score)
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                    Medium Risk
                  </span>
                </td>
                <td className="py-3 px-4 text-[#52525B]">
                  Mentorship langsung dari CTO & penugasan arsitektur multi-wilayah.
                </td>
                <td className="py-3 px-3 text-right">
                  <Link
                    to="/assessment/dossier?employeeId=EMP-006"
                    className="text-xs font-bold text-[#EA580C] hover:underline"
                  >
                    Dossier &rarr;
                  </Link>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-[#18181B]">
                  VP of Engineering
                  <span className="block text-[10px] text-[#78716C] font-normal">Departemen: Engineering</span>
                </td>
                <td className="py-3 px-3 font-semibold text-[#52525B]">Sarah Chen</td>
                <td className="py-3 px-3 font-bold text-[#EA580C]">
                  David Miller (Lead Frontend Eng)
                </td>
                <td className="py-3 px-3">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Ready in 1-2 Years
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Low Risk
                  </span>
                </td>
                <td className="py-3 px-4 text-[#52525B]">
                  Pelatihan manajemen anggaran teknik & manajemen lintas divisi.
                </td>
                <td className="py-3 px-3 text-right">
                  <Link
                    to="/assessment/dossier?employeeId=EMP-005"
                    className="text-xs font-bold text-[#EA580C] hover:underline"
                  >
                    Dossier &rarr;
                  </Link>
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-[#18181B]">
                  Principal Cloud Architect
                  <span className="block text-[10px] text-[#78716C] font-normal">Departemen: Cloud Infrastructure</span>
                </td>
                <td className="py-3 px-3 font-semibold text-[#52525B]">Position Open (New)</td>
                <td className="py-3 px-3 font-bold text-[#EA580C]">
                  Jordan Patel (Senior Cloud Architect)
                </td>
                <td className="py-3 px-3">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Ready Now (102.9% Score)
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full">
                    High Flight Risk
                  </span>
                </td>
                <td className="py-3 px-4 text-[#52525B]">
                  Penyesuaian paket kompensasi saham (equity retention) & kepemimpinan ISO 27001.
                </td>
                <td className="py-3 px-3 text-right">
                  <Link
                    to="/assessment/dossier?employeeId=EMP-007"
                    className="text-xs font-bold text-[#EA580C] hover:underline"
                  >
                    Dossier &rarr;
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Official Calibration Committee Override Audit Trail (Area 2 Core Feature) */}
      <div className="bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E4DC] pb-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-black text-[#18181B] tracking-tight uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
              Berita Acara & Riwayat Override Sidang Kalibrasi Komite
            </h2>
            <p className="text-xs text-[#78716C]">
              Log transparansi setiap perubahan kuadran dari rekomendasi atasan langsung ke hasil konsensus sidang kalibrasi Direksi.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#FAF9F6] border border-[#E7E4DC] px-2.5 py-1 rounded-full text-[#78716C]">
            ISO 9001 / ISO 27001 AUDIT COMPLIANT
          </span>
        </div>

        <div className="overflow-x-auto border border-[#E7E4DC] rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F6] text-[#78716C] border-b border-[#E7E4DC] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Pegawai Terkalibrasi</th>
                <th className="py-2.5 px-3">Kuadran Sebelumnya</th>
                <th className="py-2.5 px-3">Kuadran Baru (Konsensus)</th>
                <th className="py-2.5 px-4">Alasan & Justifikasi Sidang</th>
                <th className="py-2.5 px-3">Pengesah (Calibrator)</th>
                <th className="py-2.5 px-3 text-right">Waktu Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4DC] text-[#18181B]">
              {calibrationOverrides.map((ovr) => (
                <tr key={ovr.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3 px-3 font-bold text-[#18181B]">
                    {ovr.employeeName}
                    <span className="block text-[10px] font-mono text-[#78716C] font-normal">{ovr.employeeId}</span>
                  </td>
                  <td className="py-3 px-3 text-[#78716C] font-medium">
                    {ovr.previousQuadrant}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] border border-[#FED7AA] px-2 py-0.5 rounded-full inline-block">
                      {ovr.newQuadrant}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#52525B] max-w-xs leading-relaxed">
                    {ovr.overrideReason}
                  </td>
                  <td className="py-3 px-3 text-[#18181B] font-semibold">
                    {ovr.calibratorName}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[11px] text-[#78716C]">
                    {new Date(ovr.timestamp).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Calibration & Talent Detail Modal / Drawer */}
      {activeTalent && (
        <Modal
          isOpen={Boolean(activeTalent)}
          onClose={() => setActiveTalent(null)}
          title={`Kalibrasi Talenta: ${activeTalent.fullName}`}
          description={`NIK: ${activeTalent.employeeId} • ${activeTalent.positionTitle} • ${activeTalent.departmentName}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            {saveSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{saveSuccessMsg}</span>
              </div>
            )}

            {/* Profile Overview */}
            <div className="bg-[#FAF9F6] border border-[#E7E4DC] p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {activeTalent.avatarUrl ? (
                  <img
                    src={activeTalent.avatarUrl}
                    alt={activeTalent.fullName}
                    className="w-12 h-12 rounded-2xl object-cover border border-[#E7E4DC]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center text-sm font-black">
                    {activeTalent.fullName.slice(0, 2)}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-black text-[#18181B]">{activeTalent.fullName}</h3>
                  <span className="text-[11px] text-[#78716C] block">
                    Manager: {activeTalent.managerName} &bull; Nilai Aktual: {activeTalent.performanceScore}%
                  </span>
                  <span className="text-[10px] font-bold text-[#EA580C] mt-0.5 inline-block">
                    Kuadran Saat Ini: {activeTalent.quadrantName}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <Link
                  to={`/assessment/dossier?employeeId=${activeTalent.employeeId}`}
                  className="text-xs font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Buka Dossier Resmi &rarr;
                </Link>
              </div>
            </div>

            {/* Interactive Calibration Controls */}
            <div className="space-y-4 border-t border-[#E7E4DC] pt-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#18181B]">
                Penetapan Kalibrasi (Komite Evaluasi & HR)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Performance Band */}
                <div>
                  <label className="block text-[11px] font-bold text-[#78716C] mb-1">
                    Tingkat Kinerja Aktual (Performance)
                  </label>
                  <select
                    value={editPerf}
                    onChange={(e) => setEditPerf(e.target.value as PerformanceRating)}
                    className="w-full bg-[#F9F5F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-xs font-bold text-[#18181B]"
                  >
                    <option value="High">Tinggi (High) - Melampaui Target</option>
                    <option value="Medium">Sedang (Medium) - Sesuai Ekspektasi</option>
                    <option value="Low">Rendah (Low) - Di Bawah Target</option>
                  </select>
                </div>

                {/* Potential Band */}
                <div>
                  <label className="block text-[11px] font-bold text-[#78716C] mb-1">
                    Tingkat Potensi Pertumbuhan (Potential)
                  </label>
                  <select
                    value={editPot}
                    onChange={(e) => setEditPot(e.target.value as PotentialRating)}
                    className="w-full bg-[#F9F5F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-xs font-bold text-[#18181B]"
                  >
                    <option value="High">Tinggi (High) - Siap Memimpin Organisasi</option>
                    <option value="Medium">Sedang (Medium) - Siap Tanggung Jawab Baru</option>
                    <option value="Low">Rendah (Low) - Maksimal di Peran Saat Ini</option>
                  </select>
                </div>

                {/* Flight Risk */}
                <div>
                  <label className="block text-[11px] font-bold text-[#78716C] mb-1">
                    Risiko Kehilangan Talenta (Flight Risk)
                  </label>
                  <select
                    value={editRisk}
                    onChange={(e) => setEditRisk(e.target.value as FlightRisk)}
                    className="w-full bg-[#F9F5F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-xs font-bold text-[#18181B]"
                  >
                    <option value="Low">Rendah (Low Risk - Komitmen Kuat)</option>
                    <option value="Medium">Sedang (Medium Risk - Waspada Penawaran Luar)</option>
                    <option value="High">Tinggi (High Risk - Rentan Pindah)</option>
                  </select>
                </div>

                {/* Succession Readiness */}
                <div>
                  <label className="block text-[11px] font-bold text-[#78716C] mb-1">
                    Kesiapan Suksesi (Succession Timeline)
                  </label>
                  <select
                    value={editReadiness}
                    onChange={(e) => setEditReadiness(e.target.value as SuccessionReadiness)}
                    className="w-full bg-[#F9F5F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-xs font-bold text-[#18181B]"
                  >
                    <option value="Ready Now">Ready Now (Siap Sekarang)</option>
                    <option value="Ready in 1-2 Years">Ready in 1-2 Years (Kesiapan 1-2 Tahun)</option>
                    <option value="Retain in Current Role">Retain in Current Role (Pertahankan)</option>
                    <option value="Emergency Replacement Only">Emergency Replacement Only</option>
                  </select>
                </div>
              </div>

              {/* Development Focus notes */}
              <div>
                <label className="block text-[11px] font-bold text-[#78716C] mb-1">
                  Catatan Fokus Rencana Pengembangan (IDP Focus)
                </label>
                <textarea
                  rows={2}
                  value={editFocus}
                  onChange={(e) => setEditFocus(e.target.value)}
                  className="w-full bg-[#F9F5F0] border border-[#E7E4DC] rounded-xl p-3 text-xs text-[#18181B] focus:outline-none focus:border-[#EA580C]"
                  placeholder="Masukkan program pelatihan, rotasi, atau bimbingan mentor..."
                />
              </div>

              {/* Committee Override Justification Note (Area 2 Core requirement) */}
              <div>
                <label className="block text-[11px] font-bold text-[#EA580C] mb-1">
                  Justifikasi / Alasan Resmi Override Sidang Kalibrasi Komite (Audit Log ISO 9001)
                </label>
                <textarea
                  rows={2}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-3 text-xs text-[#18181B] focus:outline-none focus:border-[#EA580C]"
                  placeholder="Contoh: Konsensus HR & VP: Capaian rilis arsitektur cloud Q1 melebihi ekspektasi standar IC4..."
                />
                <span className="text-[10px] text-[#78716C] mt-0.5 block">
                  Catatan ini akan tersimpan permanen dalam Berita Acara Kalibrasi & Audit Trail ISO 27001.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E7E4DC]">
              <Button variant="ghost" size="sm" onClick={() => setActiveTalent(null)}>
                Tutup
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveCalibration}
                  className="rounded-full shadow-sm"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Simpan Kalibrasi Posisi
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
