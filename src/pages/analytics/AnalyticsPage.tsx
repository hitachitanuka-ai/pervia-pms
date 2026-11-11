import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  BarChart3,
  Building2,
  Target,
  PieChart as PieIcon,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { db } from '../../lib/database';
import { downloadExcel } from '../../utils/exportHelpers';

export const AnalyticsPage: React.FC = () => {
  const location = useLocation();
  const departments = db.getDepartments();

  const getInitialTab = () => {
    if (location.pathname.includes('/department')) return 'department';
    if (location.pathname.includes('/competency')) return 'competency';
    if (location.pathname.includes('/distribution')) return 'distribution';
    return 'company';
  };

  const [activeTab, setActiveTab] = useState<'company' | 'department' | 'competency' | 'distribution'>(getInitialTab());
  const [selectedDept, setSelectedDept] = useState<string>('All');

  // Department benchmarking dataset
  const departmentMetrics = [
    { name: 'Engineering', score: 94.5, target: 90, staff: 42, color: '#EA580C' },
    { name: 'Product', score: 91.2, target: 88, staff: 18, color: '#F97316' },
    { name: 'Marketing', score: 88.4, target: 85, staff: 14, color: '#FB923C' },
    { name: 'Sales', score: 96.0, target: 92, staff: 26, color: '#C2410C' },
    { name: 'Finance & HR', score: 90.1, target: 88, staff: 16, color: '#EA580C' },
    { name: 'Operations', score: 87.5, target: 85, staff: 12, color: '#9A3412' },
  ];

  // Competency gap analysis data (Target vs Actual)
  const competencyData = [
    { competency: 'Leadership & Vision', required: 4.5, actual: 4.2 },
    { competency: 'Technical Execution', required: 4.8, actual: 4.7 },
    { competency: 'Problem Solving', required: 4.2, actual: 4.4 },
    { competency: 'Cross-functional Comm', required: 4.0, actual: 3.8 },
    { competency: 'Agility & Innovation', required: 4.3, actual: 4.1 },
    { competency: 'Accountability & SLA', required: 4.6, actual: 4.5 },
  ];

  // Bell-curve rating distribution
  const bellCurveData = [
    { grade: 'Grade A (Outstanding)', quota: '15%', actual: '18%', count: 23, color: '#16A34A' },
    { grade: 'Grade B (Exceeds)', quota: '35%', actual: '34%', count: 44, color: '#EA580C' },
    { grade: 'Grade C (Meets Expectations)', quota: '40%', actual: '41%', count: 52, color: '#F97316' },
    { grade: 'Grade D (Needs Improvement)', quota: '8%', actual: '6%', count: 8, color: '#F59E0B' },
    { grade: 'Grade E (Unsatisfactory)', quota: '2%', actual: '1%', count: 1, color: '#EF4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            Enterprise Intelligence & BI
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            Performance Analytics Hub
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Real-time scorecards, department benchmarking, competency gap matrices, and bell-curve calibration distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Capsule Tab Switcher */}
          <div className="bg-[#EBE9E2] border border-[#DDD9CE] rounded-full p-1 flex items-center gap-1 shadow-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('company')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'company'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              Company Overview
            </button>
            <button
              onClick={() => setActiveTab('department')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'department'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              Departments
            </button>
            <button
              onClick={() => setActiveTab('competency')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'competency'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              Competency Gap
            </button>
            <button
              onClick={() => setActiveTab('distribution')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'distribution'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              Bell-Curve
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const dateStr = new Date().toISOString().slice(0, 10);
              const summaryData = [
                { Metric: 'Enterprise Index Score', Value: '91.4%', Benchmark: '88.0%', YoY: '+4.2%' },
                { Metric: 'KPI Targets Met', Value: '94.5%', Benchmark: '90.0%', YoY: '+3.1%' },
                { Metric: 'Active Evaluations Finalized', Value: '108 / 128', Benchmark: '84.4%', YoY: '+12.0%' },
                { Metric: 'Top Talent Retention Risk', Value: '4.2% (Low)', Benchmark: '<8.0%', YoY: '-1.5%' },
              ];
              const depts = db.getDepartments().map((d) => ({
                'Department ID': d.id,
                'Department Name': d.name,
                Headcount: d.employeeCount,
                'Manager ID': d.managerId || '-',
              }));
              downloadExcel(`Pervia_Enterprise_Analytics_${dateStr}.xlsx`, [
                { name: 'Executive Summary', data: summaryData },
                { name: 'Departments', data: depts },
              ]);
            }}
            className="rounded-full shadow-xs"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export (.xlsx)
          </Button>
        </div>
      </div>

      {/* KPI Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Enterprise Index Score
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">91.4%</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">↑ +4.2% YoY Improvement</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            High Performers (Grade A)
          </span>
          <p className="text-2xl font-extrabold text-[#EA580C] mt-1">23 Staff (18%)</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">Target: 15% quota band</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Appraisal Completion
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">89.5%</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">114 / 128 appraisals finalized</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Competency Average
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">4.28 / 5.0</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">Benchmark: 4.10 required</p>
        </Card>
      </div>

      {/* Tab 1: Company Performance */}
      {activeTab === 'company' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-5 border-[#E7E4DC] bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#18181B]">Division Performance vs Targets</h3>
                <p className="text-xs text-[#78716C]">Current Q1 2026 Evaluation Cycle benchmarks</p>
              </div>
              <span className="text-xs font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                Active Cycle Q1 2026
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5EFE6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #EFE4D7',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="score" name="Actual Score (%)" fill="#EA580C" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="target" name="Target Benchmark (%)" fill="#E2DFD6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5 border-[#E7E4DC] bg-white space-y-4">
            <h3 className="text-sm font-bold text-[#18181B]">Executive Summary Insights</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#FDFBF9] border border-[#F5EFE6]">
                <p className="font-bold text-[#18181B]">Top Performing Unit</p>
                <p className="text-[#78716C] mt-0.5">
                  <span className="font-semibold text-[#EA580C]">Sales (96.0%)</span> surpassed targets driven by enterprise subscription renewals and ARR expansion.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FDFBF9] border border-[#F5EFE6]">
                <p className="font-bold text-[#18181B]">Calibration Alert</p>
                <p className="text-[#78716C] mt-0.5">
                  Engineering Grade A distribution is at 18% (target 15%). Committee sign-off scheduled for April 21.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#FDFBF9] border border-[#F5EFE6]">
                <p className="font-bold text-[#18181B]">Competency Growth</p>
                <p className="text-[#78716C] mt-0.5">
                  Cross-functional communication scores improved by +0.3 pts following the 360-degree peer feedback program.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Department Scorecards */}
      {activeTab === 'department' && (
        <Card className="p-5 border-[#E7E4DC] bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#18181B]">Department Scorecard Benchmark Table</h3>
            <span className="text-xs text-[#78716C]">Normalized cross-department rankings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#F5EFE6] text-[#78716C] uppercase font-bold text-[10px]">
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Headcount</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Actual Score</th>
                  <th className="py-2.5 px-3">Variance</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE6]">
                {departmentMetrics.map((dept) => {
                  const variance = (dept.score - dept.target).toFixed(1);
                  return (
                    <tr key={dept.name} className="hover:bg-[#FDFBF9]">
                      <td className="py-3 px-3 font-bold text-[#18181B]">{dept.name}</td>
                      <td className="py-3 px-3 text-[#57534E]">{dept.staff} members</td>
                      <td className="py-3 px-3 text-[#57534E]">{dept.target}%</td>
                      <td className="py-3 px-3 font-extrabold text-[#EA580C]">{dept.score}%</td>
                      <td className="py-3 px-3 font-semibold text-[#16A34A]">+{variance}%</td>
                      <td className="py-3 px-3">
                        <Badge variant="success">Above Target</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: Competency Gap Analysis */}
      {activeTab === 'competency' && (
        <Card className="p-5 border-[#E7E4DC] bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#18181B]">Competency Proficiency Matrix</h3>
              <p className="text-xs text-[#78716C]">Required job level rubric vs evaluated actual performance (1.0 - 5.0)</p>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={competencyData} layout="vertical" margin={{ top: 10, right: 20, left: 60, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F5EFE6" />
                <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: '#78716C' }} />
                <YAxis dataKey="competency" type="category" tick={{ fontSize: 11, fill: '#18181B', fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #EFE4D7',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="actual" name="Evaluated Actual" fill="#EA580C" radius={[0, 6, 6, 0]} />
                <Bar dataKey="required" name="Required Baseline" fill="#DDD9CE" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Tab 4: Bell-Curve Rating Distribution */}
      {activeTab === 'distribution' && (
        <Card className="p-5 border-[#E7E4DC] bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#18181B]">Bell-Curve Calibration Normalization</h3>
              <p className="text-xs text-[#78716C]">Corporate policy quota bands vs current evaluated employee ratings</p>
            </div>
            <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
              96% Quota Compliance
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            {bellCurveData.map((tier) => (
              <div
                key={tier.grade}
                className="p-4 rounded-2xl border border-[#E7E4DC] bg-[#FDFBF9] flex flex-col justify-between"
              >
                <div>
                  <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: tier.color }} />
                  <p className="text-xs font-bold text-[#18181B] leading-tight">{tier.grade}</p>
                  <p className="text-xl font-extrabold text-[#18181B] mt-2">{tier.count} Staff</p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#F5EFE6] text-[11px] text-[#78716C] flex justify-between">
                  <span>Actual: <b className="text-[#18181B]">{tier.actual}</b></span>
                  <span>Target: {tier.quota}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
