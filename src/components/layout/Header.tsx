import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  UserCheck,
  LogOut,
  Settings,
  ChevronDown,
  Database,
  Calendar,
  CheckCircle2,
  Shield,
  Sparkles,
  Menu,
  X,
  FileText,
  Sliders,
  Layers,
  Award,
  Users,
  LayoutDashboard,
  CheckSquare,
  DollarSign,
  Building2,
  Briefcase,
  Network,
  CalendarDays,
  CalendarCheck,
  GitFork,
  BookOpen,
  LineChart,
  Target,
  Users2,
  FileCheck2,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  Download,
  KeyRound,
  ShieldCheck,
  PieChart,
  Clock,
  AlertCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/database';
import { UserRole } from '../../types';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { PerviaLogo } from '../brand/PerviaLogo';

interface SubMenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  description: string;
  badge?: string;
}

interface NavCategory {
  id: string;
  label: string;
  href: string;
  matchPrefix: string;
  subItems: SubMenuItem[];
}

interface HeaderProps {
  onToggleMobileDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileDrawer }) => {
  const { user, role, switchRole, logout, availableRoles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth hover intent and transition handler so submenus don't vanish abruptly
  const handleMouseEnterItem = (id: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(id);
  };

  const handleMouseLeaveItem = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 240); // 240ms graceful window for natural mouse movement
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && !document.body.classList.contains('applet-maximized')) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement
          .requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch(() => {
            // Graceful fallback if top-level iframe blocks requestFullscreen
            document.body.classList.add('applet-maximized');
            setIsFullscreen(true);
          });
      } else {
        document.body.classList.add('applet-maximized');
        setIsFullscreen(true);
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      document.body.classList.remove('applet-maximized');
      setIsFullscreen(false);
    }
  };

  const notifications = db.getNotifications(user?.id);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingTasksCount = db.getTasks().filter((t) => t.status !== 'Completed').length;
  const activePeriod = db.getPeriods().find((p) => p.status === 'Active') || db.getPeriods()[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (targetRole: UserRole) => {
    switchRole(targetRole);
    setProfileMenuOpen(false);
  };

  const navCategories: NavCategory[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      matchPrefix: '/dashboard',
      subItems: [
        {
          name: 'Executive Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
          description: 'Real-time performance pulse & metrics telemetry',
        },
        {
          name: 'My Action Tasks',
          href: '/tasks',
          icon: CheckSquare,
          description: 'Approval milestones & sign-off queues',
          badge: pendingTasksCount > 0 ? `${pendingTasksCount} Tasks` : undefined,
        },
        {
          name: 'Notifications',
          href: '/notifications',
          icon: Bell,
          description: 'Cycle alerts & review requests',
          badge: unreadCount > 0 ? `${unreadCount} New` : undefined,
        },
      ],
    },
    {
      id: 'people',
      label: 'People',
      href: '/organization/employees',
      matchPrefix: '/organization',
      subItems: [
        {
          name: 'Employee Directory',
          href: '/organization/employees',
          icon: Users,
          description: 'Workforce list, talent dossier & profiles',
        },
        {
          name: 'Departments',
          href: '/organization/departments',
          icon: Building2,
          description: 'Operational divisions & staffing quotas',
        },
        {
          name: 'Positions & Job Roles',
          href: '/organization/positions',
          icon: Briefcase,
          description: 'Job families, level bands & competencies',
        },
        {
          name: 'Organization Chart',
          href: '/organization/chart',
          icon: Network,
          description: 'Interactive company hierarchy & tree',
        },
      ],
    },
    {
      id: 'cycles',
      label: 'Cycles',
      href: '/cycle/periods',
      matchPrefix: '/cycle',
      subItems: [
        {
          name: 'Evaluation Periods',
          href: '/cycle/periods',
          icon: CalendarDays,
          description: 'Configurable review schedules',
        },
        {
          name: 'Evaluation Calendar',
          href: '/cycle/calendar',
          icon: CalendarCheck,
          description: 'Milestones & appraisal deadline matrix',
        },
        {
          name: 'Review Workflow',
          href: '/cycle/workflow',
          icon: GitFork,
          description: 'Multi-stage approval pipeline stages',
        },
        {
          name: 'Period Archives',
          href: '/cycle/history',
          icon: Clock,
          description: 'Historical cycle score logs & reports',
        },
      ],
    },
    {
      id: 'kpis',
      label: 'KPIs',
      href: '/kpi/actuals',
      matchPrefix: '/kpi',
      subItems: [
        {
          name: 'Actual Performance',
          href: '/kpi/actuals',
          icon: LineChart,
          description: 'Metric deliverables & dynamic score formulas',
        },
        {
          name: 'KPI Library',
          href: '/kpi/library',
          icon: BookOpen,
          description: 'Standard corporate metric definitions catalog',
        },
        {
          name: 'Target Management',
          href: '/kpi/targets',
          icon: Target,
          description: 'Department & role KPI assignment quotas',
        },
        {
          name: 'Evidence Audit',
          href: '/kpi/evidence',
          icon: ShieldCheck,
          description: 'Verifiable document attachments & audit trail',
        },
      ],
    },
    {
      id: 'assessment',
      label: 'Salary & Eval',
      href: '/assessment/final',
      matchPrefix: '/assessment',
      subItems: [
        {
          name: 'Final Performance Evaluation',
          href: '/assessment/final',
          icon: FileCheck2,
          description: 'Composite rating sign-off (KPI, Comp, Behav, 360)',
          badge: '60% KPI',
        },
        {
          name: 'Printable Appraisal Dossier',
          href: '/assessment/dossier',
          icon: FileText,
          description: 'Official PDF appraisal format & digital signatures',
          badge: 'PDF Print',
        },
        {
          name: 'Salary & Incentive Simulator',
          href: '/assessment/salary-simulator',
          icon: DollarSign,
          description: 'Merit matrix calculations & bonus pool allocation',
          badge: 'Merit Sim',
        },
        {
          name: 'Talent Calibration (9-Box Grid)',
          href: '/assessment/calibration',
          icon: Sparkles,
          description: 'Performance vs Potential 9-box calibration',
        },
        {
          name: '360-Degree Feedback',
          href: '/assessment/360-feedback',
          icon: Users2,
          description: 'Multi-rater peer & subordinate feedback',
        },
        {
          name: 'Supervisor Assessment',
          href: '/assessment/supervisor',
          icon: Target,
          description: 'Manager evaluation & qualitative feedback',
        },
        {
          name: 'Self Assessment',
          href: '/assessment/self',
          icon: Award,
          description: 'Employee self-reflection & rating submission',
        },
      ],
    },
    {
      id: 'development',
      label: 'Development',
      href: '/development/coaching',
      matchPrefix: '/development',
      subItems: [
        {
          name: 'Coaching Records',
          href: '/development/coaching',
          icon: TrendingUp,
          description: '1-on-1 mentorship logs & manager notes',
        },
        {
          name: 'Development Plan (IDP)',
          href: '/development/plan',
          icon: Target,
          description: 'Growth goals, skill roadmaps & training',
        },
        {
          name: 'Performance Improvement (PIP)',
          href: '/development/pip',
          icon: AlertCircle,
          description: 'Structured remedial plans & monitoring',
        },
      ],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/analytics/company',
      matchPrefix: '/analytics',
      subItems: [
        {
          name: 'Company Performance',
          href: '/analytics/company',
          icon: BarChart3,
          description: 'Enterprise executive summary & ratings',
        },
        {
          name: 'Department Analytics',
          href: '/analytics/department',
          icon: Building2,
          description: 'Division scorecards & quota benchmarks',
        },
        {
          name: '9-Box Talent Matrix',
          href: '/analytics/talent-matrix',
          icon: Layers,
          description: 'Interactive performance vs potential grid & succession',
          badge: 'Matrix',
        },
        {
          name: 'Competency Gap Analysis',
          href: '/analytics/competency',
          icon: Target,
          description: 'Proficiency matrix vs role requirements',
        },
        {
          name: 'Rating Distribution',
          href: '/analytics/distribution',
          icon: PieChart,
          description: 'Bell-curve normalizations & grade bands',
        },
      ],
    },
    {
      id: 'data',
      label: 'Data',
      href: '/data/import',
      matchPrefix: '/data',
      subItems: [
        {
          name: 'Import Excel Spreadsheet',
          href: '/data/import',
          icon: FileSpreadsheet,
          description: 'Bulk employee & target ingest (.xlsx, .csv)',
        },
        {
          name: 'Export Performance Data',
          href: '/data/export',
          icon: Download,
          description: 'Full appraisal dossiers & analytics export',
        },
        {
          name: 'API & HRIS Integration',
          href: '/data/api',
          icon: KeyRound,
          description: 'Webhooks & enterprise connector tokens',
        },
      ],
    },
    {
      id: 'settings',
      label: 'Setting',
      href: '/settings/company',
      matchPrefix: '/settings',
      subItems: [
        {
          name: 'Company Profile & Settings',
          href: '/settings/company',
          icon: Settings,
          description: 'Branding, timezone, and fiscal calendar defaults',
        },
        {
          name: 'Roles & Permissions',
          href: '/settings/roles',
          icon: ShieldCheck,
          description: 'RBAC 7-role permissions & access control',
        },
        {
          name: 'User Management',
          href: '/settings/users',
          icon: Users,
          description: 'Employee logins, status & department assignees',
        },
        {
          name: 'Database Schema (PostgreSQL DDL)',
          href: '/settings/database',
          icon: Database,
          description: '38 relational tables, constraints & RLS status',
        },
        {
          name: 'Audit Trail Logs',
          href: '/settings/audit',
          icon: FileText,
          description: 'Compliance logging of changes, approvals & edits',
        },
      ],
    },
  ];

  // Filter and customize navigation categories based on the user's active role permissions matrix
  const getRoleFilteredNavCategories = (): NavCategory[] => {
    const currentRole = role || 'Employee';

    return navCategories
      .filter((cat) => {
        if (currentRole === 'Super Admin') return true;
        if (currentRole === 'HR Admin') return cat.id !== 'settings';
        if (currentRole === 'HR Manager') return !['data', 'settings'].includes(cat.id);
        if (currentRole === 'Department Manager')
          return ['dashboard', 'people', 'kpis', 'assessment', 'development', 'analytics'].includes(cat.id);
        if (currentRole === 'Supervisor')
          return ['dashboard', 'people', 'kpis', 'assessment', 'development'].includes(cat.id);
        if (currentRole === 'Employee')
          return ['dashboard', 'kpis', 'assessment', 'development'].includes(cat.id);
        if (currentRole === 'Reviewer') return ['dashboard', 'assessment'].includes(cat.id);
        return true;
      })
      .map((cat) => {
        // Employee persona custom labels & routes
        if (currentRole === 'Employee') {
          if (cat.id === 'kpis') {
            return {
              ...cat,
              label: 'My KPIs',
              subItems: [
                {
                  name: 'My Actual Deliverables',
                  href: '/kpi/actuals',
                  icon: LineChart,
                  description: 'Record metric deliverables & evidence progress',
                },
                {
                  name: 'Upload Evidence Audit',
                  href: '/kpi/evidence',
                  icon: ShieldCheck,
                  description: 'Attach certificates, files & audit receipts',
                },
                {
                  name: 'My Assigned Targets',
                  href: '/kpi/targets',
                  icon: Target,
                  description: 'View Q1 goals and weight allocations (60% KPI)',
                },
              ],
            };
          }
          if (cat.id === 'assessment') {
            return {
              ...cat,
              label: 'My Assessment',
              subItems: [
                {
                  name: 'Self-Evaluation Form',
                  href: '/assessment/self',
                  icon: Award,
                  description: 'Fill self-ratings, reflection & achievements',
                },
                {
                  name: 'Peer 360 Feedback (Given)',
                  href: '/assessment/360-feedback',
                  icon: Users2,
                  description: 'Provide constructive feedback for teammates',
                },
                {
                  name: 'My Final Scorecard',
                  href: '/assessment/final',
                  icon: FileCheck2,
                  description: 'View calibrated performance score & bonus band',
                },
              ],
            };
          }
          if (cat.id === 'development') {
            return {
              ...cat,
              label: 'Growth & IDP',
              subItems: [
                {
                  name: 'Individual Development (IDP)',
                  href: '/development/plan',
                  icon: Target,
                  description: 'My career path roadmap, AWS certifications & skills',
                },
                {
                  name: 'My Coaching Notes',
                  href: '/development/coaching',
                  icon: TrendingUp,
                  description: 'Mentorship action items & 1-on-1 discussion logs',
                },
              ],
            };
          }
        }

        // Reviewer persona custom labels & routes
        if (currentRole === 'Reviewer') {
          if (cat.id === 'assessment') {
            return {
              ...cat,
              label: 'Peer 360 Reviews',
              subItems: [
                {
                  name: 'Pending 360 Feedback Requests',
                  href: '/assessment/360-feedback',
                  icon: Users2,
                  description: 'Respond anonymously to peer evaluations',
                  badge: '3 Waiting',
                },
              ],
            };
          }
        }

        // Supervisor persona custom labels & routes
        if (currentRole === 'Supervisor') {
          if (cat.id === 'people') {
            return {
              ...cat,
              label: 'My Team',
              subItems: [
                {
                  name: 'Team Member Dossiers',
                  href: '/organization/employees',
                  icon: Users,
                  description: 'Direct reports roster & competencies',
                },
                {
                  name: 'Team Org Tree',
                  href: '/organization/chart',
                  icon: Network,
                  description: 'Reporting lines & hierarchy',
                },
              ],
            };
          }
          if (cat.id === 'kpis') {
            return {
              ...cat,
              label: 'Team Deliverables',
              subItems: [
                {
                  name: 'Verify Evidence & Proofs',
                  href: '/kpi/evidence',
                  icon: ShieldCheck,
                  description: 'Approve or reject employee metric claims',
                  badge: '4 New',
                },
                {
                  name: 'Team Actual Deliverables',
                  href: '/kpi/actuals',
                  icon: LineChart,
                  description: 'View real-time score calculations',
                },
              ],
            };
          }
          if (cat.id === 'assessment') {
            return {
              ...cat,
              label: 'Supervisor Reviews',
              subItems: [
                {
                  name: 'Conduct Supervisor Appraisal',
                  href: '/assessment/supervisor',
                  icon: Target,
                  description: 'Manager qualitative ratings & recommendation',
                },
                {
                  name: 'Composite Sign-off Review',
                  href: '/assessment/final',
                  icon: FileCheck2,
                  description: 'Sign off final employee appraisals',
                },
              ],
            };
          }
          if (cat.id === 'development') {
            return {
              ...cat,
              label: 'Coaching & PIP',
              subItems: [
                {
                  name: '1-on-1 Coaching Logs',
                  href: '/development/coaching',
                  icon: TrendingUp,
                  description: 'Log mentoring notes & mutual commitments',
                },
                {
                  name: 'Remedial (PIP) Monitoring',
                  href: '/development/pip',
                  icon: AlertCircle,
                  description: 'Track at-risk performance milestones',
                },
              ],
            };
          }
        }

        // Department Manager persona custom labels
        if (currentRole === 'Department Manager') {
          if (cat.id === 'people') {
            return {
              ...cat,
              label: 'Department Team',
              subItems: [
                {
                  name: 'Department Employees',
                  href: '/organization/employees',
                  icon: Users,
                  description: 'Staffing directory & headcounts',
                },
                {
                  name: 'Job Roles & Bands',
                  href: '/organization/positions',
                  icon: Briefcase,
                  description: 'Level IC1-IC6 distribution',
                },
              ],
            };
          }
          if (cat.id === 'analytics') {
            return {
              ...cat,
              label: 'Dept Scorecard',
              subItems: [
                {
                  name: 'Department Analytics',
                  href: '/analytics/department',
                  icon: Building2,
                  description: 'Division benchmark & achievement index',
                },
                {
                  name: 'Competency Gap Matrix',
                  href: '/analytics/competency',
                  icon: Target,
                  description: 'Department skill deficiency analysis',
                },
              ],
            };
          }
        }

        return cat;
      });
  };

  const activeNavCategories = getRoleFilteredNavCategories();

  return (
    <header className="sticky top-0 z-50 w-full max-w-full bg-[#F6F5F0]/95 backdrop-blur-md border-b border-[#E7E4DC] shadow-[0_4px_20px_rgba(24,24,27,0.03)] px-3 sm:px-4 xl:px-6 py-2 transition-all">
      <div className="w-full max-w-[1750px] mx-auto flex items-center justify-between gap-2 xl:gap-4">
        {/* Left: Official Pervia Brand Logo (Compact & Non-colliding) */}
        <div className="flex items-center gap-2 shrink-0 z-10">
          <Link to="/dashboard" className="flex items-center gap-1.5 group">
            <PerviaLogo size="md" compact showText={true} />
          </Link>
        </div>

        {/* Center Desktop: Floating Pill Capsule Menu Bar (Isolated with clearance & overflow-visible for floating submenus) */}
        <div className="hidden xl:flex flex-1 items-center justify-center px-1 2xl:px-3 min-w-0" ref={navContainerRef}>
          <nav className="bg-[#EBE9E2] border border-[#DDD9CE] rounded-full p-0.5 xl:p-1 flex items-center gap-0.5 shadow-xs whitespace-nowrap shrink-0">
            {activeNavCategories.map((cat) => {
              const isCatActive =
                cat.id === 'dashboard'
                  ? location.pathname === '/dashboard' ||
                    location.pathname === '/' ||
                    location.pathname.startsWith('/tasks') ||
                    location.pathname.startsWith('/notifications')
                  : cat.id === 'settings'
                  ? location.pathname.startsWith('/settings') || location.pathname.startsWith('/admin')
                  : location.pathname.startsWith(cat.matchPrefix);
              const isOpen = activeDropdown === cat.id;
              const isRightAligned = cat.id === 'settings' || cat.id === 'data';

              return (
                <div
                  key={cat.id}
                  className="relative shrink-0"
                  onMouseEnter={() => handleMouseEnterItem(cat.id)}
                  onMouseLeave={handleMouseLeaveItem}
                >
                  <button
                    type="button"
                    onClick={() => {
                      navigate(cat.href);
                      setActiveDropdown(null);
                    }}
                    className={`text-[11px] 2xl:text-xs rounded-full px-2 2xl:px-2.5 py-1 2xl:py-1.5 transition-all flex items-center gap-1 shrink-0 cursor-pointer whitespace-nowrap ${
                      isCatActive
                        ? 'bg-[#18181B] text-white shadow-xs font-bold'
                        : isOpen
                        ? 'bg-[#DDD9CE] text-[#18181B] font-bold shadow-2xs'
                        : 'text-[#57534E] hover:text-[#18181B] hover:bg-[#DDD9CE]/60 font-semibold'
                    }`}
                  >
                    {cat.id === 'settings' && <Settings className="w-3 h-3 shrink-0" />}
                    <span>{cat.label}</span>
                    <ChevronDown
                      className={`w-2.5 h-2.5 transition-transform duration-200 shrink-0 ${
                        isCatActive
                          ? isOpen ? 'rotate-180 text-white' : 'text-white/80'
                          : isOpen
                          ? 'rotate-180 text-[#18181B]'
                          : 'text-[#78716C]'
                      }`}
                    />
                  </button>

                  {/* Dropdown Card with hover bridge */}
                  {isOpen && (
                    <div
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleMouseLeaveItem}
                      className={`absolute ${
                        cat.id === 'dashboard' || cat.id === 'people'
                          ? 'left-0'
                          : isRightAligned
                          ? 'right-0'
                          : 'left-1/2 -translate-x-1/2'
                      } pt-2 z-50 animate-in fade-in zoom-in-95`}
                    >
                      {/* Invisible hover bridge connecting button and dropdown */}
                      <div className="absolute -top-3 left-0 right-0 h-4 bg-transparent pointer-events-auto" />

                      <div className="w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-[#EFE4D7] p-2.5">
                        <div className="px-3.5 py-2 border-b border-[#F5EFE6] flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider block">
                            {cat.label} Modules
                          </span>
                          <Link
                            to={cat.href}
                            onClick={() => setActiveDropdown(null)}
                            className="text-[11px] font-bold text-[#EA580C] hover:underline"
                          >
                            View Main &rarr;
                          </Link>
                        </div>

                        <div className="py-1.5 space-y-1">
                          {cat.subItems.map((sub) => {
                            const Icon = sub.icon;
                            const isSubActive = location.pathname === sub.href;

                            return (
                              <Link
                                key={sub.name}
                                to={sub.href}
                                onClick={() => setActiveDropdown(null)}
                                className={`flex items-start gap-3 p-2.5 rounded-2xl transition-all cursor-pointer ${
                                  isSubActive
                                    ? 'bg-[#FFEDD5] text-[#9A3412] font-bold'
                                    : 'hover:bg-[#FDFBF9] text-[#57534E] hover:text-[#18181B]'
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                    isSubActive
                                      ? 'bg-[#EA580C] text-white shadow-xs'
                                      : 'bg-[#F5EFE6] text-[#78716C]'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-bold leading-tight truncate">
                                      {sub.name}
                                    </span>
                                    {sub.badge && (
                                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#EA580C] text-white shrink-0">
                                        {sub.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-[#A8A29E] mt-0.5 leading-snug truncate">
                                    {sub.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Right Desktop: Dedicated Fullscreen, Notifications & Profile Section (Always pinned & visible) */}
        <div className="hidden xl:flex items-center justify-end gap-2 shrink-0 z-10 pl-1">
          {/* Action Tools Pill Wrapper (Fullscreen + Notifications) */}
          <div className="flex items-center gap-1 p-0.5 bg-white border border-[#DDD9CE] rounded-full shadow-2xs">
            {/* Fullscreen Toggle Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isFullscreen
                  ? 'bg-[#FFEDD5] text-[#EA580C]'
                  : 'hover:bg-[#F5F4EF] text-[#57534E] hover:text-[#18181B]'
              }`}
              title={isFullscreen ? 'Keluar Mode Layar Penuh (Esc)' : 'Perbesar Halaman (Full Screen)'}
              aria-label="Toggle Full Screen"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5 text-[#EA580C]" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5 text-[#292524]" />
              )}
            </button>

            {/* Notification Bell Circle Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="w-8 h-8 rounded-full hover:bg-[#F5F4EF] flex items-center justify-center text-[#18181B] relative transition-colors cursor-pointer"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-3.5 h-3.5 text-[#292524]" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#EA580C] text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* User Profile Dedicated Capsule Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 bg-white border border-[#DDD9CE] hover:border-[#EA580C]/50 rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
              title={`${user?.fullName || 'Davis Levin'} (${role || 'Admin'})`}
            >
              <img
                src={
                  user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'
                }
                alt={user?.fullName || 'Davis Levin'}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-[#EA580C]/20 group-hover:scale-105 transition-transform"
              />
              <div className="text-left hidden 2xl:block leading-tight max-w-[100px]">
                <span className="text-xs font-bold text-[#18181B] block truncate">
                  {user?.fullName || 'Davis Levin'}
                </span>
                <span className="text-[10px] text-[#78716C] font-medium block truncate">
                  {role || 'Administrator'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2 py-0.5 rounded-full 2xl:hidden">
                {(role || 'Admin').split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-[#78716C] group-hover:text-[#EA580C] transition-colors" />
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Header Controls (Visible below XL screens) */}
        <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Active Cycle Badge on small screens */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-[#EBE9E2] border border-[#DDD9CE] rounded-full text-[10px] font-bold text-[#57534E]">
            <Calendar className="w-3 h-3 text-[#EA580C]" />
            <span>Q1 2026</span>
          </div>

          {/* Fullscreen Toggle on Mobile */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#DDD9CE] flex items-center justify-center text-[#57534E] hover:text-[#18181B] cursor-pointer"
            aria-label="Toggle Full Screen"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5 text-[#292524]" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5 text-[#292524]" />
            )}
          </button>

          {/* Notifications Button on Mobile */}
          <button
            type="button"
            onClick={() => setNotifMenuOpen(!notifMenuOpen)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-[#DDD9CE] flex items-center justify-center text-[#18181B] relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#292524]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#EA580C] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Persona / Role Pill Button on Mobile */}
          <button
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-1 p-0.5 sm:p-1 pl-1 pr-2 bg-white rounded-full border border-[#DDD9CE] cursor-pointer"
          >
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'
              }
              alt={user?.fullName || 'User Profile'}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
            />
            <span className="text-[9px] sm:text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-1.5 sm:px-2 py-0.5 rounded-full truncate max-w-[65px] sm:max-w-none">
              {(role || 'Admin').split(' ')[0]}
            </span>
          </button>

          {/* Mobile Menu Pill Drawer Button */}
          <button
            type="button"
            onClick={onToggleMobileDrawer}
            className="bg-[#18181B] hover:bg-[#27272A] text-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Floating Notifications Popover (Shared for desktop and mobile) */}
      {notifMenuOpen && (
        <div
          ref={notifMenuRef}
          className="fixed sm:absolute top-16 sm:top-auto right-3 sm:right-8 mt-2 w-[calc(100vw-24px)] sm:w-80 bg-white rounded-3xl shadow-2xl border border-[#EFE4D7] p-2.5 z-50 animate-in fade-in zoom-in-95"
        >
          <div className="px-3.5 py-2 border-b border-[#F5EFE6] flex items-center justify-between">
            <span className="text-xs font-bold text-[#292524] uppercase tracking-wider">
              Notifications
            </span>
            <span className="text-[11px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[#F5EFE6] py-1 text-xs">
            {notifications.slice(0, 4).map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  db.markNotificationRead(n.id);
                  setNotifMenuOpen(false);
                  if (n.link) navigate(n.link);
                }}
                className={`p-3 rounded-2xl hover:bg-[#FDFBF9] cursor-pointer transition-colors ${
                  !n.read ? 'bg-[#FFF7ED]' : ''
                }`}
              >
                <p className="font-bold text-[#292524]">{n.title}</p>
                <p className="text-[#78716C] text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
              </div>
            ))}
          </div>

          <div className="p-2 border-t border-[#F5EFE6] text-center">
            <button
              onClick={() => {
                setNotifMenuOpen(false);
                navigate('/notifications');
              }}
              className="text-xs text-[#EA580C] font-bold hover:underline cursor-pointer"
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}

      {/* Floating Profile & Role Popover (Shared for desktop and mobile) */}
      {profileMenuOpen && (
        <div
          ref={profileMenuRef}
          className="fixed sm:absolute top-16 sm:top-auto right-3 sm:right-8 mt-2 w-[calc(100vw-24px)] sm:w-72 bg-white rounded-3xl shadow-2xl border border-[#EFE4D7] p-3 z-50 animate-in fade-in zoom-in-95"
        >
          <div className="p-3 bg-[#FDFBF9] rounded-2xl border border-[#F5EFE6] flex items-center gap-3">
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'
              }
              alt={user?.fullName}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border border-[#EFE4D7]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-[#292524] truncate">
                {user?.fullName || 'Davis Levin'}
              </p>
              <p className="text-[11px] text-[#78716C] truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-[#FFEDD5] text-[#C2410C] text-[9px] font-black rounded-full uppercase">
                {role}
              </span>
            </div>
          </div>

          {/* Persona Switcher Section */}
          <div className="mt-3 pt-2 border-t border-[#F5EFE6]">
            <div className="px-2 pb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider">
                Switch Role Persona
              </span>
              <Shield className="w-3.5 h-3.5 text-[#EA580C]" />
            </div>

            <div className="max-h-44 overflow-y-auto space-y-1 py-1">
              {availableRoles.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => {
                    handleRoleChange(item.role);
                    setProfileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    role === item.role
                      ? 'bg-[#FFEDD5] font-bold text-[#9A3412]'
                      : 'text-[#57534E] hover:bg-[#FDFBF9]'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{item.role}</p>
                    <p className="text-[10px] text-[#A8A29E]">{item.name}</p>
                  </div>
                  {role === item.role && <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-[#F5EFE6] space-y-1">
            <Link
              to="/organization/employees"
              onClick={() => setProfileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-xs text-[#57534E] hover:bg-[#FDFBF9] rounded-xl transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Employee Dossier</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setProfileMenuOpen(false);
                logout();
                navigate('/login');
              }}
              className="w-full text-left px-3 py-2 text-xs text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl flex items-center gap-2 font-semibold cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
