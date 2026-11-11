import React, { useState } from 'react';
import { db } from '../../lib/database';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ScrollText, Search, ShieldCheck, Download } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { downloadCsv } from '../../utils/exportHelpers';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState(db.getAuditLogs());
  const [search, setSearch] = useState('');
  const [filterModule, setFilterModule] = useState('all');

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());
    const matchesModule = filterModule === 'all' || log.module === filterModule;
    return matchesSearch && matchesModule;
  });

  const exportCSV = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Details', 'IP'];
    const rows = filtered.map((l) => [
      l.timestamp,
      l.userName,
      l.userRole,
      l.action,
      l.module,
      l.details,
      l.ipAddress || '-',
    ]);
    downloadCsv(`audit_logs_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">System Audit Logs</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Immutable, ISO 27001-compliant tracking of all administrative actions, logins, and score updates
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportCSV}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export CSV Log
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by action, user or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#315E91]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-[#64748B] font-medium">Module:</span>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="text-xs rounded-lg border border-[#CBD5E1] px-2.5 py-1.5 bg-white text-[#172B4D] focus:outline-none"
            >
              <option value="all">All Modules</option>
              <option value="Authentication">Authentication</option>
              <option value="Performance Cycle">Performance Cycle</option>
              <option value="KPI Management">KPI Management</option>
              <option value="Assessment">Assessment</option>
              <option value="System Administration">System Administration</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-6 py-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#172B4D]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-6 py-3 font-mono text-[11px] text-[#64748B] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#172B4D] whitespace-nowrap">
                    {log.userName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Badge variant="navy" size="sm">
                      {log.userRole}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-[#315E91] whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-[#64748B] whitespace-nowrap">{log.module}</td>
                  <td className="px-6 py-3 text-[#475569]">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
