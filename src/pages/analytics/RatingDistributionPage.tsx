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
  PieChart as PieIcon,
  CheckCircle2,
  AlertTriangle,
  Download,
  ShieldCheck,
  Scale,
  Users,
  Award,
} from 'lucide-react';
import { db } from '../../lib/database';
import { exportCalibrationAuditPdf } from '../../utils/exportHelpers';

export const RatingDistributionPage: React.FC = () => {
  // Bell-curve rating distribution dataset
  const distributionTiers = [
    {
      grade: 'Grade A',
      label: 'Outstanding / Top Talent',
      quotaPct: 15,
      actualPct: 18.0,
      actualCount: 23,
      targetCount: 19,
      variance: '+3.0%',
      color: '#16A34A',
      bonusMultiplier: '130%',
    },
    {
      grade: 'Grade B',
      label: 'Exceeds Expectations',
      quotaPct: 35,
      actualPct: 34.4,
      actualCount: 44,
      targetCount: 45,
      variance: '-0.6%',
      color: '#EA580C',
      bonusMultiplier: '110%',
    },
    {
      grade: 'Grade C',
      label: 'Meets Expectations / Solid',
      quotaPct: 40,
      actualPct: 40.6,
      actualCount: 52,
      targetCount: 51,
      variance: '+0.6%',
      color: '#F97316',
      bonusMultiplier: '100%',
    },
    {
      grade: 'Grade D',
      label: 'Needs Structured Improvement',
      quotaPct: 8,
      actualPct: 6.2,
      actualCount: 8,
      targetCount: 10,
      variance: '-1.8%',
      color: '#F59E0B',
      bonusMultiplier: '70%',
    },
    {
      grade: 'Grade E',
      label: 'Unsatisfactory / PIP Mandatory',
      quotaPct: 2,
      actualPct: 0.8,
      actualCount: 1,
      targetCount: 3,
      variance: '-1.2%',
      color: '#EF4444',
      bonusMultiplier: '0%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            Calibration &bull; Normalization Curve
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            Rating Distribution (Bell-Curve)
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Calibrate performance grades across corporate quota bands, eliminate supervisory rating inflation, and audit fairness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCalibrationAuditPdf()}
            className="rounded-full shadow-xs"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Calibration Audit (PDF)
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Quota Compliance Index
          </span>
          <p className="text-2xl font-extrabold text-[#16A34A] mt-1">96.4%</p>
          <p className="text-[11px] text-[#16A34A] font-semibold mt-0.5">Within permissible ±5% tolerance band</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Grade A (Top Talent)
          </span>
          <p className="text-2xl font-extrabold text-[#EA580C] mt-1">23 Staff (18.0%)</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">Quota Target: 15.0%</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Core Talent (Grade B & C)
          </span>
          <p className="text-2xl font-extrabold text-[#18181B] mt-1">96 Staff (75.0%)</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">Quota Target: 75.0% (Exact match)</p>
        </Card>

        <Card hover className="p-4 border-[#E7E4DC] bg-white">
          <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
            Remedial Gate (Grade D & E)
          </span>
          <p className="text-2xl font-extrabold text-[#D97706] mt-1">9 Staff (7.0%)</p>
          <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">Quota Target: 10.0% (Under threshold)</p>
        </Card>
      </div>

      {/* Bell Curve Bar Chart: Target Quota % vs Actual Distribution % */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#18181B]">Bell-Curve Distribution vs Enterprise Quota</h3>
            <p className="text-xs text-[#78716C]">Actual percentage of evaluated headcount vs target corporate quota bands</p>
          </div>
          <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
            Total Staff: 128 Calibrated
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionTiers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5EFE6" />
              <XAxis dataKey="grade" tick={{ fontSize: 11, fill: '#78716C' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#78716C' }} unit="%" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #EFE4D7',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="actualPct" name="Actual Distribution (%)" fill="#EA580C" radius={[8, 8, 0, 0]} />
              <Bar dataKey="quotaPct" name="Corporate Quota (%)" fill="#DDD9CE" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Calibration Band Breakdown Table */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <h3 className="text-base font-bold text-[#18181B]">Detailed Calibration Grade Bands & Bonus Impact</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#F5EFE6] text-[#78716C] uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Grade Band</th>
                <th className="py-2.5 px-3">Performance Definition</th>
                <th className="py-2.5 px-3">Target Quota</th>
                <th className="py-2.5 px-3">Actual Count</th>
                <th className="py-2.5 px-3">Actual %</th>
                <th className="py-2.5 px-3">Variance</th>
                <th className="py-2.5 px-3">Appraisal Bonus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {distributionTiers.map((tier) => (
                <tr key={tier.grade} className="hover:bg-[#FDFBF9]">
                  <td className="py-3 px-3 font-extrabold text-[#18181B]">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tier.color }} />
                      <span>{tier.grade}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#57534E] font-medium">{tier.label}</td>
                  <td className="py-3 px-3 text-[#78716C]">{tier.quotaPct}%</td>
                  <td className="py-3 px-3 font-bold text-[#18181B]">{tier.actualCount} Staff</td>
                  <td className="py-3 px-3 font-extrabold text-[#EA580C]">{tier.actualPct}%</td>
                  <td className="py-3 px-3 font-semibold text-[#57534E]">{tier.variance}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full text-[10px]">
                      {tier.bonusMultiplier} Multiplier
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
