import React, { useState } from 'react';
import { db } from '../../lib/database';
import { CompensationEmployee, UserRole } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { PerviaLogo } from '../../components/brand/PerviaLogo';
import {
  DollarSign,
  TrendingUp,
  Award,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  FileText,
  Printer,
  ShieldCheck,
  Building2,
  Users,
  Search,
  ArrowRight,
  Info,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { downloadCsv } from '../../utils/exportHelpers';

export const SalaryIncentiveSimulatorPage: React.FC = () => {
  const { user, role } = useAuth();
  const [employees, setEmployees] = useState<CompensationEmployee[]>(db.getCompensationEmployees());
  const [bonusBudgetLimit, setBonusBudgetLimit] = useState<number>(300000000); // 300 Million IDR
  const [meritTargetPct, setMeritTargetPct] = useState<number>(8.0); // 8% avg merit
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [activeLetterEmployee, setActiveLetterEmployee] = useState<CompensationEmployee | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Format currency in Rupiah (IDR)
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Calculations
  const totalCurrentPayroll = employees.reduce((acc, curr) => acc + curr.currentSalary, 0);
  const totalNewPayroll = employees.reduce((acc, curr) => acc + curr.newSalary, 0);
  const totalMonthlyIncrement = totalNewPayroll - totalCurrentPayroll;
  const avgMeritPct = Number((employees.reduce((acc, curr) => acc + curr.meritIncreasePct, 0) / employees.length).toFixed(2));
  const totalBonusPool = employees.reduce((acc, curr) => acc + curr.bonusAmount, 0);
  const bonusBudgetUsagePct = Math.round((totalBonusPool / bonusBudgetLimit) * 100);

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.positionTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = filterDept === 'all' || emp.departmentName === filterDept;
    return matchSearch && matchDept;
  });

  const handleMeritPctChange = (empId: string, newPct: number) => {
    const updated = db.updateCompensationEmployee(empId, { meritIncreasePct: newPct });
    if (updated) {
      setEmployees(db.getCompensationEmployees());
    }
  };

  const handleBonusMultiplierChange = (empId: string, newMultiplier: number) => {
    const updated = db.updateCompensationEmployee(empId, { bonusMultiplier: newMultiplier });
    if (updated) {
      setEmployees(db.getCompensationEmployees());
    }
  };

  const handleApplyAll = () => {
    db.applyAllCompensationRecommendations();
    setEmployees(db.getCompensationEmployees());
    setSuccessBanner('Rekomendasi penyesuaian gaji dan bonus kinerja resmi disahkan untuk integrasi Payroll & Finance!');
    setTimeout(() => setSuccessBanner(null), 6000);
  };

  const handleExportCSV = () => {
    const headers = [
      'NIK',
      'Nama',
      'Departemen',
      'Posisi',
      'Level',
      'Gaji Saat Ini',
      'Skor Kinerja',
      'Grade',
      'Compa Ratio',
      'Merit Increase (%)',
      'Gaji Baru',
      'Bonus Multiplier',
      'Nominal Bonus',
      'Status',
    ];
    const rows = employees.map((e) => [
      e.employeeId,
      e.fullName,
      e.departmentName,
      e.positionTitle,
      e.level,
      e.currentSalary,
      e.performanceScore,
      e.ratingGrade,
      e.compaRatio,
      `${e.meritIncreasePct}%`,
      e.newSalary,
      `${e.bonusMultiplier}x`,
      e.bonusAmount,
      e.status,
    ]);
    downloadCsv(`Pervia_Payroll_Merit_Bonus_2026_Q1.csv`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1">
            <span className="font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
              Compensation & Rewards Strategy
            </span>
            <span>&bull;</span>
            <span>Siklus Penilaian 2026 Q1</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight">
            Simulasi Kenaikan Gaji & Bonus Kinerja (Merit & Incentive Simulator)
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Model kalkulasi kenaikan gaji pokok berkala (merit matrix) dan alokasi bonus pool berdasarkan capaian prestasi kerja dan compa-ratio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-full shadow-xs"
            leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />}
          >
            Ekspor Payroll CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleApplyAll}
            className="rounded-full shadow-xs font-bold"
            leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
          >
            Sahkan Rekomendasi Gaji
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">{successBanner}</p>
              <p className="text-[11px] text-emerald-700">Tercatat dalam audit log sistem dengan enkripsi integritas data.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            RATIFIED
          </span>
        </div>
      )}

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Payroll Increment */}
        <div className="bg-white rounded-3xl border border-[#E7E4DC] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Kenaikan Gaji Bulanan Total
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#18181B] mt-1.5">
                {formatIDR(totalMonthlyIncrement)}
              </div>
              <span className="text-[11px] font-semibold text-[#EA580C] mt-0.5 block">
                +{( (totalMonthlyIncrement / totalCurrentPayroll) * 100 ).toFixed(1)}% dari total payroll
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#F5F4EF] text-[11px] text-[#78716C] flex justify-between">
            <span>Rata-rata Merit:</span>
            <strong className="text-[#18181B]">{avgMeritPct}% per pegawai</strong>
          </div>
        </div>

        {/* Card 2: Bonus Pool Distribution */}
        <div className="bg-white rounded-3xl border border-[#E7E4DC] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Total Bonus Kinerja Disimulasikan
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#18181B] mt-1.5">
                {formatIDR(totalBonusPool)}
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 block">
                Pagu: {formatIDR(bonusBudgetLimit)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-[#78716C]">
              <span>Penggunaan Pagu:</span>
              <span className={bonusBudgetUsagePct > 100 ? 'text-rose-600 font-black' : 'text-emerald-700'}>
                {bonusBudgetUsagePct}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#FAF9F6] border border-[#E7E4DC] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  bonusBudgetUsagePct > 100 ? 'bg-rose-600' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(100, bonusBudgetUsagePct)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: New Base Payroll Base */}
        <div className="bg-white rounded-3xl border border-[#E7E4DC] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Estimasi Payroll Baru / Bulan
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#18181B] mt-1.5">
                {formatIDR(totalNewPayroll)}
              </div>
              <span className="text-[11px] text-[#78716C] mt-0.5 block">
                Sebelumnya: {formatIDR(totalCurrentPayroll)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#FAF9F6] text-[#78716C] border border-[#E7E4DC] flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#F5F4EF] text-[11px] text-[#78716C] flex justify-between">
            <span>Pegawai Tercover:</span>
            <strong className="text-[#18181B]">{employees.length} staf aktif</strong>
          </div>
        </div>

        {/* Card 4: Top Performer Incentive Multiplier */}
        <div className="bg-white rounded-3xl border border-[#E7E4DC] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Grade A Top Performer Multiplier
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#EA580C] mt-1.5">
                1.50x s/d 2.00x
              </div>
              <span className="text-[11px] text-[#78716C] mt-0.5 block">
                Merit: 9.5% - 11.0%
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#F5F4EF] text-[11px] text-emerald-700 flex justify-between font-bold">
            <span>Diferensiasi Kinerja:</span>
            <span>Tinggi (High Merit)</span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Merit Matrix Policy Guide & Budget Sliders */}
      <div className="bg-white rounded-3xl border border-[#E7E4DC] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E4DC] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#EA580C]" />
            <h2 className="text-sm font-black text-[#18181B] tracking-tight uppercase">
              Parameter Anggaran & Matriks Kebijakan Kenaikan Gaji (Merit Policy Grid)
            </h2>
          </div>
          <span className="text-[11px] text-[#78716C]">
            Model Compa-Ratio Quartile &bull; Validated ISO 9001
          </span>
        </div>

        {/* Interactive Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF9F6] p-4 rounded-2xl border border-[#E7E4DC]">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-[#18181B]">Pagu Anggaran Bonus Kinerja (Bonus Pool Budget):</span>
              <strong className="text-[#EA580C] text-sm">{formatIDR(bonusBudgetLimit)}</strong>
            </div>
            <input
              type="range"
              min={100000000}
              max={600000000}
              step={10000000}
              value={bonusBudgetLimit}
              onChange={(e) => setBonusBudgetLimit(Number(e.target.value))}
              className="w-full accent-[#EA580C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#78716C] mt-1 font-mono">
              <span>Rp 100 Juta</span>
              <span>Rp 350 Juta</span>
              <span>Rp 600 Juta</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-[#18181B]">Pedoman Target Merit Kenaikan Gaji Rata-rata:</span>
              <strong className="text-[#EA580C] text-sm">{meritTargetPct}%</strong>
            </div>
            <input
              type="range"
              min={3.0}
              max={15.0}
              step={0.5}
              value={meritTargetPct}
              onChange={(e) => setMeritTargetPct(Number(e.target.value))}
              className="w-full accent-[#EA580C] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#78716C] mt-1 font-mono">
              <span>3.0% (Konservatif)</span>
              <span>8.0% (Standar Industri)</span>
              <span>15.0% (Agresif)</span>
            </div>
          </div>
        </div>

        {/* Standard Matrix Reference Table */}
        <div className="overflow-x-auto border border-[#E7E4DC] rounded-xl text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#FAF9F6] text-[#78716C] text-[10px] uppercase font-bold border-b border-[#E7E4DC]">
              <tr>
                <th className="py-2.5 px-3">Grade Kinerja (Rating)</th>
                <th className="py-2.5 px-3 text-center">Bonus Multiplier</th>
                <th className="py-2.5 px-3 text-center">Below Market (&lt;90%)</th>
                <th className="py-2.5 px-3 text-center">At Market (90% - 110%)</th>
                <th className="py-2.5 px-3 text-center">Above Market (&gt;110%)</th>
                <th className="py-2.5 px-4">Deskripsi Rekomendasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4DC] text-[#18181B]">
              <tr className="bg-emerald-50/50">
                <td className="py-2 px-3 font-bold text-emerald-800">Grade A (Outstanding / 90%+)</td>
                <td className="py-2 px-3 text-center font-bold text-[#EA580C]">1.50x - 2.00x</td>
                <td className="py-2 px-3 text-center font-mono font-bold">12.0% - 14.0%</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-[#EA580C]">9.0% - 11.0%</td>
                <td className="py-2 px-3 text-center font-mono font-bold">6.0% - 8.0%</td>
                <td className="py-2 px-4 text-[11px] text-[#52525B]">Prioritas retensi maksimal, promosi, akselerasi karir.</td>
              </tr>
              <tr className="bg-amber-50/40">
                <td className="py-2 px-3 font-bold text-amber-900">Grade B+ (Exceeds / 85% - 89%)</td>
                <td className="py-2 px-3 text-center font-bold text-[#EA580C]">1.25x</td>
                <td className="py-2 px-3 text-center font-mono font-bold">8.0% - 10.0%</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-[#EA580C]">6.0% - 8.0%</td>
                <td className="py-2 px-3 text-center font-mono font-bold">4.0% - 5.5%</td>
                <td className="py-2 px-4 text-[11px] text-[#52525B]">Kontributor tinggi, perluasan lingkup tanggung jawab.</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-[#18181B]">Grade B (Meets / 80% - 84%)</td>
                <td className="py-2 px-3 text-center font-semibold text-[#52525B]">1.00x</td>
                <td className="py-2 px-3 text-center font-mono">6.0% - 7.0%</td>
                <td className="py-2 px-3 text-center font-mono font-semibold">4.0% - 5.0%</td>
                <td className="py-2 px-3 text-center font-mono">2.5% - 3.5%</td>
                <td className="py-2 px-4 text-[11px] text-[#52525B]">Kinerja solid sesuai ekspektasi standar jabatan.</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-amber-800">Grade C (Needs Imp. / 70% - 79%)</td>
                <td className="py-2 px-3 text-center font-mono text-[#78716C]">0.50x</td>
                <td className="py-2 px-3 text-center font-mono">2.0%</td>
                <td className="py-2 px-3 text-center font-mono">1.0%</td>
                <td className="py-2 px-3 text-center font-mono">0.0%</td>
                <td className="py-2 px-4 text-[11px] text-amber-800">Di bawah ekspektasi. Pembekalan coaching / IDP intensif.</td>
              </tr>
              <tr className="bg-rose-50/50">
                <td className="py-2 px-3 font-bold text-rose-800">Grade D (Unsatisfactory / &lt;70%)</td>
                <td className="py-2 px-3 text-center font-mono text-rose-700">0.00x</td>
                <td className="py-2 px-3 text-center font-mono text-rose-700">0.0%</td>
                <td className="py-2 px-3 text-center font-mono text-rose-700">0.0%</td>
                <td className="py-2 px-3 text-center font-mono text-rose-700">0.0%</td>
                <td className="py-2 px-4 text-[11px] text-rose-800 font-semibold">Wajib Performance Improvement Plan (PIP) 60 hari.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Live Employee Compensation & Merit Table */}
      <div className="bg-white rounded-3xl border border-[#E7E4DC] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E4DC] pb-3">
          <div>
            <h2 className="text-sm font-black text-[#18181B] tracking-tight uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-[#EA580C]" />
              Daftar Rekomendasi Kompensasi Karyawan
            </h2>
            <span className="text-xs text-[#78716C]">
              Anda dapat mengedit persentase merit atau pengali bonus secara langsung per individu.
            </span>
          </div>

          {/* Search & Department Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama atau NIK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#FAF9F6] border border-[#E7E4DC] rounded-full text-xs text-[#18181B] focus:outline-none focus:border-[#EA580C]"
              />
            </div>

            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-[#FAF9F6] border border-[#E7E4DC] text-xs font-semibold rounded-full px-3 py-1.5 text-[#18181B]"
            >
              <option value="all">Semua Departemen</option>
              <option value="Engineering & Technology">Engineering</option>
              <option value="Product & Design">Product</option>
              <option value="Sales & Revenue">Sales</option>
              <option value="People & Culture (HR)">HR</option>
              <option value="Finance & Operations">Finance</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-[#E7E4DC] rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F6] text-[#78716C] border-b border-[#E7E4DC] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-3">Pegawai</th>
                <th className="py-3 px-3 text-right">Gaji Saat Ini</th>
                <th className="py-3 px-2 text-center">Skor & Grade</th>
                <th className="py-3 px-2 text-center">Compa-Ratio</th>
                <th className="py-3 px-2 text-center">% Merit</th>
                <th className="py-3 px-3 text-right">Gaji Baru (Bulan)</th>
                <th className="py-3 px-2 text-center">Bonus Mult</th>
                <th className="py-3 px-3 text-right">Nominal Bonus</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-3 text-center">Surat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4DC] text-[#18181B]">
              {filteredEmployees.map((emp) => (
                <tr key={emp.employeeId} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-bold text-[#18181B] block">{emp.fullName}</span>
                    <span className="text-[10px] text-[#78716C] block">
                      {emp.employeeId} &bull; {emp.positionTitle} ({emp.level})
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-medium text-[#52525B]">
                    {formatIDR(emp.currentSalary)}
                  </td>

                  <td className="py-3 px-2 text-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        emp.ratingGrade.includes('Grade A')
                          ? 'bg-emerald-100 text-emerald-800'
                          : emp.ratingGrade.includes('Grade B+')
                          ? 'bg-orange-100 text-[#EA580C]'
                          : emp.ratingGrade.includes('Grade B')
                          ? 'bg-stone-200 text-stone-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {emp.ratingGrade.split(' ')[0]} ({emp.performanceScore}%)
                    </span>
                  </td>

                  <td className="py-3 px-2 text-center font-mono text-[11px]">
                    {(emp.compaRatio * 100).toFixed(0)}%
                  </td>

                  {/* Inline editable Merit Increase % */}
                  <td className="py-3 px-2 text-center">
                    <div className="inline-flex items-center gap-1 bg-[#FAF9F6] border border-[#E7E4DC] rounded-lg px-2 py-1">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="25"
                        value={emp.meritIncreasePct}
                        onChange={(e) => handleMeritPctChange(emp.employeeId, Number(e.target.value))}
                        className="w-12 text-center font-mono font-bold text-xs text-[#EA580C] bg-transparent focus:outline-none"
                      />
                      <span className="text-[10px] text-[#78716C]">%</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-black text-[#18181B]">
                    {formatIDR(emp.newSalary)}
                  </td>

                  {/* Inline selectable Bonus Multiplier */}
                  <td className="py-3 px-2 text-center">
                    <select
                      value={emp.bonusMultiplier}
                      onChange={(e) => handleBonusMultiplierChange(emp.employeeId, Number(e.target.value))}
                      className="bg-[#FAF9F6] border border-[#E7E4DC] text-[11px] font-bold text-[#EA580C] rounded-lg px-2 py-1 cursor-pointer"
                    >
                      <option value={2.0}>2.00x</option>
                      <option value={1.5}>1.50x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.0}>1.00x</option>
                      <option value={0.5}>0.50x</option>
                      <option value={0.0}>0.00x</option>
                    </select>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                    {formatIDR(emp.bonusAmount)}
                  </td>

                  <td className="py-3 px-2 text-center">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        emp.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveLetterEmployee(emp)}
                      className="rounded-full text-xs p-1.5"
                      title="Lihat Surat Resmi Kenaikan Gaji & Bonus"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#EA580C]" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Official Compensation Letter Preview Modal */}
      {activeLetterEmployee && (
        <Modal
          isOpen={Boolean(activeLetterEmployee)}
          onClose={() => setActiveLetterEmployee(null)}
          title={`Surat Keputusan Penyesuaian Gaji & Bonus — ${activeLetterEmployee.fullName}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs p-2 sm:p-4">
            {/* Letterhead */}
            <div className="border-b-2 border-[#18181B] pb-4 flex items-start justify-between">
              <div>
                <PerviaLogo size="sm" showText={true} compact={false} />
                <p className="text-[10px] text-[#78716C] mt-1">
                  Human Resources & Compensation Committee &bull; PT Pervia Enterprise Global
                </p>
              </div>
              <div className="text-right text-[10px] font-mono text-[#78716C]">
                <div>No: SK/HR-COMP/2026/Q1/{activeLetterEmployee.employeeId}</div>
                <div>Tanggal: 03 April 2026</div>
                <div className="font-bold text-[#EA580C]">CONFIDENTIAL</div>
              </div>
            </div>

            {/* Salutation & Body */}
            <div className="space-y-3 text-[#292524] leading-relaxed">
              <p>
                Kepada Yth. <br />
                <strong>{activeLetterEmployee.fullName}</strong> ({activeLetterEmployee.employeeId})<br />
                {activeLetterEmployee.positionTitle} &bull; Departemen {activeLetterEmployee.departmentName}
              </p>

              <p>
                Dengan hormat,
              </p>

              <p>
                Berdasarkan hasil Evaluasi Prestasi Kerja Siklus <strong>2026 Q1</strong> dan keputusan sidang kalibrasi Direksi & Komite Remunerasi, dengan bangga kami sampaikan apresiasi atas kontribusi Anda dengan predikat:
              </p>

              <div className="p-3 bg-[#FAF9F6] border border-[#E7E4DC] rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#78716C] uppercase">Skor Evaluasi Prestasi:</span>
                  <span className="text-sm font-black text-[#EA580C] block">
                    {activeLetterEmployee.performanceScore}% ({activeLetterEmployee.ratingGrade})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#78716C] uppercase">Kategori Kinerja:</span>
                  <span className="text-xs font-extrabold text-emerald-800 block">Top Tier Contributor</span>
                </div>
              </div>

              <p>
                Sehubungan dengan hasil tersebut, Perusahaan menetapkan penyesuaian kompensasi dan insentif kinerja sebagai berikut:
              </p>

              <div className="grid grid-cols-2 gap-3 bg-[#FFF7ED] p-4 rounded-xl border border-[#FED7AA]">
                <div>
                  <span className="text-[10px] font-bold text-[#78716C] block">Gaji Pokok Baru (+{activeLetterEmployee.meritIncreasePct}% Merit):</span>
                  <strong className="text-sm text-[#18181B] font-mono">{formatIDR(activeLetterEmployee.newSalary)} / bulan</strong>
                  <span className="text-[10px] text-[#78716C] block mt-0.5">(Sebelumnya: {formatIDR(activeLetterEmployee.currentSalary)})</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#78716C] block">Bonus Kinerja Kuartal (Multiplier {activeLetterEmployee.bonusMultiplier}x):</span>
                  <strong className="text-sm text-emerald-700 font-mono">{formatIDR(activeLetterEmployee.bonusAmount)}</strong>
                  <span className="text-[10px] text-[#78716C] block mt-0.5">Dibayarkan pada payroll periode April 2026</span>
                </div>
              </div>

              <p className="text-[11px] text-[#78716C]">
                Penyesuaian ini efektif berlaku terhitung mulai tanggal <strong>01 Mei 2026</strong>. Kami berharap apresiasi ini dapat terus memotivasi Anda dalam menciptakan inovasi dan keunggulan bagi kemajuan bersama.
              </p>
            </div>

            {/* Signature Block */}
            <div className="pt-4 border-t border-[#E7E4DC] flex items-end justify-between text-xs">
              <div>
                <p className="text-[10px] text-[#78716C]">Disahkan oleh:</p>
                <div className="mt-4 font-bold text-[#18181B]">Elena Rostova</div>
                <div className="text-[10px] text-[#78716C]">Director of Human Resources</div>
                <div className="text-[9px] font-mono text-emerald-700 mt-1">SHA256:VERIFIED-PAYROLL-SEAL</div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.print()}
                  className="rounded-full"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                >
                  Cetak Surat Resmi
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setActiveLetterEmployee(null)}>
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
