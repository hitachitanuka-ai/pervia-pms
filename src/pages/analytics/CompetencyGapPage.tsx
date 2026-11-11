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
} from 'recharts';
import {
  Target,
  Zap,
  TrendingUp,
  AlertCircle,
  Download,
  BookOpen,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { db } from '../../lib/database';
import { downloadExcel } from '../../utils/exportHelpers';

export const CompetencyGapPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('All');

  // Competency rubric dataset
  const competencyMatrix = [
    {
      competency: 'Leadership & People Coaching',
      category: 'Core Leadership',
      required: 4.5,
      actual: 4.2,
      gap: -0.3,
      status: 'Minor Gap',
      trainingAction: 'Enroll senior managers in 360-degree executive mentoring',
    },
    {
      competency: 'Technical Architecture & Execution',
      category: 'Functional Expertise',
      required: 4.8,
      actual: 4.7,
      gap: -0.1,
      status: 'On Target',
      trainingAction: 'Continuous microservice brownbag sessions',
    },
    {
      competency: 'Complex Problem Solving & RCA',
      category: 'Problem Solving',
      required: 4.2,
      actual: 4.4,
      gap: +0.2,
      status: 'Exceeding',
      trainingAction: 'Promote internal post-mortem and 5-Whys documentation',
    },
    {
      competency: 'Cross-Functional Communication',
      category: 'Collaboration',
      required: 4.0,
      actual: 3.8,
      gap: -0.2,
      status: 'Minor Gap',
      trainingAction: 'Implement asynchronous RFC RFC template standards',
    },
    {
      competency: 'Strategic Agility & Change Management',
      category: 'Strategic Impact',
      required: 4.3,
      actual: 4.1,
      gap: -0.2,
      status: 'Minor Gap',
      trainingAction: 'Quarterly OKR alignment sprints with product leads',
    },
    {
      competency: 'Operational SLA & Accountability',
      category: 'Operational Excellence',
      required: 4.6,
      actual: 4.5,
      gap: -0.1,
      status: 'On Target',
      trainingAction: 'Incident response drill and on-call handbook update',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            Talent Assessment &bull; Rubric Calibration
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            Competency Gap Analysis
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Identify skill proficiencies, quantify capability gaps against job level rubrics, and map corrective learning interventions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const dateStr = new Date().toISOString().slice(0, 10);
              const data = competencyMatrix.map((c) => ({
                'Competency Name': c.competency,
                Category: c.category,
                'Required Benchmark': c.required,
                'Actual Attainment': c.actual,
                'Gap Delta': c.gap,
                Status: c.gap >= 0 ? 'Compliant / Exceeds' : 'Capability Gap',
                'Intervention Priority': c.gap < -0.3 ? 'High Priority' : 'Standard Development',
              }));
              downloadExcel(`Pervia_Competency_Gap_Analysis_${dateStr}.xlsx`, [
                { name: 'Competency Gaps', data },
              ]);
            }}
            className="rounded-full shadow-xs"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Matrix (.xlsx)
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Overall Competency Avg
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">4.28 / 5.0</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">↑ +0.22 pts vs previous year</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Target Baseline
          </span>
          <p className="text-2xl font-extrabold text-[#78716C] mt-1">4.40 / 5.0</p>
          <p className="text-[11px] text-[#EA580C] font-semibold mt-0.5">Net Enterprise Gap: -0.12 pts</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Highest Capability
          </span>
          <p className="text-2xl font-extrabold text-[#16A34A] mt-1">Tech Execution</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">4.7 / 5.0 (Near mastery)</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Primary Focus Area
          </span>
          <p className="text-2xl font-extrabold text-[#D97706] mt-1">Communication</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">Assigned to Q2 IDP roadmaps</p>
        </Card>
      </div>

      {/* Horizontal Bar Chart: Required vs Evaluated Actual */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#18181B]">Competency Proficiency Benchmarks</h3>
            <p className="text-xs text-[#78716C]">Evaluated actual rating vs required job level baseline (Scale: 1.0 - 5.0)</p>
          </div>
          <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
            Scale: 1.0 to 5.0 Rubric
          </span>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={competencyMatrix}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 140, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F5EFE6" />
              <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: '#78716C' }} />
              <YAxis
                dataKey="competency"
                type="category"
                tick={{ fontSize: 11, fill: '#18181B', fontWeight: 600 }}
              />
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

      {/* Competency Gap Resolution Table */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <h3 className="text-base font-bold text-[#18181B]">Competency Gaps & Actionable Learning Prescriptions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#F5EFE6] text-[#78716C] uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Competency</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Required</th>
                <th className="py-2.5 px-3">Evaluated</th>
                <th className="py-2.5 px-3">Variance Gap</th>
                <th className="py-2.5 px-3">Target Learning Prescription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {competencyMatrix.map((cm) => (
                <tr key={cm.competency} className="hover:bg-[#FDFBF9]">
                  <td className="py-3 px-3 font-bold text-[#18181B]">{cm.competency}</td>
                  <td className="py-3 px-3 text-[#57534E]">{cm.category}</td>
                  <td className="py-3 px-3 font-semibold text-[#78716C]">{cm.required} / 5.0</td>
                  <td className="py-3 px-3 font-extrabold text-[#EA580C]">{cm.actual} / 5.0</td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-black ${
                        cm.gap >= 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
                      }`}
                    >
                      {cm.gap > 0 ? `+${cm.gap}` : cm.gap}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#57534E] max-w-xs">{cm.trainingAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
