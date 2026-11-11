import { UserProfile, UserRole, RoleDefinition } from '../types';
import { db } from '../lib/database';

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  'Super Admin': {
    id: 'role-super-admin',
    role: 'Super Admin',
    description: 'Complete system access, company settings, database and audit controls',
    isSystem: true,
    permissions: ['all'],
  },
  'HR Admin': {
    id: 'role-hr-admin',
    role: 'HR Admin',
    description: 'Manages employee directory, departments, positions, evaluation cycles, and company reports',
    isSystem: true,
    permissions: [
      'employee:view', 'employee:create', 'employee:edit', 'employee:archive',
      'org:manage', 'cycle:manage', 'kpi:manage', 'assessment:admin',
      'analytics:view', 'data:manage', 'audit:view'
    ],
  },
  'HR Manager': {
    id: 'role-hr-manager',
    role: 'HR Manager',
    description: 'Supervises evaluations, calibration sessions, development plans, and PIP records',
    isSystem: true,
    permissions: [
      'employee:view', 'employee:edit', 'cycle:view', 'kpi:manage',
      'assessment:review', 'assessment:calibrate', 'development:manage', 'analytics:view'
    ],
  },
  'Department Manager': {
    id: 'role-dept-manager',
    role: 'Department Manager',
    description: 'Oversees departmental KPIs, reviews team evaluations, approves development plans',
    isSystem: true,
    permissions: [
      'employee:view_dept', 'kpi:view_dept', 'kpi:approve',
      'assessment:review_dept', 'assessment:approve', 'analytics:view_dept'
    ],
  },
  'Supervisor': {
    id: 'role-supervisor',
    role: 'Supervisor',
    description: 'Direct manager responsible for assigning KPIs, coaching, verifying evidence, and conducting assessments',
    isSystem: true,
    permissions: [
      'employee:view_team', 'kpi:verify', 'kpi:input_team',
      'assessment:supervisor_input', 'coaching:manage', 'pip:manage'
    ],
  },
  'Employee': {
    id: 'role-employee',
    role: 'Employee',
    description: 'Standard employee submitting self-evaluations, actual KPIs, evidence, and development goals',
    isSystem: true,
    permissions: [
      'kpi:view_own', 'kpi:input_own', 'assessment:self_input',
      'feedback:give', 'development:view_own'
    ],
  },
  'Reviewer': {
    id: 'role-reviewer',
    role: 'Reviewer',
    description: 'Peer or 360-degree feedback respondent with anonymous response submission',
    isSystem: true,
    permissions: [
      'kpi:view_own', 'feedback:give', 'assessment:peer_input'
    ],
  },
};

const SESSION_KEY = 'PMS_AUTH_SESSION_V1';

export class AuthService {
  static getCurrentSession(): UserProfile | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    // Default initial session: HR Admin Elena Rostova
    const defaultUser = db.getProfiles()[1]; // HR Admin
    if (defaultUser) {
      this.setSession(defaultUser);
      return defaultUser;
    }
    return null;
  }

  static setSession(user: UserProfile) {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }

  static clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
  }

  static login(email: string, _password?: string): { success: boolean; user?: UserProfile; error?: string } {
    const profile = db.getProfileByEmail(email);
    if (!profile) {
      return { success: false, error: 'Invalid business email or password.' };
    }
    if (profile.status !== 'Active') {
      return { success: false, error: `Account is ${profile.status}. Contact HR.` };
    }

    this.setSession(profile);
    db.addAuditLog({
      userId: profile.id,
      userName: profile.fullName,
      userRole: profile.role,
      action: 'USER_LOGIN',
      module: 'Authentication',
      details: `User logged in successfully with role ${profile.role}`,
    });

    return { success: true, user: profile };
  }

  static switchRole(role: UserRole): UserProfile | null {
    const profile = db.getProfiles().find((p) => p.role === role);
    if (profile) {
      this.setSession(profile);
      db.addAuditLog({
        userId: profile.id,
        userName: profile.fullName,
        userRole: profile.role,
        action: 'ROLE_SWITCHED',
        module: 'Authentication',
        details: `Impersonated / switched active role to ${role} (${profile.fullName})`,
      });
      return profile;
    }
    return null;
  }

  static hasPermission(user: UserProfile | null, permission: string): boolean {
    if (!user) return false;
    if (user.role === 'Super Admin') return true;
    const def = ROLE_DEFINITIONS[user.role];
    if (!def) return false;
    return def.permissions.includes('all') || def.permissions.includes(permission);
  }
}
