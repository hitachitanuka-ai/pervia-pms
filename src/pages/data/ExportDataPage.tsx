import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Download,
  FileCheck2,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  Layers,
  Database,
} from 'lucide-react';
import { db } from '../../lib/database';
import { downloadExcel, downloadCsv, downloadJson, exportCompanyReportPdf } from '../../utils/exportHelpers';

export const ExportDataPage: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<'xlsx' | 'csv' | 'pdf' | 'json'>('xlsx');
  const [selectedDomain, setSelectedDomain] = useState<'all' | 'kpis' | 'competencies' | 'evaluations'>('all');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const employees = db.getEmployees();
  const departments = db.getDepartments();

  const handleExport = () => {
    setIsExporting(true);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filteredEmployees = selectedDept === 'All'
      ? employees
      : employees.filter((e) => e.departmentName === selectedDept);

    setTimeout(() => {
      try {
        if (selectedFormat === 'xlsx') {
          const empData = filteredEmployees.map((e) => ({
            'Employee ID': e.employeeId,
            'Full Name': e.fullName,
            Department: e.departmentName,
            Position: e.positionTitle,
            Role: e.role,
            Status: e.employmentStatus,
            Email: e.email,
            'Join Date': e.joinDate,
            'KPI Score (%)': 94.2,
            'Competency Score': '4.4 / 5.0',
            'Final Composite (%)': 92.8,
            'Grade Band': 'Grade A',
          }));

          const deptData = departments.map((d) => ({
            'Department ID': d.id,
            'Department Name': d.name,
            Headcount: d.employeeCount,
            'Manager ID': d.managerId || '-',
          }));

          downloadExcel(`Pervia_Enterprise_Performance_Dossier_${dateStr}.xlsx`, [
            { name: 'Employee Scorecards', data: empData },
            { name: 'Departments', data: deptData },
          ]);
        } else if (selectedFormat === 'csv') {
          const headers = [
            'Employee ID',
            'Full Name',
            'Department',
            'Position',
            'Status',
            'Role',
            'KPI Score',
            'Competency Score',
            'Composite Rating',
            'Grade Band',
          ];
          const rows = filteredEmployees.map((e) => [
            e.employeeId,
            e.fullName,
            e.departmentName,
            e.positionTitle,
            e.employmentStatus,
            e.role,
            '94.2%',
            '4.4 / 5.0',
            '92.8%',
            'Grade A',
          ]);
          downloadCsv(`Pervia_Employee_Performance_${dateStr}.csv`, headers, rows);
        } else if (selectedFormat === 'pdf') {
          exportCompanyReportPdf({
            companyName: 'Pervia Enterprise Performance Management',
            cycleName: '2026 Q1 Enterprise Performance Cycle',
            overallScore: 91.4,
          });
        } else if (selectedFormat === 'json') {
          const backupPayload = {
            metadata: {
              system: 'Pervia Enterprise Performance Management',
              version: '2026.1-enterprise',
              exportedAt: new Date().toISOString(),
              scope: selectedDomain,
              department: selectedDept,
            },
            employees: filteredEmployees,
            departments: departments,
            evaluations: db.getEvaluations(),
            dossiers: db.getAppraisalDossiers(),
            calibrationOverrides: db.getCalibrationOverrides(),
          };
          downloadJson(`Pervia_Database_Backup_${dateStr}.json`, backupPayload);
        }

        setExportComplete(true);
        setTimeout(() => setExportComplete(false), 5000);
      } catch (err) {
        console.error('Export error:', err);
      } finally {
        setIsExporting(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            Data Portability &bull; Export Engine
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            Export Performance Dossiers
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Export appraisal archives, KPI attainment reports, and compliance dossiers in Excel, CSV, PDF, or JSON.
          </p>
        </div>
      </div>

      {/* Format Selection Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#18181B]">1. Select Export Format</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            {
              id: 'xlsx',
              title: 'Microsoft Excel (.xlsx)',
              desc: 'Formatted multi-tab workbook with embedded pivot calculations and summary scorecards.',
              icon: FileSpreadsheet,
              badge: 'Recommended',
            },
            {
              id: 'csv',
              title: 'Comma-Separated (.csv)',
              desc: 'Raw normalized tabular format suitable for data warehouses and BI pipelines.',
              icon: FileText,
              badge: 'Raw Data',
            },
            {
              id: 'pdf',
              title: 'Executive PDF Dossier',
              desc: 'Print-ready executive summary dossiers with visual scorecards and digital sign-off blocks.',
              icon: FileCheck2,
              badge: 'Executive',
            },
            {
              id: 'json',
              title: 'PostgreSQL Relational JSON',
              desc: 'Complete relational entity backup matching database table schema definitions.',
              icon: Database,
              badge: 'Full Backup',
            },
          ].map((f) => {
            const Icon = f.icon;
            const isSelected = selectedFormat === f.id;
            return (
              <div
                key={f.id}
                onClick={() => setSelectedFormat(f.id as any)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#EA580C] bg-[#FFF7ED] shadow-xs'
                    : 'border-[#E7E4DC] hover:border-[#DDD9CE] bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#EA580C] text-white' : 'bg-[#F5EFE6] text-[#78716C]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-[#78716C] bg-white border border-[#E7E4DC] px-2 py-0.5 rounded-full">
                      {f.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#18181B]">{f.title}</h4>
                  <p className="text-[11px] text-[#78716C] mt-1 leading-relaxed">{f.desc}</p>
                </div>

                <div className="mt-4 pt-2 border-t border-[#F5EFE6] flex items-center justify-between">
                  <span className="text-[10px] text-[#A8A29E] font-medium">Click to select</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters & Scope Configuration */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <h3 className="text-sm font-bold text-[#18181B]">2. Configure Export Scope & Filters</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-[#292524] block mb-1">Evaluation Period</label>
            <select className="w-full p-2.5 rounded-xl border border-[#DDD9CE] bg-white">
              <option>2026 Q1 Enterprise Performance Cycle (Active)</option>
              <option>2025 Q4 Annual Evaluation Cycle</option>
              <option>All Historical Periods</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-[#292524] block mb-1">Department Filter</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#DDD9CE] bg-white"
            >
              <option value="All">All Departments (128 Employees)</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-[#292524] block mb-1">Data Scope</label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-[#DDD9CE] bg-white"
            >
              <option value="all">Full Comprehensive Dossier (KPI + Comp + Reviews)</option>
              <option value="kpis">KPI Targets & Actual Deliverables Only</option>
              <option value="competencies">Competency & Behavioral Scores Only</option>
              <option value="evaluations">Final Composite Ratings & Grade Bands Only</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-[#F5EFE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-[#78716C]">
            Ready to export: <b>128 Employee Records</b> &bull; Format: <b>.{selectedFormat.toUpperCase()}</b>
          </div>

          <Button
            variant="primary"
            size="md"
            disabled={isExporting}
            onClick={handleExport}
            className="rounded-full shadow-xs"
            leftIcon={<Download className="w-4 h-4" />}
          >
            {isExporting ? 'Generating Archive...' : `Export to .${selectedFormat.toUpperCase()}`}
          </Button>
        </div>

        {exportComplete && (
          <div className="p-3 bg-[#DCFCE7] text-[#16A34A] text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Archive generated successfully! File download has started.</span>
          </div>
        )}
      </Card>

      {/* Preview Table */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#18181B]">Data Preview (First 5 Records)</h3>
          <span className="text-xs text-[#78716C]">Sample of data included in export payload</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#F5EFE6] text-[#78716C] uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Emp ID</th>
                <th className="py-2.5 px-3">Employee Name</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Role Level</th>
                <th className="py-2.5 px-3">KPI Score</th>
                <th className="py-2.5 px-3">Comp Score</th>
                <th className="py-2.5 px-3">Composite Rating</th>
                <th className="py-2.5 px-3">Grade Band</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {employees.slice(0, 5).map((e) => (
                <tr key={e.id} className="hover:bg-[#FDFBF9]">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#EA580C]">{e.employeeId}</td>
                  <td className="py-2.5 px-3 font-bold text-[#18181B]">{e.fullName}</td>
                  <td className="py-2.5 px-3 text-[#57534E]">{e.departmentName}</td>
                  <td className="py-2.5 px-3 text-[#57534E]">{e.positionTitle}</td>
                  <td className="py-2.5 px-3 font-bold text-[#18181B]">94.2%</td>
                  <td className="py-2.5 px-3 font-bold text-[#18181B]">4.4 / 5.0</td>
                  <td className="py-2.5 px-3 font-black text-[#EA580C]">92.8%</td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full text-[10px]">
                      Grade A
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
