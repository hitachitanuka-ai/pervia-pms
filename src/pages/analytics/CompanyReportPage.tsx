import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Award,
  Download,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Target,
  DollarSign,
  Users,
} from 'lucide-react';
import { db } from '../../lib/database';
import { exportCompanyReportPdf } from '../../utils/exportHelpers';

export const CompanyReportPage: React.FC = () => {
  const [selectedQuarter, setSelectedQuarter] = useState('2026 Q1');

  // Executive quarterly performance trend
  const quarterlyTrends = [
    { quarter: '2025 Q2', overallScore: 84.2, target: 82.0, kpiAchievement: 86.5, employeeCount: 110 },
    { quarter: '2025 Q3', overallScore: 86.8, target: 84.0, kpiAchievement: 88.0, employeeCount: 118 },
    { quarter: '2025 Q4', overallScore: 89.1, target: 85.0, kpiAchievement: 91.2, employeeCount: 124 },
    { quarter: '2026 Q1', overallScore: 91.4, target: 88.0, kpiAchievement: 94.5, employeeCount: 128 },
  ];

  // Core executive goals
  const companyKeyResults = [
    { goal: 'Annual Recurring Revenue (ARR) Growth', actual: '$18.4M', target: '$16.5M', progress: 111, status: 'Exceeded' },
    { goal: 'Global SLA Reliability & System Uptime', actual: '99.98%', target: '99.95%', progress: 100, status: 'Met' },
    { goal: 'Enterprise Customer Satisfaction (CSAT)', actual: '94.2%', target: '90.0%', progress: 104, status: 'Exceeded' },
    { goal: 'Employee Retention & Internal Mobility', actual: '96.2%', target: '92.0%', progress: 104, status: 'Exceeded' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            Executive Briefing &bull; Enterprise Summary
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            Company Performance Report
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Board-level executive dossier covering company-wide rating indices, ARR delivery, and multi-cycle growth trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCompanyReportPdf()}
            className="rounded-full shadow-xs"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Executive PDF
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Company Index Score
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">91.4%</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">↑ +4.2% YoY Improvement</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            KPI Deliverables Met
          </span>
          <p className="text-2xl font-extrabold text-[#EA580C] mt-1">94.5%</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">18 of 20 strategic corporate OKRs</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Evaluations Finalized
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">89.5%</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">114 / 128 total staff</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Appraisal Budget Multiplier
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">$2,647 / pt</p>
          <p className="text-[11px] text-[#EA580C] font-semibold mt-0.5">100% bonus pool funding</p>
        </Card>
      </div>

      {/* Quarterly Trend Chart */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#18181B]">Multi-Quarter Performance Trajectory</h3>
            <p className="text-xs text-[#78716C]">Historical composite score vs target baseline across 4 quarters</p>
          </div>
          <span className="text-xs font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-1 rounded-full">
            Continuous Upward Trend
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={quarterlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5EFE6" />
              <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} />
              <YAxis domain={[75, 100]} tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #EFE4D7',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="overallScore" name="Company Composite Score (%)" fill="#EA580C" radius={[8, 8, 0, 0]} />
              <Line type="monotone" dataKey="target" name="Target Baseline (%)" stroke="#18181B" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="kpiAchievement" name="KPI Deliverable Achievement (%)" stroke="#16A34A" strokeWidth={2} strokeDasharray="4 4" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Company OKRs & Key Results Table */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#18181B]">Executive Objectives & Key Results (OKRs)</h3>
          <span className="text-xs text-[#78716C]">Q1 2026 Enterprise Corporate Scorecard</span>
        </div>

        <div className="space-y-3">
          {companyKeyResults.map((kr, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#FDFBF9] border border-[#F5EFE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <span className="font-bold text-[#18181B] text-sm">{kr.goal}</span>
                <p className="text-[#78716C]">
                  Actual: <b className="text-[#EA580C]">{kr.actual}</b> &bull; Target: {kr.target}
                </p>
              </div>

              <div className="flex items-center gap-4 sm:self-auto self-end">
                <div className="text-right">
                  <span className="text-[10px] text-[#A8A29E] uppercase font-bold block">Achievement</span>
                  <span className="font-black text-sm text-[#18181B]">{kr.progress}%</span>
                </div>
                <Badge variant={kr.status === 'Exceeded' ? 'success' : 'orange'}>
                  {kr.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
