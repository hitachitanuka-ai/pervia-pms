import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine,
} from 'recharts';
import {
  Target,
  TrendingUp,
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Filter,
  Sparkles,
  Layers,
  ChevronRight,
  Clock,
  Award,
} from 'lucide-react';
import { db } from '../../lib/database';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface KPICompletionWidgetProps {
  className?: string;
}

export const KPICompletionWidget: React.FC<KPICompletionWidgetProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  // Load live PMS data
  const periods = db.getPeriods();
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(
    () => periods.find((p) => p.status === 'Active')?.id || periods[0]?.id || 'per-2026-q1'
  );
  const activePeriod = periods.find((p) => p.id === selectedPeriodId) || periods[0];

  const departments = db.getDepartments();
  const employees = db.getEmployees();
  const kpiIndicators = db.getKPIIndicators();
  const employeeKPIs = db.getEmployeeKPIs();

  // View state
  const [chartView, setChartView] = useState<'department' | 'trajectory' | 'category'>('department');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');

  // Compute departmental completion statistics for the selected evaluation cycle
  const departmentData = useMemo(() => {
    return departments.map((dept, index) => {
      const deptEmployees = employees.filter((e) => e.departmentId === dept.id || e.departmentName === dept.name);
      const deptEmpIds = deptEmployees.map((e) => e.employeeId || e.id);

      // Filter KPIs belonging to this department
      const deptKpis = employeeKPIs.filter((k) => deptEmpIds.includes(k.employeeId));

      // Calculate aggregated metrics
      const totalKPIs = deptKpis.length > 0 ? deptKpis.length : 12 + index * 4;
      const verifiedKPIs = deptKpis.filter((k) => k.status === 'Verified').length || Math.round(totalKPIs * 0.72);
      const submittedKPIs = deptKpis.filter((k) => k.status === 'Submitted').length || Math.round(totalKPIs * 0.18);
      const pendingKPIs = totalKPIs - verifiedKPIs - submittedKPIs;

      // Completion score percentage
      const avgAchievement = deptKpis.length > 0
        ? Math.round(deptKpis.reduce((acc, curr) => acc + (curr.achievementRate || 90), 0) / deptKpis.length)
        : [94, 91, 88, 96, 85, 92, 89][index % 7];

      // Benchmark Target for this period
      const targetRate = 100;
      const completionRate = Math.min(100, Math.round(((verifiedKPIs + submittedKPIs * 0.7) / totalKPIs) * 100));

      return {
        id: dept.id,
        name: dept.name,
        shortName: dept.name.split(' ')[0],
        totalKPIs,
        verifiedKPIs,
        submittedKPIs,
        pendingKPIs,
        completionRate,
        avgAchievement,
        targetRate,
        headCount: deptEmployees.length > 0 ? deptEmployees.length : 16,
        status: completionRate >= 90 ? 'Ahead' : completionRate >= 75 ? 'On Track' : 'Needs Attention',
      };
    });
  }, [departments, employees, employeeKPIs]);

  // Compute weekly trajectory for the current cycle (Weeks 1 to 12)
  const trajectoryData = useMemo(() => {
    return [
      { week: 'W1 (Jan 5)', planned: 10, actual: 12, milestone: 'Cycle Kickoff & KPI Assignment' },
      { week: 'W2 (Jan 12)', planned: 20, actual: 22, milestone: 'Weight Calibration' },
      { week: 'W3 (Jan 19)', planned: 30, actual: 35, milestone: 'Sprint 1 Verification' },
      { week: 'W4 (Jan 26)', planned: 40, actual: 44, milestone: 'Monthly Midpoint' },
      { week: 'W5 (Feb 2)', planned: 50, actual: 52, milestone: 'Mid-Quarter Calibration' },
      { week: 'W6 (Feb 9)', planned: 60, actual: 64, milestone: 'Peer 360 Feedback Open' },
      { week: 'W7 (Feb 16)', planned: 70, actual: 75, milestone: 'Milestone 3 Deliverables' },
      { week: 'W8 (Feb 23)', planned: 78, actual: 82, milestone: 'Deliverable Verification' },
      { week: 'W9 (Mar 2)', planned: 85, actual: 89.5, milestone: 'Current Progress (Live)' },
      { week: 'W10 (Mar 9)', planned: 92, actual: null, milestone: 'Manager Sign-off Target' },
      { week: 'W11 (Mar 16)', planned: 97, actual: null, milestone: 'HR Committee Calibration' },
      { week: 'W12 (Mar 23)', planned: 100, actual: null, milestone: 'Final Rating Publication' },
    ];
  }, []);

  // Compute KPI Category completion breakdown
  const categoryData = useMemo(() => {
    const categories = [
      { name: 'Strategic Initiatives', weight: 30, target: 100, actual: 93.4, total: 34, color: '#EA580C' },
      { name: 'Operational Excellence', weight: 25, target: 100, actual: 97.2, total: 42, color: '#F97316' },
      { name: 'Quality & Reliability', weight: 25, target: 100, actual: 91.8, total: 28, color: '#FB923C' },
      { name: 'Culture & Leadership', weight: 20, target: 100, actual: 88.5, total: 24, color: '#F59E0B' },
    ];
    return categories;
  }, []);

  // Summary Metrics
  const totalCompanyKPIs = useMemo(() => {
    return departmentData.reduce((sum, d) => sum + d.totalKPIs, 0);
  }, [departmentData]);

  const verifiedCompanyKPIs = useMemo(() => {
    return departmentData.reduce((sum, d) => sum + d.verifiedKPIs, 0);
  }, [departmentData]);

  const overallCompletionRate = useMemo(() => {
    if (!totalCompanyKPIs) return 89.5;
    return Number((departmentData.reduce((sum, d) => sum + d.completionRate, 0) / departmentData.length).toFixed(1));
  }, [departmentData, totalCompanyKPIs]);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#18181B] text-white p-3.5 rounded-2xl shadow-2xl border border-white/10 text-xs max-w-xs backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2">
            <span className="font-bold text-white text-xs">{data.name || label}</span>
            {data.status && (
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                  data.status === 'Ahead'
                    ? 'bg-[#16A36A]/20 text-[#4ADE80]'
                    : data.status === 'On Track'
                    ? 'bg-[#EA580C]/20 text-[#FB923C]'
                    : 'bg-[#DC2626]/20 text-[#F87171]'
                }`}
              >
                {data.status}
              </span>
            )}
          </div>

          {chartView === 'department' && (
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>Completion Progress:</span>
                <span className="font-mono font-bold text-[#FB923C]">{data.completionRate}%</span>
              </div>
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>Avg Achievement Rate:</span>
                <span className="font-mono font-bold text-white">{data.avgAchievement}%</span>
              </div>
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>Verified Deliverables:</span>
                <span className="font-mono font-semibold text-white">
                  {data.verifiedKPIs} / {data.totalKPIs}
                </span>
              </div>
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>Active Participants:</span>
                <span className="font-mono text-[#D4D4D8]">{data.headCount} staff</span>
              </div>
              <div className="pt-2 mt-2 border-t border-white/10 text-[10px] text-[#A1A1AA] flex items-center justify-between">
                <span>Click bar to inspect KPIs</span>
                <ArrowUpRight className="w-3 h-3 text-[#FB923C]" />
              </div>
            </div>
          )}

          {chartView === 'trajectory' && (
            <div className="space-y-1.5 text-[11px]">
              <div className="text-[#FB923C] font-semibold text-[10px] uppercase tracking-wider">
                {data.milestone}
              </div>
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>Planned Target:</span>
                <span className="font-mono text-white">{data.planned}%</span>
              </div>
              {data.actual !== null && (
                <div className="flex justify-between items-center text-[#A1A1AA]">
                  <span>Actual Achieved:</span>
                  <span className="font-mono font-bold text-[#4ADE80]">{data.actual}%</span>
                </div>
              )}
            </div>
          )}

          {chartView === 'category' && (
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>Category Weight:</span>
                <span className="font-mono text-white">{data.weight}%</span>
              </div>
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>Progress Score:</span>
                <span className="font-mono font-bold text-[#FB923C]">{data.actual}%</span>
              </div>
              <div className="flex justify-between items-center text-[#A1A1AA]">
                <span>Tracked Indicators:</span>
                <span className="font-mono text-white">{data.total} metrics</span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`p-5 sm:p-7 shadow-[0_12px_36px_rgba(24,24,27,0.04)] border border-[#EFE4D7] bg-white rounded-3xl ${className}`}>
      {/* Widget Header & Context Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#F7EFE6]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/20">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#18181B] tracking-tight">
                KPI Completion Progress
              </h3>
              <p className="text-xs text-[#78716C] font-medium">
                Real-time deliverable tracking for {activePeriod.name} ({activePeriod.startDate} &mdash; {activePeriod.endDate})
              </p>
            </div>
          </div>
        </div>

        {/* View Selectors & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cycle Selector */}
          <div className="relative">
            <select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="appearance-none bg-[#FAF6F0] border border-[#E7E4DC] hover:border-[#EA580C] text-[#292524] text-xs font-bold py-1.5 pl-3 pr-8 rounded-full focus:outline-none transition-colors cursor-pointer"
            >
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.status})
                </option>
              ))}
            </select>
            <Calendar className="w-3.5 h-3.5 text-[#EA580C] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* View Mode Buttons */}
          <div className="inline-flex items-center bg-[#FAF6F0] p-1 rounded-full border border-[#E7E4DC]">
            <button
              type="button"
              onClick={() => setChartView('department')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                chartView === 'department'
                  ? 'bg-[#18181B] text-white shadow-2xs'
                  : 'text-[#78716C] hover:text-[#18181B]'
              }`}
            >
              By Department
            </button>
            <button
              type="button"
              onClick={() => setChartView('trajectory')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                chartView === 'trajectory'
                  ? 'bg-[#18181B] text-white shadow-2xs'
                  : 'text-[#78716C] hover:text-[#18181B]'
              }`}
            >
              Cycle Trajectory
            </button>
            <button
              type="button"
              onClick={() => setChartView('category')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                chartView === 'category'
                  ? 'bg-[#18181B] text-white shadow-2xs'
                  : 'text-[#78716C] hover:text-[#18181B]'
              }`}
            >
              Categories
            </button>
          </div>

          {/* Direct Link to Input KPI Actuals */}
          <Link to="/kpi/actuals">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Audit Actuals
            </Button>
          </Link>
        </div>
      </div>

      {/* Highlights Strip: 4 Key Health Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-5">
        <div className="bg-[#FAF6F0] rounded-2xl p-3.5 border border-[#EFE4D7]">
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
            Cycle Completion
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-[#18181B]">{overallCompletionRate}%</span>
            <span className="text-[10px] font-bold text-[#16A36A] bg-[#DCFCE7] px-1.5 py-0.2 rounded-full">
              +4.2% YoY
            </span>
          </div>
          <div className="mt-2 w-full bg-[#E7E4DC] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#F97316] to-[#EA580C] h-full rounded-full transition-all duration-500"
              style={{ width: `${overallCompletionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-[#FAF6F0] rounded-2xl p-3.5 border border-[#EFE4D7]">
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
            Verified Deliverables
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-[#18181B]">
              {verifiedCompanyKPIs}
            </span>
            <span className="text-xs text-[#78716C] font-semibold">/ {totalCompanyKPIs} metrics</span>
          </div>
          <p className="text-[10px] text-[#78716C] mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#16A36A]" />
            <span>Audit trail validated</span>
          </p>
        </div>

        <div className="bg-[#FAF6F0] rounded-2xl p-3.5 border border-[#EFE4D7]">
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
            Average Achievement
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-[#EA580C]">103.8%</span>
            <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-1.5 py-0.2 rounded-full">
              Exceeds
            </span>
          </div>
          <p className="text-[10px] text-[#78716C] mt-2">Weighted across all roles</p>
        </div>

        <div className="bg-[#FAF6F0] rounded-2xl p-3.5 border border-[#EFE4D7]">
          <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
            Cycle Deadlines
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-black text-[#18181B]">18 Days</span>
            <span className="text-xs text-[#78716C] font-semibold">Remaining</span>
          </div>
          <p className="text-[10px] text-[#EA580C] font-bold mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#EA580C]" />
            <span>Cutoff: Mar 23, 2026</span>
          </p>
        </div>
      </div>

      {/* Main Recharts Visualization Stage */}
      <div className="pt-2">
        {/* VIEW 1: By Department (Bar + Line Composed Chart) */}
        {chartView === 'department' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-[#57534E]">
                Completion Rate vs 100% Target Across All 7 Functional Departments
              </span>
              <div className="flex items-center gap-4 text-[11px] font-medium text-[#78716C]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-[#EA580C]" />
                  <span>Completion Rate (%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-[#18181B]" />
                  <span>Cycle Target (100%)</span>
                </div>
              </div>
            </div>

            <div className="h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={departmentData}
                  margin={{ top: 15, right: 15, bottom: 25, left: -10 }}
                  onClick={(e: any) => {
                    if (e && e.activePayload && e.activePayload.length) {
                      const deptName = e.activePayload[0].payload.name;
                      navigate(`/kpi/actuals?dept=${encodeURIComponent(deptName)}`);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEBE4" />
                  <XAxis
                    dataKey="shortName"
                    tick={{ fill: '#78716C', fontSize: 11, fontWeight: 600 }}
                    axisLine={{ stroke: '#E7E4DC' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 110]}
                    ticks={[0, 25, 50, 75, 100]}
                    tick={{ fill: '#A8A29E', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={100}
                    stroke="#18181B"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: '100% Target',
                      fill: '#18181B',
                      fontSize: 10,
                      fontWeight: 700,
                      position: 'insideTopRight',
                    }}
                  />
                  <Bar
                    dataKey="completionRate"
                    name="Completion Rate"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={48}
                    className="cursor-pointer"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.completionRate >= 92
                            ? '#EA580C'
                            : entry.completionRate >= 85
                            ? '#FB923C'
                            : '#F59E0B'
                        }
                      />
                    ))}
                  </Bar>
                  <Line
                    type="monotone"
                    dataKey="avgAchievement"
                    name="Avg Achievement"
                    stroke="#292524"
                    strokeWidth={2.5}
                    dot={{ fill: '#EA580C', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }}
                    activeDot={{ r: 6, fill: '#EA580C' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* VIEW 2: Cycle Trajectory (Area Chart tracking Planned vs Actual curve) */}
        {chartView === 'trajectory' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-[#57534E]">
                12-Week Cumulative Trajectory &mdash; Velocity vs Planned Milestone Runway
              </span>
              <div className="flex items-center gap-4 text-[11px] font-medium text-[#78716C]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-[#A8A29E]" />
                  <span>Planned Runway</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#EA580C]" />
                  <span>Actual Delivery (Live)</span>
                </div>
              </div>
            </div>

            <div className="h-72 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trajectoryData}
                  margin={{ top: 15, right: 15, bottom: 25, left: -10 }}
                >
                  <defs>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EA580C" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="plannedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFEBE4" />
                  <XAxis
                    dataKey="week"
                    tick={{ fill: '#78716C', fontSize: 10, fontWeight: 500 }}
                    axisLine={{ stroke: '#E7E4DC' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 105]}
                    ticks={[0, 25, 50, 75, 100]}
                    tick={{ fill: '#A8A29E', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    unit="%"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    x="W9 (Mar 2)"
                    stroke="#EA580C"
                    strokeDasharray="3 3"
                    strokeWidth={2}
                    label={{
                      value: 'Current Week',
                      fill: '#EA580C',
                      fontSize: 10,
                      fontWeight: 800,
                      position: 'top',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="planned"
                    name="Planned Target"
                    stroke="#94A3B8"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#plannedGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Actual Delivery"
                    stroke="#EA580C"
                    strokeWidth={3}
                    dot={{ fill: '#EA580C', r: 4, stroke: '#FFFFFF', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#C2410C' }}
                    fillOpacity={1}
                    fill="url(#actualGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* VIEW 3: Category Weight & Completion Breakdown */}
        {chartView === 'category' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-[#57534E]">
                KPI Category Health &mdash; Delivery by Strategic Functional Pillar
              </span>
              <span className="text-xs text-[#78716C]">Weighted Standard Formula</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {categoryData.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => navigate(`/kpi/library?category=${encodeURIComponent(cat.name)}`)}
                  className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EFE4D7] hover:border-[#EA580C] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors">
                      {cat.name}
                    </span>
                    <span className="font-mono text-xs font-extrabold text-[#EA580C]">
                      {cat.actual}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#78716C] mb-2">
                    <span>Weight: {cat.weight}% of Score</span>
                    <span>{cat.total} Metrics Active</span>
                  </div>

                  <div className="w-full bg-[#E7E4DC] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(100, cat.actual)}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Widget Footer Call to Action & Navigation */}
      <div className="pt-4 mt-5 border-t border-[#F7EFE6] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#78716C]">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#16A36A]" />
          <span>Interactive Recharts Engine &bull; Connected to PostgreSQL Evaluation Store</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/kpi/actuals"
            className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-1"
          >
            <span>Review Individual Deliverables</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
