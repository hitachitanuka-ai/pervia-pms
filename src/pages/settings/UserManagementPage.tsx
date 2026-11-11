import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { UserProfile, UserRole } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Users, Plus, Search, ShieldCheck, ExternalLink } from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>(db.getProfiles());
  const [search, setSearch] = useState('');

  const filtered = profiles.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">User Accounts & Roles</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage authenticated users, credentials, roles, and status
          </p>
        </div>
        <Badge variant="navy" size="md">
          {profiles.length} System Users
        </Badge>
      </div>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search user accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#315E91]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-6 py-3">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#172B4D]">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80'}
                        alt={u.fullName}
                        className="w-8 h-8 rounded-full object-cover border border-[#CBD5E1]"
                      />
                      <div>
                        <Link
                          to={`/organization/employees?employeeId=${u.employeeId}`}
                          className="font-bold text-[#172B4D] hover:text-[#EA580C] hover:underline flex items-center gap-1.5"
                          title="View Employee Dossier"
                        >
                          <span>{u.fullName}</span>
                          <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                        </Link>
                        <p className="text-[11px] text-[#64748B]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={u.role === 'Super Admin' ? 'navy' : 'info'} size="sm">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-[#64748B] font-mono">{u.phone || '-'}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant="success" size="sm">
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5 text-[#64748B] font-mono">
                    {new Date(u.createdAt).toLocaleDateString()}
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
