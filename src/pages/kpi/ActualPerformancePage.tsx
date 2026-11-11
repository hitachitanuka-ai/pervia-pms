import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { EmployeeKPI, KPIEvidenceItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  LineChart,
  CheckCircle2,
  AlertCircle,
  FileBadge,
  Upload,
  Edit3,
  Calculator,
  ShieldCheck,
  TrendingUp,
  Target,
  Sparkles,
  BarChart3,
  Award,
  ArrowRight,
  User,
  X,
  FileText,
  Eye,
  CheckSquare,
  ExternalLink,
  Download,
  Search,
  Filter,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { exportEvidenceProofFile } from '../../utils/exportHelpers';

export const ActualPerformancePage: React.FC = () => {
  const { user, role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const employeeIdParam = searchParams.get('employeeId');
  const employees = db.getEmployees();
  const currentEmployee = employeeIdParam
    ? employees.find((e) => e.id === employeeIdParam || e.employeeId === employeeIdParam)
    : null;

  const [activeTab, setActiveTab] = useState<'kpi_cards' | 'evidence_hub'>('kpi_cards');
  const [employeeKPIs, setEmployeeKPIs] = useState<EmployeeKPI[]>(db.getEmployeeKPIs());
  const [evidenceList, setEvidenceList] = useState<KPIEvidenceItem[]>(db.getKPIEvidenceItems());
  const [editingItem, setEditingItem] = useState<EmployeeKPI | null>(null);
  const [actualValueInput, setActualValueInput] = useState<number>(0);
  const [notesInput, setNotesInput] = useState<string>('');

  // Evidence Viewer & Checklist Modal State (Area 4)
  const [viewingEvidence, setViewingEvidence] = useState<KPIEvidenceItem | null>(null);
  const [checklistValid, setChecklistValid] = useState({
    systemProofValid: false,
    slaStandardMet: false,
    weightMeasurementCorrect: false,
    oneOnOneDiscussed: false,
  });
  const [supervisorRemarkInput, setSupervisorRemarkInput] = useState('');
  const [evidenceSuccessBanner, setEvidenceSuccessBanner] = useState<string | null>(null);

  const handleOpenEdit = (item: EmployeeKPI) => {
    setEditingItem(item);
    setActualValueInput(item.actual || item.target);
    setNotesInput(item.supervisorNotes || '');
  };

  const handleSaveActual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    db.updateKPIActual(editingItem.id, Number(actualValueInput), notesInput);
    db.addAuditLog({
      userId: user?.id || 'emp',
      userName: user?.fullName || 'User',
      userRole: role,
      action: 'KPI_ACTUAL_UPDATED',
      module: 'Performance Tracking',
      details: `Updated ${editingItem.kpiCode} actual to ${actualValueInput} ${editingItem.unit}`,
    });

    setEmployeeKPIs([...db.getEmployeeKPIs()]);
    setEditingItem(null);
  };

  const handleOpenEvidenceViewer = (item: KPIEvidenceItem) => {
    setViewingEvidence(item);
    setChecklistValid(item.verificationChecklist);
    setSupervisorRemarkInput(item.supervisorRemarks || '');
  };

  const handleVerifyEvidence = (isApproved: boolean) => {
    if (!viewingEvidence) return;

    const supervisorName = `${user?.fullName || 'Sarah Chen'} (${role || 'Supervisor'})`;
    const updated = db.verifyKPIEvidenceItem(
      viewingEvidence.id,
      isApproved,
      supervisorRemarkInput || (isApproved ? 'Verifikasi disetujui tanpa catatan deviasi.' : 'Mohon perbarui bukti rilis.'),
      checklistValid,
      supervisorName
    );

    if (updated) {
      setEvidenceList([...db.getKPIEvidenceItems()]);
      setEmployeeKPIs([...db.getEmployeeKPIs()]);
      setEvidenceSuccessBanner(
        isApproved
          ? `Bukti ${viewingEvidence.kpiCode} (${viewingEvidence.fileName}) berhasil diverifikasi & status disahkan!`
          : `Permintaan revisi untuk ${viewingEvidence.kpiCode} telah dikirimkan ke pegawai.`
      );
      setViewingEvidence(null);
      setTimeout(() => setEvidenceSuccessBanner(null), 5000);
    }
  };

  const allChecklistCompleted =
    checklistValid.systemProofValid &&
    checklistValid.slaStandardMet &&
    checklistValid.weightMeasurementCorrect &&
    checklistValid.oneOnOneDiscussed;

  const totalWeightedScore = Number(
    employeeKPIs.reduce((sum, k) => sum + (k.weightedScore || 0), 0).toFixed(2)
  );

  const verifiedCount = employeeKPIs.filter((k) => k.status === 'Verified').length;
  const verifiedRate = Math.round((verifiedCount / (employeeKPIs.length || 1)) * 100);
  const pendingEvidenceCount = evidenceList.filter((e) => e.status === 'Pending Verification').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1">
            <span className="font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
              Deliverables & Evidence Audit
            </span>
            <span>&bull;</span>
            <span>Siklus 2026 Q1</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#292524] tracking-tight">
            Pencapaian Deliverables & Verifikasi Bukti KPI
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Audit bukti pendukung deliverables, peninjauan checklist kelayakan atasan, dan kalkulasi skor KPI berbobot (60%).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-1.5 bg-[#FFEDD5] border border-[#FED7AA] rounded-full text-xs flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
            <span className="text-[#C2410C] font-semibold">Skor KPI Tertimbang: </span>
            <strong className="text-sm text-[#292524] font-black">{totalWeightedScore}%</strong>
          </div>

          <Link to="/assessment/final">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full shadow-2xs"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Sign Off Evaluasi
            </Button>
          </Link>
        </div>
      </div>

      {/* Confirmation Banner */}
      {evidenceSuccessBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">{evidenceSuccessBanner}</p>
              <p className="text-[11px] text-emerald-700">Tersimpan dalam log audit ISO 9001 dengan stempel verifikasi.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            AUDIT VERIFIED
          </span>
        </div>
      )}

      {/* Inter-connected Employee Banner if filtered */}
      {currentEmployee && (
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#FFF7ED] to-[#FFEDD5] border border-[#FED7AA] rounded-3xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src={currentEmployee.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
              alt={currentEmployee.fullName}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#EA580C]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#292524]">{currentEmployee.fullName}</span>
                <span className="font-mono text-[10px] font-bold text-[#EA580C] bg-white px-2 py-0.5 rounded-full border border-[#FED7AA]">
                  {currentEmployee.employeeId}
                </span>
                <span className="text-[10px] text-[#78716C]">&bull; {currentEmployee.positionTitle}</span>
              </div>
              <p className="text-[11px] text-[#9A3412] mt-0.5 font-medium">
                Menampilkan data deliverable & dokumen bukti resmi untuk {currentEmployee.departmentName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs rounded-full"
              onClick={() => navigate(`/organization/employees?employeeId=${currentEmployee.id}`)}
              leftIcon={<User className="w-3.5 h-3.5" />}
            >
              Lihat Profil
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs rounded-full bg-white"
              onClick={() => setSearchParams({})}
            >
              Tampilkan Semua Pegawai
            </Button>
          </div>
        </div>
      )}

      {/* Navigation View Switcher (Area 4: Deliverables vs Evidence Hub) */}
      <div className="flex items-center gap-2 border-b border-[#E7E4DC] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('kpi_cards')}
          className={`text-xs px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'kpi_cards'
              ? 'bg-[#18181B] text-white shadow-xs'
              : 'bg-[#FAF9F6] text-[#78716C] hover:bg-[#EBE9E2] border border-[#E7E4DC]'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Kalkulasi Capaian KPI ({employeeKPIs.length} Metrik)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('evidence_hub')}
          className={`text-xs px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'evidence_hub'
              ? 'bg-[#18181B] text-white shadow-xs'
              : 'bg-[#FAF9F6] text-[#78716C] hover:bg-[#EBE9E2] border border-[#E7E4DC]'
          }`}
        >
          <FileBadge className="w-3.5 h-3.5 text-[#EA580C]" />
          <span>Hub Bukti Dokumen & Checklist Atasan</span>
          {pendingEvidenceCount > 0 && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#EA580C] text-white">
              {pendingEvidenceCount} Menunggu Verifikasi
            </span>
          )}
        </button>
      </div>

      {/* Top 3 KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-[#EFE4D7] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                Average KPI Achievement
              </span>
              <div className="text-3xl font-black text-[#292524] mt-1.5">
                {Math.round(employeeKPIs.reduce((sum, k) => sum + (k.achievementRate || 0), 0) / (employeeKPIs.length || 1))}%
              </div>
              <span className="text-[11px] font-semibold text-[#EA580C] mt-0.5 block">
                Deliverables meeting target
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
              <span>Tracking health</span>
              <span className="text-[#EA580C]">Optimal</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-[#FFEDD5]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FDBA74] to-[#EA580C]" style={{ width: '85%' }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#EFE4D7] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                Status Verifikasi Bukti
              </span>
              <div className="text-3xl font-black text-[#292524] mt-1.5">
                {verifiedCount} <span className="text-sm font-semibold text-[#78716C]">/ {employeeKPIs.length} Terverifikasi</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 block">
                {pendingEvidenceCount} dokumen menunggu checklist atasan
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FBBF24] to-[#D97706] text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
              <span>Tingkat verifikasi audit</span>
              <span className="text-[#D97706]">{verifiedRate}%</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-[#FEF3C7]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FCD34D] to-[#D97706]" style={{ width: `${verifiedRate}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#EFE4D7] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                Kontribusi Komponen Bobot
              </span>
              <div className="text-3xl font-black text-[#EA580C] mt-1.5">
                {totalWeightedScore} <span className="text-sm font-semibold text-[#78716C]">/ 60.00 pts</span>
              </div>
              <span className="text-[11px] font-semibold text-[#A8A29E] mt-0.5 block">
                Porsi 60% dari nilai akhir evaluasi
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB7185] to-[#E11D48] text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
              <span>Pencapaian pilar KPI</span>
              <span className="text-[#EA580C]">{Math.round((totalWeightedScore / 60) * 100)}%</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-[#FFE4E6]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FDA4AF] to-[#E11D48]" style={{ width: `${Math.min(100, Math.round((totalWeightedScore / 60) * 100))}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* VIEW TAB 1: KPI CARDS */}
      {activeTab === 'kpi_cards' && (
        <div className="space-y-4">
          {employeeKPIs.map((kpi) => {
            const achievement = kpi.achievementRate || 0;
            const cappedAchieve = Math.min(120, achievement);
            const progressPercent = Math.min(100, Math.round((cappedAchieve / 120) * 100));

            return (
              <div
                key={kpi.id}
                className="bg-white rounded-3xl border border-[#EFE4D7] p-5 sm:p-6 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Icon box & details */}
                  <div className="flex items-start gap-4 max-w-xl">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20">
                      <Target className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                          {kpi.kpiCode}
                        </span>
                        <span className="text-xs font-bold text-[#78716C]">&bull; {kpi.category}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            kpi.status === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {kpi.status}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-[#292524]">{kpi.kpiName}</h3>
                      <p className="text-xs text-[#78716C] leading-relaxed">
                        Arah formula: <strong className="text-[#292524]">{kpi.direction}</strong> &bull; Bobot:{' '}
                        <strong className="text-[#EA580C]">{kpi.weight}%</strong> &bull; Satuan: {kpi.unit}
                      </p>
                      {kpi.supervisorNotes && (
                        <p className="text-[11px] text-[#52525B] bg-[#FAF9F6] p-2 rounded-xl border border-[#E7E4DC]">
                          Catatan Atasan: {kpi.supervisorNotes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Numbers and Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="grid grid-cols-4 gap-4 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-[#A8A29E] uppercase font-bold block">Target</span>
                        <span className="font-extrabold text-[#292524]">
                          {kpi.target} {kpi.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A8A29E] uppercase font-bold block">Realisasi</span>
                        <span className="font-extrabold text-[#18181B]">
                          {kpi.actual !== undefined ? `${kpi.actual} ${kpi.unit}` : 'Pending'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A8A29E] uppercase font-bold block">Capaian</span>
                        <span className="font-extrabold text-[#EA580C]">
                          {kpi.achievementRate !== undefined ? `${kpi.achievementRate}%` : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#A8A29E] uppercase font-bold block">Skor</span>
                        <span className="font-extrabold text-[#292524]">
                          {kpi.weightedScore !== undefined ? `${kpi.weightedScore} pts` : '-'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const ev = evidenceList.find((e) => e.kpiCode === kpi.kpiCode);
                          if (ev) handleOpenEvidenceViewer(ev);
                          else setActiveTab('evidence_hub');
                        }}
                        className="rounded-full shadow-2xs text-xs"
                        leftIcon={<FileText className="w-3.5 h-3.5 text-[#EA580C]" />}
                      >
                        Lihat Bukti
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenEdit(kpi)}
                        className="rounded-full shadow-sm shrink-0 text-xs"
                        leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                      >
                        Catat Realisasi
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW TAB 2: EVIDENCE & DOCUMENT VIEWER HUB (Area 4 Core) */}
      {activeTab === 'evidence_hub' && (
        <div className="bg-white rounded-3xl border border-[#E7E4DC] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E4DC] pb-3">
            <div>
              <h2 className="text-sm font-black text-[#18181B] tracking-tight uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                Pusat Audit Bukti Dokumen & Verifikasi Atasan
              </h2>
              <span className="text-xs text-[#78716C]">
                Pemeriksaan bukti otentik, hash kriptografi SHA-256, dan checklist 4-poin kelayakan atasan.
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => alert('Fitur unggah bukti dokumen dibuka.')}
              className="rounded-full text-xs shadow-xs"
              leftIcon={<Upload className="w-3.5 h-3.5" />}
            >
              Unggah Dokumen Bukti Baru
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidenceList.map((ev) => (
              <div
                key={ev.id}
                className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-2xl p-4 flex flex-col justify-between hover:border-[#EA580C] hover:shadow-xs transition-all space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#EA580C] bg-[#FFEDD5] px-2 py-0.5 rounded-md">
                        {ev.kpiCode}
                      </span>
                      <span className="text-[10px] font-bold text-[#78716C] bg-white border border-[#E7E4DC] px-2 py-0.5 rounded-md">
                        {ev.documentType}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ev.status === 'Verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#18181B] leading-snug">{ev.title}</h3>
                    <p className="text-[11px] text-[#78716C] mt-0.5">
                      File: <strong className="text-[#18181B]">{ev.fileName}</strong> ({ev.fileSize})
                    </p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-[#E7E4DC] text-[10px] font-mono text-[#78716C] space-y-0.5">
                    <div className="truncate">Hash: {ev.shaHash}</div>
                    <div>Target: {ev.target} {ev.unit} &bull; Klaim Realisasi: <strong className="text-[#EA580C]">{ev.claimedActual} {ev.unit}</strong></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E7E4DC] flex items-center justify-between">
                  <span className="text-[10px] text-[#78716C]">
                    Oleh: {ev.employeeName}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenEvidenceViewer(ev)}
                    className="rounded-full text-xs shadow-xs"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    Buka Viewer & Verifikasi
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DOCUMENT VIEWER & SUPERVISOR CHECKLIST MODAL (Area 4 Core) */}
      {viewingEvidence && (
        <Modal
          isOpen={Boolean(viewingEvidence)}
          onClose={() => setViewingEvidence(null)}
          title={`Inspeksi Dokumen Bukti: ${viewingEvidence.fileName}`}
          description={`${viewingEvidence.kpiCode} • ${viewingEvidence.title} • Pegawai: ${viewingEvidence.employeeName}`}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            {/* Document Header Metadata Bar */}
            <div className="bg-[#FAF9F6] border border-[#E7E4DC] p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 font-mono text-[11px]">
              <div>
                <span className="text-[#78716C]">Tipe File: </span>
                <strong className="text-[#18181B]">{viewingEvidence.documentType} ({viewingEvidence.fileSize})</strong>
              </div>
              <div>
                <span className="text-[#78716C]">Upload: </span>
                <strong className="text-[#18181B]">{new Date(viewingEvidence.uploadDate).toLocaleDateString('id-ID')}</strong>
              </div>
              <div className="truncate max-w-xs text-[10px] text-[#EA580C]">
                {viewingEvidence.shaHash}
              </div>
            </div>

            {/* Document Visual Preview Sheet Canvas */}
            <div className="border-2 border-dashed border-[#E7E4DC] rounded-2xl p-6 bg-white relative overflow-hidden min-h-[220px] flex flex-col justify-between shadow-2xs">
              {/* Official Watermark */}
              <div className="absolute right-4 top-4 select-none opacity-20 rotate-[-12deg] pointer-events-none">
                <div className="border-4 border-[#18181B] p-2 rounded-xl text-center">
                  <span className="text-xl font-black">CONFIDENTIAL AUDIT</span>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2 border-b border-[#E7E4DC] pb-2">
                  <FileBadge className="w-6 h-6 text-[#EA580C]" />
                  <div>
                    <h4 className="text-xs font-black text-[#18181B] uppercase tracking-wide">
                      {viewingEvidence.title}
                    </h4>
                    <span className="text-[10px] text-[#78716C]">
                      Sertifikasi Bukti Deliverable Kinerja ISO 9001
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F6] rounded-xl text-xs space-y-1">
                  <p className="font-semibold text-[#18181B]">Rincian Deliverable Terverifikasi:</p>
                  <p className="text-[#52525B]">
                    Klaim pencapaian aktual pegawai sebesar <strong>{viewingEvidence.claimedActual} {viewingEvidence.unit}</strong> terhadap target <strong>{viewingEvidence.target} {viewingEvidence.unit}</strong>.
                  </p>
                  <p className="text-[10px] text-emerald-700 font-mono">
                    ✓ Validated via Internal Telemetry Gateway &bull; Reference Key: PRV-VERIF-{viewingEvidence.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E7E4DC] relative z-10 text-[10px] text-[#78716C]">
                <span>Status Bukti: <strong className="text-[#18181B]">{viewingEvidence.status}</strong></span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportEvidenceProofFile(viewingEvidence)}
                  className="rounded-full text-[10px]"
                  leftIcon={<Download className="w-3 h-3" />}
                >
                  Unduh Salinan Bukti (.txt)
                </Button>
              </div>
            </div>

            {/* Supervisor 4-Point Verification Checklist (Interactive) */}
            <div className="space-y-3 border-t border-[#E7E4DC] pt-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#18181B] flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-[#EA580C]" />
                  Checklist Verifikasi Kelayakan Atasan Langsung (4 Kriteria Wajib)
                </h4>
                <span className="text-[10px] font-bold text-[#EA580C]">
                  {Object.values(checklistValid).filter(Boolean).length} / 4 Tercentang
                </span>
              </div>

              <div className="space-y-2 bg-[#FAF9F6] p-4 rounded-2xl border border-[#E7E4DC]">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklistValid.systemProofValid}
                    onChange={(e) => setChecklistValid({ ...checklistValid, systemProofValid: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-[#EA580C] accent-[#EA580C] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-[#18181B] block">1. Integritas Bukti & Tautan Resmi Valid</span>
                    <span className="text-[11px] text-[#78716C]">Dokumen bersumber dari repository resmi, Jira issue release, atau sertifikat terakreditasi.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklistValid.slaStandardMet}
                    onChange={(e) => setChecklistValid({ ...checklistValid, slaStandardMet: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-[#EA580C] accent-[#EA580C] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-[#18181B] block">2. Kualitas Deliverables Memenuhi Standar SLA</span>
                    <span className="text-[11px] text-[#78716C]">Hasil kerja tidak menimbulkan defek kritis produksi dan memenuhi SLA mutu.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklistValid.weightMeasurementCorrect}
                    onChange={(e) => setChecklistValid({ ...checklistValid, weightMeasurementCorrect: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-[#EA580C] accent-[#EA580C] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-[#18181B] block">3. Pengukuran Angka Target Sesuai Rumus Bobot KPI</span>
                    <span className="text-[11px] text-[#78716C]">Tidak ada perubahan sepihak atas pembagi formula atau target kuartal awal.</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checklistValid.oneOnOneDiscussed}
                    onChange={(e) => setChecklistValid({ ...checklistValid, oneOnOneDiscussed: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded text-[#EA580C] accent-[#EA580C] cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-[#18181B] block">4. Telah Ditinjau Bersama dalam Sesi Coaching 1-on-1</span>
                    <span className="text-[11px] text-[#78716C]">Atasan dan pegawai telah mendiskusikan pencapaian deliverable ini secara transparan.</span>
                  </div>
                </label>
              </div>

              {/* Supervisor Remarks Input */}
              <div>
                <label className="block text-[11px] font-bold text-[#78716C] mb-1">
                  Catatan Verifikasi / Umpan Balik Supervisor
                </label>
                <textarea
                  rows={2}
                  value={supervisorRemarkInput}
                  onChange={(e) => setSupervisorRemarkInput(e.target.value)}
                  placeholder="Masukkan catatan penilaian bukti kinerja atau instruksi revisi..."
                  className="w-full bg-[#FAF9F6] border border-[#E7E4DC] rounded-xl p-3 text-xs text-[#18181B] focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E7E4DC]">
              <Button variant="ghost" size="sm" onClick={() => setViewingEvidence(null)}>
                Tutup
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVerifyEvidence(false)}
                  className="rounded-full text-xs text-rose-700 hover:bg-rose-50 border-rose-200"
                >
                  Minta Revisi Bukti
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  disabled={!allChecklistCompleted}
                  onClick={() => handleVerifyEvidence(true)}
                  className={`rounded-full text-xs font-bold shadow-sm ${
                    !allChecklistCompleted ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  title={allChecklistCompleted ? 'Setujui dan verifikasi bukti klaim' : 'Centang semua 4 kriteria checklist terlebih dahulu'}
                >
                  {allChecklistCompleted ? 'Setujui & Verifikasi Capaian' : 'Lengkapi 4 Checklist'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Actual Input Modal */}
      {editingItem && (
        <Modal
          isOpen={Boolean(editingItem)}
          onClose={() => setEditingItem(null)}
          title={`Input Metric Actual: ${editingItem.kpiName}`}
          description={`${editingItem.kpiCode} • Target: ${editingItem.target} ${editingItem.unit} (${editingItem.direction})`}
        >
          <form onSubmit={handleSaveActual} className="space-y-4 text-xs">
            <div className="p-4 bg-[#FFEDD5] border border-[#FED7AA] rounded-2xl">
              <span className="font-bold text-[#9A3412] block mb-1">Active Calculation Rule:</span>
              <p className="text-[#C2410C]">
                {editingItem.direction === 'Higher Is Better'
                  ? 'Achievement = (Actual / Target) × 100 [Normalized 0% – 120%]'
                  : 'Achievement = (Target / Actual) × 100 [Normalized 0% – 120%]'}
              </p>
            </div>

            <Input
              label={`Recorded Actual Deliverable (${editingItem.unit})`}
              type="number"
              step="any"
              value={actualValueInput}
              onChange={(e) => setActualValueInput(Number(e.target.value))}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-[#292524] mb-1">
                Supporting Evidence / Verification Note
              </label>
              <textarea
                rows={3}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Include link to pull requests, reports, metrics, or audit documentation..."
                className="w-full rounded-2xl border border-[#EFE4D7] p-3 text-xs focus:outline-none focus:border-[#EA580C] focus:ring-3 focus:ring-[#FFEDD5] transition-all bg-white"
              />
            </div>

            <div className="p-4 border-2 border-dashed border-[#FED7AA] rounded-2xl text-center space-y-1 bg-[#FDFBF9]">
              <Upload className="w-5 h-5 text-[#EA580C] mx-auto" />
              <p className="font-bold text-[#292524]">Attach Supporting File (PDF, XLSX)</p>
              <p className="text-[11px] text-[#A8A29E]">Click to browse or drag & drop evidence</p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-[#F5EFE6]">
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingItem(null)}>
                Discard
              </Button>
              <Button variant="primary" size="sm" type="submit" className="rounded-full shadow-sm">
                Save & Calculate Score
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
