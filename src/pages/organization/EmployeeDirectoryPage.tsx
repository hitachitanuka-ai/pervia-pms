import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { Employee, EmploymentStatus, UserRole } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Eye,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
  Target,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import * as XLSX from 'xlsx';

export const EmployeeDirectoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>(db.getEmployees());
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Sync URL search parameters for seamless inter-module navigation
  useEffect(() => {
    const deptParam = searchParams.get('dept');
    if (deptParam) {
      setSelectedDept(deptParam);
    }
    const empParam = searchParams.get('employeeId') || searchParams.get('id');
    if (empParam) {
      const match = employees.find((e) => e.id === empParam || e.employeeId === empParam);
      if (match) {
        setSelectedEmployee(match);
      }
    }
  }, [searchParams, employees]);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState({
    employeeId: `EMP-0${employees.length + 1}`,
    fullName: '',
    email: '',
    phone: '+1 (555) 019-0000',
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    positionId: 'p1000000-0000-0000-0000-000000000003',
    employmentStatus: 'Active' as EmploymentStatus,
    role: 'Employee' as UserRole,
    joinDate: new Date().toISOString().slice(0, 10),
  });

  const departments = db.getDepartments();
  const positions = db.getPositions();

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'all' || emp.departmentName === selectedDept;
    const matchesStatus = selectedStatus === 'all' || emp.employmentStatus === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.fullName || !newEmp.email) return;

    const dept = departments.find((d) => d.id === newEmp.departmentId);
    const pos = positions.find((p) => p.id === newEmp.positionId);

    db.addEmployee({
      employeeId: newEmp.employeeId,
      fullName: newEmp.fullName,
      email: newEmp.email,
      phone: newEmp.phone,
      departmentId: newEmp.departmentId,
      departmentName: dept?.name || 'Engineering & Technology',
      positionId: newEmp.positionId,
      positionTitle: pos?.title || 'Software Engineer',
      employmentStatus: newEmp.employmentStatus,
      role: newEmp.role,
      joinDate: newEmp.joinDate,
      avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + employees.length}?auto=format&fit=crop&w=256&q=80`,
    });

    setEmployees([...db.getEmployees()]);
    setCreateModalOpen(false);
  };

  const exportExcel = () => {
    const wsData = filtered.map((e) => ({
      'Employee ID': e.employeeId,
      'Full Name': e.fullName,
      Email: e.email,
      Phone: e.phone,
      Department: e.departmentName,
      Position: e.positionTitle,
      Status: e.employmentStatus,
      Role: e.role,
      'Join Date': e.joinDate,
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, `TeamHub_Employees_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const modalPerformanceData = [
    { period: 'Q1 25', score: 78.5 },
    { period: 'Q2 25', score: 81.2 },
    { period: 'Q3 25', score: 80.5 },
    { period: 'Q4 25', score: 84.8 },
    { period: 'Q1 26', score: 89.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Top 3 Stat Cards Styled in the Warm Terracotta Model with Progress Tracks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card hover className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              Total Headcount
            </span>
            <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
              +4% Net
            </span>
          </div>

          <div className="flex items-center gap-3.5 my-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/20 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#292524]">128</span>
                <span className="text-xs text-[#78716C]">Employees</span>
              </div>
              {/* Progress Track */}
              <div className="mt-2 w-full bg-[#FFEDD5] h-2 rounded-full relative">
                <div className="bg-[#EA580C] h-2 rounded-full" style={{ width: '92%' }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#EA580C] shadow-xs"
                  style={{ left: 'calc(92% - 7px)' }}
                />
              </div>
            </div>
          </div>
          <span className="text-[11px] text-[#A8A29E] mt-2 block">100% active roster capacity</span>
        </Card>

        <Card hover className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              Average Team Performance
            </span>
            <span className="text-[10px] font-bold text-[#16A36A] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full">
              Exceeding
            </span>
          </div>

          <div className="flex items-center gap-3.5 my-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#F59E0B] text-white flex items-center justify-center shadow-md shadow-[#F59E0B]/20 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#292524]">89.5%</span>
                <span className="text-xs text-[#D97706] font-bold">Grade A</span>
              </div>
              {/* Progress Track */}
              <div className="mt-2 w-full bg-[#FEF3C7] h-2 rounded-full relative">
                <div className="bg-[#F59E0B] h-2 rounded-full" style={{ width: '89.5%' }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#F59E0B] shadow-xs"
                  style={{ left: 'calc(89.5% - 7px)' }}
                />
              </div>
            </div>
          </div>
          <span className="text-[11px] text-[#A8A29E] mt-2 block">+3.8% increased vs last period</span>
        </Card>

        <Card hover className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
              Cycle Reviews Submitted
            </span>
            <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
              79 / 115
            </span>
          </div>

          <div className="flex items-center gap-3.5 my-1.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white flex items-center justify-center shadow-md shadow-[#C2410C]/20 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-[#292524]">68.7%</span>
                <span className="text-xs text-[#EA580C] font-bold">In Calibration</span>
              </div>
              {/* Progress Track */}
              <div className="mt-2 w-full bg-[#FFEDD5] h-2 rounded-full relative">
                <div className="bg-[#EA580C] h-2 rounded-full" style={{ width: '68.7%' }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#EA580C] shadow-xs"
                  style={{ left: 'calc(68.7% - 7px)' }}
                />
              </div>
            </div>
          </div>
          <span className="text-[11px] text-[#A8A29E] mt-2 block">Review deadline in 14 days</span>
        </Card>
      </div>

      {/* Action Controls & Filters Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-[#A8A29E]" />
            <input
              type="text"
              placeholder="Search by name, position or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-[#EFE4D7] bg-[#FAF6F0] focus:bg-white focus:outline-none focus:border-[#EA580C] focus:ring-3 focus:ring-[#FFEDD5] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="text-xs rounded-full border border-[#EFE4D7] px-3.5 py-2 bg-[#FAF6F0] text-[#292524] focus:outline-none font-medium cursor-pointer"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs rounded-full border border-[#EFE4D7] px-3.5 py-2 bg-[#FAF6F0] text-[#292524] focus:outline-none font-medium cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Probation">Probation</option>
              <option value="Contract">Contract</option>
            </select>

            {/* Toggle View */}
            <div className="flex items-center bg-[#FAF6F0] p-1 rounded-full border border-[#EFE4D7]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-[#EA580C]' : 'text-[#78716C]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-white shadow-xs text-[#EA580C]' : 'text-[#78716C]'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={exportExcel}
              className="rounded-full"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setCreateModalOpen(true)}
              className="rounded-full shadow-xs"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Employee
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid Cards with Warm Terracotta Model */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((emp) => (
            <Card
              key={emp.id}
              hover
              onClick={() => setSelectedEmployee(emp)}
              className="p-5 text-center flex flex-col items-center justify-between cursor-pointer group"
            >
              <div className="w-full flex justify-end">
                <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                  {emp.employmentStatus}
                </span>
              </div>

              {/* Centered Avatar with Warm Terracotta Ring */}
              <div className="relative my-2">
                <img
                  src={emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                  alt={emp.fullName}
                  className="w-18 h-18 rounded-full object-cover border-3 border-[#EA580C] group-hover:scale-105 transition-transform"
                />
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#EA580C] border-2 border-white rounded-full" />
              </div>

              <div className="w-full">
                <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors">
                  {emp.fullName}
                </h4>
                <p className="text-[11px] text-[#78716C] font-medium mt-0.5 truncate">
                  {emp.positionTitle}
                </p>
                <p className="text-[10px] text-[#A8A29E] font-mono mt-0.5">
                  {emp.employeeId} &bull; {emp.departmentName}
                </p>
              </div>

              <div className="w-full pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-center gap-1.5">
                <span className="text-[10px] font-medium text-[#78716C] bg-[#FAF6F0] px-2.5 py-0.5 rounded-full">
                  Full-Time
                </span>
                <span className="text-[10px] font-bold text-[#EA580C] group-hover:underline ml-1">
                  View Dossier &rarr;
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6F0] text-[#78716C] font-bold border-b border-[#EFE4D7] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Employee</th>
                  <th className="px-4 py-3.5">ID</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">Position</th>
                  <th className="px-4 py-3.5">Join Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7EFE6] text-[#292524]">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#FAF6F0] transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                          alt={emp.fullName}
                          className="w-9 h-9 rounded-full object-cover border-2 border-[#EA580C]"
                        />
                        <div>
                          <p className="font-bold text-[#292524]">{emp.fullName}</p>
                          <p className="text-[11px] text-[#78716C]">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-[#EA580C]">
                      {emp.employeeId}
                    </td>
                    <td className="px-4 py-3 text-[#78716C]">{emp.departmentName}</td>
                    <td className="px-4 py-3 font-semibold">{emp.positionTitle}</td>
                    <td className="px-4 py-3 text-[#A8A29E] font-mono">{emp.joinDate}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-bold text-[#C2410C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                        {emp.employmentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Button
                        variant="soft"
                        size="sm"
                        onClick={() => setSelectedEmployee(emp)}
                        className="rounded-full"
                        leftIcon={<Eye className="w-3 h-3" />}
                      >
                        Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Selected Employee Dossier Modal */}
      {selectedEmployee && (
        <Modal
          isOpen={Boolean(selectedEmployee)}
          onClose={() => setSelectedEmployee(null)}
          title={`Employee Performance Dossier: ${selectedEmployee.fullName}`}
          description={`${selectedEmployee.employeeId} &bull; ${selectedEmployee.positionTitle}`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* Top 4 Metric Rings with Warm Terracotta Styling (Clickable to jump directly to corresponding module!) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedEmployee(null);
                  navigate(`/kpi/actuals?employeeId=${selectedEmployee.id}`);
                }}
                className="p-4 bg-[#FAF6F0] hover:bg-[#FFF7ED] border border-[#EFE4D7] hover:border-[#EA580C] rounded-3xl flex items-center justify-between text-left transition-all hover:scale-[1.02] cursor-pointer group shadow-2xs"
                title="Click to view & record KPI Deliverables for this employee"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#78716C] group-hover:text-[#EA580C] uppercase block">
                    KPI Score &rarr;
                  </span>
                  <span className="text-xl font-black text-[#292524] mt-1 block">105.4%</span>
                  <span className="text-[10px] text-[#16A36A] font-bold">4 Verified</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-[#EA580C] bg-[#FFEDD5] flex items-center justify-center font-bold text-xs text-[#C2410C] group-hover:bg-[#EA580C] group-hover:text-white transition-colors">
                  60%
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedEmployee(null);
                  navigate(`/assessment/final?employeeId=${selectedEmployee.id}`);
                }}
                className="p-4 bg-[#FAF6F0] hover:bg-[#FFF7ED] border border-[#EFE4D7] hover:border-[#EA580C] rounded-3xl flex items-center justify-between text-left transition-all hover:scale-[1.02] cursor-pointer group shadow-2xs"
                title="Click to view Competency Appraisal for this employee"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#78716C] group-hover:text-[#EA580C] uppercase block">
                    Competencies &rarr;
                  </span>
                  <span className="text-xl font-black text-[#292524] mt-1 block">92.0%</span>
                  <span className="text-[10px] text-[#78716C]">Level 4.2 Avg</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-[#292524] bg-white flex items-center justify-center font-bold text-xs text-[#292524] group-hover:bg-[#292524] group-hover:text-white transition-colors">
                  20%
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedEmployee(null);
                  navigate(`/assessment/final?employeeId=${selectedEmployee.id}`);
                }}
                className="p-4 bg-[#FAF6F0] hover:bg-[#FFF7ED] border border-[#EFE4D7] hover:border-[#EA580C] rounded-3xl flex items-center justify-between text-left transition-all hover:scale-[1.02] cursor-pointer group shadow-2xs"
                title="Click to view Behavioral Appraisal for this employee"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#78716C] group-hover:text-[#EA580C] uppercase block">
                    Behavioral &rarr;
                  </span>
                  <span className="text-xl font-black text-[#292524] mt-1 block">95.0%</span>
                  <span className="text-[10px] text-[#16A36A] font-bold">Anchored</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-[#FB923C] bg-[#FFEDD5] flex items-center justify-center font-bold text-xs text-[#C2410C] group-hover:bg-[#FB923C] group-hover:text-white transition-colors">
                  10%
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedEmployee(null);
                  navigate(`/assessment/360-feedback?employeeId=${selectedEmployee.id}`);
                }}
                className="p-4 bg-[#FAF6F0] hover:bg-[#FFF7ED] border border-[#EFE4D7] hover:border-[#EA580C] rounded-3xl flex items-center justify-between text-left transition-all hover:scale-[1.02] cursor-pointer group shadow-2xs"
                title="Click to view 360 Feedback for this employee"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#78716C] group-hover:text-[#EA580C] uppercase block">
                    360 Feedback &rarr;
                  </span>
                  <span className="text-xl font-black text-[#292524] mt-1 block">88.5%</span>
                  <span className="text-[10px] text-[#78716C]">5 Responses</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-[#FDBA74] bg-[#FFEDD5] flex items-center justify-center font-bold text-xs text-[#C2410C] group-hover:bg-[#FDBA74] group-hover:text-white transition-colors">
                  10%
                </div>
              </button>
            </div>

            {/* Profile Overview Card + Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 p-5 bg-[#FAF6F0] border border-[#EFE4D7] rounded-3xl space-y-4 text-center">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-[#FFEDD5] p-1.5 flex items-center justify-center">
                  <img
                    src={selectedEmployee.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                    alt={selectedEmployee.fullName}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-[#292524]">{selectedEmployee.fullName}</h3>
                  <p className="text-xs text-[#78716C] mt-0.5 font-medium">
                    {selectedEmployee.positionTitle} &bull; {selectedEmployee.departmentName}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-[11px] font-mono font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                      {selectedEmployee.employeeId}
                    </span>
                    <span className="text-[11px] font-bold text-[#C2410C] bg-[#FED7AA] px-2.5 py-0.5 rounded-full">
                      {selectedEmployee.employmentStatus}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EFE4D7] text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Join Date:</span>
                    <span className="font-mono text-[#292524]">{selectedEmployee.joinDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78716C]">Email:</span>
                    <span className="text-[#292524] font-medium truncate">{selectedEmployee.email}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 p-5 bg-white border border-[#EFE4D7] rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-[#292524]">Performance Trajectory</h4>
                    <span className="text-xs text-[#78716C] bg-[#FAF6F0] border border-[#EFE4D7] px-2.5 py-0.5 rounded-full">
                      FY 2025 – 2026 ▾
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-2xl font-black text-[#292524]">100.0%</span>
                    <span className="text-xs text-[#16A36A] font-bold ml-2">
                      Grade A &bull; Exceeds Expectations
                    </span>
                  </div>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={modalPerformanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="terracottaModalGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="period" stroke="#A8A29E" fontSize={11} tickLine={false} />
                      <YAxis stroke="#A8A29E" fontSize={11} domain={[70, 100]} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#EFE4D7',
                          borderRadius: '16px',
                          fontSize: '11px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#EA580C"
                        strokeWidth={2.5}
                        fill="url(#terracottaModalGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-3 border-t border-[#F7EFE6] flex justify-between text-xs text-[#78716C]">
                  <span>Formula Weights: KPI (60%) + Comp (20%) + Behav (10%) + 360 (10%)</span>
                  <span className="font-bold text-[#EA580C]">Validated</span>
                </div>
              </div>
            </div>

            {/* Quick Action Bar for Seamless Inter-Module Navigation */}
            <div className="pt-4 border-t border-[#EFE4D7] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-full shadow-xs"
                  onClick={() => {
                    setSelectedEmployee(null);
                    navigate(`/kpi/actuals?employeeId=${selectedEmployee.id}`);
                  }}
                  leftIcon={<Target className="w-3.5 h-3.5" />}
                >
                  Input KPI Deliverables
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    setSelectedEmployee(null);
                    navigate(`/assessment/final?employeeId=${selectedEmployee.id}`);
                  }}
                  leftIcon={<Award className="w-3.5 h-3.5" />}
                >
                  Final Appraisal Sign-Off
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-[#78716C] hover:text-[#EA580C]"
                  onClick={() => {
                    setSelectedEmployee(null);
                    navigate(`/organization/departments`);
                  }}
                  leftIcon={<Building2 className="w-3.5 h-3.5" />}
                >
                  View Department
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEmployee(null)}
                className="rounded-full"
              >
                Close Dossier
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Register New Employee"
        description="Enter employee credentials to provision their PMS record"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
          <Input
            label="Employee ID"
            value={newEmp.employeeId}
            onChange={(e) => setNewEmp({ ...newEmp, employeeId: e.target.value })}
            required
          />
          <Input
            label="Full Name"
            placeholder="e.g. Mia Torres"
            value={newEmp.fullName}
            onChange={(e) => setNewEmp({ ...newEmp, fullName: e.target.value })}
            required
          />
          <Input
            label="Business Email"
            type="email"
            placeholder="m.torres@apexglobal.com"
            value={newEmp.email}
            onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#292524] mb-1">Department</label>
              <select
                value={newEmp.departmentId}
                onChange={(e) => setNewEmp({ ...newEmp, departmentId: e.target.value })}
                className="w-full rounded-2xl border border-[#EFE4D7] p-2.5 bg-white text-xs cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#292524] mb-1">PMS Role</label>
              <select
                value={newEmp.role}
                onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value as UserRole })}
                className="w-full rounded-2xl border border-[#EFE4D7] p-2.5 bg-white text-xs cursor-pointer"
              >
                <option value="Employee">Employee</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Department Manager">Department Manager</option>
                <option value="HR Manager">HR Manager</option>
                <option value="HR Admin">HR Admin</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#F7EFE6]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" size="sm" type="submit" className="rounded-full shadow-xs">
              Save Employee
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
