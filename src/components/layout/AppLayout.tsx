import React, { useState } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import {
  MapPin,
  BarChart2,
  Search,
  SlidersHorizontal,
  Plus,
  Calendar as CalendarIcon,
  ChevronDown,
  Sparkles,
  Users,
  Building2,
  Layers,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { db } from '../../lib/database';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_DEFINITIONS } from '../../services/authService';

export const AppLayout: React.FC = () => {
  const { user, role, switchRole, availableRoles } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const activePeriod = db.getPeriods().find((p) => p.status === 'Active') || db.getPeriods()[0];

  // Derive active section and page title matching the user's role and RBAC matrix
  const getHeaderInfo = () => {
    const path = location.pathname;
    const currentRole = role || 'Employee';

    // Role-specific override for Employee
    if (currentRole === 'Employee') {
      if (path.startsWith('/kpi')) {
        return {
          title: 'My KPIs & Deliverables',
          subTabs: [
            { label: 'My Actual Deliverables', path: '/kpi/actuals' },
            { label: 'Evidence & Proofs', path: '/kpi/evidence' },
            { label: 'Assigned Targets (60%)', path: '/kpi/targets' },
          ],
          capsules: [
            { label: 'Assigned Weight', value: '60% of Score', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
            { label: 'Logged Deliverables', value: '5 metrics', bg: 'bg-[#18181B] text-white' },
            { label: 'Evidence Status', value: '3 verified', bg: 'bg-[#9CA3AF] text-white' },
          ],
        };
      }
      if (path.startsWith('/assessment')) {
        return {
          title: 'My Assessments & 360 Feedback',
          subTabs: [
            { label: 'Self Evaluation Form', path: '/assessment/self' },
            { label: 'Peer 360 Feedback (Given)', path: '/assessment/360-feedback' },
            { label: 'My Final Scorecard', path: '/assessment/final' },
          ],
          capsules: [
            { label: 'Self Review', value: 'Due June 7', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
            { label: 'Peer 360 Given', value: '2 completed', bg: 'bg-[#18181B] text-white' },
            { label: 'Final Result', value: 'Calibrating', bg: 'bg-[#9CA3AF] text-white' },
          ],
        };
      }
      if (path.startsWith('/development')) {
        return {
          title: 'My Individual Growth & IDP',
          subTabs: [
            { label: 'Career Roadmap & IDP', path: '/development/plan' },
            { label: '1-on-1 Mentoring Notes', path: '/development/coaching' },
          ],
          capsules: [
            { label: 'Career Ladder', value: 'IC4 -> IC5 Staff', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
            { label: 'Readiness Score', value: '88% ready', bg: 'bg-[#18181B] text-white' },
            { label: 'Cert Progress', value: 'AWS 70%', bg: 'bg-[#9CA3AF] text-white' },
          ],
        };
      }
      // Employee Dashboard default
      return {
        title: 'My Performance & Goals',
        subTabs: [
          { label: 'Personal Overview', path: '/dashboard' },
          { label: 'My Actual Deliverables', path: '/kpi/actuals' },
          { label: 'Evidence Upload', path: '/kpi/evidence' },
          { label: 'Self Assessment', path: '/assessment/self' },
          { label: 'Individual Plan (IDP)', path: '/development/plan' },
        ],
        capsules: [
          { label: 'My Q1 Score', value: '92.4% rating', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'My Deliverables', value: '5 / 5 logged', bg: 'bg-[#18181B] text-white' },
          { label: 'Self Review', value: 'Due June 7', bg: 'bg-[#EA580C] text-white' },
        ],
      };
    }

    // Role-specific override for Supervisor
    if (currentRole === 'Supervisor') {
      if (path.startsWith('/kpi')) {
        return {
          title: 'Team Deliverables & Evidence Verification',
          subTabs: [
            { label: 'Verify Evidence & Proofs', path: '/kpi/evidence' },
            { label: 'Team Actual Performance', path: '/kpi/actuals' },
            { label: 'KPI Target Library', path: '/kpi/targets' },
          ],
          capsules: [
            { label: 'Evidence Queue', value: '4 to verify', bg: 'bg-[#EA580C] text-white' },
            { label: 'Verified Claims', value: '18 items', bg: 'bg-[#18181B] text-white' },
            { label: 'Team Achievement', value: '94.2% avg', bg: 'bg-[#9CA3AF] text-white' },
          ],
        };
      }
      if (path.startsWith('/assessment')) {
        return {
          title: 'Supervisor Reviews & Appraisals',
          subTabs: [
            { label: 'Supervisor Appraisal Form', path: '/assessment/supervisor' },
            { label: 'Sign-off Final Evaluation', path: '/assessment/final' },
            { label: '360 Feedback Summary', path: '/assessment/360-feedback' },
          ],
          capsules: [
            { label: 'Supervised', value: '6 staff', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
            { label: 'Submitted Reviews', value: '4 / 6 reviews', bg: 'bg-[#18181B] text-white' },
            { label: 'Grade A Candidates', value: '2 engineers', bg: 'bg-[#9CA3AF] text-white' },
          ],
        };
      }
      if (path.startsWith('/development')) {
        return {
          title: 'Team Coaching & Remedial Monitoring',
          subTabs: [
            { label: '1-on-1 Mentorship Logs', path: '/development/coaching' },
            { label: 'Remedial (PIP) Records', path: '/development/pip' },
            { label: 'Team Development Plans', path: '/development/plan' },
          ],
          capsules: [
            { label: '1-on-1 Sessions', value: '8 logged', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
            { label: 'Active PIPs', value: '1 case monitoring', bg: 'bg-[#EA580C] text-white' },
            { label: 'IDP Reviews', value: '100% covered', bg: 'bg-[#18181B] text-white' },
          ],
        };
      }
      // Supervisor Dashboard default
      return {
        title: 'Team Supervision & Performance',
        subTabs: [
          { label: 'Team Overview', path: '/dashboard' },
          { label: 'Direct Reports', path: '/organization/employees' },
          { label: 'Verify Deliverables', path: '/kpi/evidence' },
          { label: 'Supervisor Review', path: '/assessment/supervisor' },
          { label: '1-on-1 Coaching', path: '/development/coaching' },
        ],
        capsules: [
          { label: 'Direct Reports', value: '6 engineers', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'Evidence Queue', value: '4 pending', bg: 'bg-[#EA580C] text-white' },
          { label: 'Avg Team Score', value: '91.8%', bg: 'bg-[#18181B] text-white' },
        ],
      };
    }

    // Role-specific override for Reviewer
    if (currentRole === 'Reviewer') {
      return {
        title: 'Peer 360-Degree Feedback Hub',
        subTabs: [
          { label: 'Reviewer Dashboard', path: '/dashboard' },
          { label: 'Pending 360 Reviews', path: '/assessment/360-feedback' },
          { label: 'My Action Tasks', path: '/tasks' },
        ],
        capsules: [
          { label: 'Pending Reviews', value: '3 peers waiting', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'Completed', value: '5 responses', bg: 'bg-[#18181B] text-white' },
          { label: 'Anonymity', value: 'Encrypted & Safe', bg: 'bg-[#9CA3AF] text-white' },
        ],
      };
    }

    // Role-specific override for Department Manager
    if (currentRole === 'Department Manager') {
      if (path.startsWith('/analytics')) {
        return {
          title: 'Department Division Scorecard',
          subTabs: [
            { label: 'Department Analytics', path: '/analytics/department' },
            { label: 'Competency Gap Matrix', path: '/analytics/competency' },
            { label: 'Division Headcounts', path: '/organization/departments' },
          ],
          capsules: [
            { label: 'Division Index', value: '94.8% achievement', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
            { label: 'Ranking', value: '#1 in Enterprise', bg: 'bg-[#18181B] text-white' },
            { label: 'Quota', value: '28 / 30 filled', bg: 'bg-[#9CA3AF] text-white' },
          ],
        };
      }
      return {
        title: 'Engineering Department Performance',
        subTabs: [
          { label: 'Division Overview', path: '/dashboard' },
          { label: 'Department Staff', path: '/organization/employees' },
          { label: 'Appraisal Approvals', path: '/assessment/final' },
          { label: 'Dept Scorecard', path: '/analytics/department' },
          { label: 'Team IDPs', path: '/development/plan' },
        ],
        capsules: [
          { label: 'Division Index', value: '94.8% rating', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'Sign-off Queue', value: '3 pending', bg: 'bg-[#EA580C] text-white' },
          { label: 'Headcount', value: '28 / 30 seats', bg: 'bg-[#18181B] text-white' },
        ],
      };
    }

    if (path.startsWith('/organization')) {
      return {
        title: 'People',
        subTabs: [
          { label: 'Employee Directory', path: '/organization/employees' },
          { label: 'Departments', path: '/organization/departments' },
          { label: 'Positions', path: '/organization/positions' },
          { label: 'Organization Chart', path: '/organization/chart' },
        ],
        capsules: [
          { label: 'Full-Time', value: '128 staff', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'Evaluated', value: '89.5%', bg: 'bg-[#18181B] text-white' },
          { label: 'Capacity', value: '96% filled', bg: 'bg-[#9CA3AF] text-white' },
        ],
      };
    }
    if (path.startsWith('/kpi')) {
      return {
        title: 'Devices & KPI',
        subTabs: [
          { label: 'Actual Performance', path: '/kpi/actuals' },
          { label: 'KPI Library', path: '/kpi/library' },
          { label: 'Target Management', path: '/kpi/targets' },
          { label: 'Evidence Audit', path: '/kpi/evidence' },
        ],
        capsules: [
          { label: 'Achievement', value: '94.2%', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'Verified', value: '18 / 20 KPIs', bg: 'bg-[#18181B] text-white' },
          { label: 'Weighted Index', value: '56.5 pts', bg: 'bg-[#9CA3AF] text-white' },
        ],
      };
    }
    if (path.startsWith('/assessment')) {
      return {
        title: 'Salary & Evaluation',
        subTabs: [
          { label: 'Final Evaluation', path: '/assessment/final' },
          { label: 'Salary & Incentive Sim', path: '/assessment/salary-simulator' },
          { label: 'Appraisal Dossier (PDF)', path: '/assessment/dossier' },
          { label: 'Talent Calibration (9-Box)', path: '/assessment/calibration' },
          { label: '360 Feedback', path: '/assessment/360-feedback' },
          { label: 'Supervisor Review', path: '/assessment/supervisor' },
          { label: 'Self Assessment', path: '/assessment/self' },
        ],
        capsules: [
          { label: 'Cycle Score', value: '89.2% avg', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'Approved', value: '14 / 16 staff', bg: 'bg-[#18181B] text-white' },
          { label: 'Grade A', value: '35% top tier', bg: 'bg-[#9CA3AF] text-white' },
        ],
      };
    }
    if (path.startsWith('/cycle')) {
      return {
        title: 'Hiring & Cycles',
        subTabs: [
          { label: 'Evaluation Periods', path: '/cycle/periods' },
          { label: 'Evaluation Calendar', path: '/cycle/calendar' },
          { label: 'Review Workflow', path: '/cycle/workflow' },
          { label: 'Period History', path: '/cycle/history' },
        ],
        capsules: [
          { label: 'Current Cycle', value: '2026 Q1', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'Stage', value: 'Supervisor Review', bg: 'bg-[#18181B] text-white' },
          { label: 'Days Left', value: '18 days', bg: 'bg-[#9CA3AF] text-white' },
        ],
      };
    }
    if (path.startsWith('/tasks')) {
      return {
        title: 'My Action Tasks',
        subTabs: [
          { label: 'Pending Queue', path: '/tasks' },
          { label: 'Completed Actions', path: '/tasks' },
          { label: 'Approval Milestones', path: '/tasks' },
        ],
        capsules: [
          { label: 'Urgent Items', value: '3 tasks', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'Sign-offs', value: '14 done', bg: 'bg-[#18181B] text-white' },
          { label: 'Completion', value: '82% on track', bg: 'bg-[#9CA3AF] text-white' },
        ],
      };
    }
    if (path.startsWith('/development')) {
      return {
        title: 'Growth & Development',
        subTabs: [
          { label: 'Coaching Logs', path: '/development/coaching' },
          { label: 'Development Plans (IDP)', path: '/development/plan' },
          { label: 'Remedial (PIP)', path: '/development/pip' },
        ],
        capsules: [
          { label: '1-on-1 Sessions', value: '24 logged', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'Active IDPs', value: '88 staff', bg: 'bg-[#18181B] text-white' },
          { label: 'PIP Success', value: '92% cleared', bg: 'bg-[#9CA3AF] text-white' },
        ],
      };
    }
    if (path.startsWith('/analytics')) {
      return {
        title: 'Performance Analytics',
        subTabs: [
          { label: 'Company Overview', path: '/analytics/company' },
          { label: 'Department Scorecards', path: '/analytics/department' },
          { label: '9-Box Talent Matrix', path: '/analytics/talent-matrix' },
          { label: 'Competency Gap', path: '/analytics/competency' },
          { label: 'Rating Distribution', path: '/analytics/distribution' },
        ],
        capsules: [
          { label: 'Company Index', value: '91.4% rating', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'High Performers', value: '28 staff', bg: 'bg-[#18181B] text-white' },
          { label: 'Benchmark', value: '+4.2% YoY', bg: 'bg-[#9CA3AF] text-white' },
        ],
      };
    }
    if (path.startsWith('/data')) {
      return {
        title: 'Data Management & Integrations',
        subTabs: [
          { label: 'Import Excel / CSV', path: '/data/import' },
          { label: 'Export Dossiers', path: '/data/export' },
          { label: 'API & Webhooks', path: '/data/api' },
        ],
        capsules: [
          { label: 'Database Ingest', value: '38 tables', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'REST API Gateway', value: 'v2.4 Active', bg: 'bg-[#18181B] text-white' },
          { label: 'Sync Status', value: 'Realtime', bg: 'bg-[#9CA3AF] text-white' },
        ],
      };
    }
    if (path.startsWith('/settings') || path.startsWith('/admin')) {
      return {
        title: 'System Administration',
        subTabs: [
          { label: 'Company Profile', path: '/settings/company' },
          { label: 'Roles & Permissions', path: '/settings/roles' },
          { label: 'User Accounts', path: '/settings/users' },
          { label: 'Database Schema', path: '/settings/database' },
          { label: 'Audit Trail', path: '/settings/audit' },
        ],
        capsules: [
          { label: 'PostgreSQL', value: '38 tables', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
          { label: 'Active Roles', value: '7 personas', bg: 'bg-[#18181B] text-white' },
          { label: 'Security RLS', value: 'Enforced', bg: 'bg-[#9CA3AF] text-white' },
        ],
      };
    }

    // Default: Executive Dashboard & Overview
    return {
      title: 'Executive Dashboard & Overview',
      subTabs: [
        { label: 'Executive Pulse', path: '/dashboard' },
        { label: 'Action Tasks', path: '/tasks' },
        { label: 'KPI Deliverables', path: '/kpi/actuals' },
        { label: 'Talent Matrix (9-Box)', path: '/analytics/talent-matrix' },
        { label: 'Appraisal Dossier', path: '/assessment/dossier' },
      ],
      capsules: [
        { label: 'Cycle Hours', value: '264.00 hrs', bg: 'bg-[#FFD15C] text-[#3D2E00]' },
        { label: 'Appraisal Index', value: '$2,647 / pt', bg: 'bg-[#18181B] text-white' },
        { label: 'Performance', value: '89.5% score', bg: 'bg-[#9CA3AF] text-white' },
      ],
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F6F5F0] text-[#18181B] font-sans flex flex-col antialiased selection:bg-[#FFEDD5] selection:text-[#EA580C]">
      {/* Slide-over Full Module Directory Drawer */}
      <Sidebar isOpen={mobileDrawerOpen} onCloseMobile={() => setMobileDrawerOpen(false)} />

      {/* Top Floating Capsule Navigation Header */}
      <Header onToggleMobileDrawer={() => setMobileDrawerOpen(true)} />

      {/* Interactive RBAC Persona Switcher Banner (Adapts entire app interface live!) */}
      <div className="no-print w-full bg-white border-b border-[#E7E4DC] px-3 sm:px-6 py-1.5 shadow-2xs">
        <div className="w-full max-w-[1700px] mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider">
              Active Role Persona:
            </span>
            <div className="flex items-center gap-1.5 bg-[#FAF6F0] px-2.5 py-1 rounded-full border border-[#EFE4D7]">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
              <span className="font-extrabold text-[#18181B] text-xs">{user?.fullName || 'User'}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#FFEDD5] text-[#C2410C] font-black text-[9px] uppercase">
                {role}
              </span>
            </div>
            <span className="text-[#78716C] text-[11px] hidden xl:inline">
              &bull; {ROLE_DEFINITIONS[role]?.description}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            <span className="text-[10px] text-[#A8A29E] font-bold uppercase shrink-0 mr-1 hidden sm:inline">
              Simulasi Tampilan Role:
            </span>
            {availableRoles.map((item) => (
              <button
                key={item.role}
                type="button"
                onClick={() => switchRole(item.role)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                  role === item.role
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-[#F5F4EF] hover:bg-[#EBE9E2] text-[#57534E] hover:text-[#18181B]'
                }`}
                title={`Switch to ${item.role} persona (${item.name})`}
              >
                {item.role === 'Super Admin' && '👑 '}
                {item.role === 'HR Admin' && '📋 '}
                {item.role === 'HR Manager' && '💼 '}
                {item.role === 'Department Manager' && '🏢 '}
                {item.role === 'Supervisor' && '🎯 '}
                {item.role === 'Employee' && '👤 '}
                {item.role === 'Reviewer' && '✍️ '}
                <span>{item.role}</span>
              </button>
            ))}
            <Link
              to="/settings/roles"
              className="text-[10px] font-bold text-[#EA580C] hover:underline ml-1.5 shrink-0"
              title="Lihat Matrix Lengkap Permissions"
            >
              Matrix &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container with responsive padding (strictly contained within screen bounds) */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 flex flex-col gap-4 sm:gap-6 overflow-x-hidden">
        {/* Top Hero Row: Big Elegant Title + Action Search Pill Bar + Metric Capsules */}
        <div className="no-print space-y-3 sm:space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            {/* Big Elegant Title matching "Salary" in reference image */}
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-light text-[#18181B] tracking-tight leading-tight">
                {headerInfo.title}
              </h1>
              <p className="text-[11px] sm:text-xs text-[#78716C] mt-1 sm:mt-1.5 font-medium truncate">
                Enterprise Performance Management &bull; Cycle: {activePeriod?.name}
              </p>
            </div>

            {/* Sub-menu Action Search Pill Bar (Responsive for Mobile) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
              {/* Unified Pill Search and Actions Bar */}
              <div className="bg-white rounded-full px-2.5 sm:px-3 py-1.5 shadow-[0_4px_16px_rgba(24,24,27,0.04)] border border-[#E7E4DC] flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {/* 📍 Pin / Division icon */}
                  <button
                    type="button"
                    title="Filter by Division or Office"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F5F4EF] hover:bg-[#EBE9E2] text-[#57534E] hover:text-[#18181B] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                  </button>

                  {/* 📊 Mode / Analytics icon */}
                  <button
                    type="button"
                    title="Toggle Analytics View"
                    onClick={() => navigate('/analytics/company')}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F5F4EF] hover:bg-[#EBE9E2] text-[#57534E] hover:text-[#18181B] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 🔍 Search Input */}
                <div className="relative flex-1 sm:flex-none flex items-center min-w-0 mx-1">
                  <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-full sm:w-36 md:w-44 pl-7 pr-2 py-1 text-xs text-[#18181B] placeholder:text-[#A8A29E] bg-transparent focus:outline-none transition-all"
                  />
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  {/* 🎛️ Filter Sliders icon */}
                  <button
                    type="button"
                    title="Filter options"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F5F4EF] hover:bg-[#EBE9E2] text-[#57534E] hover:text-[#18181B] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>

                  {/* ＋ Add New Action icon */}
                  <button
                    type="button"
                    title="Record Actual Deliverable"
                    onClick={() => navigate('/kpi/actuals')}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Month / Cycle Dropdown Pill */}
              <div className="relative self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setPeriodDropdownOpen(!periodDropdownOpen)}
                  className="bg-white rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 shadow-[0_4px_16px_rgba(24,24,27,0.04)] border border-[#E7E4DC] text-xs font-semibold text-[#18181B] flex items-center gap-2 hover:bg-[#FDFBF9] transition-colors cursor-pointer"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>{activePeriod?.name.split(' ')[1] || 'Q1 2026'}</span>
                  <ChevronDown className="w-3 h-3 text-[#78716C]" />
                </button>

                {periodDropdownOpen && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EFE4D7] p-2 z-30">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-[#A8A29E] uppercase">
                      Select Appraisal Period
                    </div>
                    {db.getPeriods().map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPeriodDropdownOpen(false)}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer ${
                          p.status === 'Active'
                            ? 'bg-[#FFEDD5] font-bold text-[#9A3412]'
                            : 'hover:bg-[#FDFBF9] text-[#57534E]'
                        }`}
                      >
                        {p.name} ({p.status})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Sub-Tabs Strip & Category Capsules Row (Touch-Scrollable on Mobile) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 pt-1 border-b border-[#EAE7DF] pb-3">
            {/* Contextual Sub-Menu Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 w-full lg:w-auto flex-nowrap">
              {headerInfo.subTabs.map((tab) => {
                const isActive = location.pathname === tab.path;
                return (
                  <Link
                    key={tab.label}
                    to={tab.path}
                    className={`text-xs px-3.5 sm:px-4 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#18181B] text-white font-semibold shadow-xs'
                        : 'bg-white/80 border border-[#E7E4DC] text-[#78716C] hover:text-[#18181B] hover:bg-white font-medium'
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>

            {/* Status Category Capsules matching Work day (yellow) / Truancy (black) / Vocation (gray) */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 w-full lg:w-auto flex-nowrap shrink-0">
              {headerInfo.capsules.map((cap) => (
                <div
                  key={cap.label}
                  className={`rounded-full px-3 sm:px-3.5 py-1 text-[11px] sm:text-xs font-semibold shadow-2xs flex items-center gap-1.5 shrink-0 ${cap.bg}`}
                >
                  <span className="opacity-80 font-normal">{cap.label}:</span>
                  <span className="font-extrabold">{cap.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Viewport Content */}
        <div className="w-full">
          <Outlet />
        </div>
      </main>

      {/* Clean Footer matching Crextio branding */}
      <footer className="no-print w-full max-w-[1700px] mx-auto px-4 sm:px-8 py-5 sm:py-6 text-xs text-[#A8A29E] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#EAE7DF] mt-8 sm:mt-12">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#EA580C] tracking-wide">Pervia PMS</span>
          <span>&bull;</span>
          <span>Empowering People. Elevating Performance.</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#78716C]">
          <span className="hover:text-[#18181B] cursor-pointer">PostgreSQL DDL</span>
          <span>&bull;</span>
          <span className="hover:text-[#18181B] cursor-pointer">7 Role Personas</span>
          <span>&bull;</span>
          <span className="hover:text-[#18181B] cursor-pointer">Confidential &bull; ISO 27001</span>
        </div>
      </footer>
    </div>
  );
};
