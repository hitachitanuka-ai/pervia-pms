import {
  Company,
  UserProfile,
  Department,
  Position,
  Employee,
  EvaluationPeriod,
  KPIIndicator,
  EmployeeKPI,
  PerformanceEvaluation,
  AuditLog,
  NotificationItem,
  SystemTask,
  UserRole,
  TalentGridItem,
  AppraisalDossier,
  DigitalSignatureRecord,
  PotentialRating,
  PerformanceRating,
  FlightRisk,
  SuccessionReadiness,
  CalibrationOverrideLog,
  CompensationEmployee,
  KPIEvidenceItem,
  SLAEscalationLog,
} from '../types';

const STORAGE_KEY = 'PMS_ENTERPRISE_DATA_V1';

interface PMSDatabaseStore {
  company: Company;
  profiles: UserProfile[];
  departments: Department[];
  positions: Position[];
  employees: Employee[];
  periods: EvaluationPeriod[];
  kpiIndicators: KPIIndicator[];
  employeeKPIs: EmployeeKPI[];
  evaluations: PerformanceEvaluation[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  tasks: SystemTask[];
  talentGridItems: TalentGridItem[];
  dossiers: AppraisalDossier[];
  calibrationOverrides?: CalibrationOverrideLog[];
  compensationEmployees?: CompensationEmployee[];
  evidenceItems?: KPIEvidenceItem[];
  slaEscalationLogs?: SLAEscalationLog[];
}


const DEFAULT_COMPANY: Company = {
  id: 'c1000000-0000-0000-0000-000000000001',
  name: 'Apex Global Technologies',
  code: 'APEX',
  domain: 'apexglobal.com',
  currency: 'USD',
  timezone: 'America/New_York (EST)',
  createdAt: '2024-01-01T08:00:00Z',
  updatedAt: '2026-01-01T08:00:00Z',
};

const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'u1000000-0000-0000-0000-000000000001',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-001',
    email: 'superadmin@enterprise-pms.com',
    fullName: 'Alexander Vance',
    phone: '+1 (555) 019-2831',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    role: 'Super Admin',
    status: 'Active',
    createdAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'u1000000-0000-0000-0000-000000000002',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-002',
    email: 'hradmin@enterprise-pms.com',
    fullName: 'Elena Rostova',
    phone: '+1 (555) 019-4482',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    role: 'HR Admin',
    status: 'Active',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'u1000000-0000-0000-0000-000000000003',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-003',
    email: 'hrmanager@enterprise-pms.com',
    fullName: 'Marcus Sterling',
    phone: '+1 (555) 019-8921',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    role: 'HR Manager',
    status: 'Active',
    createdAt: '2024-02-01T08:30:00Z',
  },
  {
    id: 'u1000000-0000-0000-0000-000000000004',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-004',
    email: 'deptmanager@enterprise-pms.com',
    fullName: 'Sarah Chen',
    phone: '+1 (555) 019-7712',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    role: 'Department Manager',
    status: 'Active',
    createdAt: '2024-02-15T08:30:00Z',
  },
  {
    id: 'u1000000-0000-0000-0000-000000000005',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-005',
    email: 'supervisor@enterprise-pms.com',
    fullName: 'David Miller',
    phone: '+1 (555) 019-3389',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    role: 'Supervisor',
    status: 'Active',
    createdAt: '2024-03-01T08:30:00Z',
  },
  {
    id: 'u1000000-0000-0000-0000-000000000006',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-006',
    email: 'employee@enterprise-pms.com',
    fullName: 'Aria Montgomery',
    phone: '+1 (555) 019-1123',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    role: 'Employee',
    status: 'Active',
    createdAt: '2024-04-01T08:30:00Z',
  },
  {
    id: 'u1000000-0000-0000-0000-000000000007',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-007',
    email: 'reviewer@enterprise-pms.com',
    fullName: 'Jordan Patel',
    phone: '+1 (555) 019-5567',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    role: 'Reviewer',
    status: 'Active',
    createdAt: '2024-04-15T08:30:00Z',
  },
];

const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    companyId: DEFAULT_COMPANY.id,
    code: 'ENG',
    name: 'Engineering & Technology',
    description: 'Software development, cloud infrastructure, QA, and security systems',
    managerId: 'EMP-004',
    managerName: 'Sarah Chen',
    employeeCount: 42,
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000002',
    companyId: DEFAULT_COMPANY.id,
    code: 'HR',
    name: 'Human Resources & Talent',
    description: 'Talent acquisition, employee relations, learning and development, PMS',
    managerId: 'EMP-003',
    managerName: 'Marcus Sterling',
    employeeCount: 12,
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000003',
    companyId: DEFAULT_COMPANY.id,
    code: 'SALES',
    name: 'Sales & Business Development',
    description: 'Enterprise revenue generation, account executive teams, customer success',
    managerId: 'EMP-008',
    managerName: 'Claire Redfield',
    employeeCount: 28,
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000004',
    companyId: DEFAULT_COMPANY.id,
    code: 'FIN',
    name: 'Finance & Compliance',
    description: 'Corporate budgeting, audit, forecasting, payroll and tax operations',
    managerId: 'EMP-009',
    managerName: 'Nathan Drake',
    employeeCount: 14,
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000005',
    companyId: DEFAULT_COMPANY.id,
    code: 'PROD',
    name: 'Product & Design',
    description: 'Product management, user research, UX/UI design, and design systems',
    managerId: 'EMP-010',
    managerName: 'Sophia Loren',
    employeeCount: 19,
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

const DEFAULT_POSITIONS: Position[] = [
  {
    id: 'p1000000-0000-0000-0000-000000000001',
    companyId: DEFAULT_COMPANY.id,
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    departmentName: 'Engineering & Technology',
    code: 'ENG-VP',
    title: 'VP of Engineering',
    level: 'Executive',
    jobFamily: 'Engineering Management',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'p1000000-0000-0000-0000-000000000002',
    companyId: DEFAULT_COMPANY.id,
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    departmentName: 'Engineering & Technology',
    code: 'ENG-TL',
    title: 'Lead Frontend Engineer',
    level: 'Senior',
    jobFamily: 'Software Engineering',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'p1000000-0000-0000-0000-000000000003',
    companyId: DEFAULT_COMPANY.id,
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    departmentName: 'Engineering & Technology',
    code: 'ENG-SSE',
    title: 'Senior Software Engineer',
    level: 'Senior',
    jobFamily: 'Software Engineering',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'p1000000-0000-0000-0000-000000000004',
    companyId: DEFAULT_COMPANY.id,
    departmentId: 'd1000000-0000-0000-0000-000000000002',
    departmentName: 'Human Resources & Talent',
    code: 'HR-DIR',
    title: 'Director of Human Resources',
    level: 'Executive',
    jobFamily: 'People Operations',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'p1000000-0000-0000-0000-000000000005',
    companyId: DEFAULT_COMPANY.id,
    departmentId: 'd1000000-0000-0000-0000-000000000002',
    departmentName: 'Human Resources & Talent',
    code: 'HR-MGR',
    title: 'People Operations Manager',
    level: 'Middle',
    jobFamily: 'People Operations',
    status: 'Active',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'e1000000-0000-0000-0000-000000000001',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-001',
    userId: 'u1000000-0000-0000-0000-000000000001',
    fullName: 'Alexander Vance',
    email: 'superadmin@enterprise-pms.com',
    phone: '+1 (555) 019-2831',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    departmentName: 'Engineering & Technology',
    positionId: 'p1000000-0000-0000-0000-000000000001',
    positionTitle: 'Chief Technology Officer',
    joinDate: '2022-01-10',
    employmentStatus: 'Active',
    role: 'Super Admin',
    location: 'Headquarters - New York',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'e1000000-0000-0000-0000-000000000002',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-002',
    userId: 'u1000000-0000-0000-0000-000000000002',
    fullName: 'Elena Rostova',
    email: 'hradmin@enterprise-pms.com',
    phone: '+1 (555) 019-4482',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    departmentId: 'd1000000-0000-0000-0000-000000000002',
    departmentName: 'Human Resources & Talent',
    positionId: 'p1000000-0000-0000-0000-000000000004',
    positionTitle: 'Director of Human Resources',
    joinDate: '2022-03-15',
    employmentStatus: 'Active',
    role: 'HR Admin',
    location: 'Headquarters - New York',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'e1000000-0000-0000-0000-000000000003',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-003',
    userId: 'u1000000-0000-0000-0000-000000000003',
    fullName: 'Marcus Sterling',
    email: 'hrmanager@enterprise-pms.com',
    phone: '+1 (555) 019-8921',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    departmentId: 'd1000000-0000-0000-0000-000000000002',
    departmentName: 'Human Resources & Talent',
    positionId: 'p1000000-0000-0000-0000-000000000005',
    positionTitle: 'People Operations Manager',
    managerId: 'EMP-002',
    managerName: 'Elena Rostova',
    joinDate: '2023-02-01',
    employmentStatus: 'Active',
    role: 'HR Manager',
    location: 'Headquarters - New York',
    createdAt: '2024-02-01T08:30:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'e1000000-0000-0000-0000-000000000004',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-004',
    userId: 'u1000000-0000-0000-0000-000000000004',
    fullName: 'Sarah Chen',
    email: 'deptmanager@enterprise-pms.com',
    phone: '+1 (555) 019-7712',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    departmentName: 'Engineering & Technology',
    positionId: 'p1000000-0000-0000-0000-000000000001',
    positionTitle: 'VP of Engineering',
    managerId: 'EMP-001',
    managerName: 'Alexander Vance',
    joinDate: '2022-06-01',
    employmentStatus: 'Active',
    role: 'Department Manager',
    location: 'San Francisco Tech Hub',
    createdAt: '2024-02-15T08:30:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'e1000000-0000-0000-0000-000000000005',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-005',
    userId: 'u1000000-0000-0000-0000-000000000005',
    fullName: 'David Miller',
    email: 'supervisor@enterprise-pms.com',
    phone: '+1 (555) 019-3389',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    departmentName: 'Engineering & Technology',
    positionId: 'p1000000-0000-0000-0000-000000000002',
    positionTitle: 'Lead Frontend Engineer',
    managerId: 'EMP-004',
    managerName: 'Sarah Chen',
    supervisorId: 'EMP-004',
    supervisorName: 'Sarah Chen',
    joinDate: '2023-04-10',
    employmentStatus: 'Active',
    role: 'Supervisor',
    location: 'San Francisco Tech Hub',
    createdAt: '2024-03-01T08:30:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'e1000000-0000-0000-0000-000000000006',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-006',
    userId: 'u1000000-0000-0000-0000-000000000006',
    fullName: 'Aria Montgomery',
    email: 'employee@enterprise-pms.com',
    phone: '+1 (555) 019-1123',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    departmentName: 'Engineering & Technology',
    positionId: 'p1000000-0000-0000-0000-000000000003',
    positionTitle: 'Senior Software Engineer',
    managerId: 'EMP-004',
    managerName: 'Sarah Chen',
    supervisorId: 'EMP-005',
    supervisorName: 'David Miller',
    joinDate: '2023-08-15',
    employmentStatus: 'Active',
    role: 'Employee',
    location: 'San Francisco Tech Hub',
    createdAt: '2024-04-01T08:30:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'e1000000-0000-0000-0000-000000000007',
    companyId: DEFAULT_COMPANY.id,
    employeeId: 'EMP-007',
    userId: 'u1000000-0000-0000-0000-000000000007',
    fullName: 'Jordan Patel',
    email: 'reviewer@enterprise-pms.com',
    phone: '+1 (555) 019-5567',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    departmentName: 'Engineering & Technology',
    positionId: 'p1000000-0000-0000-0000-000000000003',
    positionTitle: 'Senior Cloud Architect',
    managerId: 'EMP-004',
    managerName: 'Sarah Chen',
    supervisorId: 'EMP-005',
    supervisorName: 'David Miller',
    joinDate: '2023-09-01',
    employmentStatus: 'Active',
    role: 'Reviewer',
    location: 'Seattle Hub',
    createdAt: '2024-04-15T08:30:00Z',
    updatedAt: '2026-01-01T08:00:00Z',
  },
];

const DEFAULT_PERIODS: EvaluationPeriod[] = [
  {
    id: 'per-2026-q1',
    companyId: DEFAULT_COMPANY.id,
    name: '2026 Q1 Enterprise Performance Cycle',
    code: 'CYC-2026-Q1',
    type: 'Quarterly',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    submissionDeadline: '2026-04-07',
    reviewDeadline: '2026-04-21',
    status: 'Active',
    totalParticipants: 115,
    completionRate: 68.4,
    createdAt: '2025-12-15T00:00:00Z',
  },
  {
    id: 'per-2025-annual',
    companyId: DEFAULT_COMPANY.id,
    name: '2025 Annual Performance Review',
    code: 'CYC-2025-ANNUAL',
    type: 'Annually',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    submissionDeadline: '2026-01-15',
    reviewDeadline: '2026-01-30',
    status: 'Closed',
    totalParticipants: 108,
    completionRate: 100.0,
    createdAt: '2024-12-01T00:00:00Z',
  },
];

const DEFAULT_KPIS: KPIIndicator[] = [
  {
    id: 'kpi-eng-001',
    companyId: DEFAULT_COMPANY.id,
    code: 'ENG-KPI-01',
    name: 'Sprint Velocity & Delivery On-Time Rate',
    description: 'Percentage of agreed story points successfully tested and merged to staging by sprint cutoff',
    category: 'Operational Excellence',
    departmentName: 'Engineering & Technology',
    measurementType: 'Percentage',
    direction: 'Higher Is Better',
    defaultTarget: 95.0,
    defaultWeight: 25.0,
    minScore: 50.0,
    maxScore: 120.0,
    unit: '%',
    dataSource: 'Jira Software / GitHub PRs',
    status: 'Active',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'kpi-eng-002',
    companyId: DEFAULT_COMPANY.id,
    code: 'ENG-KPI-02',
    name: 'Production Defect Density & SLA MTTR',
    description: 'Mean time to resolve P1/P2 issues in hours (lower is better)',
    category: 'Quality & Reliability',
    departmentName: 'Engineering & Technology',
    measurementType: 'Numeric',
    direction: 'Lower Is Better',
    defaultTarget: 2.0,
    defaultWeight: 25.0,
    minScore: 0.0,
    maxScore: 120.0,
    unit: 'hours',
    dataSource: 'Datadog / PagerDuty',
    status: 'Active',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'kpi-eng-003',
    companyId: DEFAULT_COMPANY.id,
    code: 'ENG-KPI-03',
    name: 'Architecture & Scalability Milestone Completion',
    description: 'Delivery of core microservice separation and high-throughput caching milestone',
    category: 'Strategic Initiatives',
    departmentName: 'Engineering & Technology',
    measurementType: 'Percentage',
    direction: 'Higher Is Better',
    defaultTarget: 100.0,
    defaultWeight: 30.0,
    minScore: 0.0,
    maxScore: 110.0,
    unit: '%',
    dataSource: 'Engineering Architecture Board',
    status: 'Active',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'kpi-eng-004',
    companyId: DEFAULT_COMPANY.id,
    code: 'ENG-KPI-04',
    name: 'Mentorship & Knowledge Sharing Hours',
    description: 'Quarterly hours dedicated to code walkthroughs, design review mentoring, and tech talks',
    category: 'Culture & Leadership',
    departmentName: 'Engineering & Technology',
    measurementType: 'Numeric',
    direction: 'Higher Is Better',
    defaultTarget: 20.0,
    defaultWeight: 20.0,
    minScore: 0.0,
    maxScore: 120.0,
    unit: 'hours',
    dataSource: 'Internal Academy Portal',
    status: 'Active',
    createdAt: '2024-01-10T00:00:00Z',
  },
];

const DEFAULT_EMPLOYEE_KPIS: EmployeeKPI[] = [
  {
    id: 'ekpi-001',
    companyId: DEFAULT_COMPANY.id,
    periodId: 'per-2026-q1',
    employeeId: 'EMP-006',
    kpiId: 'kpi-eng-001',
    kpiCode: 'ENG-KPI-01',
    kpiName: 'Sprint Velocity & Delivery On-Time Rate',
    category: 'Operational Excellence',
    measurementType: 'Percentage',
    direction: 'Higher Is Better',
    target: 95.0,
    weight: 25.0,
    actual: 98.2,
    achievementRate: 103.37,
    weightedScore: 25.84,
    unit: '%',
    status: 'Verified',
    supervisorNotes: 'Consistently met all sprint releases without blockers.',
  },
  {
    id: 'ekpi-002',
    companyId: DEFAULT_COMPANY.id,
    periodId: 'per-2026-q1',
    employeeId: 'EMP-006',
    kpiId: 'kpi-eng-002',
    kpiCode: 'ENG-KPI-02',
    kpiName: 'Production Defect Density & SLA MTTR',
    category: 'Quality & Reliability',
    measurementType: 'Numeric',
    direction: 'Lower Is Better',
    target: 2.0,
    weight: 25.0,
    actual: 1.5,
    achievementRate: 120.0, // Capped at max 120%
    weightedScore: 30.0,
    unit: 'hours',
    status: 'Verified',
    supervisorNotes: 'Outstanding turnaround on production triage.',
  },
  {
    id: 'ekpi-003',
    companyId: DEFAULT_COMPANY.id,
    periodId: 'per-2026-q1',
    employeeId: 'EMP-006',
    kpiId: 'kpi-eng-003',
    kpiCode: 'ENG-KPI-03',
    kpiName: 'Architecture & Scalability Milestone Completion',
    category: 'Strategic Initiatives',
    measurementType: 'Percentage',
    direction: 'Higher Is Better',
    target: 100.0,
    weight: 30.0,
    actual: 92.0,
    achievementRate: 92.0,
    weightedScore: 27.6,
    unit: '%',
    status: 'Submitted',
    supervisorNotes: 'Milestone 3 finalized; final cache benchmark scheduled.',
  },
  {
    id: 'ekpi-004',
    companyId: DEFAULT_COMPANY.id,
    periodId: 'per-2026-q1',
    employeeId: 'EMP-006',
    kpiId: 'kpi-eng-004',
    kpiCode: 'ENG-KPI-04',
    kpiName: 'Mentorship & Knowledge Sharing Hours',
    category: 'Culture & Leadership',
    measurementType: 'Numeric',
    direction: 'Higher Is Better',
    target: 20.0,
    weight: 20.0,
    actual: 22.0,
    achievementRate: 110.0,
    weightedScore: 22.0,
    unit: 'hours',
    status: 'Verified',
    supervisorNotes: 'Ran two excellent workshops on micro-frontends.',
  },
];

const DEFAULT_EVALUATIONS: PerformanceEvaluation[] = [
  {
    id: 'eval-006-2026-q1',
    companyId: DEFAULT_COMPANY.id,
    periodId: 'per-2026-q1',
    periodName: '2026 Q1 Enterprise Performance Cycle',
    employeeId: 'EMP-006',
    employeeName: 'Aria Montgomery',
    employeeRole: 'Senior Software Engineer',
    departmentName: 'Engineering & Technology',
    managerId: 'EMP-004',
    managerName: 'Sarah Chen',
    stage: 'Supervisor Assessment',
    kpiScore: 105.44, // 25.84 + 30.0 + 27.6 + 22.0
    competencyScore: 92.0,
    behavioralScore: 95.0,
    feedbackScore: 88.5,
    // (105.44 * 0.6) + (92.0 * 0.2) + (95.0 * 0.1) + (88.5 * 0.1) = 63.26 + 18.4 + 9.5 + 8.85 = 100.01
    finalScore: 100.01,
    ratingGrade: 'Exceeds Expectations (A)',
    status: 'In Review',
    submittedAt: '2026-03-30T10:00:00Z',
    updatedAt: '2026-04-02T14:20:00Z',
  },
  {
    id: 'eval-005-2026-q1',
    companyId: DEFAULT_COMPANY.id,
    periodId: 'per-2026-q1',
    periodName: '2026 Q1 Enterprise Performance Cycle',
    employeeId: 'EMP-005',
    employeeName: 'David Miller',
    employeeRole: 'Lead Frontend Engineer',
    departmentName: 'Engineering & Technology',
    managerId: 'EMP-004',
    managerName: 'Sarah Chen',
    stage: 'Manager Review',
    kpiScore: 98.2,
    competencyScore: 94.0,
    behavioralScore: 90.0,
    feedbackScore: 91.0,
    finalScore: 95.82,
    ratingGrade: 'Exceeds Expectations (A)',
    status: 'Submitted',
    submittedAt: '2026-03-29T11:00:00Z',
    updatedAt: '2026-04-01T09:15:00Z',
  },
  {
    id: 'eval-007-2026-q1',
    companyId: DEFAULT_COMPANY.id,
    periodId: 'per-2026-q1',
    periodName: '2026 Q1 Enterprise Performance Cycle',
    employeeId: 'EMP-007',
    employeeName: 'Jordan Patel',
    employeeRole: 'Senior Cloud Architect',
    departmentName: 'Engineering & Technology',
    managerId: 'EMP-004',
    managerName: 'Sarah Chen',
    stage: 'Final Approval',
    kpiScore: 108.5,
    competencyScore: 96.0,
    behavioralScore: 92.0,
    feedbackScore: 94.0,
    finalScore: 102.9,
    ratingGrade: 'Outstanding Performer (A+)',
    status: 'Approved',
    submittedAt: '2026-03-25T14:00:00Z',
    approvedAt: '2026-04-03T16:30:00Z',
    updatedAt: '2026-04-03T16:30:00Z',
  },
];

const DEFAULT_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    companyId: DEFAULT_COMPANY.id,
    userId: 'u1000000-0000-0000-0000-000000000001',
    userName: 'Alexander Vance',
    userRole: 'Super Admin',
    action: 'SYSTEM_BOOTSTRAP',
    module: 'System Administration',
    details: 'System initialized with ISO 27001-compliant enterprise security baseline.',
    ipAddress: '192.168.1.100',
    timestamp: '2026-04-01T08:00:00Z',
  },
  {
    id: 'log-002',
    companyId: DEFAULT_COMPANY.id,
    userId: 'u1000000-0000-0000-0000-000000000002',
    userName: 'Elena Rostova',
    userRole: 'HR Admin',
    action: 'PERIOD_ACTIVATION',
    module: 'Performance Cycle',
    details: 'Evaluation Period CYC-2026-Q1 set to Active status. 115 participants mapped.',
    ipAddress: '10.0.4.15',
    timestamp: '2026-04-01T09:30:00Z',
  },
  {
    id: 'log-003',
    companyId: DEFAULT_COMPANY.id,
    userId: 'u1000000-0000-0000-0000-000000000005',
    userName: 'David Miller',
    userRole: 'Supervisor',
    action: 'KPI_VERIFIED',
    module: 'KPI Management',
    details: 'Verified actual metric for ENG-KPI-01 and ENG-KPI-02 for Aria Montgomery.',
    ipAddress: '172.16.2.88',
    timestamp: '2026-04-02T11:15:00Z',
  },
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    userId: 'u1000000-0000-0000-0000-000000000006',
    title: 'Self Assessment Window Closing',
    message: 'Your Q1 Self Assessment submission is due in 3 business days. Please verify all actual metrics.',
    type: 'warning',
    link: '/assessment/self',
    read: false,
    createdAt: '2026-04-04T08:00:00Z',
  },
  {
    id: 'notif-002',
    userId: 'u1000000-0000-0000-0000-000000000005',
    title: 'KPI Actual Pending Verification',
    message: 'Aria Montgomery submitted actual values with supporting evidence for ENG-KPI-03.',
    type: 'info',
    link: '/kpi/actuals',
    read: false,
    createdAt: '2026-04-03T14:10:00Z',
  },
  {
    id: 'notif-003',
    userId: 'u1000000-0000-0000-0000-000000000002',
    title: 'Evaluation Calibration Stage Open',
    message: 'Calibration committee review for Engineering & Sales is scheduled for Friday 10:00 AM.',
    type: 'info',
    link: '/assessment/calibration',
    read: true,
    createdAt: '2026-04-02T09:00:00Z',
  },
];

const DEFAULT_TASKS: SystemTask[] = [
  {
    id: 'task-1',
    title: 'Review Q1 KPI Progress for Direct Reports',
    module: 'KPI Management',
    dueDate: '2026-04-07',
    priority: 'High',
    status: 'In Progress',
    link: '/kpi/monitoring',
  },
  {
    id: 'task-2',
    title: 'Submit 360-Degree Peer Feedback for Jordan Patel',
    module: 'Assessment',
    dueDate: '2026-04-10',
    priority: 'Medium',
    status: 'Pending',
    link: '/assessment/360-feedback',
  },
  {
    id: 'task-3',
    title: 'Conduct Monthly Coaching Check-in',
    module: 'Development',
    dueDate: '2026-04-14',
    priority: 'Medium',
    status: 'Pending',
    link: '/development/coaching',
  },
  {
    id: 'task-4',
    title: 'Audit Department Weight Distribution Compliance (100% check)',
    module: 'System Administration',
    dueDate: '2026-04-15',
    priority: 'High',
    status: 'Completed',
    link: '/kpi/assignment',
  },
];

const DEFAULT_TALENT_ITEMS: TalentGridItem[] = [
  // Quadrant: Star / Top Talent (High Potential, High Performance)
  {
    id: 'tg-001',
    employeeId: 'EMP-006',
    fullName: 'Aria Montgomery',
    email: 'employee@enterprise-pms.com',
    positionTitle: 'Senior Software Engineer (IC4)',
    departmentName: 'Engineering & Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    managerName: 'Sarah Chen',
    performanceScore: 100.0,
    performanceBand: 'High',
    potentialBand: 'High',
    flightRisk: 'Medium',
    successionReadiness: 'Ready Now',
    ratingGrade: 'Grade A',
    quadrantId: 'q-star',
    quadrantName: 'Star / Top Talent',
    keyStrengths: ['Distributed Systems', 'Mentorship', 'Fault Tolerant Pipelines'],
    developmentFocus: 'Lead architect succession track & strategic enterprise design',
    lastUpdated: '2026-04-03T16:00:00Z',
  },
  {
    id: 'tg-002',
    employeeId: 'EMP-001',
    fullName: 'Alexander Vance',
    email: 'superadmin@enterprise-pms.com',
    positionTitle: 'Chief Technology Officer',
    departmentName: 'Engineering & Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    managerName: 'Board of Directors',
    performanceScore: 98.5,
    performanceBand: 'High',
    potentialBand: 'High',
    flightRisk: 'Low',
    successionReadiness: 'Ready Now',
    ratingGrade: 'Grade A+',
    quadrantId: 'q-star',
    quadrantName: 'Star / Top Talent',
    keyStrengths: ['Executive Vision', 'Cloud Scale Architecture', 'Talent Magnet'],
    developmentFocus: 'Global scaling & multi-region datacenter expansion',
    lastUpdated: '2026-04-01T10:00:00Z',
  },
  // Quadrant: Rising Star / Future Leader (High Potential, Med Performance)
  {
    id: 'tg-003',
    employeeId: 'EMP-007',
    fullName: 'Jordan Patel',
    email: 'reviewer@enterprise-pms.com',
    positionTitle: 'Senior Cloud Architect',
    departmentName: 'Engineering & Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    managerName: 'Sarah Chen',
    performanceScore: 94.0,
    performanceBand: 'Medium',
    potentialBand: 'High',
    flightRisk: 'High',
    successionReadiness: 'Ready in 1-2 Years',
    ratingGrade: 'Grade A',
    quadrantId: 'q-rising-star',
    quadrantName: 'Rising Star / Future Leader',
    keyStrengths: ['Kubernetes Infrastructure', 'Security Mesh', 'Fast Prototyping'],
    developmentFocus: 'Executive communication & stakeholder budget negotiation',
    lastUpdated: '2026-04-02T11:30:00Z',
  },
  {
    id: 'tg-004',
    employeeId: 'EMP-010',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@enterprise-pms.com',
    positionTitle: 'Lead Product Designer',
    departmentName: 'Product & Design',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=256&q=80',
    managerName: 'Sarah Chen',
    performanceScore: 93.5,
    performanceBand: 'Medium',
    potentialBand: 'High',
    flightRisk: 'Medium',
    successionReadiness: 'Ready in 1-2 Years',
    ratingGrade: 'Grade A',
    quadrantId: 'q-rising-star',
    quadrantName: 'Rising Star / Future Leader',
    keyStrengths: ['Design System', 'User Psychology', 'Design-to-Code Speed'],
    developmentFocus: 'Design org management and cross-functional brand leadership',
    lastUpdated: '2026-04-02T15:20:00Z',
  },
  // Quadrant: Rough Diamond / Enigma (High Potential, Low Performance)
  {
    id: 'tg-005',
    employeeId: 'EMP-011',
    fullName: 'Leo Tanaka',
    email: 'leo.tanaka@enterprise-pms.com',
    positionTitle: 'AI Research Engineer',
    departmentName: 'Engineering & Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    managerName: 'David Miller',
    performanceScore: 78.4,
    performanceBand: 'Low',
    potentialBand: 'High',
    flightRisk: 'High',
    successionReadiness: 'Ready in 1-2 Years',
    ratingGrade: 'Grade C',
    quadrantId: 'q-rough-diamond',
    quadrantName: 'Rough Diamond / Enigma',
    keyStrengths: ['Deep Learning', 'Algorithm Math', 'Novel Problem Solving'],
    developmentFocus: 'SLA discipline, production delivery cadence, and peer reviews',
    lastUpdated: '2026-04-01T09:00:00Z',
  },
  {
    id: 'tg-006',
    employeeId: 'EMP-012',
    fullName: 'Maya Lin',
    email: 'maya.lin@enterprise-pms.com',
    positionTitle: 'Product Growth Analyst',
    departmentName: 'Product & Design',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    managerName: 'Marcus Sterling',
    performanceScore: 81.2,
    performanceBand: 'Low',
    potentialBand: 'High',
    flightRisk: 'Medium',
    successionReadiness: 'Ready in 1-2 Years',
    ratingGrade: 'Grade C+',
    quadrantId: 'q-rough-diamond',
    quadrantName: 'Rough Diamond / Enigma',
    keyStrengths: ['Cohort Analytics', 'A/B Experimentation', 'Statistical Rigor'],
    developmentFocus: 'Executive synthesis, roadmap prioritization clarity',
    lastUpdated: '2026-04-03T08:30:00Z',
  },
  // Quadrant: High Professional / Star Contributor (Medium Potential, High Performance)
  {
    id: 'tg-007',
    employeeId: 'EMP-005',
    fullName: 'David Miller',
    email: 'supervisor@enterprise-pms.com',
    positionTitle: 'Lead Frontend Engineer',
    departmentName: 'Engineering & Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    managerName: 'Sarah Chen',
    performanceScore: 95.8,
    performanceBand: 'High',
    potentialBand: 'Medium',
    flightRisk: 'Low',
    successionReadiness: 'Ready Now',
    ratingGrade: 'Grade A',
    quadrantId: 'q-high-pro',
    quadrantName: 'High Professional / Star Contributor',
    keyStrengths: ['React Ecosystem', 'Performance Tuning', 'Code Quality Standards'],
    developmentFocus: 'Broaden technical oversight across cross-functional backend services',
    lastUpdated: '2026-04-02T14:00:00Z',
  },
  {
    id: 'tg-008',
    employeeId: 'EMP-014',
    fullName: 'Robert Hayes',
    email: 'robert.hayes@enterprise-pms.com',
    positionTitle: 'Senior Enterprise Account Executive',
    departmentName: 'Sales & Business Development',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    managerName: 'Sarah Chen',
    performanceScore: 96.5,
    performanceBand: 'High',
    potentialBand: 'Medium',
    flightRisk: 'Low',
    successionReadiness: 'Ready Now',
    ratingGrade: 'Grade A',
    quadrantId: 'q-high-pro',
    quadrantName: 'High Professional / Star Contributor',
    keyStrengths: ['Enterprise Quota Smashing', 'C-Level Negotiation', 'Contract Closure'],
    developmentFocus: 'Sales mentoring and national strategic account playbook authoring',
    lastUpdated: '2026-04-01T12:00:00Z',
  },
  // Quadrant: Core Performer / Solid Contributor (Medium Potential, Medium Performance)
  {
    id: 'tg-009',
    employeeId: 'EMP-004',
    fullName: 'Sarah Chen',
    email: 'deptmanager@enterprise-pms.com',
    positionTitle: 'VP of Engineering',
    departmentName: 'Engineering & Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    managerName: 'Alexander Vance',
    performanceScore: 91.0,
    performanceBand: 'Medium',
    potentialBand: 'Medium',
    flightRisk: 'Low',
    successionReadiness: 'Retain in Current Role',
    ratingGrade: 'Grade B+',
    quadrantId: 'q-core-player',
    quadrantName: 'Core Performer / Solid Contributor',
    keyStrengths: ['Department Leadership', 'Sprint Reliability', 'Budget Prudence'],
    developmentFocus: 'Enterprise multi-year tech roadmap and succession readiness',
    lastUpdated: '2026-04-01T14:40:00Z',
  },
  {
    id: 'tg-010',
    employeeId: 'EMP-003',
    fullName: 'Marcus Sterling',
    email: 'hrmanager@enterprise-pms.com',
    positionTitle: 'People Operations Manager',
    departmentName: 'Human Resources & Talent',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    managerName: 'Elena Rostova',
    performanceScore: 89.6,
    performanceBand: 'Medium',
    potentialBand: 'Medium',
    flightRisk: 'Low',
    successionReadiness: 'Retain in Current Role',
    ratingGrade: 'Grade B',
    quadrantId: 'q-core-player',
    quadrantName: 'Core Performer / Solid Contributor',
    keyStrengths: ['Talent Relations', 'Cycle Compliance', 'Fair Mediation'],
    developmentFocus: 'HR analytics automation and strategic workforce capacity planning',
    lastUpdated: '2026-04-02T16:00:00Z',
  },
  {
    id: 'tg-011',
    employeeId: 'EMP-015',
    fullName: 'Lucas Silva',
    email: 'lucas.silva@enterprise-pms.com',
    positionTitle: 'DevOps & Site Reliability Engineer',
    departmentName: 'Engineering & Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
    managerName: 'David Miller',
    performanceScore: 88.0,
    performanceBand: 'Medium',
    potentialBand: 'Medium',
    flightRisk: 'Low',
    successionReadiness: 'Retain in Current Role',
    ratingGrade: 'Grade B',
    quadrantId: 'q-core-player',
    quadrantName: 'Core Performer / Solid Contributor',
    keyStrengths: ['Terraform IaC', 'Incident Response', 'Uptime Optimization'],
    developmentFocus: 'Multi-cloud disaster recovery drills and service mesh upgrades',
    lastUpdated: '2026-04-01T11:00:00Z',
  },
  // Quadrant: Dilemma / Inconsistent Performer (Medium Potential, Low Performance)
  {
    id: 'tg-012',
    employeeId: 'EMP-016',
    fullName: 'Kevin Zhang',
    email: 'kevin.zhang@enterprise-pms.com',
    positionTitle: 'Frontend Engineer (IC2)',
    departmentName: 'Engineering & Technology',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    managerName: 'David Miller',
    performanceScore: 76.5,
    performanceBand: 'Low',
    potentialBand: 'Medium',
    flightRisk: 'Medium',
    successionReadiness: 'Retain in Current Role',
    ratingGrade: 'Grade C',
    quadrantId: 'q-dilemma',
    quadrantName: 'Dilemma / Inconsistent Performer',
    keyStrengths: ['CSS Animation', 'Design Empathy', 'Eager Learner'],
    developmentFocus: 'TypeScript type safety, unit test coverage, and milestone consistency',
    lastUpdated: '2026-04-02T10:15:00Z',
  },
  // Quadrant: Trusted Specialist / Workhorse (Low Potential, High Performance)
  {
    id: 'tg-013',
    employeeId: 'EMP-002',
    fullName: 'Elena Rostova',
    email: 'hradmin@enterprise-pms.com',
    positionTitle: 'Director of Human Resources',
    departmentName: 'Human Resources & Talent',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    managerName: 'Alexander Vance',
    performanceScore: 97.2,
    performanceBand: 'High',
    potentialBand: 'Low',
    flightRisk: 'Low',
    successionReadiness: 'Retain in Current Role',
    ratingGrade: 'Grade A',
    quadrantId: 'q-workhorse',
    quadrantName: 'Trusted Specialist / Workhorse',
    keyStrengths: ['Labor Law Compliance', 'Audit Excellence', 'Institutional Memory'],
    developmentFocus: 'Subject matter expert council and executive advisory capacity',
    lastUpdated: '2026-04-03T11:00:00Z',
  },
  // Quadrant: Effective / Steady Worker (Low Potential, Med Performance)
  {
    id: 'tg-014',
    employeeId: 'EMP-018',
    fullName: 'Emily Watson',
    email: 'emily.watson@enterprise-pms.com',
    positionTitle: 'Operations Coordinator',
    departmentName: 'Business Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    managerName: 'Elena Rostova',
    performanceScore: 86.0,
    performanceBand: 'Medium',
    potentialBand: 'Low',
    flightRisk: 'Low',
    successionReadiness: 'Retain in Current Role',
    ratingGrade: 'Grade B',
    quadrantId: 'q-steady',
    quadrantName: 'Effective / Steady Worker',
    keyStrengths: ['Vendor Coordination', 'Office Logistics', 'Process Follow-through'],
    developmentFocus: 'Automated invoice workflow management and spreadsheet modeling',
    lastUpdated: '2026-04-01T15:00:00Z',
  },
  // Quadrant: Risk / Underperformer (Low Potential, Low Performance)
  {
    id: 'tg-015',
    employeeId: 'EMP-019',
    fullName: 'Brandon Cole',
    email: 'brandon.cole@enterprise-pms.com',
    positionTitle: 'Junior Implementation Specialist',
    departmentName: 'Business Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    managerName: 'Sarah Chen',
    performanceScore: 62.4,
    performanceBand: 'Low',
    potentialBand: 'Low',
    flightRisk: 'High',
    successionReadiness: 'Emergency Replacement Only',
    ratingGrade: 'Grade D (PIP Active)',
    quadrantId: 'q-risk',
    quadrantName: 'Risk / Underperformer',
    keyStrengths: ['Basic Customer Support'],
    developmentFocus: 'Mandatory 60-day Performance Improvement Plan (PIP) execution',
    lastUpdated: '2026-04-01T09:30:00Z',
  },
];

const DEFAULT_DOSSIERS: AppraisalDossier[] = [
  {
    id: 'dos-006-2026-q1',
    documentRef: 'PRV-2026-Q1-APP-006',
    employeeId: 'EMP-006',
    employeeName: 'Aria Montgomery',
    employeeRole: 'Senior Software Engineer (IC4)',
    departmentName: 'Engineering & Technology',
    managerName: 'Sarah Chen',
    periodName: '2026 Q1 Enterprise Performance Cycle',
    evaluationDate: '2026-04-03',
    status: 'Finalized',
    kpiScore: 105.44,
    competencyScore: 92.0,
    behavioralScore: 95.0,
    feedbackScore: 88.5,
    finalScore: 100.01,
    ratingGrade: 'Exceeds Expectations (Grade A)',
    performanceCategory: 'Top Talent / High Performer',
    rewardMultiplier: '120% Bonus Allocation',
    evaluatorRemarks: {
      keyAchievements: [
        'Delivered low-latency GraphQL caching layer reducing p99 response times from 340ms to 42ms.',
        'Mentored 3 junior developers and organized 2 enterprise-wide frontend engineering workshops.',
        'Zero production downtime across all core transaction APIs throughout Q1 release window.',
      ],
      growthAreas: [
        'Expand technical architecture documentation across cross-departmental product RFCs.',
        'Strengthen formal delegation of routine bug triage to empower mid-level engineers.',
      ],
      agreedIdpTargets: [
        'Achieve AWS Certified Solutions Architect Professional certification by Q2 2026.',
        'Deliver keynote on Micro-frontends at Annual Engineering Summit.',
      ],
    },
    signatures: {
      employee: {
        signerRole: 'Employee',
        signerName: 'Aria Montgomery',
        signerTitle: 'Senior Software Engineer',
        signedAt: '2026-04-03T14:15:00Z',
        status: 'Signed',
        verificationHash: 'SHA256:7f9a2b8e34c190ddfae26b1',
        digitalCertificateId: 'PRV-CERT-EMP006-2026Q1',
      },
      supervisor: {
        signerRole: 'Supervisor',
        signerName: 'Sarah Chen',
        signerTitle: 'VP of Engineering',
        signedAt: '2026-04-03T16:30:00Z',
        status: 'Signed',
        verificationHash: 'SHA256:a12e5c893df4401bbce9812',
        digitalCertificateId: 'PRV-CERT-MGR004-2026Q1',
      },
      hrDirector: {
        signerRole: 'HR Director / Committee',
        signerName: 'Elena Rostova',
        signerTitle: 'Director of Human Resources',
        signedAt: '2026-04-04T09:00:00Z',
        status: 'Signed',
        verificationHash: 'SHA256:4d88e001ba92c719eef6550',
        digitalCertificateId: 'PRV-SEAL-HRCOMM-2026Q1',
      },
    },
  },
  {
    id: 'dos-005-2026-q1',
    documentRef: 'PRV-2026-Q1-APP-005',
    employeeId: 'EMP-005',
    employeeName: 'David Miller',
    employeeRole: 'Lead Frontend Engineer',
    departmentName: 'Engineering & Technology',
    managerName: 'Sarah Chen',
    periodName: '2026 Q1 Enterprise Performance Cycle',
    evaluationDate: '2026-04-02',
    status: 'Approved',
    kpiScore: 98.2,
    competencyScore: 94.0,
    behavioralScore: 90.0,
    feedbackScore: 91.0,
    finalScore: 95.82,
    ratingGrade: 'Exceeds Expectations (Grade A)',
    performanceCategory: 'High Professional / Star Contributor',
    rewardMultiplier: '110% Bonus Allocation',
    evaluatorRemarks: {
      keyAchievements: [
        'Spearheaded design system UI library refactoring across 14 enterprise micro-apps.',
        'Conducted 24 code reviews per week with an average turnaround time under 4 hours.',
      ],
      growthAreas: [
        'Bridge coordination with the cloud security architecture team on RBAC token renewals.',
      ],
      agreedIdpTargets: [
        'Lead frontend accessibility (WCAG AA) company-wide compliance initiative.',
      ],
    },
    signatures: {
      employee: {
        signerRole: 'Employee',
        signerName: 'David Miller',
        signerTitle: 'Lead Frontend Engineer',
        signedAt: '2026-04-02T11:00:00Z',
        status: 'Signed',
        verificationHash: 'SHA256:e32bc110f88129ac',
        digitalCertificateId: 'PRV-CERT-EMP005-2026Q1',
      },
      supervisor: {
        signerRole: 'Supervisor',
        signerName: 'Sarah Chen',
        signerTitle: 'VP of Engineering',
        signedAt: '2026-04-02T14:20:00Z',
        status: 'Signed',
        verificationHash: 'SHA256:cc990141fbe1477a',
        digitalCertificateId: 'PRV-CERT-MGR004-2026Q1',
      },
      hrDirector: {
        signerRole: 'HR Director / Committee',
        signerName: 'Elena Rostova',
        signerTitle: 'Director of Human Resources',
        status: 'Pending',
      },
    },
  },
  {
    id: 'dos-007-2026-q1',
    documentRef: 'PRV-2026-Q1-APP-007',
    employeeId: 'EMP-007',
    employeeName: 'Jordan Patel',
    employeeRole: 'Senior Cloud Architect',
    departmentName: 'Engineering & Technology',
    managerName: 'Sarah Chen',
    periodName: '2026 Q1 Enterprise Performance Cycle',
    evaluationDate: '2026-04-01',
    status: 'Approved',
    kpiScore: 108.5,
    competencyScore: 96.0,
    behavioralScore: 92.0,
    feedbackScore: 94.0,
    finalScore: 102.9,
    ratingGrade: 'Outstanding Performer (Grade A+)',
    performanceCategory: 'Rising Star / Future Leader',
    rewardMultiplier: '130% Bonus Allocation',
    evaluatorRemarks: {
      keyAchievements: [
        'Architected Kubernetes multi-cluster failover achieving 99.99% system availability.',
        'Eliminated cloud idle compute instances saving $142,000 annually.',
      ],
      growthAreas: [
        'Conduct cross-training sessions for junior cloud engineers on Terraform module authoring.',
      ],
      agreedIdpTargets: [
        'Publish internal Cloud Security Architecture Whitepaper for ISO 27001 recertification.',
      ],
    },
    signatures: {
      employee: {
        signerRole: 'Employee',
        signerName: 'Jordan Patel',
        signerTitle: 'Senior Cloud Architect',
        signedAt: '2026-04-01T15:30:00Z',
        status: 'Signed',
        verificationHash: 'SHA256:779bc513da4421',
        digitalCertificateId: 'PRV-CERT-EMP007-2026Q1',
      },
      supervisor: {
        signerRole: 'Supervisor',
        signerName: 'Sarah Chen',
        signerTitle: 'VP of Engineering',
        signedAt: '2026-04-02T09:15:00Z',
        status: 'Signed',
        verificationHash: 'SHA256:ff349a11ee9812',
        digitalCertificateId: 'PRV-CERT-MGR004-2026Q1',
      },
      hrDirector: {
        signerRole: 'HR Director / Committee',
        signerName: 'Elena Rostova',
        signerTitle: 'Director of Human Resources',
        signedAt: '2026-04-03T10:00:00Z',
        status: 'Signed',
        verificationHash: 'SHA256:114bb22019eead',
        digitalCertificateId: 'PRV-SEAL-HRCOMM-2026Q1',
      },
    },
  },
];

const DEFAULT_CALIBRATION_OVERRIDES: CalibrationOverrideLog[] = [
  {
    id: 'cal-ovr-01',
    employeeId: 'EMP-006',
    employeeName: 'Aria Montgomery',
    previousQuadrant: 'Core Performer / Solid Contributor',
    newQuadrant: 'Star / Top Talent',
    calibratorName: 'Sarah Chen (VP Eng) & Elena Rostova (HRD)',
    overrideReason: 'Konsensus komite: Memimpin implementasi arsitektur multi-region dengan zero defect, kontribusi lintas tim melebihi ekspektasi peran IC4.',
    timestamp: '2026-04-03T11:30:00Z',
  },
  {
    id: 'cal-ovr-02',
    employeeId: 'EMP-007',
    employeeName: 'Jordan Patel',
    previousQuadrant: 'Rising Star / Future Leader',
    newQuadrant: 'High Professional / Star Contributor',
    calibratorName: 'Komite Kalibrasi Q1 2026',
    overrideReason: 'Penyesuaian fokus karir individual ke jalur Technical Specialist / Principal ketimbang People Manager.',
    timestamp: '2026-04-02T16:15:00Z',
  },
];

const DEFAULT_COMPENSATION_EMPLOYEES: CompensationEmployee[] = [
  {
    employeeId: 'EMP-006',
    fullName: 'Aria Montgomery',
    departmentName: 'Engineering & Technology',
    positionTitle: 'Senior Software Engineer',
    level: 'IC4 Senior',
    currentSalary: 28500000,
    performanceScore: 94.2,
    ratingGrade: 'Grade A (Outstanding)',
    compaRatio: 0.95,
    meritIncreasePct: 11.0,
    newSalary: 31635000,
    bonusMultiplier: 1.5,
    bonusAmount: 42750000,
    status: 'Recommended',
  },
  {
    employeeId: 'EMP-007',
    fullName: 'Jordan Patel',
    departmentName: 'Engineering & Technology',
    positionTitle: 'Cloud Infrastructure Architect',
    level: 'IC5 Lead',
    currentSalary: 38000000,
    performanceScore: 91.8,
    ratingGrade: 'Grade A (Outstanding)',
    compaRatio: 1.02,
    meritIncreasePct: 9.5,
    newSalary: 41610000,
    bonusMultiplier: 1.5,
    bonusAmount: 57000000,
    status: 'Recommended',
  },
  {
    employeeId: 'EMP-005',
    fullName: 'David Miller',
    departmentName: 'Engineering & Technology',
    positionTitle: 'Engineering Manager',
    level: 'M1 Manager',
    currentSalary: 42000000,
    performanceScore: 89.5,
    ratingGrade: 'Grade B+ (Exceeds)',
    compaRatio: 0.98,
    meritIncreasePct: 7.5,
    newSalary: 45150000,
    bonusMultiplier: 1.25,
    bonusAmount: 52500000,
    status: 'Recommended',
  },
  {
    employeeId: 'EMP-008',
    fullName: 'Samantha Reed',
    departmentName: 'Product & Design',
    positionTitle: 'Staff Product Designer',
    level: 'IC4 Senior',
    currentSalary: 26000000,
    performanceScore: 88.0,
    ratingGrade: 'Grade B+ (Exceeds)',
    compaRatio: 0.92,
    meritIncreasePct: 8.0,
    newSalary: 28080000,
    bonusMultiplier: 1.25,
    bonusAmount: 32500000,
    status: 'Draft',
  },
  {
    employeeId: 'EMP-009',
    fullName: 'Lucas Wright',
    departmentName: 'Sales & Revenue',
    positionTitle: 'Enterprise Account Executive',
    level: 'IC3 Mid',
    currentSalary: 22000000,
    performanceScore: 85.5,
    ratingGrade: 'Grade B (Meets)',
    compaRatio: 1.05,
    meritIncreasePct: 4.5,
    newSalary: 22990000,
    bonusMultiplier: 1.0,
    bonusAmount: 22000000,
    status: 'Draft',
  },
  {
    employeeId: 'EMP-010',
    fullName: 'Nadia Putri',
    departmentName: 'People & Culture (HR)',
    positionTitle: 'Talent Acquisition Specialist',
    level: 'IC2 Junior',
    currentSalary: 14500000,
    performanceScore: 86.2,
    ratingGrade: 'Grade B (Meets)',
    compaRatio: 0.90,
    meritIncreasePct: 6.0,
    newSalary: 15370000,
    bonusMultiplier: 1.0,
    bonusAmount: 14500000,
    status: 'Draft',
  },
  {
    employeeId: 'EMP-011',
    fullName: 'Reza Pratama',
    departmentName: 'Finance & Operations',
    positionTitle: 'Financial Analyst',
    level: 'IC3 Mid',
    currentSalary: 19000000,
    performanceScore: 78.4,
    ratingGrade: 'Grade C (Needs Improvement)',
    compaRatio: 1.10,
    meritIncreasePct: 1.5,
    newSalary: 19285000,
    bonusMultiplier: 0.5,
    bonusAmount: 9500000,
    status: 'Draft',
  },
  {
    employeeId: 'EMP-012',
    fullName: 'Budi Santoso',
    departmentName: 'Engineering & Technology',
    positionTitle: 'Junior QA Tester',
    level: 'IC1 Associate',
    currentSalary: 11000000,
    performanceScore: 68.0,
    ratingGrade: 'Grade D (Unsatisfactory)',
    compaRatio: 0.88,
    meritIncreasePct: 0.0,
    newSalary: 11000000,
    bonusMultiplier: 0.0,
    bonusAmount: 0,
    status: 'Draft',
  },
];

const DEFAULT_EVIDENCE_ITEMS: KPIEvidenceItem[] = [
  {
    id: 'evd-001',
    kpiCode: 'ENG-KPI-01',
    kpiName: 'Sprint Story Points Delivery & Reliability',
    employeeId: 'EMP-006',
    employeeName: 'Aria Montgomery',
    title: 'Audit Report Rilis Sprint Q1 & Jira Velocity Telemetry',
    documentType: 'PDF',
    fileName: 'Sprint_Q1_2026_Velocity_Audit_Report.pdf',
    fileSize: '3.4 MB',
    fileUrl: '/evidence/sprint-q1.pdf',
    uploadDate: '2026-03-28T14:30:00Z',
    shaHash: 'SHA256:7f9a2b8e34c190ddfae26b1897c88a4b',
    claimedActual: 85,
    target: 80,
    unit: 'pts',
    status: 'Verified',
    verificationChecklist: {
      systemProofValid: true,
      slaStandardMet: true,
      weightMeasurementCorrect: true,
      oneOnOneDiscussed: true,
    },
    supervisorRemarks: 'Verifikasi selesai. Keandalan rilis sprint tercapai 106.25% tanpa rollback.',
    verifiedBy: 'Sarah Chen (VP Eng)',
    verifiedAt: '2026-03-30T10:15:00Z',
  },
  {
    id: 'evd-002',
    kpiCode: 'ENG-KPI-02',
    kpiName: 'Production Defect Density & SLA MTTR',
    employeeId: 'EMP-006',
    employeeName: 'Aria Montgomery',
    title: 'Log Incident Post-Mortem & Datadog SLA MTTR 1.5 Jam',
    documentType: 'Image',
    fileName: 'Datadog_Incident_MTTR_Q1_Proof.png',
    fileSize: '1.8 MB',
    fileUrl: '/evidence/datadog-mttr.png',
    uploadDate: '2026-03-29T09:20:00Z',
    shaHash: 'SHA256:3a1b5c9d8e7f2231445566778899aabb',
    claimedActual: 1.5,
    target: 2.0,
    unit: 'hrs',
    status: 'Verified',
    verificationChecklist: {
      systemProofValid: true,
      slaStandardMet: true,
      weightMeasurementCorrect: true,
      oneOnOneDiscussed: true,
    },
    supervisorRemarks: 'Target tercapai melebihi ekspektasi. MTTR stabil di 1.5 jam vs target 2.0 jam.',
    verifiedBy: 'Sarah Chen (VP Eng)',
    verifiedAt: '2026-03-30T10:18:00Z',
  },
  {
    id: 'evd-003',
    kpiCode: 'ENG-KPI-03',
    kpiName: 'Architecture & Scalability Milestone Completion',
    employeeId: 'EMP-006',
    employeeName: 'Aria Montgomery',
    title: 'Sertifikat Kelulusan AWS Certified Solutions Architect Professional',
    documentType: 'Certificate',
    fileName: 'AWS_Solutions_Architect_Professional_AriaM.pdf',
    fileSize: '2.1 MB',
    fileUrl: '/evidence/aws-cert.pdf',
    uploadDate: '2026-03-25T16:45:00Z',
    shaHash: 'SHA256:998877665544332211aabbccddeeff00',
    claimedActual: 92,
    target: 100,
    unit: '%',
    status: 'Pending Verification',
    verificationChecklist: {
      systemProofValid: true,
      slaStandardMet: true,
      weightMeasurementCorrect: false,
      oneOnOneDiscussed: false,
    },
    supervisorRemarks: 'Menunggu konfirmasi verifikasi nomor lisensi di AWS Credential Portal.',
  },
  {
    id: 'evd-004',
    kpiCode: 'ENG-KPI-04',
    kpiName: 'Mentorship & Knowledge Sharing Hours',
    employeeId: 'EMP-006',
    employeeName: 'Aria Montgomery',
    title: 'Daftar Presensi 22 Jam Tech Talk & 1-on-1 Mentoring Junior',
    documentType: 'PDF',
    fileName: 'Mentoring_Hours_Log_Q1_2026.pdf',
    fileSize: '950 KB',
    fileUrl: '/evidence/mentoring.pdf',
    uploadDate: '2026-03-31T11:00:00Z',
    shaHash: 'SHA256:11223344556677889900aabbccddeeff',
    claimedActual: 22,
    target: 20,
    unit: 'hrs',
    status: 'Pending Verification',
    verificationChecklist: {
      systemProofValid: false,
      slaStandardMet: false,
      weightMeasurementCorrect: false,
      oneOnOneDiscussed: false,
    },
  },
];

const DEFAULT_SLA_LOGS: SLAEscalationLog[] = [
  {
    id: 'sla-esc-01',
    taskId: 'task-002',
    taskTitle: 'Supervisor Assessment Review untuk Aria Montgomery',
    employeeId: 'EMP-006',
    employeeName: 'Aria Montgomery',
    assignedToName: 'Sarah Chen',
    assignedToRole: 'Department Manager / Supervisor',
    daysOverdue: 3,
    escalationLevel: 'Level 1 (Dept Manager)',
    escalatedTo: 'Elena Rostova (HR Admin)',
    escalationReason: 'Batas SLA 7 hari kerja untuk penyelesaian review tahap Supervisor telah terlampaui.',
    triggeredAt: '2026-04-03T08:00:00Z',
    status: 'Dispatched',
  },
];

// Initialize and manage store
class DatabaseManager {
  private store: PMSDatabaseStore;

  constructor() {
    this.store = this.loadInitial();
  }

  private loadInitial(): PMSDatabaseStore {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          company: parsed.company || DEFAULT_COMPANY,
          profiles: parsed.profiles || DEFAULT_PROFILES,
          departments: parsed.departments || DEFAULT_DEPARTMENTS,
          positions: parsed.positions || DEFAULT_POSITIONS,
          employees: parsed.employees || DEFAULT_EMPLOYEES,
          periods: parsed.periods || DEFAULT_PERIODS,
          kpiIndicators: parsed.kpiIndicators || DEFAULT_KPIS,
          employeeKPIs: parsed.employeeKPIs || DEFAULT_EMPLOYEE_KPIS,
          evaluations: parsed.evaluations || DEFAULT_EVALUATIONS,
          auditLogs: parsed.auditLogs || DEFAULT_AUDIT_LOGS,
          notifications: parsed.notifications || DEFAULT_NOTIFICATIONS,
          tasks: parsed.tasks || DEFAULT_TASKS,
          talentGridItems: parsed.talentGridItems || DEFAULT_TALENT_ITEMS,
          dossiers: parsed.dossiers || DEFAULT_DOSSIERS,
          calibrationOverrides: parsed.calibrationOverrides || DEFAULT_CALIBRATION_OVERRIDES,
          compensationEmployees: parsed.compensationEmployees || DEFAULT_COMPENSATION_EMPLOYEES,
          evidenceItems: parsed.evidenceItems || DEFAULT_EVIDENCE_ITEMS,
          slaEscalationLogs: parsed.slaEscalationLogs || DEFAULT_SLA_LOGS,
        };
      }
    } catch {
      // LocalStorage not available or parse error
    }

    const initial: PMSDatabaseStore = {
      company: DEFAULT_COMPANY,
      profiles: DEFAULT_PROFILES,
      departments: DEFAULT_DEPARTMENTS,
      positions: DEFAULT_POSITIONS,
      employees: DEFAULT_EMPLOYEES,
      periods: DEFAULT_PERIODS,
      kpiIndicators: DEFAULT_KPIS,
      employeeKPIs: DEFAULT_EMPLOYEE_KPIS,
      evaluations: DEFAULT_EVALUATIONS,
      auditLogs: DEFAULT_AUDIT_LOGS,
      notifications: DEFAULT_NOTIFICATIONS,
      tasks: DEFAULT_TASKS,
      talentGridItems: DEFAULT_TALENT_ITEMS,
      dossiers: DEFAULT_DOSSIERS,
      calibrationOverrides: DEFAULT_CALIBRATION_OVERRIDES,
      compensationEmployees: DEFAULT_COMPENSATION_EMPLOYEES,
      evidenceItems: DEFAULT_EVIDENCE_ITEMS,
      slaEscalationLogs: DEFAULT_SLA_LOGS,
    };
    this.save(initial);
    return initial;
  }


  private save(data: PMSDatabaseStore) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.store = data;
    } catch {
      // ignore
    }
  }

  // Getters
  getCompany(): Company {
    return this.store.company;
  }

  getProfiles(): UserProfile[] {
    return this.store.profiles;
  }

  getProfileByEmail(email: string): UserProfile | undefined {
    return this.store.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
  }

  getEmployees(): Employee[] {
    return this.store.employees;
  }

  getDepartments(): Department[] {
    return this.store.departments;
  }

  getPositions(): Position[] {
    return this.store.positions;
  }

  getPeriods(): EvaluationPeriod[] {
    return this.store.periods;
  }

  getKPIIndicators(): KPIIndicator[] {
    return this.store.kpiIndicators;
  }

  getEmployeeKPIs(employeeId?: string, periodId?: string): EmployeeKPI[] {
    let result = this.store.employeeKPIs;
    if (employeeId) result = result.filter((k) => k.employeeId === employeeId);
    if (periodId) result = result.filter((k) => k.periodId === periodId);
    return result;
  }

  getEvaluations(): PerformanceEvaluation[] {
    return this.store.evaluations;
  }

  getAuditLogs(): AuditLog[] {
    return this.store.auditLogs;
  }

  getNotifications(userId?: string): NotificationItem[] {
    if (userId) return this.store.notifications.filter((n) => n.userId === userId);
    return this.store.notifications;
  }

  addNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): NotificationItem {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.store.notifications = [newNotif, ...this.store.notifications];
    this.save(this.store);
    return newNotif;
  }

  getTasks(): SystemTask[] {
    return this.store.tasks;
  }

  // Mutations
  addAuditLog(entry: Omit<AuditLog, 'id' | 'companyId' | 'timestamp'>) {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      companyId: this.store.company.id,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.store.auditLogs = [newLog, ...this.store.auditLogs];
    this.save(this.store);
  }

  addEmployee(emp: Omit<Employee, 'id' | 'companyId' | 'createdAt' | 'updatedAt'>): Employee {
    const newEmp: Employee = {
      ...emp,
      id: `e-${Date.now()}`,
      companyId: this.store.company.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.store.employees = [...this.store.employees, newEmp];
    this.save(this.store);
    return newEmp;
  }

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const idx = this.store.employees.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    this.store.employees[idx] = {
      ...this.store.employees[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save(this.store);
    return this.store.employees[idx];
  }

  addDepartment(dept: Omit<Department, 'id' | 'companyId' | 'createdAt'>): Department {
    const newDept: Department = {
      ...dept,
      id: `d-${Date.now()}`,
      companyId: this.store.company.id,
      createdAt: new Date().toISOString(),
    };
    this.store.departments = [...this.store.departments, newDept];
    this.save(this.store);
    return newDept;
  }

  addPosition(pos: Omit<Position, 'id' | 'companyId' | 'createdAt'>): Position {
    const newPos: Position = {
      ...pos,
      id: `p-${Date.now()}`,
      companyId: this.store.company.id,
      createdAt: new Date().toISOString(),
    };
    this.store.positions = [...this.store.positions, newPos];
    this.save(this.store);
    return newPos;
  }

  addPeriod(period: Omit<EvaluationPeriod, 'id' | 'companyId' | 'createdAt'>): EvaluationPeriod {
    const newPer: EvaluationPeriod = {
      ...period,
      id: `per-${Date.now()}`,
      companyId: this.store.company.id,
      createdAt: new Date().toISOString(),
    };
    this.store.periods = [newPer, ...this.store.periods];
    this.save(this.store);
    return newPer;
  }

  updateKPIActual(kpiId: string, actual: number, notes?: string): EmployeeKPI | null {
    const idx = this.store.employeeKPIs.findIndex((k) => k.id === kpiId);
    if (idx === -1) return null;
    const item = this.store.employeeKPIs[idx];

    let achievementRate = 0;
    if (item.direction === 'Higher Is Better') {
      achievementRate = (actual / item.target) * 100;
    } else if (item.direction === 'Lower Is Better') {
      achievementRate = (item.target / (actual || 1)) * 100;
    } else {
      achievementRate = actual >= item.target ? 100 : (actual / item.target) * 100;
    }

    // Min & Max clamping (default 0 to 120%)
    achievementRate = Math.min(120, Math.max(0, achievementRate));
    const weightedScore = (achievementRate * item.weight) / 100;

    this.store.employeeKPIs[idx] = {
      ...item,
      actual,
      achievementRate: Number(achievementRate.toFixed(2)),
      weightedScore: Number(weightedScore.toFixed(2)),
      supervisorNotes: notes || item.supervisorNotes,
      status: 'Verified',
    };
    this.save(this.store);
    return this.store.employeeKPIs[idx];
  }

  markNotificationRead(id: string) {
    this.store.notifications = this.store.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.save(this.store);
  }

  getTalentGridItems(): TalentGridItem[] {
    return this.store.talentGridItems || DEFAULT_TALENT_ITEMS;
  }

  getTalentGridItem(idOrEmployeeId: string): TalentGridItem | undefined {
    return (this.store.talentGridItems || DEFAULT_TALENT_ITEMS).find(
      (t) => t.id === idOrEmployeeId || t.employeeId === idOrEmployeeId
    );
  }

  updateTalentGridItem(id: string, updates: Partial<TalentGridItem>): TalentGridItem | null {
    const list = this.getTalentGridItems();
    const idx = list.findIndex((t) => t.id === id || t.employeeId === id);
    if (idx === -1) return null;

    const updatedItem = { ...list[idx], ...updates, lastUpdated: new Date().toISOString() };
    const perf = updatedItem.performanceBand;
    const pot = updatedItem.potentialBand;

    let qId = 'q-core-player';
    let qName = 'Core Performer / Solid Contributor';
    if (pot === 'High' && perf === 'High') {
      qId = 'q-star';
      qName = 'Star / Top Talent';
    } else if (pot === 'High' && perf === 'Medium') {
      qId = 'q-rising-star';
      qName = 'Rising Star / Future Leader';
    } else if (pot === 'High' && perf === 'Low') {
      qId = 'q-rough-diamond';
      qName = 'Rough Diamond / Enigma';
    } else if (pot === 'Medium' && perf === 'High') {
      qId = 'q-high-pro';
      qName = 'High Professional / Star Contributor';
    } else if (pot === 'Medium' && perf === 'Medium') {
      qId = 'q-core-player';
      qName = 'Core Performer / Solid Contributor';
    } else if (pot === 'Medium' && perf === 'Low') {
      qId = 'q-dilemma';
      qName = 'Dilemma / Inconsistent Performer';
    } else if (pot === 'Low' && perf === 'High') {
      qId = 'q-workhorse';
      qName = 'Trusted Specialist / Workhorse';
    } else if (pot === 'Low' && perf === 'Medium') {
      qId = 'q-steady';
      qName = 'Effective / Steady Worker';
    } else if (pot === 'Low' && perf === 'Low') {
      qId = 'q-risk';
      qName = 'Risk / Underperformer';
    }

    updatedItem.quadrantId = qId;
    updatedItem.quadrantName = qName;

    list[idx] = updatedItem;
    this.store.talentGridItems = [...list];
    this.save(this.store);
    return updatedItem;
  }

  getAppraisalDossiers(): AppraisalDossier[] {
    return this.store.dossiers || DEFAULT_DOSSIERS;
  }

  getAppraisalDossierByEmployee(employeeIdOrEvalId: string): AppraisalDossier | undefined {
    return (this.store.dossiers || DEFAULT_DOSSIERS).find(
      (d) => d.employeeId === employeeIdOrEvalId || d.id === employeeIdOrEvalId || d.documentRef === employeeIdOrEvalId
    );
  }

  signAppraisalDossier(
    dossierId: string,
    signerRole: 'Employee' | 'Supervisor' | 'HR Director / Committee',
    signerName: string,
    signerTitle?: string
  ): AppraisalDossier | null {
    const list = this.getAppraisalDossiers();
    const idx = list.findIndex((d) => d.id === dossierId || d.employeeId === dossierId);
    if (idx === -1) return null;

    const dossier = { ...list[idx] };
    const timestamp = new Date().toISOString();
    const hash = `SHA256:${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
    const cert = `PRV-SIG-${dossier.employeeId}-${Date.now().toString().slice(-4)}`;

    if (signerRole === 'Employee') {
      dossier.signatures = {
        ...dossier.signatures,
        employee: {
          signerRole: 'Employee',
          signerName,
          signerTitle: signerTitle || dossier.employeeRole,
          signedAt: timestamp,
          status: 'Signed',
          verificationHash: hash,
          digitalCertificateId: cert,
        },
      };
    } else if (signerRole === 'Supervisor') {
      dossier.signatures = {
        ...dossier.signatures,
        supervisor: {
          signerRole: 'Supervisor',
          signerName,
          signerTitle: signerTitle || 'Direct Supervisor / Appraiser',
          signedAt: timestamp,
          status: 'Signed',
          verificationHash: hash,
          digitalCertificateId: cert,
        },
      };
    } else {
      dossier.signatures = {
        ...dossier.signatures,
        hrDirector: {
          signerRole: 'HR Director / Committee',
          signerName,
          signerTitle: signerTitle || 'Director of Human Resources',
          signedAt: timestamp,
          status: 'Signed',
          verificationHash: hash,
          digitalCertificateId: `PRV-SEAL-HRCOMM-${Date.now().toString().slice(-4)}`,
        },
      };
      dossier.status = 'Finalized';
    }

    list[idx] = dossier;
    this.store.dossiers = [...list];
    this.save(this.store);
    return dossier;
  }

  // ================= AREA 2: CALIBRATION COMMITTEE =================
  getCalibrationOverrides(): CalibrationOverrideLog[] {
    return this.store.calibrationOverrides || DEFAULT_CALIBRATION_OVERRIDES;
  }

  addCalibrationOverride(data: Omit<CalibrationOverrideLog, 'id' | 'timestamp'>): CalibrationOverrideLog {
    const list = this.getCalibrationOverrides();
    const newLog: CalibrationOverrideLog = {
      ...data,
      id: `cal-ovr-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.store.calibrationOverrides = [newLog, ...list];
    this.save(this.store);

    this.addAuditLog({
      userId: 'committee',
      userName: data.calibratorName,
      userRole: 'Super Admin',
      action: 'CALIBRATION_OVERRIDE_RATIFIED',
      module: 'Talent Calibration (9-Box)',
      details: `${data.employeeName} dipindahkan dari ${data.previousQuadrant} ke ${data.newQuadrant}. Alasan: ${data.overrideReason}`,
    });

    return newLog;
  }

  // ================= AREA 3: SALARY & MERIT SIMULATOR =================
  getCompensationEmployees(): CompensationEmployee[] {
    return this.store.compensationEmployees || DEFAULT_COMPENSATION_EMPLOYEES;
  }

  updateCompensationEmployee(employeeId: string, updates: Partial<CompensationEmployee>): CompensationEmployee | null {
    const list = this.getCompensationEmployees();
    const idx = list.findIndex((c) => c.employeeId === employeeId);
    if (idx === -1) return null;

    const updated = { ...list[idx], ...updates };
    // Recalculate new salary if merit pct updated
    if (updates.meritIncreasePct !== undefined) {
      updated.newSalary = Math.round(updated.currentSalary * (1 + updates.meritIncreasePct / 100));
    }
    // Recalculate bonus amount if multiplier updated
    if (updates.bonusMultiplier !== undefined) {
      updated.bonusAmount = Math.round(updated.currentSalary * updates.bonusMultiplier);
    }

    list[idx] = updated;
    this.store.compensationEmployees = [...list];
    this.save(this.store);
    return updated;
  }

  applyAllCompensationRecommendations(): boolean {
    const list = this.getCompensationEmployees();
    const updated = list.map((c) => ({ ...c, status: 'Approved' as const }));
    this.store.compensationEmployees = updated;
    this.save(this.store);

    this.addAuditLog({
      userId: 'exec-hr',
      userName: 'HR & Compensation Committee',
      userRole: 'Super Admin',
      action: 'MERIT_INCREASE_RATIFIED',
      module: 'Salary & Incentive Simulator',
      details: `Disetujui kenaikan gaji & bonus kinerja untuk ${updated.length} karyawan siklus 2026 Q1.`,
    });

    return true;
  }

  // ================= AREA 4: KPI EVIDENCE & CHECKLIST APPROVAL =================
  getKPIEvidenceItems(employeeId?: string): KPIEvidenceItem[] {
    const items = this.store.evidenceItems || DEFAULT_EVIDENCE_ITEMS;
    if (employeeId) {
      return items.filter((item) => item.employeeId === employeeId);
    }
    return items;
  }

  verifyKPIEvidenceItem(
    evidenceId: string,
    verified: boolean,
    remarks: string,
    checklist: KPIEvidenceItem['verificationChecklist'],
    supervisorName: string
  ): KPIEvidenceItem | null {
    const list = this.getKPIEvidenceItems();
    const idx = list.findIndex((e) => e.id === evidenceId);
    if (idx === -1) return null;

    const item = { ...list[idx] };
    item.status = verified ? 'Verified' : 'Revision Requested';
    item.supervisorRemarks = remarks;
    item.verificationChecklist = checklist;
    item.verifiedBy = supervisorName;
    item.verifiedAt = new Date().toISOString();

    list[idx] = item;
    this.store.evidenceItems = [...list];

    // If verified, also update the corresponding employeeKPI status in database
    if (verified) {
      const kpis = this.getEmployeeKPIs();
      const kpiIdx = kpis.findIndex((k) => k.kpiCode === item.kpiCode && k.employeeId === item.employeeId);
      if (kpiIdx !== -1) {
        kpis[kpiIdx].status = 'Verified';
        kpis[kpiIdx].actual = item.claimedActual;
        this.store.employeeKPIs = [...kpis];
      }
    }

    this.save(this.store);

    this.addAuditLog({
      userId: 'supervisor',
      userName: supervisorName,
      userRole: 'Supervisor',
      action: verified ? 'EVIDENCE_CLAIM_VERIFIED' : 'EVIDENCE_REVISION_REQUESTED',
      module: 'KPI Deliverables Audit',
      details: `${item.kpiCode} (${item.title}) - Status: ${item.status}. Catatan: ${remarks}`,
    });

    return item;
  }

  // ================= AREA 5: SLA ESCALATION & CYCLE REMINDERS =================
  getSLAEscalationLogs(): SLAEscalationLog[] {
    return this.store.slaEscalationLogs || DEFAULT_SLA_LOGS;
  }

  triggerSLAEscalation(taskId: string, reason: string): SLAEscalationLog | null {
    const task = this.getTasks().find((t) => t.id === taskId);
    if (!task) return null;

    const list = this.getSLAEscalationLogs();
    const newLog: SLAEscalationLog = {
      id: `sla-esc-${Date.now()}`,
      taskId: task.id,
      taskTitle: task.title,
      employeeId: 'EMP-006',
      employeeName: 'Aria Montgomery',
      assignedToName: 'Sarah Chen',
      assignedToRole: 'VP of Engineering / Supervisor',
      daysOverdue: 4,
      escalationLevel: 'Level 1 (Dept Manager)',
      escalatedTo: 'Elena Rostova (HR Admin) & Marcus Sterling (HR Manager)',
      escalationReason: reason,
      triggeredAt: new Date().toISOString(),
      status: 'Dispatched',
    };

    this.store.slaEscalationLogs = [newLog, ...list];

    // Create high-priority in-app notification
    this.addNotification({
      userId: 'u1000000-0000-0000-0000-000000000004',
      title: `🚨 ESKALASI SLA: ${task.title}`,
      message: `Pemberitahuan resmi: Tugas review penilaian telah melewati batas SLA 7 hari kerja. Tindakan segera diperlukan.`,
      type: 'alert',
      link: task.link,
    });

    this.addAuditLog({
      userId: 'system-sla',
      userName: 'Automated SLA Watchdog Engine',
      userRole: 'Super Admin',
      action: 'SLA_BREACH_ESCALATED',
      module: 'Evaluation Cycle Watchdog',
      details: `Eskalasi otomatis dikirimkan ke HR & Management untuk tugas '${task.title}'. Alasan: ${reason}`,
    });

    this.save(this.store);
    return newLog;
  }

  sendBulkCycleReminder(type: 'H-3' | 'H-1' | 'Custom', customMessage?: string): { success: boolean; recipientCount: number } {
    const employees = this.getEmployees();
    const count = employees.length;

    const msg = customMessage || (
      type === 'H-3'
        ? 'Pengingat Siklus 2026 Q1: Batas waktu pengisian Self-Assessment & 360 Feedback berakhir dalam 3 hari (Jumat, 23:59 WIB).'
        : 'PERINGATAN TERAKHIR H-1: Batas penutupan siklus evaluasi kuartal 1 tersisa 24 jam. Mohon segera finalisasi formulir penilaian Anda.'
    );

    this.addNotification({
      userId: 'all',
      title: `⏳ PENGINGAT SIKLUS EVALUASI (${type})`,
      message: msg,
      type: 'warning',
      link: '/assessment/self',
    });

    this.addAuditLog({
      userId: 'hr-admin',
      userName: 'HR Operations Broadcast',
      userRole: 'HR Admin',
      action: 'CYCLE_DEADLINE_REMINDER_BROADCAST',
      module: 'Evaluation Period Manager',
      details: `Broadcast pengingat batas waktu '${type}' dikirimkan kepada seluruh ${count} pegawai aktif.`,
    });

    return { success: true, recipientCount: count };
  }

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.store = this.loadInitial();
  }
}


export const db = new DatabaseManager();
