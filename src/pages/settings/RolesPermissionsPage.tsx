import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ROLE_DEFINITIONS } from '../../services/authService';
import { ShieldCheck, Check, Lock, Users } from 'lucide-react';
import { UserRole } from '../../types';

export const RolesPermissionsPage: React.FC = () => {
  const rolesList = Object.values(ROLE_DEFINITIONS);

  const modulesList = [
    { id: 'employee:manage', name: 'Employee Directory & Org Hierarchy' },
    { id: 'cycle:manage', name: 'Evaluation Periods & Calibration' },
    { id: 'kpi:manage', name: 'KPI Library & Weight Allocations' },
    { id: 'kpi:verify', name: 'KPI Actuals & Evidence Verification' },
    { id: 'assessment:conduct', name: 'Self & Supervisor Evaluation Form' },
    { id: 'assessment:approve', name: 'Multi-stage Approval & Finalization' },
    { id: 'feedback:360', name: '360 Feedback Review & Summary' },
    { id: 'coaching:manage', name: 'Coaching & Development Plans' },
    { id: 'pip:manage', name: 'Performance Improvement Plans (PIP)' },
    { id: 'analytics:export', name: 'Export Reports & Analytics' },
    { id: 'audit:view', name: 'Audit Logs & ISO 27001 Security' },
    { id: 'system:admin', name: 'System Settings & Supabase Schema' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#172B4D]">Roles & Permissions Matrix</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Configured Role-Based Access Control (RBAC) across all 7 enterprise personas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rolesList.map((r) => (
          <Card key={r.id}>
            <CardHeader className="py-3 px-4">
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-sm text-[#172B4D]">{r.role}</span>
                <Badge variant={r.role === 'Super Admin' ? 'navy' : 'info'} size="sm">
                  {r.isSystem ? 'System Defined' : 'Custom'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <p className="text-xs text-[#64748B]">{r.description}</p>
              <div className="pt-2 border-t border-[#E2E8F0] text-[11px] text-[#315E91] font-semibold">
                {r.permissions.includes('all')
                  ? 'All Permissions Granted (Full Control)'
                  : `${r.permissions.length} Explicit Capabilities Mapped`}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permission Access Matrix Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Enterprise Capabilities Access Matrix</CardTitle>
            <CardDescription>Visual matrix of permissions mapped to user roles</CardDescription>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Permission / Capability</th>
                <th className="px-3 py-3 text-center">Super Admin</th>
                <th className="px-3 py-3 text-center">HR Admin</th>
                <th className="px-3 py-3 text-center">HR Manager</th>
                <th className="px-3 py-3 text-center">Dept Mgr</th>
                <th className="px-3 py-3 text-center">Supervisor</th>
                <th className="px-3 py-3 text-center">Employee</th>
                <th className="px-3 py-3 text-center">Reviewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#172B4D]">
              {modulesList.map((mod, idx) => (
                <tr key={mod.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-6 py-3 font-medium text-[#172B4D]">{mod.name}</td>
                  <td className="px-3 py-3 text-center">
                    <Check className="w-4 h-4 text-[#16A36A] mx-auto" />
                  </td>
                  <td className="px-3 py-3 text-center">
                    {idx < 11 ? <Check className="w-4 h-4 text-[#16A36A] mx-auto" /> : '-'}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {idx >= 1 && idx <= 9 ? <Check className="w-4 h-4 text-[#16A36A] mx-auto" /> : '-'}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {idx === 0 || (idx >= 2 && idx <= 7) || idx === 9 ? (
                      <Check className="w-4 h-4 text-[#16A36A] mx-auto" />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {(idx >= 2 && idx <= 8) ? <Check className="w-4 h-4 text-[#16A36A] mx-auto" /> : '-'}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {idx === 3 || idx === 4 || idx === 6 || idx === 7 ? (
                      <Check className="w-4 h-4 text-[#16A36A] mx-auto" />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {idx === 6 ? <Check className="w-4 h-4 text-[#16A36A] mx-auto" /> : '-'}
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
