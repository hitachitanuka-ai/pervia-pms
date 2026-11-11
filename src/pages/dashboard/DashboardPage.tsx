import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/database';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users,
  TrendingUp,
  Target,
  Award,
  Calendar,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sliders,
  Lamp,
  Briefcase,
  Layers,
  BarChart3,
  Flame,
  LineChart,
  User,
  Mail,
  Phone,
  ExternalLink,
  ChevronRight as ChevronRightIcon,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { KPICompletionWidget } from '../../components/dashboard/KPICompletionWidget';

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const employees = db.getEmployees();
  const periods = db.getPeriods();
  const activePeriod = periods.find((p) => p.status === 'Active') || periods[0];
  const evaluations = db.getEvaluations();

  const [activeTab, setActiveTab] = useState<'overview' | 'kpis' | 'competencies' | 'calibrations'>('overview');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(18);
  const [focusedEmpId, setFocusedEmpId] = useState<string>(employees[0]?.id || '');

  const focusedEmp = employees.find((e) => e.id === focusedEmpId) || employees[0];

  const avgScore = evaluations.length
    ? Number((evaluations.reduce((sum, e) => sum + e.finalScore, 0) / evaluations.length).toFixed(1))
    : 89.5;

  // Role-aware hero configuration
  const getRoleHeroConfig = () => {
    switch (role) {
      case 'Employee':
        return {
          badge: `${user?.fullName || 'Alex Morgan'} • Senior Frontend Engineer (IC4)`,
          badgePill: 'Personal Workspace',
          headline: 'Accelerate Your Goals & Deliverables',
          description: 'Record your Q1 KPI deliverables, attach evidence audit files, and finalize your self-assessment reflection before June 7th.',
          primaryBtnText: 'Input My Deliverables',
          primaryBtnLink: '/kpi/actuals',
          secondaryBtnText: 'Open Self Assessment',
          secondaryBtnLink: '/assessment/self',
          tagline: 'Assigned Formula: 60% KPI Deliverables • 20% Comp • 10% Behav • 10% 360 Feedback',
        };
      case 'Supervisor':
        return {
          badge: `${user?.fullName || 'Michael Scott'} • Engineering Supervisor & Lead`,
          badgePill: 'Team Supervision',
          headline: 'Lead, Coach & Verify Team Performance',
          description: 'Review 4 pending evidence submissions from direct reports, conduct bi-weekly 1-on-1 coaching, and conduct supervisor reviews.',
          primaryBtnText: 'Verify Team Evidence (4 Pending)',
          primaryBtnLink: '/kpi/evidence',
          secondaryBtnText: 'Log 1-on-1 Coaching',
          secondaryBtnLink: '/development/coaching',
          tagline: '6 Direct Reports • 4 Evidence Audits in Queue • Supervisor Deadline: June 14th',
        };
      case 'Department Manager':
        return {
          badge: `${user?.fullName || 'Sarah Chen'} • VP of Engineering & Dept Manager`,
          badgePill: 'Division Control',
          headline: 'Steer Division Performance & Strategy',
          description: 'Approve departmental deliverables, calibrate appraisal recommendations, and monitor division quota achievement.',
          primaryBtnText: 'Sign Off Appraisals',
          primaryBtnLink: '/assessment/final',
          secondaryBtnText: 'Department Scorecard',
          secondaryBtnLink: '/analytics/department',
          tagline: 'Engineering Division: 94.8% Achievement • 28 Active Staff • 3 Approvals Pending',
        };
      case 'Reviewer':
        return {
          badge: `${user?.fullName || 'Jordan Lee'} • Peer 360 Reviewer`,
          badgePill: 'Peer Review Hub',
          headline: 'Provide Confidential Peer 360 Feedback',
          description: 'You have 3 peer evaluation requests waiting for your constructive feedback. Help teammates grow with multi-rater insights.',
          primaryBtnText: 'Complete Peer 360 Reviews',
          primaryBtnLink: '/assessment/360-feedback',
          secondaryBtnText: 'View Evaluation Tasks',
          secondaryBtnLink: '/tasks',
          tagline: 'All submitted feedback is completely anonymized and encrypted before aggregation.',
        };
      case 'HR Manager':
        return {
          badge: `${user?.fullName || 'Marcus Vance'} • Talent & Performance Manager`,
          badgePill: 'Talent & Calibration',
          headline: 'Oversee Appraisal Calibration & Growth',
          description: 'Calibrate bell-curve distribution across divisions, monitor active IDP roadmaps, and audit PIP compliance milestones.',
          primaryBtnText: 'Open Calibration Session',
          primaryBtnLink: '/assessment/calibration',
          secondaryBtnText: 'Review Active IDPs',
          secondaryBtnLink: '/development/plan',
          tagline: 'Grade A Cap: 15% Max • Company Composite: 91.4% • 12 Active PIP Cases',
        };
      default: // Super Admin & HR Admin
        return {
          badge: 'Apex Enterprise Performance Suite',
          badgePill: 'FY 2026 Live',
          headline: 'Empower Collective Performance & Synergy',
          description: 'Continuous KPI tracking, 360 multi-rater feedback calibration, and goal alignment in one warm, focused workspace.',
          primaryBtnText: 'Input KPI Actuals',
          primaryBtnLink: '/kpi/actuals',
          secondaryBtnText: 'Employee Directory',
          secondaryBtnLink: '/organization/employees',
          tagline: 'Standard Formula: 60% KPI • 20% Comp • 10% Behav • 10% 360 • Evaluation Cycle Active',
        };
    }
  };

  const heroConfig = getRoleHeroConfig();

  return (
    <div className="space-y-6">
      {/* Main Grid: Left/Center Hero + Right Floating Executive Card (Matching Reference Layout!) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left & Center Main Section (8 cols on xl) */}
        <div className="xl:col-span-8 space-y-6">
          {/* THE HERO SHOWCASE CENTERPIECE: Warm Terracotta Architectural Scene */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FDE7D4] via-[#F8CDAE] to-[#F1B38E] border border-[#ECD1BC] shadow-[0_12px_36px_rgba(234,88,12,0.12)] p-4 sm:p-8 min-h-auto flex flex-col justify-between">
            {/* Subtle architectural wall texture overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/30 via-transparent to-black/5 pointer-events-none" />

            {/* Top Bar inside Hero */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EA580C] animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-bold text-[#9A3412] tracking-wider uppercase">
                  {heroConfig.badge}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#9A3412] bg-white/60 backdrop-blur-xs px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-white/60">
                {heroConfig.badgePill}
              </span>
            </div>

            {/* Middle: Architectural Scene Illustration */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center my-2 sm:my-4">
              {/* Headline & CTA */}
              <div className="lg:col-span-6 space-y-2.5 sm:space-y-3">
                <h2 className="text-xl sm:text-3xl font-extrabold text-[#2D1F17] tracking-tight leading-tight">
                  {heroConfig.headline}
                </h2>
                <p className="text-xs sm:text-sm text-[#6C5345] leading-relaxed max-w-md">
                  {heroConfig.description}
                </p>
                <div className="pt-1.5 sm:pt-2 flex flex-wrap items-center gap-2 sm:gap-3">
                  <Link to={heroConfig.primaryBtnLink}>
                    <button
                      type="button"
                      className="bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-lg shadow-[#EA580C]/30 transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                    >
                      <span>{heroConfig.primaryBtnText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                  <Link to={heroConfig.secondaryBtnLink}>
                    <button
                      type="button"
                      className="bg-white/80 hover:bg-white text-[#2D1F17] text-xs font-semibold px-4 sm:px-4.5 py-2 sm:py-2.5 rounded-full border border-white/80 transition-all cursor-pointer"
                    >
                      {heroConfig.secondaryBtnText}
                    </button>
                  </Link>
                </div>
              </div>

              {/* Architectural Scene Art (Different scene: modern creative studio with arched window, pendant lamp, plant, executive desk) */}
              <div className="lg:col-span-6 flex items-center justify-center relative min-h-[190px] sm:min-h-[220px] scale-[0.85] sm:scale-100 origin-center my-1 lg:my-0">
                {/* Floating Architectural Wall & Arched Window */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                  {/* Classical Architectural Archway with Soft Interior Sunlight */}
                  <div className="w-44 h-56 rounded-t-full border-4 border-white/90 bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col items-center justify-between p-3">
                    {/* Arch Window Panes */}
                    <div className="w-full h-24 border-b-2 border-white/60 relative flex items-center justify-center">
                      <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-white/60" />
                        <div className="h-full w-0.5 bg-white/60 absolute" />
                      </div>
                    </div>

                    {/* Warm Silhouette Inside Room */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#EA580C]/20 to-[#FB923C]/40 blur-xs absolute bottom-4" />

                    {/* Window Sill Plant */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#16A36A] shadow-xs -mb-1 flex items-center justify-center text-white text-[10px]">
                        🌿
                      </div>
                      <div className="w-8 h-5 bg-[#C2410C] rounded-b-md shadow-xs" />
                    </div>
                  </div>

                  {/* Pendant Ceiling Lantern (as in reference aesthetic) */}
                  <div className="absolute -top-2 left-6 flex flex-col items-center">
                    <div className="w-0.5 h-10 bg-[#7C2D12]" />
                    <div className="w-6 h-8 bg-gradient-to-b from-[#292524] to-[#1C1917] rounded-sm flex items-center justify-center shadow-md relative">
                      <div className="w-3 h-4 bg-[#FDE047] rounded-full blur-[2px] opacity-80" />
                    </div>
                  </div>

                  {/* Modern Designer Desk & Chair (replaces the bicycle with creative enterprise desk!) */}
                  <div className="absolute -bottom-1 -left-2 z-10 flex flex-col items-center">
                    {/* Potted Fiddle Leaf Tree */}
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#16A36A] shadow-md flex items-center justify-center text-white text-xs">
                        🪴
                      </div>
                      <div className="w-8 h-7 bg-[#EA580C] rounded-b-lg shadow-sm" />
                      <div className="w-10 h-1.5 bg-[#44403C]/20 rounded-full blur-xs mt-0.5" />
                    </div>
                  </div>

                  {/* Floating Metric Pill */}
                  <div className="absolute top-8 -right-2 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-white/80 flex items-center gap-2 animate-bounce duration-1000">
                    <div className="w-7 h-7 rounded-xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center font-bold text-xs">
                      ★
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716C] block leading-none">Team Score</span>
                      <span className="text-xs font-extrabold text-[#292524] leading-tight">
                        {avgScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] sm:text-[11px] text-[#78716C] pt-2 border-t border-[#F4BE9B]/50">
              <span>Standard Formula: 60% KPI &bull; 20% Comp &bull; 10% Behav &bull; 10% 360</span>
              <span className="font-bold text-[#9A3412]">Evaluation Cycle Active</span>
            </div>
          </div>

          {/* BOTTOM FLOATING METRIC CARDS (Exact match to the 2 white bottom cards in the reference image!) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Metric Card 1: Active KPI Achievement */}
            <Card
              hover
              onClick={() => navigate('/kpi/actuals')}
              className="p-4 sm:p-6 flex flex-col justify-between cursor-pointer group hover:border-[#EA580C] transition-all"
              title="Click to view & track KPI actuals"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#78716C] group-hover:text-[#EA580C] uppercase tracking-wider transition-colors">
                  Active KPI Achievement &rarr;
                </span>
                <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                  Target 100%
                </span>
              </div>

              {/* Icon Box + Big Numbers + Progress Track (As shown in reference image bottom card) */}
              <div className="flex items-center gap-4 my-2">
                {/* Rounded square orange icon box */}
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/20 shrink-0 group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#292524] tracking-tight">89.5%</span>
                    <span className="text-xs font-bold text-[#EA580C]">4,287 pts</span>
                  </div>

                  {/* Horizontal progress track with indicator knob (like the reference image!) */}
                  <div className="mt-2.5 w-full bg-[#FFEDD5] h-2 rounded-full relative overflow-visible">
                    <div
                      className="bg-gradient-to-r from-[#F97316] to-[#EA580C] h-2 rounded-full transition-all"
                      style={{ width: '89.5%' }}
                    />
                    {/* Indicator Knob */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#EA580C] shadow-sm pointer-events-none"
                      style={{ left: 'calc(89.5% - 8px)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#78716C]">
                <span>Verified Deliverables</span>
                <span className="text-xs font-bold text-[#EA580C] group-hover:underline">
                  View Metrics &rarr;
                </span>
              </div>
            </Card>

            {/* Metric Card 2: Evaluation Completion */}
            <Card
              hover
              onClick={() => navigate('/assessment/final')}
              className="p-4 sm:p-6 flex flex-col justify-between cursor-pointer group hover:border-[#EA580C] transition-all"
              title="Click to view & sign off evaluations"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#78716C] group-hover:text-[#EA580C] uppercase tracking-wider transition-colors">
                  Evaluation Completion &rarr;
                </span>
                <span className="text-[10px] font-bold text-[#16A36A] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full">
                  79 / 115 In
                </span>
              </div>

              {/* Icon Box + Big Numbers + Progress Track (As shown in reference image bottom card) */}
              <div className="flex items-center gap-4 my-2">
                {/* Rounded square golden-orange icon box */}
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#F59E0B] text-white flex items-center justify-center shadow-md shadow-[#F59E0B]/20 shrink-0 group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#292524] tracking-tight">87.6%</span>
                    <span className="text-xs font-bold text-[#D97706]">6,254 reviews</span>
                  </div>

                  {/* Horizontal progress track with indicator knob */}
                  <div className="mt-2.5 w-full bg-[#FEF3C7] h-2 rounded-full relative overflow-visible">
                    <div
                      className="bg-gradient-to-r from-[#FB923C] to-[#F59E0B] h-2 rounded-full transition-all"
                      style={{ width: '87.6%' }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#F59E0B] shadow-sm pointer-events-none"
                      style={{ left: 'calc(87.6% - 8px)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#78716C]">
                <span>Calibration Stage 2 Open</span>
                <span className="text-xs font-bold text-[#EA580C] group-hover:underline">
                  Sign Off Scores &rarr;
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Floating Device / Card (Adapts dynamically to the active role persona!) */}
        <div className="xl:col-span-4">
          <Card className="p-4 sm:p-6 shadow-2xl border border-[#EFE4D7] space-y-4 sm:space-y-5 bg-white relative">
            {/* Top Header of Device Card */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F7EFE6]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#A8A29E] tracking-wider block">
                  {role === 'Employee' && 'Personal Dossier'}
                  {role === 'Supervisor' && 'Team Dossier'}
                  {role === 'Reviewer' && 'Peer Review Dossier'}
                  {role === 'Department Manager' && 'Department Dossier'}
                  {['HR Admin', 'HR Manager', 'Super Admin'].includes(role) && 'Executive Dossier'}
                </span>
                <h3 className="text-sm font-extrabold text-[#292524] mt-0.5">
                  {role === 'Employee' && 'My Q1 Target Pulse'}
                  {role === 'Supervisor' && 'Direct Reports Queue'}
                  {role === 'Reviewer' && '360 Feedback Queue'}
                  {role === 'Department Manager' && 'Engineering Skyline'}
                  {['HR Admin', 'HR Manager', 'Super Admin'].includes(role) && 'Performance Pulse'}
                </h3>
              </div>
              <span className="text-xs font-bold text-white bg-gradient-to-r from-[#F97316] to-[#EA580C] px-3 py-1 rounded-full shadow-xs">
                {role}
              </span>
            </div>

            {/* Role-Specific Card Graphic / Content */}
            {role === 'Employee' ? (
              /* Employee: Personal Deliverable Breakdown */
              <div className="p-4 bg-gradient-to-b from-[#FDF8F3] to-[#F7EFE5] rounded-2xl border border-[#EFE4D7] space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#292524]">My Assigned Goal Progress</span>
                  <span className="text-[10px] font-bold text-[#EA580C]">92.4% Overall</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-semibold text-[#57534E]">
                      <span>Sprint Epic Delivery</span>
                      <span className="text-[#EA580C] font-bold">98%</span>
                    </div>
                    <div className="w-full bg-[#E5E0D6] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#EA580C] h-full rounded-full" style={{ width: '98%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-semibold text-[#57534E]">
                      <span>Zero P0 Production Defects</span>
                      <span className="text-[#16A34A] font-bold">100%</span>
                    </div>
                    <div className="w-full bg-[#E5E0D6] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#16A34A] h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1 font-semibold text-[#57534E]">
                      <span>Design System Component Coverage</span>
                      <span className="text-[#D97706] font-bold">85%</span>
                    </div>
                    <div className="w-full bg-[#E5E0D6] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#D97706] h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                </div>
              </div>
            ) : role === 'Supervisor' ? (
              /* Supervisor: Direct Reports Verification Queue */
              <div className="p-3.5 bg-gradient-to-b from-[#FDF8F3] to-[#F7EFE5] rounded-2xl border border-[#EFE4D7] space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#292524]">Direct Reports Evidence Audit</span>
                  <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2 py-0.5 rounded-full">
                    4 To Verify
                  </span>
                </div>

                <div className="divide-y divide-[#EFE4D7] text-xs">
                  <div className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#18181B]">Alex Morgan</p>
                      <p className="text-[10px] text-[#78716C]">5 Deliverables &bull; 100% Verified</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
                      Done
                    </span>
                  </div>

                  <div className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#18181B]">David Kim</p>
                      <p className="text-[10px] text-[#EA580C] font-semibold">2 Evidence Files Pending Audit</p>
                    </div>
                    <Link
                      to="/kpi/evidence"
                      className="text-[10px] font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] px-2.5 py-0.5 rounded-full transition-colors"
                    >
                      Audit
                    </Link>
                  </div>

                  <div className="py-2 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#18181B]">Maya Lin</p>
                      <p className="text-[10px] text-[#EA580C] font-semibold">2 Metric Claims Pending Audit</p>
                    </div>
                    <Link
                      to="/kpi/evidence"
                      className="text-[10px] font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] px-2.5 py-0.5 rounded-full transition-colors"
                    >
                      Audit
                    </Link>
                  </div>
                </div>
              </div>
            ) : role === 'Reviewer' ? (
              /* Reviewer: 360 Feedback Requests */
              <div className="p-3.5 bg-gradient-to-b from-[#FDF8F3] to-[#F7EFE5] rounded-2xl border border-[#EFE4D7] space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#292524]">360 Peer Feedback Requests</span>
                  <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2 py-0.5 rounded-full">
                    3 Waiting
                  </span>
                </div>

                <div className="divide-y divide-[#EFE4D7] text-xs">
                  {[
                    { name: 'Alex Morgan', role: 'Senior Frontend Engineer', dept: 'Engineering' },
                    { name: 'David Kim', role: 'Lead Backend Architect', dept: 'Engineering' },
                    { name: 'Maya Lin', role: 'Senior Product Designer', dept: 'Product' },
                  ].map((p, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#18181B]">{p.name}</p>
                        <p className="text-[10px] text-[#78716C]">{p.role}</p>
                      </div>
                      <Link
                        to="/assessment/360-feedback"
                        className="text-[10px] font-bold text-white bg-[#EA580C] hover:bg-[#C2410C] px-2.5 py-0.5 rounded-full transition-colors"
                      >
                        Review
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Department Manager, HR Manager, HR Admin, Super Admin: Skyline Chart */
              <div className="p-4 bg-gradient-to-b from-[#FDF8F3] to-[#F7EFE5] rounded-2xl border border-[#EFE4D7]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#292524]">Department Skyline</span>
                  <span className="text-[10px] text-[#EA580C] font-semibold">Click bar to filter &rarr;</span>
                </div>

                <div className="h-28 w-full flex items-end justify-between gap-1.5 px-2 pt-3">
                  {[
                    { label: 'Eng', name: 'Engineering & Technology', height: '85%', color: 'from-[#EA580C] to-[#F97316]' },
                    { label: 'HR', name: 'Human Resources & Talent', height: '92%', color: 'from-[#C2410C] to-[#EA580C]' },
                    { label: 'Sales', name: 'Sales & Commercial', height: '78%', color: 'from-[#FB923C] to-[#FDBA74]' },
                    { label: 'Fin', name: 'Finance & Governance', height: '88%', color: 'from-[#EA580C] to-[#FB923C]' },
                    { label: 'Prod', name: 'Product & Design', height: '96%', color: 'from-[#9A3412] to-[#EA580C]' },
                    { label: 'Mktg', name: 'Marketing & Brand', height: '82%', color: 'from-[#F97316] to-[#FDBA74]' },
                    { label: 'Ops', name: 'Operations & Supply Chain', height: '90%', color: 'from-[#EA580C] to-[#F97316]' },
                  ].map((bar, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => navigate(`/organization/employees?dept=${encodeURIComponent(bar.name)}`)}
                      className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
                      title={`Click to view employees in ${bar.name}`}
                    >
                      <div
                        className={`w-full bg-gradient-to-t ${bar.color} rounded-t-md shadow-xs transition-all group-hover:scale-110 group-hover:brightness-110`}
                        style={{ height: bar.height }}
                      />
                      <span className="text-[9px] font-bold text-[#78716C] group-hover:text-[#EA580C] transition-colors">{bar.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mini Calendar Day Matrix Widget */}
            <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#EFE4D7]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#292524]">
                  {role === 'Employee' ? 'My Review Milestones' : 'Evaluation Deadlines'}
                </span>
                <span className="text-[10px] font-bold text-[#EA580C]">June 2026</span>
              </div>

              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#A8A29E] mb-1">
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setSelectedCalendarDay(d);
                      if (d === 7) navigate('/assessment/self');
                      if (d === 14) navigate('/tasks');
                      if (d === 21) navigate('/assessment/final');
                    }}
                    className={`py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                      selectedCalendarDay === d
                        ? 'bg-[#EA580C] text-white shadow-xs'
                        : [7, 14, 21].includes(d)
                        ? 'bg-[#FFEDD5] text-[#C2410C] hover:bg-[#FED7AA]'
                        : 'text-[#44403C] hover:bg-[#F0E6DA]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="pt-2 mt-2 border-t border-[#EAE0D3] flex items-center justify-between text-[10px] text-[#78716C]">
                <Link to="/assessment/self" className="hover:text-[#EA580C] hover:underline font-semibold">
                  Self Due: 7th &rarr;
                </Link>
                <Link to="/assessment/final" className="font-bold text-[#EA580C] hover:underline">
                  Cutoff: 21st &rarr;
                </Link>
              </div>
            </div>

            {/* Bottom Solid Orange Pill CTA (Role-Adapted!) */}
            <Link
              to={
                role === 'Employee'
                  ? '/assessment/self'
                  : role === 'Supervisor'
                  ? '/kpi/evidence'
                  : role === 'Reviewer'
                  ? '/assessment/360-feedback'
                  : '/assessment/final'
              }
              className="block pt-1"
            >
              <button
                type="button"
                className="w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white text-xs font-bold py-3 px-4 rounded-2xl shadow-lg shadow-[#EA580C]/25 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>
                  {role === 'Employee' && 'Open Self-Evaluation Form'}
                  {role === 'Supervisor' && 'Audit Team Evidence (4 Pending)'}
                  {role === 'Reviewer' && 'Complete Peer 360 Reviews'}
                  {role === 'Department Manager' && 'Sign Off Division Appraisals'}
                  {['HR Admin', 'HR Manager', 'Super Admin'].includes(role) && 'Calibrate & Publish Ratings'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </Card>
        </div>
      </div>

      {/* QUICK ACTIONS SHORTCUTS (Dinamis Sesuai Role Persona!) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#78716C]">
              Quick Actions ({role} Persona)
            </h3>
          </div>
          <span className="text-[11px] text-[#A8A29E] font-medium hidden sm:inline">
            Workflow jalan pintas yang disesuaikan dengan matrix izin {role}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {role === 'Employee' ? (
            <>
              {/* Action 1 Employee: Input Deliverable */}
              <Link
                to="/kpi/actuals"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/20 group-hover:scale-105 transition-transform">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                      60% KPI
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      Input My Deliverable
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      Catat progres metrik aktual, deliverable sprint, dan persentase pencapaian KPI Q1.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Input Actuals</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Action 2 Employee: Upload Evidence */}
              <Link
                to="/kpi/evidence"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/20 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                      Bukti Dokumen
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      Unggah Bukti &amp; Evidence
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      Lampirkan berkas sertifikat, screenshot, atau tautan bukti klaim KPI untuk diverifikasi supervisor.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Upload File</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Action 3 Employee: Self-Evaluation */}
              <Link
                to="/assessment/self"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white flex items-center justify-center shadow-md shadow-[#D97706]/20 group-hover:scale-105 transition-transform">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                      Batas: 7 Juni
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      Isi Evaluasi Diri (Self)
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      Lakukan refleksi diri, berikan rating kompetensi internal dan cantumkan pencapaian kunci.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Buka Form</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Action 4 Employee: Individual Development Plan */}
              <Link
                to="/development/plan"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#9A3412] text-white flex items-center justify-center shadow-md shadow-[#9A3412]/20 group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#18181B] bg-[#F5EFE6] px-2.5 py-0.5 rounded-full">
                      88% Ready
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      Rencana Karir (IDP)
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      Pantau kenaikan level IC4 ke IC5, progres sertifikasi AWS, dan target kompetensi teknis.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Lihat IDP</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </>
          ) : role === 'Supervisor' ? (
            <>
              {/* Action 1 Supervisor: Verify Evidence */}
              <Link
                to="/kpi/evidence"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/20 group-hover:scale-105 transition-transform">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-white bg-[#EA580C] px-2.5 py-0.5 rounded-full">
                      4 Antrean Baru
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      Verifikasi Bukti KPI Tim
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      Audit berkas klaim metrik dari anggota tim direct report, setujui atau minta perbaikan.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Audit Berkas</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Action 2 Supervisor: 1-on-1 Coaching */}
              <Link
                to="/development/coaching"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/20 group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#9A3412] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                      Bi-Weekly
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      Catat Sesi 1-on-1 Coaching
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      Dokumentasikan poin diskusi, hambatan kerja, dan komitmen bersama anggota tim.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Log Mentoring</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Action 3 Supervisor: Supervisor Review */}
              <Link
                to="/assessment/supervisor"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white flex items-center justify-center shadow-md shadow-[#D97706]/20 group-hover:scale-105 transition-transform">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                      4/6 Selesai
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      Penilaian Atasan (Supervisor)
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      Berikan evaluasi kualitatif manajerial, skor perilaku, dan catatan rekomendasi kinerja.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Isi Penilaian</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Action 4 Supervisor: Remedial PIP */}
              <Link
                to="/development/pip"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#9A3412] text-white flex items-center justify-center shadow-md shadow-[#9A3412]/20 group-hover:scale-105 transition-transform">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEF2F2] px-2.5 py-0.5 rounded-full">
                      1 Kasus PIP
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      Pantau Kasus PIP Tim
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      Awasi kepatuhan target mingguan dan SLA rencana perbaikan kinerja remedial formal.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Monitor PIP</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </>
          ) : role === 'Reviewer' ? (
            <>
              {/* Action 1 Reviewer: 360 Feedback */}
              <Link
                to="/assessment/360-feedback"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/20 group-hover:scale-105 transition-transform">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-white bg-[#EA580C] px-2.5 py-0.5 rounded-full">
                      3 Menunggu
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      Isi Evaluasi Rekan (360)
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      Beri masukan konstruktif anonim untuk rekan kerja yang telah mengajukan permintaan feedback.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Beri Feedback</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Action 2 Reviewer: Tasks */}
              <Link
                to="/tasks"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white flex items-center justify-center shadow-md shadow-[#D97706]/20 group-hover:scale-105 transition-transform">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#78716C] bg-[#F5EFE6] px-2.5 py-0.5 rounded-full">
                      Panduan
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      Rubrik Penilaian Reviewer
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      Baca skala panduan penilaian objektif agar evaluasi rekan sejawat adil dan terstandarisasi.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Baca Rubrik</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Action 3 Reviewer: Calendar */}
              <Link
                to="/dashboard"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/20 group-hover:scale-105 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                      Cutoff 14 Juni
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      Batas Akhir Penilaian
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      Pastikan seluruh tanggapan 360 multi-rater telah terkirim sebelum jendela review ditutup.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Lihat Jadwal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Action 4 Reviewer: History */}
              <Link
                to="/assessment/360-feedback"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#9A3412] text-white flex items-center justify-center shadow-md shadow-[#9A3412]/20 group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                      5 Selesai
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      Histori Feedback Terkirim
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      Lihat status ringkasan tanggapan evaluasi yang telah Anda kirimkan pada siklus aktif.
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Lihat Histori</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </>
          ) : (
            /* Super Admin, HR Admin, HR Manager, Department Manager */
            <>
              {/* Action 1 Admin: Start / Sign Off Evaluation */}
              <Link
                to="/assessment/final"
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/20 group-hover:scale-105 transition-transform">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                      Siklus Aktif
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      {role === 'Department Manager' ? 'Persetujuan Nilai Divisi' : 'Finalisasi & Evaluasi Skor'}
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      {role === 'Department Manager'
                        ? 'Tanda tangani pengesahan appraisal akhir seluruh staf departemen.'
                        : 'Kelola penilaian komposit, kalkulasi bobot otomatis, dan sign-off resmi.'}
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>Buka Evaluasi</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Action 2 Admin: Calibration / Analytics */}
              <Link
                to={role === 'Department Manager' ? '/analytics/department' : '/assessment/calibration'}
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/20 group-hover:scale-105 transition-transform">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#9A3412] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                      {role === 'Department Manager' ? '#1 Enterprise' : 'Bell Curve'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      {role === 'Department Manager' ? 'Scorecard Departemen' : 'Kalibrasi Kuota Rating'}
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      {role === 'Department Manager'
                        ? 'Pantau pencapaian kuota KPI dan gap kompetensi divisi Engineering.'
                        : 'Normalisasi kurva lonceng Grade A-E dan kalibrasi pembagian bonus.'}
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>{role === 'Department Manager' ? 'Lihat Scorecard' : 'Mulai Kalibrasi'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Action 3 Admin: Import Data / Roster */}
              <Link
                to={['Super Admin', 'HR Admin'].includes(role) ? '/data/import' : '/development/plan'}
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white flex items-center justify-center shadow-md shadow-[#D97706]/20 group-hover:scale-105 transition-transform">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#16A36A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                      {['Super Admin', 'HR Admin'].includes(role) ? 'Excel / CSV' : '88 IDP Aktif'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      {['Super Admin', 'HR Admin'].includes(role) ? 'Impor Roster & Target' : 'Persetujuan IDP Tim'}
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      {['Super Admin', 'HR Admin'].includes(role)
                        ? 'Unggah massal data master karyawan dan target KPI via spreadsheet.'
                        : 'Tinjau roadmap pelatihan dan kesiapan promosi talenta tim.'}
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>{['Super Admin', 'HR Admin'].includes(role) ? 'Impor Data' : 'Tinjau IDP'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Action 4 Admin: Company Report / 1-on-1 */}
              <Link
                to={role === 'Department Manager' ? '/organization/employees' : '/analytics/company'}
                className="group bg-white rounded-3xl p-4 sm:p-5 border border-[#EFE4D7] hover:border-[#EA580C] shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EA580C] to-[#9A3412] text-white flex items-center justify-center shadow-md shadow-[#9A3412]/20 group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#18181B] bg-[#F5EFE6] px-2.5 py-0.5 rounded-full">
                      {role === 'Department Manager' ? '28 Staf' : 'Laporan Korporat'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#292524] group-hover:text-[#EA580C] transition-colors leading-snug">
                      {role === 'Department Manager' ? 'Direktori Tim Departemen' : 'Laporan Eksekutif Perusahaan'}
                    </h4>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      {role === 'Department Manager'
                        ? 'Pantau penempatan staf divisi, level IC, dan beban kerja.'
                        : 'Analisis komprehensif tren kuartalan, indeks kepatuhan, dan OKR korporat.'}
                    </p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-[#F7EFE6] flex items-center justify-between text-xs text-[#EA580C] font-semibold">
                  <span>{role === 'Department Manager' ? 'Buka Direktori' : 'Buka Laporan'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* KPI COMPLETION PROGRESS RECHARTS WIDGET */}
      <KPICompletionWidget />

      {/* SECTION 2: INTERACTIVE TEAM APPRAISAL ROSTER & LIVE DOSSIER (Matching Reference Image Style!) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 pt-2">
        {/* Left Column (8 cols): Employee Appraisal Roster Cards */}
        <div className="xl:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-[#292524] tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-[#EA580C]" />
                <span>Team Appraisal Roster</span>
              </h3>
              <p className="text-xs text-[#78716C] mt-0.5">
                Click any employee card to preview live deliverables and launch connected reviews
              </p>
            </div>
            <Link to="/organization/employees">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs shadow-2xs"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Open Full Directory ({employees.length})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {employees.map((emp) => {
              const isSelected = focusedEmp.id === emp.id;
              const empEvaluation = evaluations.find(
                (e) => e.employeeId === emp.employeeId || e.employeeId === emp.id
              );
              const score = empEvaluation?.finalScore || 88.5;

              return (
                <div
                  key={emp.id}
                  onClick={() => setFocusedEmpId(emp.id)}
                  className={`bg-white rounded-3xl border p-4 sm:p-5 shadow-[0_4px_16px_rgba(24,24,27,0.03)] hover:shadow-md transition-all cursor-pointer group relative ${
                    isSelected
                      ? 'border-[#EA580C] ring-2 ring-[#FFEDD5] bg-[#FFFBF8]'
                      : 'border-[#EFE4D7] hover:border-[#EA580C]/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                          alt={emp.fullName}
                          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#16A36A] border-2 border-white rounded-full" />
                      </div>
                      <div className="min-w-0">
                        <h4
                          className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                            isSelected ? 'text-[#EA580C]' : 'text-[#292524] group-hover:text-[#EA580C]'
                          }`}
                        >
                          {emp.fullName}
                        </h4>
                        <p className="text-[11px] text-[#78716C] truncate mt-0.5 font-medium">
                          {emp.positionTitle}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2 py-0.5 rounded-full shrink-0">
                      {score}%
                    </span>
                  </div>

                  {/* Multi-tier progress track matching reference image */}
                  <div className="space-y-1 pt-2 border-t border-[#F7EFE6]">
                    <div className="flex justify-between text-[10px] font-semibold text-[#78716C]">
                      <span className="truncate max-w-[140px]">{emp.departmentName}</span>
                      <span className="text-[#EA580C] font-bold">Grade A</span>
                    </div>
                    <div className="relative w-full h-1.5 rounded-full bg-[#E5E2D9] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FFD15C] via-[#EA580C] to-[#18181B] rounded-full transition-all"
                        style={{ width: `${Math.min(100, score)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Live Employee Dossier & Direct Action Hub (Matching Reference Image Right Panel!) */}
        <div className="xl:col-span-4">
          <div className="bg-white rounded-3xl border border-[#EFE4D7] shadow-xl p-5 sm:p-6 space-y-4 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-[#F7EFE6]">
              <span className="text-[10px] uppercase font-bold text-[#A8A29E] tracking-wider">
                Focused Employee Dossier
              </span>
              <span className="font-mono text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2 py-0.5 rounded-full">
                {focusedEmp.employeeId}
              </span>
            </div>

            {/* Glowing Golden Avatar Portrait */}
            <div className="flex flex-col items-center text-center">
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#EA580C] via-[#FDBA74] to-[#F59E0B] shadow-md shadow-[#EA580C]/20 mb-3">
                <img
                  src={focusedEmp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                  alt={focusedEmp.fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white"
                />
              </div>

              <h3 className="text-base font-extrabold text-[#292524]">{focusedEmp.fullName}</h3>
              <p className="text-xs text-[#78716C] font-medium mt-0.5">{focusedEmp.positionTitle}</p>
              <p className="text-[11px] text-[#A8A29E] mt-0.5">{focusedEmp.departmentName}</p>
            </div>

            {/* Basic Information fields */}
            <div className="bg-[#FAF6F0] rounded-2xl p-4 border border-[#EFE4D7] space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#78716C]">Email Address</span>
                <span className="font-medium text-[#292524] truncate max-w-[170px]">{focusedEmp.email}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#78716C]">Phone</span>
                <span className="font-mono text-[#292524]">{focusedEmp.phone}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#78716C]">Status</span>
                <span className="font-bold text-[#16A36A] bg-[#DCFCE7] px-2 py-0.5 rounded-full text-[10px]">
                  {focusedEmp.employmentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#78716C]">Join Date</span>
                <span className="font-mono text-[#292524]">{focusedEmp.joinDate}</span>
              </div>
            </div>

            {/* Direct Inter-Connected Navigation Buttons */}
            <div className="space-y-2 pt-2 border-t border-[#F7EFE6]">
              <Button
                variant="primary"
                size="sm"
                className="w-full rounded-2xl shadow-sm text-xs justify-between"
                onClick={() => navigate(`/kpi/actuals?employeeId=${focusedEmp.id}`)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                <span>Input KPI Deliverables</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full rounded-2xl text-xs justify-between"
                onClick={() => navigate(`/assessment/final?employeeId=${focusedEmp.id}`)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                <span>Final Performance Appraisal</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="w-full rounded-2xl text-xs text-[#78716C] hover:text-[#EA580C] justify-between"
                onClick={() => navigate(`/organization/employees?employeeId=${focusedEmp.id}`)}
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                <span>View Full Record in Directory</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
