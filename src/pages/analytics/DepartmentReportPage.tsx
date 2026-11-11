import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import {
  Building2,
  Users,
  Award,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { db } from '../../lib/database';
import { downloadExcel } from '../../utils/exportHelpers';

export const DepartmentReportPage: React.FC = () => {
  const [selectedSort, setSelectedSort] = useState<'score' | 'headcount'>('score');

  const departmentData = [
    { name: 'Sales & BD', score: 96.0, target: 92.0, staff: 26, completion: 96, leader: 'Sarah Chen', color: '#C2410C' },
    { name: 'Engineering', score: 94.5, target: 90.0, staff: 42, completion: 92, leader: 'David Miller', color: '#EA580C' },
    { name: 'Product Management', score: 91.2, target: 88.0, staff: 18, completion: 88, leader: 'Marcus Sterling', color: '#F97316' },
    { name: 'Finance & HR', score: 90.1, target: 88.0, staff: 16, completion: 94, leader: 'Elena Rostova', color: '#FB923C' },
    { name: 'Marketing & Brand', score: 88.4, target: 85.0, staff: 14, completion: 85, leader: 'Rachel Zane', color: '#EA580C' },
    { name: 'Customer Operations', score: 87.5, target: 85.0, staff: 12, completion: 80, leader: 'Alexander Vance', color: '#9A3412' },
  ];

  const sortedData = [...departmentData].sort((a, b) =>
    selectedSort === 'score' ? b.score - a.score : b.staff - a.staff
  );

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            Benchmarking &bull; Operational Divisions
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            Department Performance Report
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Comparative performance analytics, division completion status, and departmental scorecard leaderboards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const dateStr = new Date().toISOString().slice(0, 10);
              const data = departmentData.map((d, idx) => ({
                Rank: idx + 1,
                'Department Name': d.name,
                'Composite Score (%)': d.score,
                'Target Benchmark (%)': d.target,
                'Attainment Rate': `${((d.score / d.target) * 100).toFixed(1)}%`,
                'Headcount Staff': d.staff,
                'Appraisal Completion (%)': `${d.completion}%`,
                'Department Leader': d.leader,
              }));
              downloadExcel(`Pervia_Department_Scorecards_${dateStr}.xlsx`, [
                { name: 'Department Scorecards', data },
              ]);
            }}
            className="rounded-full shadow-xs"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Scorecards
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Rank #1 Department
          </span>
          <p className="text-2xl font-extrabold text-[#EA580C] mt-1">Sales & BD</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">96.0% Composite Score (+4.0% vs target)</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Largest Division
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">Engineering</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">42 Engineers (32.8% of staff)</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Divisions Above Target
          </span>
          <p className="text-2xl font-extrabold text-[#16A34A] mt-1">6 / 6 Units</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">100% operational division quota pass</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Average Completion
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">89.2%</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">Supervisor sign-offs on schedule</p>
        </Card>
      </div>

      {/* Comparison Chart */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#18181B]">Division Score vs Target Benchmark</h3>
            <p className="text-xs text-[#78716C]">Q1 2026 Evaluation Cycle scores normalized out of 100%</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#78716C]">Sort by:</span>
            <button
              onClick={() => setSelectedSort('score')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                selectedSort === 'score' ? 'bg-[#18181B] text-white' : 'bg-[#EBE9E2] text-[#57534E]'
              }`}
            >
              Highest Score
            </button>
            <button
              onClick={() => setSelectedSort('headcount')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                selectedSort === 'headcount' ? 'bg-[#18181B] text-white' : 'bg-[#EBE9E2] text-[#57534E]'
              }`}
            >
              Headcount
            </button>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5EFE6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} />
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
              <Bar dataKey="score" name="Department Score (%)" fill="#EA580C" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" name="Target Goal (%)" fill="#DDD9CE" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Detailed Department Leaderboard Table */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <h3 className="text-base font-bold text-[#18181B]">Department Scorecard Benchmark Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#F5EFE6] text-[#78716C] uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Division Name</th>
                <th className="py-2.5 px-3">Department Head</th>
                <th className="py-2.5 px-3">Headcount</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Actual Score</th>
                <th className="py-2.5 px-3">Completion Rate</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {sortedData.map((d, idx) => (
                <tr key={d.name} className="hover:bg-[#FDFBF9]">
                  <td className="py-3 px-3 font-black text-[#EA580C]">#{idx + 1}</td>
                  <td className="py-3 px-3 font-bold text-[#18181B]">{d.name}</td>
                  <td className="py-3 px-3 text-[#57534E]">{d.leader}</td>
                  <td className="py-3 px-3 text-[#57534E]">{d.staff} members</td>
                  <td className="py-3 px-3 text-[#57534E]">{d.target}%</td>
                  <td className="py-3 px-3 font-extrabold text-[#EA580C] text-sm">{d.score}%</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#EBE9E2] rounded-full overflow-hidden">
                        <div className="bg-[#16A34A] h-full" style={{ width: `${d.completion}%` }} />
                      </div>
                      <span className="font-semibold text-[#18181B]">{d.completion}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant="success">Quota Cleared</Badge>
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
