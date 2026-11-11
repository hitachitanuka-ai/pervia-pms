export type UserRole =
  | 'Super Admin'
  | 'HR Admin'
  | 'HR Manager'
  | 'Department Manager'
  | 'Supervisor'
  | 'Employee'
  | 'Reviewer';

export type EmploymentStatus = 'Active' | 'Probation' | 'Contract' | 'Terminated' | 'Resigned';

export interface Company {
  id: string;
  name: string;
  code: string;
  domain?: string;
  logoUrl?: string;
  currency: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  companyId: string;
  employeeId?: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  departmentId?: string;
  positionId?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  lastLoginAt?: string;
}

export interface Permission {
  id: string;
  module: string;
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'finalize' | 'export';
  description: string;
}

export interface RoleDefinition {
  id: string;
  role: UserRole;
  description: string;
  isSystem: boolean;
  permissions: string[];
}

export interface Department {
  id: string;
  companyId: string;
  code: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  parentDepartmentId?: string;
  employeeCount?: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Position {
  id: string;
  companyId: string;
  departmentId: string;
  departmentName?: string;
  code: string;
  title: string;
  level: string; // e.g. 'Executive', 'Senior', 'Middle', 'Junior'
  jobFamily?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export interface Employee {
  id: string;
  companyId: string;
  employeeId: string; // e.g. 'EMP-0012'
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionTitle: string;
  managerId?: string;
  managerName?: string;
  supervisorId?: string;
  supervisorName?: string;
  joinDate: string;
  employmentStatus: EmploymentStatus;
  role: UserRole;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export type PeriodType = 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually' | 'Custom';
export type PeriodStatus = 'Draft' | 'Active' | 'Locked' | 'Closed' | 'Archived';

export interface EvaluationPeriod {
  id: string;
  companyId: string;
  name: string; // e.g. "2026 Annual Evaluation", "Q1 2026 Performance"
  code: string;
  type: PeriodType;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  reviewDeadline: string;
  templateId?: string;
  status: PeriodStatus;
  totalParticipants?: number;
  completionRate?: number;
  createdAt: string;
}

export type MeasurementType = 'Numeric' | 'Percentage' | 'Rating' | 'Milestone';
export type CalculationDirection = 'Higher Is Better' | 'Lower Is Better' | 'Exact Target' | 'Milestone';

export interface KPIIndicator {
  id: string;
  companyId: string;
  code: string;
  name: string;
  description: string;
  category: string;
  departmentId?: string;
  departmentName?: string;
  positionId?: string;
  positionTitle?: string;
  measurementType: MeasurementType;
  direction: CalculationDirection;
  defaultTarget: number;
  defaultWeight: number;
  minScore: number;
  maxScore: number;
  unit: string;
  dataSource: string;
  status: 'Active' | 'Archived';
  createdAt: string;
}

export interface EmployeeKPI {
  id: string;
  companyId: string;
  periodId: string;
  employeeId: string;
  kpiId: string;
  kpiCode: string;
  kpiName: string;
  category: string;
  measurementType: MeasurementType;
  direction: CalculationDirection;
  target: number;
  weight: number;
  actual?: number;
  achievementRate?: number;
  weightedScore?: number;
  unit: string;
  status: 'Draft' | 'Submitted' | 'Verified' | 'Approved';
  supervisorNotes?: string;
}

export interface Competency {
  id: string;
  code: string;
  name: string;
  category: 'Core' | 'Functional' | 'Leadership' | 'Digital' | 'Communication';
  description: string;
  behavioralIndicators: string[];
  targetLevel: number; // 1 to 5
}

export interface BehavioralIndicator {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  weight: number;
  scaleMin: number;
  scaleMax: number;
  anchors: { level: number; description: string }[];
}

export interface PerformanceEvaluation {
  id: string;
  companyId: string;
  periodId: string;
  periodName: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  departmentName: string;
  managerId: string;
  managerName: string;
  stage:
    | 'Self Assessment'
    | 'Supervisor Assessment'
    | 'Competency Assessment'
    | 'Behavioral Assessment'
    | '360 Feedback'
    | 'Manager Review'
    | 'HR Review'
    | 'Final Approval'
    | 'Published';
  kpiScore: number;
  competencyScore: number;
  behavioralScore: number;
  feedbackScore: number;
  finalScore: number;
  ratingGrade: string; // e.g. "Outstanding (A)", "Exceeds Expectations (B+)"
  status: 'Draft' | 'Submitted' | 'In Review' | 'Revision Requested' | 'Approved' | 'Finalized';
  submittedAt?: string;
  approvedAt?: string;
  updatedAt: string;
}

export interface CoachingSession {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  coachId: string;
  coachName: string;
  sessionDate: string;
  topic: string;
  keyDiscussion: string;
  actionItems: { item: string; done: boolean; dueDate: string }[];
  status: 'Scheduled' | 'Completed' | 'Follow-up Needed';
}

export interface PIPRecord {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  supervisorId: string;
  supervisorName: string;
  startDate: string;
  endDate: string;
  performanceIssue: string;
  improvementTargets: string;
  checkInFrequency: 'Weekly' | 'Bi-Weekly' | 'Monthly';
  status: 'Active' | 'Extended' | 'Successfully Completed' | 'Unsuccessful';
  notes: string;
}

export interface AuditLog {
  id: string;
  companyId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface SystemTask {
  id: string;
  title: string;
  module: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  link: string;
}

// 9-Box Talent Matrix Types
export type PotentialRating = 'Low' | 'Medium' | 'High';
export type PerformanceRating = 'Low' | 'Medium' | 'High';
export type FlightRisk = 'Low' | 'Medium' | 'High';
export type SuccessionReadiness =
  | 'Ready Now'
  | 'Ready in 1-2 Years'
  | 'Retain in Current Role'
  | 'Emergency Replacement Only';

export interface TalentGridItem {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  positionTitle: string;
  departmentName: string;
  avatarUrl?: string;
  managerName: string;
  performanceScore: number;
  performanceBand: PerformanceRating;
  potentialBand: PotentialRating;
  flightRisk: FlightRisk;
  successionReadiness: SuccessionReadiness;
  ratingGrade: string;
  quadrantId: string;
  quadrantName: string;
  keyStrengths: string[];
  developmentFocus: string;
  lastUpdated: string;
}

export interface DigitalSignatureRecord {
  signerRole: 'Employee' | 'Supervisor' | 'HR Director / Committee';
  signerName: string;
  signerTitle: string;
  signedAt?: string;
  status: 'Signed' | 'Pending';
  verificationHash?: string;
  digitalCertificateId?: string;
}

export interface AppraisalDossier {
  id: string;
  documentRef: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  departmentName: string;
  managerName: string;
  periodName: string;
  evaluationDate: string;
  status: 'Draft' | 'Submitted' | 'Calibrated' | 'Approved' | 'Finalized';
  kpiScore: number;
  competencyScore: number;
  behavioralScore: number;
  feedbackScore: number;
  finalScore: number;
  ratingGrade: string;
  performanceCategory: string;
  rewardMultiplier: string;
  evaluatorRemarks: {
    keyAchievements: string[];
    growthAreas: string[];
    agreedIdpTargets: string[];
  };
  signatures: {
    employee: DigitalSignatureRecord;
    supervisor: DigitalSignatureRecord;
    hrDirector: DigitalSignatureRecord;
  };
}

export interface CalibrationOverrideLog {
  id: string;
  employeeId: string;
  employeeName: string;
  previousQuadrant: string;
  newQuadrant: string;
  calibratorName: string;
  overrideReason: string;
  timestamp: string;
}

export interface CompensationEmployee {
  employeeId: string;
  fullName: string;
  departmentName: string;
  positionTitle: string;
  level: string;
  currentSalary: number; // Monthly in IDR
  performanceScore: number;
  ratingGrade: string; // e.g. "Grade A", "Grade B+"
  compaRatio: number; // e.g. 0.95 (95% of midpoint)
  meritIncreasePct: number; // e.g. 10.5%
  newSalary: number;
  bonusMultiplier: number; // e.g. 1.5x
  bonusAmount: number;
  status: 'Draft' | 'Recommended' | 'Approved' | 'Locked';
}

export interface KPIEvidenceItem {
  id: string;
  kpiCode: string;
  kpiName: string;
  employeeId: string;
  employeeName: string;
  title: string;
  documentType: 'PDF' | 'Image' | 'Link' | 'Certificate';
  fileName: string;
  fileSize: string;
  fileUrl: string;
  uploadDate: string;
  shaHash: string;
  claimedActual: number;
  target: number;
  unit: string;
  status: 'Pending Verification' | 'Verified' | 'Revision Requested';
  verificationChecklist: {
    systemProofValid: boolean;
    slaStandardMet: boolean;
    weightMeasurementCorrect: boolean;
    oneOnOneDiscussed: boolean;
  };
  supervisorRemarks?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface SLAEscalationLog {
  id: string;
  taskId: string;
  taskTitle: string;
  employeeId: string;
  employeeName: string;
  assignedToName: string;
  assignedToRole: string;
  daysOverdue: number;
  escalationLevel: 'Level 1 (Dept Manager)' | 'Level 2 (HR Director)';
  escalatedTo: string;
  escalationReason: string;
  triggeredAt: string;
  status: 'Dispatched' | 'Acknowledged' | 'Resolved';
}

