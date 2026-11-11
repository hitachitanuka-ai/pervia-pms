import React, { useState } from 'react';
import { db } from '../../lib/database';
import { Position } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Briefcase, Plus, Search } from 'lucide-react';

export const PositionsPage: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>(db.getPositions());
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const departments = db.getDepartments();

  const [newPos, setNewPos] = useState({
    code: '',
    title: '',
    departmentId: departments[0]?.id || '',
    level: 'Senior',
    jobFamily: 'Engineering',
  });

  const filtered = positions.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPos.title || !newPos.code) return;
    const dept = departments.find((d) => d.id === newPos.departmentId);

    db.addPosition({
      code: newPos.code.toUpperCase(),
      title: newPos.title,
      departmentId: newPos.departmentId,
      departmentName: dept?.name || 'Engineering',
      level: newPos.level,
      jobFamily: newPos.jobFamily,
      status: 'Active',
    });

    setPositions([...db.getPositions()]);
    setModalOpen(false);
    setNewPos({
      code: '',
      title: '',
      departmentId: departments[0]?.id || '',
      level: 'Senior',
      jobFamily: 'Engineering',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Position Management</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Job architecture, career levels, and departmental position hierarchies
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add Position
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search positions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#315E91]"
            />
          </div>
          <Badge variant="navy" size="md">
            {positions.length} Standard Titles
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#64748B] font-semibold border-b border-[#E2E8F0] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Position Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Job Family</th>
                <th className="px-6 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#172B4D]">
              {filtered.map((pos) => (
                <tr key={pos.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-6 py-3.5 font-mono font-semibold text-[#315E91]">{pos.code}</td>
                  <td className="px-6 py-3.5 font-bold text-[#172B4D]">{pos.title}</td>
                  <td className="px-4 py-3.5 text-[#475569]">{pos.departmentName}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant="navy" size="sm">
                      {pos.level}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-[#64748B]">{pos.jobFamily || 'General'}</td>
                  <td className="px-6 py-3.5 text-right">
                    <Badge variant="success" size="sm">
                      {pos.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Job Position"
        description="Add a position title to the job architecture catalog"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <Input
            label="Position Code"
            placeholder="e.g. ENG-SRE"
            value={newPos.code}
            onChange={(e) => setNewPos({ ...newPos, code: e.target.value })}
            required
          />
          <Input
            label="Position Title"
            placeholder="e.g. Site Reliability Engineer"
            value={newPos.title}
            onChange={(e) => setNewPos({ ...newPos, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-[#172B4D] mb-1">Department</label>
            <select
              value={newPos.departmentId}
              onChange={(e) => setNewPos({ ...newPos, departmentId: e.target.value })}
              className="w-full rounded-lg border border-[#CBD5E1] p-2 bg-white"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Career Level</label>
              <select
                value={newPos.level}
                onChange={(e) => setNewPos({ ...newPos, level: e.target.value })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 bg-white"
              >
                <option value="Executive">Executive</option>
                <option value="Senior">Senior</option>
                <option value="Middle">Middle</option>
                <option value="Junior">Junior</option>
              </select>
            </div>
            <div>
              <Input
                label="Job Family"
                placeholder="e.g. Infrastructure"
                value={newPos.jobFamily}
                onChange={(e) => setNewPos({ ...newPos, jobFamily: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Position
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
