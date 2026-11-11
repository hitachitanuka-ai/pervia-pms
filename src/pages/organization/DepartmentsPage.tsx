import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { Department } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Building2, Plus, Users, Search, Sparkles, TrendingUp, Briefcase, ArrowRight } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>(db.getDepartments());
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({
    code: '',
    name: '',
    description: '',
    managerName: '',
  });

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name || !newDept.code) return;

    db.addDepartment({
      code: newDept.code.toUpperCase(),
      name: newDept.name,
      description: newDept.description,
      managerName: newDept.managerName || 'Pending Assignment',
      status: 'Active',
      employeeCount: 1,
    });

    setDepartments([...db.getDepartments()]);
    setModalOpen(false);
    setNewDept({ code: '', name: '', description: '', managerName: '' });
  };

  const totalEmployees = departments.reduce((acc, d) => acc + (d.employeeCount || 12), 0);
  const avgQuota = 84; // Benchmark headcount capacity

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#292524] tracking-tight">
            Department Management
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Divisions, designated heads of department, and headcount allocations
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="rounded-full shadow-sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Department
        </Button>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-[#EFE4D7] p-5 shadow-[0_8px_24px_rgba(41,37,36,0.04)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                Active Divisions
              </span>
              <div className="text-3xl font-black text-[#292524] mt-1.5">{departments.length}</div>
              <span className="text-[11px] font-semibold text-[#A8A29E] mt-0.5 block">
                Enterprise business units
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
              <span>Active operational state</span>
              <span className="text-[#EA580C]">100% Online</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-[#FFEDD5]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FDBA74] to-[#EA580C] relative w-full">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#EA580C] shadow-sm transform translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#EFE4D7] p-5 shadow-[0_8px_24px_rgba(41,37,36,0.04)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                Total Staff Allocated
              </span>
              <div className="text-3xl font-black text-[#292524] mt-1.5">{totalEmployees}</div>
              <span className="text-[11px] font-semibold text-[#A8A29E] mt-0.5 block">
                Active organizational headcount
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FBBF24] to-[#D97706] text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
              <span>Assigned to managers</span>
              <span className="text-[#D97706]">96% Assigned</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-[#FEF3C7]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FCD34D] to-[#D97706] relative w-[96%]">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#D97706] shadow-sm transform translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#EFE4D7] p-5 shadow-[0_8px_24px_rgba(41,37,36,0.04)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                Capacity Target Quota
              </span>
              <div className="text-3xl font-black text-[#EA580C] mt-1.5">{avgQuota}%</div>
              <span className="text-[11px] font-semibold text-[#A8A29E] mt-0.5 block">
                Staffing capacity utilization
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB7185] to-[#E11D48] text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
              <span>Hiring runway target</span>
              <span className="text-[#EA580C]">{avgQuota}%</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-[#FFE4E6]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#FDA4AF] to-[#E11D48] relative w-[84%]">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#E11D48] shadow-sm transform translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl border border-[#EFE4D7] p-4 shadow-[0_8px_24px_rgba(41,37,36,0.04)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#A8A29E]" />
            <input
              type="text"
              placeholder="Search departments or codes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border border-[#EFE4D7] bg-[#FDFBF9] focus:bg-white focus:outline-none focus:border-[#EA580C] focus:ring-3 focus:ring-[#FFEDD5] transition-all"
            />
          </div>
          <span className="text-xs font-bold text-[#C2410C] bg-[#FFEDD5] px-3.5 py-1.5 rounded-full">
            {filtered.length} Divisions Displayed
          </span>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((dept, idx) => {
          const colors = [
            'from-[#FB923C] to-[#EA580C]',
            'from-[#FBBF24] to-[#D97706]',
            'from-[#FB7185] to-[#E11D48]',
            'from-[#A78BFA] to-[#7C3AED]',
            'from-[#38BDF8] to-[#0284C7]',
          ];
          const bgGrad = colors[idx % colors.length];
          const headcountPercent = Math.min(100, Math.round(((dept.employeeCount || 12) / 20) * 100));

          return (
            <div
              key={dept.id}
              onClick={() => navigate(`/organization/employees?dept=${encodeURIComponent(dept.name)}`)}
              className="bg-white rounded-3xl border border-[#EFE4D7] hover:border-[#EA580C] p-6 shadow-[0_8px_24px_rgba(41,37,36,0.04)] hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
              title={`Click to view all employees in ${dept.name}`}
            >
              <div>
                <div className="flex items-center justify-between w-full mb-4">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${bgGrad} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                      {dept.code}
                    </span>
                    <span className="text-[10px] font-bold text-[#15803D] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                      {dept.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-[#292524] group-hover:text-[#EA580C] transition-colors">{dept.name}</h3>
                <p className="text-xs text-[#78716C] mt-1.5 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>

                {/* Capacity Track */}
                <div className="mt-4 pt-3 border-t border-[#F5EFE6] space-y-1.5">
                  <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
                    <span>Headcount allocation</span>
                    <span className="text-[#292524]">{dept.employeeCount || 12} / 20 Seats</span>
                  </div>
                  <div className="relative w-full h-1.5 rounded-full bg-[#FFEDD5]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FDBA74] to-[#EA580C] relative"
                      style={{ width: `${headcountPercent}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#EA580C] shadow-sm transform translate-x-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="pt-4 mt-4 border-t border-[#F5EFE6] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#A8A29E] block text-[10px] uppercase font-bold">Division Head</span>
                    <span className="font-bold text-[#292524]">{dept.managerName || 'Unassigned'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#A8A29E] block text-[10px] uppercase font-bold">Assigned</span>
                    <span className="font-extrabold text-[#EA580C] flex items-center gap-1 justify-end">
                      <Users className="w-3.5 h-3.5" /> {dept.employeeCount || 12}
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-[#FAF6F0] flex items-center justify-between text-xs font-bold text-[#EA580C] group-hover:underline">
                  <span>View Division Employees</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Department"
        description="Add a new business unit or team division"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <Input
            label="Department Code"
            placeholder="e.g. MKTG"
            value={newDept.code}
            onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
            required
          />
          <Input
            label="Department Name"
            placeholder="e.g. Global Marketing & Brand"
            value={newDept.name}
            onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            required
          />
          <Input
            label="Description"
            placeholder="Focus and charter of this department"
            value={newDept.description}
            onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
          />
          <Input
            label="Designated Department Head"
            placeholder="e.g. Rachel Adams"
            value={newDept.managerName}
            onChange={(e) => setNewDept({ ...newDept, managerName: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-4 border-t border-[#F5EFE6]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" size="sm" type="submit" className="rounded-full shadow-sm">
              Save Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
