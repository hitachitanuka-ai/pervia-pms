import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Target,
  Plus,
  BookOpen,
  CheckCircle2,
  Filter,
  Search,
  Building2,
  Users,
  Layers,
  ArrowRight,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { db } from '../../lib/database';
import { Link } from 'react-router-dom';

export const TargetManagementPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const targets = [
    {
      id: 'TGT-001',
      kpiCode: 'ENG-KPI-01',
      title: 'Sprint Story Points Delivery & Reliability',
      department: 'Engineering & Technology',
      targetQuota: '80 pts / sprint',
      weight: 25,
      frequency: 'Bi-Weekly',
      assignedRoles: 'Senior Software Engineer, Staff Engineer',
      assignedHeadcount: 14,
      status: 'Active',
    },
    {
      id: 'TGT-002',
      kpiCode: 'ENG-KPI-02',
      title: 'Production Defect Density & SLA MTTR',
      department: 'Engineering & Technology',
      targetQuota: 'Max 2.0 hrs MTTR',
      weight: 25,
      frequency: 'Monthly',
      assignedRoles: 'All Engineering Staff (IC2-IC5)',
      assignedHeadcount: 28,
      status: 'Active',
    },
    {
      id: 'TGT-003',
      kpiCode: 'PROD-KPI-01',
      title: 'Quarterly Active Users (QAU) Retention',
      department: 'Product & Design',
      targetQuota: '45.0% 30-Day Cohort',
      weight: 30,
      frequency: 'Quarterly',
      assignedRoles: 'Product Manager, Product Designer',
      assignedHeadcount: 12,
      status: 'Active',
    },
    {
      id: 'TGT-004',
      kpiCode: 'SALES-KPI-01',
      title: 'Enterprise Annual Recurring Revenue (ARR)',
      department: 'Sales & Growth',
      targetQuota: '$1.5M New Bookings',
      weight: 35,
      frequency: 'Quarterly',
      assignedRoles: 'Account Executive, Sales Lead',
      assignedHeadcount: 8,
      status: 'Active',
    },
    {
      id: 'TGT-005',
      kpiCode: 'OPS-KPI-01',
      title: 'Customer Ticket First Response Time (FRT)',
      department: 'Operations',
      targetQuota: 'Under 15 minutes',
      weight: 20,
      frequency: 'Continuous',
      assignedRoles: 'Operations Specialist, Support Lead',
      assignedHeadcount: 16,
      status: 'Active',
    },
  ];

  const filtered = targets.filter((t) => {
    const matchesDept = selectedDept === 'All' || t.department === selectedDept;
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.kpiCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assignedRoles.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              KPI Governance & Quotas
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight mt-1">
            Manajemen Target KPI (Target Management)
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5 max-w-2xl">
            Alokasi kuota target kinerja kuantitatif, penetapan bobot divisi, dan pemetaan standar indikator per jenjang posisi kerja.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/kpi/library">
            <Button variant="outline" size="sm" className="rounded-full text-xs">
              Katalog KPI Library &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-[#E7E4DC] p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-[#78716C]">Departemen:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-[#FAF9F6] border border-[#E7E4DC] text-xs font-bold rounded-xl px-3 py-2 text-[#18181B] focus:outline-none focus:border-[#EA580C] cursor-pointer"
          >
            <option value="All">Semua Departemen ({targets.length})</option>
            <option value="Engineering & Technology">Engineering & Technology</option>
            <option value="Product & Design">Product & Design</option>
            <option value="Sales & Growth">Sales & Growth</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari target atau role..."
            className="w-full bg-[#FAF9F6] border border-[#E7E4DC] rounded-xl pl-8 pr-3 py-2 text-xs text-[#18181B] focus:outline-none focus:border-[#EA580C]"
          />
        </div>
      </div>

      {/* Target Table Card */}
      <div className="bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3">
          <h3 className="text-sm font-black text-[#18181B] uppercase tracking-wider">
            Daftar Target Kinerja Aktif (Siklus 2026 Q1)
          </h3>
          <span className="text-xs font-semibold text-[#78716C]">
            Menampilkan {filtered.length} Target Terverifikasi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F6] text-[#78716C] border-b border-[#E7E4DC] text-[10px] uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-3">Kode KPI</th>
                <th className="py-3 px-4">Nama Indikator Kinerja</th>
                <th className="py-3 px-3">Departemen</th>
                <th className="py-3 px-3 text-center">Standar Target</th>
                <th className="py-3 px-3 text-center">Bobot</th>
                <th className="py-3 px-4">Role Pegawai yang Ditugaskan</th>
                <th className="py-3 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4DC] text-[#18181B]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#FFFDFB] transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-[#EA580C]">{item.kpiCode}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#18181B] block">{item.title}</span>
                    <span className="text-[10px] text-[#78716C]">Frekuensi: {item.frequency}</span>
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-[#52525B]">{item.department}</td>
                  <td className="py-3.5 px-3 text-center font-bold text-[#18181B] bg-[#FAF9F6] rounded-lg">
                    {item.targetQuota}
                  </td>
                  <td className="py-3.5 px-3 text-center font-black text-[#EA580C]">{item.weight}%</td>
                  <td className="py-3.5 px-4 text-[#52525B]">
                    <span>{item.assignedRoles}</span>
                    <span className="text-[10px] text-[#A8A29E] block">({item.assignedHeadcount} staf)</span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
