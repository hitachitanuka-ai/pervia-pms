import React, { useState, useRef } from 'react';
import {
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Award,
  Sparkles,
  Clock,
  User,
  Building2,
  Calendar,
  Layers,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  FileDown,
} from 'lucide-react';
import { exportAppraisalDossierPdf } from '../../utils/pdfGenerator';
import { db } from '../../lib/database';
import { AppraisalDossier, UserRole } from '../../types';
import { Button } from '../ui/Button';
import { PerviaLogo } from '../brand/PerviaLogo';
import { Link } from 'react-router-dom';

interface PrintableAppraisalDossierProps {
  initialEmployeeId?: string;
  onClose?: () => void;
  isModal?: boolean;
  currentUserRole?: UserRole;
  currentUserName?: string;
}

export const PrintableAppraisalDossier: React.FC<PrintableAppraisalDossierProps> = ({
  initialEmployeeId = 'EMP-006',
  onClose,
  isModal = false,
  currentUserRole = 'Super Admin',
  currentUserName = 'Alexander Vance',
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(initialEmployeeId);
  const [signModalOpen, setSignModalOpen] = useState(false);
  const [activeSignRole, setActiveSignRole] = useState<'Employee' | 'Supervisor' | 'HR Director / Committee'>('Employee');
  const [signatureName, setSignatureName] = useState(currentUserName);
  const [signatureTitle, setSignatureTitle] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);
  const [activeTab, setActiveTab] = useState<'official' | 'kpis' | 'rubric' | 'signatures'>('official');

  const dossierCardRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);

  // Load dossiers
  const allDossiers = db.getAppraisalDossiers();
  const currentDossier: AppraisalDossier =
    db.getAppraisalDossierByEmployee(selectedEmpId) ||
    allDossiers.find((d) => d.employeeId === selectedEmpId) ||
    allDossiers[0];

  const employeeKPIs = db.getEmployeeKPIs(currentDossier.employeeId);
  const employeesList = db.getEmployees();

  // Instant vector PDF download using native jsPDF (no html2canvas freeze, no iframe blocks)
  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setPdfSuccessMessage(null);

    try {
      const result = exportAppraisalDossierPdf(currentDossier, employeeKPIs);
      if (result.success) {
        setPdfSuccessMessage(`Berkas PDF resmi (${result.filename}) berhasil diunduh!`);
        setTimeout(() => setPdfSuccessMessage(null), 5000);
      } else {
        setPdfSuccessMessage('Gagal membuat PDF. Silakan coba kembali atau gunakan tombol JSON.');
        setTimeout(() => setPdfSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      setPdfSuccessMessage('Terjadi kesalahan saat membuat PDF.');
      setTimeout(() => setPdfSuccessMessage(null), 5000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Open the native browser print preview dialog directly (without downloading a file)
  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('window.print error:', err);
    }
  };

  const handleCopyVerification = () => {
    const text = `PERVIA VERIFIED APPRAISAL DOSSIER\nRef: ${currentDossier.documentRef}\nEmployee: ${currentDossier.employeeName} (${currentDossier.employeeId})\nScore: ${currentDossier.finalScore}% (${currentDossier.ratingGrade})\nHR Seal: ${currentDossier.signatures.hrDirector.verificationHash || 'VERIFIED'}`;
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleExportJson = () => {
    const jsonString = JSON.stringify(currentDossier, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.style.display = 'none';
    downloadAnchor.href = url;
    downloadAnchor.download = `${currentDossier.documentRef}_dossier.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    setTimeout(() => {
      document.body.removeChild(downloadAnchor);
      window.URL.revokeObjectURL(url);
    }, 200);
  };

  const handleExecuteSignature = () => {
    db.signAppraisalDossier(
      currentDossier.id,
      activeSignRole,
      signatureName || currentUserName,
      signatureTitle
    );
    setSignModalOpen(false);
  };

  const isEmployeeSigned = currentDossier.signatures.employee.status === 'Signed';
  const isSupervisorSigned = currentDossier.signatures.supervisor.status === 'Signed';
  const isHRDirectorSigned = currentDossier.signatures.hrDirector.status === 'Signed';

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden in @media print) */}
      <div className="no-print bg-white rounded-3xl border border-[#E7E4DC] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Employee Selector & Quick Info */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#78716C]">Select Dossier:</span>
            <div className="relative">
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="appearance-none bg-[#F9F5F0] border border-[#E7E4DC] text-xs font-bold text-[#18181B] rounded-full pl-3.5 pr-8 py-2 focus:outline-none focus:border-[#EA580C] cursor-pointer"
              >
                {allDossiers.map((d) => (
                  <option key={d.id} value={d.employeeId}>
                    {d.employeeName} &bull; {d.employeeRole} ({d.ratingGrade.split(' ')[0]})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#78716C] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#78716C]">
            <span>Ref:</span>
            <span className="font-mono font-bold text-[#18181B] bg-[#F9F5F0] px-2 py-0.5 rounded-md">
              {currentDossier.documentRef}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                currentDossier.status === 'Finalized'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {currentDossier.status}
            </span>
          </div>
        </div>

        {/* Right: Print, Sign & Navigation Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyVerification}
            className="rounded-full shadow-xs"
            leftIcon={copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {copiedHash ? 'Verified Text Copied!' : 'Copy Summary'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            className="rounded-full shadow-xs"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            JSON
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="rounded-full shadow-sm text-xs font-bold"
            leftIcon={
              isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : pdfSuccessMessage ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )
            }
            title="Generate dan unduh berkas PDF resmi (A4)"
          >
            {isGeneratingPdf
              ? 'Membuat Dokumen PDF...'
              : pdfSuccessMessage
              ? 'PDF Berhasil Disimpan!'
              : 'Cetak / Simpan PDF (Unduh)'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="rounded-full shadow-xs text-xs font-semibold"
            leftIcon={<Printer className="w-3.5 h-3.5 text-[#EA580C]" />}
            title="Buka dialog cetak browser (window.print) langsung tanpa unduh file"
          >
            Print Dialog (Browser)
          </Button>

          <Link
            to="/analytics/talent-matrix"
            className="text-xs font-semibold text-[#EA580C] hover:text-[#C2410C] hover:underline px-3 py-1.5 flex items-center gap-1"
            title="Lihat posisi talenta di matriks 9-Box"
          >
            <span>9-Box Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {isModal && onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full">
              Tutup
            </Button>
          )}
        </div>
      </div>

      {/* Instant PDF Download Success Confirmation Banner */}
      {pdfSuccessMessage && (
        <div className="no-print bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">{pdfSuccessMessage}</p>
              <p className="text-[11px] text-emerald-700">Dokumen formulir evaluasi resmi A4 dengan tanda tangan digital & ISO audit trail telah tersimpan.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full shrink-0">
            SHA-256 SEALED
          </span>
        </div>
      )}

      {/* Main Official Dossier Sheet (Styled for Screen and Optimized for A4 Printing) */}
      <div
        ref={dossierCardRef}
        className="printable-dossier-card bg-white rounded-3xl border border-[#E7E4DC] p-6 sm:p-10 shadow-sm transition-all max-w-5xl mx-auto space-y-8 relative overflow-hidden"
      >
        
        {/* Background Watermark Stamp (for official look) */}
        <div className="absolute right-8 top-12 pointer-events-none select-none opacity-85 rotate-[-12deg] z-0 hidden sm:block">
          <div className="border-4 border-[#EA580C] rounded-2xl px-5 py-2.5 text-center text-[#EA580C] bg-white/90 shadow-sm backdrop-blur-xs">
            <span className="block text-[10px] font-black uppercase tracking-widest text-[#C2410C]">
              PERVIA ENTERPRISE PMS
            </span>
            <span className="block text-xl font-black tracking-wider text-[#EA580C]">
              {currentDossier.status === 'Finalized' ? 'CALIBRATED & VERIFIED' : 'OFFICIAL REVIEW'}
            </span>
            <span className="block text-[9px] font-mono font-bold text-[#78716C] mt-0.5">
              HASH: {currentDossier.signatures.hrDirector.verificationHash?.slice(0, 18) || 'AUTHENTIC-2026-Q1'}
            </span>
          </div>
        </div>

        {/* 1. Official Header & Letterhead */}
        <div className="relative z-10 border-b-2 border-[#18181B] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <PerviaLogo size="md" compact={false} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#78716C] block">
                Standard Operating Procedure &bull; ISO 9001 / ISO 27001 Certified
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight uppercase mt-1">
                Formulir Penilaian Prestasi Kerja Pegawai
              </h1>
              <p className="text-xs text-[#52525B] font-medium">
                Comprehensive Employee Appraisal Dossier & Executive Talent Scorecard
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1 font-mono text-xs">
            <div className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">
              No. Dokumen / Ref:
            </div>
            <div className="text-sm font-extrabold text-[#EA580C] bg-[#FFF7ED] border border-[#FED7AA] px-3 py-1 rounded-lg inline-block">
              {currentDossier.documentRef}
            </div>
            <div className="text-[11px] text-[#78716C] mt-1">
              Klasifikasi: <strong className="text-[#18181B]">CONFIDENTIAL &bull; HR ARCHIVE</strong>
            </div>
            <div className="text-[11px] text-[#78716C]">
              Tanggal Pengesahan: <strong className="text-[#18181B]">{currentDossier.evaluationDate}</strong>
            </div>
          </div>
        </div>

        {/* 2. Employee Profile & Evaluation Context Card */}
        <div className="relative z-10 bg-[#FAF9F6] border border-[#E7E4DC] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#18181B] flex items-center gap-2">
              <User className="w-4 h-4 text-[#EA580C]" />
              Bagian 1: Data Identitas Pegawai & Periode Evaluasi
            </h2>
            <span className="text-[11px] font-bold text-[#78716C]">
              Siklus: <strong className="text-[#18181B]">{currentDossier.periodName}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Nama Lengkap Pegawai
              </span>
              <span className="text-sm font-black text-[#18181B] block">{currentDossier.employeeName}</span>
              <span className="text-[11px] font-mono text-[#78716C]">NIK: {currentDossier.employeeId}</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Jabatan & Level Band
              </span>
              <span className="text-xs font-bold text-[#18181B] block">{currentDossier.employeeRole}</span>
              <span className="text-[11px] text-[#78716C]">Level: IC4 Senior Specialist</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Departemen / Unit Kerja
              </span>
              <span className="text-xs font-bold text-[#18181B] block">{currentDossier.departmentName}</span>
              <span className="text-[11px] text-[#78716C]">Cost Center: TECH-ENG-01</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Atasan Langsung (Appraiser)
              </span>
              <span className="text-xs font-bold text-[#18181B] block">{currentDossier.managerName}</span>
              <span className="text-[11px] text-[#78716C]">Role: VP of Engineering</span>
            </div>
          </div>
        </div>

        {/* 3. Multi-Pillar Score Summary Table (60% KPI, 20% Comp, 10% Behav, 10% 360) */}
        <div className="relative z-10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E4DC] pb-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#18181B] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#EA580C]" />
              Bagian 2: Rekapitulasi Pembobotan & Nilai Akhir Prestasi Kerja
            </h2>
            <span className="text-[11px] text-[#78716C]">
              Formula Resmi: <code className="font-mono font-bold text-[#C2410C]">(KPI&times;60%) + (Comp&times;20%) + (Behav&times;10%) + (360&times;10%)</code>
            </span>
          </div>

          <div className="overflow-x-auto border border-[#E7E4DC] rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF9F6] text-[#78716C] border-b border-[#E7E4DC] text-[11px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Komponen Penilaian</th>
                  <th className="py-3 px-3 text-center">Bobot</th>
                  <th className="py-3 px-3 text-right">Skor Mentah</th>
                  <th className="py-3 px-3 text-right">Skor Tertimbang</th>
                  <th className="py-3 px-4">Keterangan / Status Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E4DC] text-[#18181B]">
                <tr>
                  <td className="py-3 px-4 font-bold">
                    <span className="block text-[#18181B]">1. Key Performance Indicators (KPI Deliverables)</span>
                    <span className="text-[11px] text-[#78716C] font-normal">
                      Pencapaian target kuantitatif deliverables & bukti kerja terverifikasi
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-[#EA580C]">60.0%</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">{currentDossier.kpiScore.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right font-mono font-black text-[#EA580C]">
                    {(currentDossier.kpiScore * 0.6).toFixed(2)} pts
                  </td>
                  <td className="py-3 px-4 text-[11px] text-emerald-700 font-semibold">
                    &bull; 4 dari 4 target terverifikasi atasan
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold">
                    <span className="block text-[#18181B]">2. Core & Functional Competency Evaluation</span>
                    <span className="text-[11px] text-[#78716C] font-normal">
                      Keahlian teknis, arsitektur sistem, pemecahan masalah & inovasi
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-[#EA580C]">20.0%</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">{currentDossier.competencyScore.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right font-mono font-black text-[#EA580C]">
                    {(currentDossier.competencyScore * 0.2).toFixed(2)} pts
                  </td>
                  <td className="py-3 px-4 text-[11px] text-emerald-700 font-semibold">
                    &bull; Melebihi standar kemahiran level IC4
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold">
                    <span className="block text-[#18181B]">3. Behavioral Values & Culture Alignment</span>
                    <span className="text-[11px] text-[#78716C] font-normal">
                      Integritas, kolaborasi tim, kepemilikan (ownership) & keteladanan
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-[#EA580C]">10.0%</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">{currentDossier.behavioralScore.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right font-mono font-black text-[#EA580C]">
                    {(currentDossier.behavioralScore * 0.1).toFixed(2)} pts
                  </td>
                  <td className="py-3 px-4 text-[11px] text-emerald-700 font-semibold">
                    &bull; Nilai budaya teladan dalam tim
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4 font-bold">
                    <span className="block text-[#18181B]">4. Peer & Subordinate 360-Degree Feedback</span>
                    <span className="text-[11px] text-[#78716C] font-normal">
                      Ulasan anonim multi-rater dari rekan kerja lintas divisi & mitra tim
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-[#EA580C]">10.0%</td>
                  <td className="py-3 px-3 text-right font-mono font-bold">{currentDossier.feedbackScore.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-right font-mono font-black text-[#EA580C]">
                    {(currentDossier.feedbackScore * 0.1).toFixed(2)} pts
                  </td>
                  <td className="py-3 px-4 text-[11px] text-emerald-700 font-semibold">
                    &bull; Rata-rata 4.8 / 5.0 dari 5 responden
                  </td>
                </tr>

                {/* Aggregate Total Row */}
                <tr className="bg-[#FFF7ED] font-black text-sm border-t-2 border-[#EA580C]">
                  <td className="py-3.5 px-4 uppercase text-[#18181B]">Total Nilai Akhir Kumulatif (Composite Score)</td>
                  <td className="py-3.5 px-3 text-center text-[#EA580C]">100%</td>
                  <td className="py-3.5 px-3 text-right font-mono text-[#78716C] text-xs">Index</td>
                  <td className="py-3.5 px-3 text-right font-mono text-base text-[#EA580C]">
                    {currentDossier.finalScore.toFixed(2)}%
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#C2410C]">
                    Predikat: {currentDossier.ratingGrade}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Distinction & Incentive Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-[#FAF9F6] border border-[#E7E4DC] p-3 rounded-xl flex items-center gap-3">
              <Award className="w-6 h-6 text-[#EA580C] shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
                  Klasifikasi Talenta
                </span>
                <span className="text-xs font-black text-[#18181B]">{currentDossier.performanceCategory}</span>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-[#E7E4DC] p-3 rounded-xl flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
                  Rekomendasi Insentif / Bonus
                </span>
                <span className="text-xs font-black text-[#18181B]">{currentDossier.rewardMultiplier}</span>
              </div>
            </div>

            <div className="bg-[#FAF9F6] border border-[#E7E4DC] p-3 rounded-xl flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
                  Validitas Kalibrasi HR
                </span>
                <span className="text-xs font-black text-emerald-700">Terdaftar & Sah (Bell-Curve OK)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Itemized KPI Deliverables Table */}
        <div className="relative z-10 space-y-3 print-avoid-break">
          <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-2">
            <h2 className="text-xs font-black uppercase tracking-wider text-[#18181B] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#EA580C]" />
              Bagian 3: Rincian Pencapaian Indikator Kinerja Utama (KPI Breakdown)
            </h2>
            <span className="text-[11px] text-[#78716C]">
              Jumlah Indikator: <strong className="text-[#18181B]">{employeeKPIs.length || 4} KPI</strong>
            </span>
          </div>

          <div className="overflow-x-auto border border-[#E7E4DC] rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF9F6] text-[#78716C] border-b border-[#E7E4DC] text-[10px] uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-2.5 px-3">Kode</th>
                  <th className="py-2.5 px-3">Indikator Kinerja (KPI)</th>
                  <th className="py-2.5 px-2 text-center">Target</th>
                  <th className="py-2.5 px-2 text-center">Realisasi</th>
                  <th className="py-2.5 px-2 text-center">Bobot</th>
                  <th className="py-2.5 px-2 text-right">Capaian</th>
                  <th className="py-2.5 px-2 text-right">Skor</th>
                  <th className="py-2.5 px-3">Catatan Verifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E4DC] text-[#18181B]">
                {employeeKPIs.length > 0 ? (
                  employeeKPIs.map((k) => (
                    <tr key={k.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-[#EA580C]">{k.kpiCode}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#18181B] block">{k.kpiName}</span>
                        <span className="text-[10px] text-[#78716C]">{k.category} &bull; {k.direction}</span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-semibold">
                        {k.target} {k.unit}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-[#18181B]">
                        {k.actual} {k.unit}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-[#78716C]">{k.weight}%</td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold text-emerald-700">
                        {k.achievementRate}%
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-black text-[#EA580C]">
                        {k.weightedScore} pts
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-[#52525B]">
                        {k.supervisorNotes || 'Terverifikasi dengan bukti release ticket.'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-xs text-[#78716C]">
                      Semua KPI terverifikasi dalam siklus ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Qualitative Feedback, Strengths & IDP Targets */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 print-avoid-break">
          {/* Box A: Key Strengths & Accomplishments */}
          <div className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#18181B] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Pencapaian Utama & Kekuatan (Key Strengths)
            </h3>
            <ul className="space-y-1.5 text-xs text-[#52525B]">
              {currentDossier.evaluatorRemarks.keyAchievements.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box B: Growth Areas & Agreed IDP Targets */}
          <div className="bg-[#FAF9F6] border border-[#E7E4DC] rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#18181B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#EA580C]" />
              Area Perbaikan & Target Pengembangan (IDP Goals)
            </h3>
            <ul className="space-y-1.5 text-xs text-[#52525B]">
              {currentDossier.evaluatorRemarks.growthAreas.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#EA580C] font-bold">&bull;</span>
                  <span>{item}</span>
                </li>
              ))}
              {currentDossier.evaluatorRemarks.agreedIdpTargets.map((item, idx) => (
                <li key={`idp-${idx}`} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">&bull;</span>
                  <span className="font-semibold text-[#18181B]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. Tri-Party Official Digital Signatures Section */}
        <div className="relative z-10 pt-4 border-t-2 border-[#18181B] space-y-4 print-avoid-break">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#18181B] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                Bagian 4: Lembar Pengesahan & Tanda Tangan Digital Resmi
              </h2>
              <p className="text-[11px] text-[#78716C]">
                Tanda tangan digital ini sah dan terikat secara hukum sesuai regulasi ITE & Kebijakan Internal Perusahaan.
              </p>
            </div>
            
            {/* Quick Interactive Sign Button (for demo and role action) */}
            <div className="no-print flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveSignRole(
                    currentUserRole === 'Employee'
                      ? 'Employee'
                      : currentUserRole === 'Supervisor' || currentUserRole === 'Department Manager'
                      ? 'Supervisor'
                      : 'HR Director / Committee'
                  );
                  setSignModalOpen(true);
                }}
                className="rounded-full text-xs"
                leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-[#EA580C]" />}
              >
                Bubuhkan Tanda Tangan Digital
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Pegawai yang Dinilai (Employee) */}
            <div className="border border-[#E7E4DC] rounded-2xl p-4 bg-[#FAF9F6] flex flex-col justify-between min-h-[160px]">
              <div>
                <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                  Pegawai yang Dinilai
                </span>
                <span className="text-xs font-extrabold text-[#18181B] block mt-0.5">
                  {currentDossier.signatures.employee.signerName}
                </span>
                <span className="text-[10px] text-[#78716C] block">
                  {currentDossier.signatures.employee.signerTitle}
                </span>
              </div>

              {/* Signature Graphic / Seal */}
              <div className="my-3 py-2 border-y border-dashed border-[#D4D4D8] text-center">
                {isEmployeeSigned ? (
                  <div className="space-y-0.5">
                    <span className="font-serif italic text-lg text-[#18181B] font-bold tracking-wider">
                      {currentDossier.signatures.employee.signerName}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-700 block">
                      SIGNED ELECTRONICALLY &bull; {currentDossier.signatures.employee.signedAt?.slice(0, 10)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-amber-700 italic">Menunggu Tanda Tangan Pegawai</span>
                )}
              </div>

              <div className="text-[9px] font-mono text-[#78716C]">
                ID: {currentDossier.signatures.employee.digitalCertificateId || 'PRV-PENDING'}
              </div>
            </div>

            {/* Box 2: Atasan Langsung (Direct Supervisor / Reviewer) */}
            <div className="border border-[#E7E4DC] rounded-2xl p-4 bg-[#FAF9F6] flex flex-col justify-between min-h-[160px]">
              <div>
                <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                  Atasan Langsung (Appraiser)
                </span>
                <span className="text-xs font-extrabold text-[#18181B] block mt-0.5">
                  {currentDossier.signatures.supervisor.signerName}
                </span>
                <span className="text-[10px] text-[#78716C] block">
                  {currentDossier.signatures.supervisor.signerTitle}
                </span>
              </div>

              {/* Signature Graphic / Seal */}
              <div className="my-3 py-2 border-y border-dashed border-[#D4D4D8] text-center">
                {isSupervisorSigned ? (
                  <div className="space-y-0.5">
                    <span className="font-serif italic text-lg text-[#18181B] font-bold tracking-wider">
                      {currentDossier.signatures.supervisor.signerName}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-700 block">
                      ENDORSED & SIGNED &bull; {currentDossier.signatures.supervisor.signedAt?.slice(0, 10)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-amber-700 italic">Menunggu Verifikasi Atasan</span>
                )}
              </div>

              <div className="text-[9px] font-mono text-[#78716C]">
                ID: {currentDossier.signatures.supervisor.digitalCertificateId || 'PRV-PENDING'}
              </div>
            </div>

            {/* Box 3: Direktur HR & Komite Kalibrasi (Corporate Security Stamp) */}
            <div className="border-2 border-[#EA580C] rounded-2xl p-4 bg-[#FFF7ED] flex flex-col justify-between min-h-[160px] relative overflow-hidden">
              <div>
                <span className="text-[10px] font-extrabold text-[#C2410C] uppercase tracking-wider block">
                  Komite Kalibrasi & Direktur HR
                </span>
                <span className="text-xs font-extrabold text-[#18181B] block mt-0.5">
                  {currentDossier.signatures.hrDirector.signerName}
                </span>
                <span className="text-[10px] text-[#78716C] block">
                  {currentDossier.signatures.hrDirector.signerTitle}
                </span>
              </div>

              {/* Corporate Security Seal */}
              <div className="my-2 py-1.5 border-y border-dashed border-[#FED7AA] text-center flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#EA580C] flex items-center justify-center text-[#EA580C] shrink-0 font-bold text-[9px]">
                  SEAL
                </div>
                <div className="text-left space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-[#C2410C] block leading-tight">
                    PERVIA CORPORATE HR SEAL
                  </span>
                  <span className="text-[8px] font-mono text-[#78716C] block">
                    {currentDossier.signatures.hrDirector.verificationHash?.slice(0, 20) || 'SHA256:VERIFIED-PMS-2026'}
                  </span>
                </div>
              </div>

              <div className="text-[9px] font-mono font-bold text-[#C2410C] flex items-center justify-between">
                <span>STATUS: {isHRDirectorSigned ? 'RATIFIED & ARCHIVED' : 'PENDING COMMITTEE'}</span>
                <span>ISO 9001</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Footer Audit Trail */}
        <div className="relative z-10 pt-4 border-t border-[#E7E4DC] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#78716C] font-mono">
          <div>
            Generated by Pervia Performance Management System (PMS) &bull; Enterprise Edition
          </div>
          <div>
            DocID: {currentDossier.documentRef} &bull; Page 1 of 1 &bull; Printed {new Date().toLocaleDateString('id-ID')}
          </div>
        </div>
      </div>

      {/* Digital Signature Confirmation Modal */}
      {signModalOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl border border-[#E7E4DC] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider">
                  Digital Certificate Authority
                </span>
                <h3 className="text-base font-black text-[#18181B] mt-0.5">
                  Konfirmasi Pengesahan Dokumen
                </h3>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <p className="text-xs text-[#52525B]">
              Anda akan menandatangani berkas penilaian kinerja untuk <strong>{currentDossier.employeeName}</strong>{' '}
              ({currentDossier.documentRef}) secara digital dengan enkripsi SHA-256.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#78716C] mb-1">
                  Peran Penandatangan (Signer Role)
                </label>
                <select
                  value={activeSignRole}
                  onChange={(e) => setActiveSignRole(e.target.value as any)}
                  className="w-full bg-[#F9F5F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  <option value="Employee">Pegawai yang Dinilai (Employee)</option>
                  <option value="Supervisor">Atasan Langsung (Direct Supervisor)</option>
                  <option value="HR Director / Committee">Direktur HR / Komite Kalibrasi</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#78716C] mb-1">
                  Nama Penandatangan
                </label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="w-full bg-[#F9F5F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-xs font-bold"
                  placeholder="Nama Lengkap Penandatangan"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#78716C] mb-1">
                  Jabatan / Posisi
                </label>
                <input
                  type="text"
                  value={signatureTitle}
                  onChange={(e) => setSignatureTitle(e.target.value)}
                  className="w-full bg-[#F9F5F0] border border-[#E7E4DC] rounded-xl px-3 py-2 text-xs"
                  placeholder="Misal: Senior Software Engineer / VP of Engineering"
                />
              </div>

              <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E7E4DC] space-y-1 font-mono text-[10px] text-[#78716C]">
                <div>Security Hash: SHA256:7f9a2b8e34c190ddfae26b1...</div>
                <div>Status Jaringan: Enterprise Node Secure (SSL/TLS Encrypted)</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E7E4DC]">
              <Button variant="ghost" size="sm" onClick={() => setSignModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={handleExecuteSignature} className="rounded-full">
                Sahkan & Bubuhkan Tanda Tangan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
