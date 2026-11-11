import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Bell,
  Users,
  Building2,
  Briefcase,
  Network,
  CalendarDays,
  CalendarCheck,
  GitFork,
  BookOpen,
  LineChart,
  Target,
  Award,
  Sparkles,
  Users2,
  FileCheck2,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  Download,
  KeyRound,
  ShieldCheck,
  Settings2,
  Database,
  ChevronDown,
  ChevronRight,
  Search,
  Zap,
  X,
  Layers,
  Shield,
  CheckCircle2,
  Clock,
  PieChart,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { db } from '../../lib/database';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  description?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{ isOpen: boolean; onCloseMobile?: () => void }> = ({
  isOpen,
  onCloseMobile,
}) => {
  const { user, role, switchRole, availableRoles } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'PERFORMANCE CYCLE': false,
    'KPI MANAGEMENT': false,
    'ASSESSMENT & SALARY': false,
    DEVELOPMENT: true,
    'ANALYTICS & REPORTS': true,
    'DATA MANAGEMENT': true,
    'SYSTEM ADMINISTRATION': true,
  });

  const unreadCount = db.getNotifications(user?.id).filter((n) => !n.read).length;
  const pendingTasksCount = db.getTasks().filter((t) => t.status !== 'Completed').length;

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Executive performance pulse' },
        {
          name: 'My Tasks',
          href: '/tasks',
          icon: CheckSquare,
          badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
          description: 'Approvals & milestones',
        },
        {
          name: 'Notifications',
          href: '/notifications',
          icon: Bell,
          badge: unreadCount > 0 ? unreadCount : undefined,
          description: 'Appraisal cycle alerts',
        },
      ],
    },
    {
      title: 'ORGANIZATION',
      items: [
        { name: 'Employee Directory', href: '/organization/employees', icon: Users, description: 'Workforce dossiers' },
        { name: 'Departments', href: '/organization/departments', icon: Building2, description: 'Divisions & quotas' },
        { name: 'Positions', href: '/organization/positions', icon: Briefcase, description: 'Titles & level bands' },
        { name: 'Org Chart', href: '/organization/chart', icon: Network, description: 'Hierarchy visualizer' },
      ],
    },
    {
      title: 'PERFORMANCE CYCLE',
      items: [
        { name: 'Evaluation Periods', href: '/cycle/periods', icon: CalendarDays, description: 'Quarter & annual cycles' },
        { name: 'Evaluation Calendar', href: '/cycle/calendar', icon: CalendarCheck, description: 'Cutoffs & milestones' },
        { name: 'Review Workflow', href: '/cycle/workflow', icon: GitFork, description: 'Multi-stage approvals' },
        { name: 'Period Archives', href: '/cycle/history', icon: Clock, description: 'Historical appraisal cycles' },
      ],
    },
    {
      title: 'KPI MANAGEMENT',
      items: [
        { name: 'Actual Performance', href: '/kpi/actuals', icon: LineChart, description: 'Deliverable tracking' },
        { name: 'KPI Library', href: '/kpi/library', icon: BookOpen, description: 'Corporate KPI catalog' },
        { name: 'Target Management', href: '/kpi/targets', icon: Target, description: 'Weight allocations' },
        { name: 'Evidence Audit', href: '/kpi/evidence', icon: ShieldCheck, description: 'Proof attachments' },
      ],
    },
    {
      title: 'ASSESSMENT & SALARY',
      items: [
        { name: 'Final Evaluation', href: '/assessment/final', icon: FileCheck2, badge: '60% KPI', description: 'Composite scoring' },
        { name: 'Appraisal Dossier', href: '/assessment/dossier', icon: FileText, badge: 'PDF', description: 'Official printable dossier' },
        { name: 'Calibration (9-Box)', href: '/assessment/calibration', icon: Sparkles, description: 'Bell-curve & 9-box matrix' },
        { name: '360 Feedback', href: '/assessment/360-feedback', icon: Users2, description: 'Peer & subordinate review' },
        { name: 'Supervisor Review', href: '/assessment/supervisor', icon: Target, description: 'Manager evaluation' },
        { name: 'Self Assessment', href: '/assessment/self', icon: Award, description: 'Individual submission' },
      ],
    },
    {
      title: 'DEVELOPMENT',
      items: [
        { name: 'Coaching Records', href: '/development/coaching', icon: TrendingUp, description: 'Mentorship records' },
        { name: 'Development Plan', href: '/development/plan', icon: Target, description: 'IDP skill goals' },
        { name: 'PIP Records', href: '/development/pip', icon: AlertCircle, description: 'Improvement plans' },
      ],
    },
    {
      title: 'ANALYTICS & REPORTS',
      items: [
        { name: 'Company Report', href: '/analytics/company', icon: BarChart3, description: 'Executive summary' },
        { name: 'Department Report', href: '/analytics/department', icon: Building2, description: 'Division scorecards' },
        { name: '9-Box Talent Matrix', href: '/analytics/talent-matrix', icon: Layers, badge: 'Matrix', description: 'Performance vs Potential grid' },
        { name: 'Competency Gap', href: '/analytics/competency', icon: Target, description: 'Skills matrix radar' },
        { name: 'Rating Distribution', href: '/analytics/distribution', icon: PieChart, description: 'Quota distribution' },
      ],
    },
    {
      title: 'DATA MANAGEMENT',
      items: [
        { name: 'Import Excel', href: '/data/import', icon: FileSpreadsheet, description: 'Bulk file ingest' },
        { name: 'Export Data', href: '/data/export', icon: Download, description: 'Reports extraction' },
        { name: 'API Integration', href: '/data/api', icon: KeyRound, description: 'HRIS connectors' },
      ],
    },
    {
      title: 'SYSTEM ADMINISTRATION',
      items: [
        { name: 'Company Settings', href: '/settings/company', icon: Settings2, description: 'System parameters' },
        { name: 'Roles & Permissions', href: '/settings/roles', icon: ShieldCheck, description: '7-role RBAC security' },
        { name: 'User Management', href: '/settings/users', icon: Users, description: 'Accounts & logins' },
        { name: 'Database & Schema', href: '/settings/database', icon: Database, description: '38 tables & RLS' },
        { name: 'Audit Trail Logs', href: '/settings/audit', icon: ShieldCheck, description: 'Compliance tracking' },
      ],
    },
  ];

  const getRoleFilteredSections = (): NavSection[] => {
    const currentRole = role || 'Employee';
    return sections
      .filter((sec) => {
        if (currentRole === 'Super Admin') return true;
        if (currentRole === 'HR Admin') return sec.title !== 'SYSTEM ADMINISTRATION';
        if (currentRole === 'HR Manager') return !['DATA MANAGEMENT', 'SYSTEM ADMINISTRATION'].includes(sec.title);
        if (currentRole === 'Department Manager')
          return !['PERFORMANCE CYCLE', 'DATA MANAGEMENT', 'SYSTEM ADMINISTRATION'].includes(sec.title);
        if (currentRole === 'Supervisor')
          return !['PERFORMANCE CYCLE', 'ANALYTICS & REPORTS', 'DATA MANAGEMENT', 'SYSTEM ADMINISTRATION'].includes(sec.title);
        if (currentRole === 'Employee')
          return ['OVERVIEW', 'KPI MANAGEMENT', 'ASSESSMENT & SALARY', 'DEVELOPMENT'].includes(sec.title);
        if (currentRole === 'Reviewer') return ['OVERVIEW', 'ASSESSMENT & SALARY'].includes(sec.title);
        return true;
      })
      .map((sec) => {
        if (currentRole === 'Employee') {
          if (sec.title === 'KPI MANAGEMENT') {
            return {
              ...sec,
              title: 'MY KPIS & GOALS',
              items: sec.items.filter((i) => ['/kpi/actuals', '/kpi/evidence', '/kpi/targets'].includes(i.href)),
            };
          }
          if (sec.title === 'ASSESSMENT & SALARY') {
            return {
              ...sec,
              title: 'MY ASSESSMENTS',
              items: sec.items.filter((i) => ['/assessment/self', '/assessment/360-feedback', '/assessment/final'].includes(i.href)),
            };
          }
          if (sec.title === 'DEVELOPMENT') {
            return {
              ...sec,
              title: 'MY GROWTH & IDP',
              items: sec.items.filter((i) => ['/development/plan', '/development/coaching'].includes(i.href)),
            };
          }
        }
        if (currentRole === 'Reviewer') {
          if (sec.title === 'ASSESSMENT & SALARY') {
            return {
              ...sec,
              title: 'PEER 360 REVIEWS',
              items: sec.items.filter((i) => i.href === '/assessment/360-feedback'),
            };
          }
        }
        return sec;
      });
  };

  const filteredSections = getRoleFilteredSections();

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with touch dismiss */}
      <div
        className="fixed inset-0 bg-[#18181B]/50 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onCloseMobile}
      />

      {/* Slide-over Drawer Panel */}
      <aside className="fixed top-0 bottom-0 left-0 z-50 w-full max-w-[340px] sm:max-w-md bg-[#FDFBF9] text-[#18181B] border-r border-[#EFE4D7] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out animate-in slide-in-from-left">
        {/* Mobile Drawer Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#F5EFE6] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] flex items-center justify-center text-white shadow-xs">
              <span className="font-black text-white text-base">P</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-[#18181B] tracking-tight block leading-none font-sans">
                Pervia
              </span>
              <span className="text-[10px] text-[#EA580C] font-bold block uppercase tracking-wider mt-0.5">
                All 38 Enterprise Modules
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="w-8 h-8 rounded-full bg-[#F5EFE6] hover:bg-[#EFE4D7] flex items-center justify-center text-[#78716C] hover:text-[#18181B] transition-colors cursor-pointer"
            aria-label="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card & 1-Tap Persona Role Switcher for Mobile */}
        <div className="p-3 bg-[#FAF6F0] border-b border-[#F5EFE6]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  user?.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'
                }
                alt={user?.fullName}
                className="w-9 h-9 rounded-2xl object-cover border border-[#EFE4D7] shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#18181B] truncate">{user?.fullName}</p>
                <span className="inline-block px-2 py-0.2 rounded-full bg-[#FFEDD5] text-[#C2410C] text-[9px] font-black uppercase">
                  {role}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="text-[10px] font-bold text-[#EA580C] bg-white border border-[#EFE4D7] px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer shrink-0 shadow-2xs"
            >
              <Shield className="w-3 h-3 text-[#EA580C]" />
              <span>Switch Role</span>
            </button>
          </div>

          {/* Inline Role Persona Selector on Mobile */}
          {roleSwitcherOpen && (
            <div className="mt-3 pt-2.5 border-t border-[#EAE0D3] space-y-1 animate-in fade-in">
              <span className="text-[9px] font-bold text-[#A8A29E] uppercase tracking-wider block px-1">
                Select Active Testing Persona:
              </span>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {availableRoles.map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => {
                      switchRole(item.role);
                      setRoleSwitcherOpen(false);
                    }}
                    className={`text-left px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer truncate ${
                      role === item.role
                        ? 'bg-[#18181B] text-white shadow-xs'
                        : 'bg-white hover:bg-[#F0E6DA] text-[#57534E] border border-[#EFE4D7]'
                    }`}
                  >
                    {item.role}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Search */}
        <div className="px-4 py-2.5 bg-white border-b border-[#F5EFE6]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-2.5 text-[#A8A29E]" />
            <input
              type="text"
              placeholder="Search all 38 modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF6F0] text-xs text-[#18181B] placeholder:text-[#A8A29E] rounded-full pl-9 pr-4 py-2 border border-[#EFE4D7] focus:border-[#EA580C] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFEDD5] transition-all"
            />
          </div>
        </div>

        {/* Navigation Section Accordion List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
          {filteredSections.map((section) => {
            const filteredItems = section.items.filter(
              (item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );

            if (filteredItems.length === 0) return null;

            const isCollapsed = collapsedSections[section.title] && !searchQuery;

            return (
              <div key={section.title} className="bg-white rounded-2xl border border-[#EFE4D7] p-1.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold text-[#A8A29E] tracking-wider uppercase hover:text-[#18181B] transition-colors cursor-pointer"
                >
                  <span>{section.title}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-normal text-[#C5BFB5] lowercase">
                      {filteredItems.length} items
                    </span>
                    {isCollapsed ? (
                      <ChevronRight className="w-3 h-3 text-[#A8A29E]" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-[#A8A29E]" />
                    )}
                  </div>
                </button>

                {!isCollapsed && (
                  <div className="space-y-0.5 pt-1">
                    {filteredItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.href;

                      return (
                        <NavLink
                          key={item.href}
                          to={item.href}
                          onClick={onCloseMobile}
                          className={cn(
                            'group flex items-center justify-between px-3 py-2 rounded-xl transition-all',
                            isActive
                              ? 'bg-[#18181B] text-white font-bold shadow-xs'
                              : 'text-[#57534E] hover:bg-[#FAF6F0] hover:text-[#18181B]'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isActive ? 'bg-[#EA580C] text-white' : 'bg-[#FAF6F0] text-[#78716C]'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5 shrink-0" />
                            </div>
                            <div className="min-w-0">
                              <span className="truncate block text-xs leading-none">{item.name}</span>
                              {item.description && (
                                <span className={`text-[9px] truncate block mt-0.5 ${isActive ? 'text-white/70' : 'text-[#A8A29E]'}`}>
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </div>
                          {item.badge !== undefined && (
                            <span
                              className={cn(
                                'text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ml-1.5',
                                isActive ? 'bg-[#EA580C] text-white' : 'bg-[#FFEDD5] text-[#C2410C]'
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
};
