import React, { useState } from 'react';
import { db } from '../../lib/database';
import { EvaluationPeriod, PeriodType, PeriodStatus } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Calendar, Plus, Lock, CheckCircle, Archive, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const EvaluationPeriodsPage: React.FC = () => {
  const { user } = useAuth();
  const [periods, setPeriods] = useState<EvaluationPeriod[]>(db.getPeriods());
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newPeriod, setNewPeriod] = useState({
    name: '',
    code: '',
    type: 'Quarterly' as PeriodType,
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    submissionDeadline: '2026-10-07',
    reviewDeadline: '2026-10-21',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (new Date(newPeriod.startDate) > new Date(newPeriod.endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    const created = db.addPeriod({
      name: newPeriod.name,
      code: newPeriod.code.toUpperCase(),
      type: newPeriod.type,
      startDate: newPeriod.startDate,
      endDate: newPeriod.endDate,
      submissionDeadline: newPeriod.submissionDeadline,
      reviewDeadline: newPeriod.reviewDeadline,
      status: 'Draft',
      totalParticipants: 115,
      completionRate: 0,
    });

    setPeriods([...db.getPeriods()]);
    setModalOpen(false);
  };

  const handleUpdateStatus = (id: string, newStatus: PeriodStatus) => {
    const list = db.getPeriods();
    const target = list.find((p) => p.id === id);
    if (target) {
      target.status = newStatus;
      setPeriods([...list]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Evaluation Periods</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configure flexible performance evaluation cadences (Weekly, Monthly, Quarterly, Annually, Custom)
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setModalOpen(true)}
          className="rounded-full shadow-xs"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Create Period
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {periods.map((period) => (
          <Card key={period.id} hover className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-extrabold text-[#0F172A]">{period.name}</h3>
                  <span className="text-[11px] font-mono font-bold text-[#10B981] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full">
                    {period.code}
                  </span>
                  <Badge
                    size="sm"
                    variant={
                      period.status === 'Active'
                        ? 'success'
                        : period.status === 'Locked'
                        ? 'warning'
                        : 'default'
                    }
                  >
                    {period.status}
                  </Badge>
                  <span className="text-[11px] font-medium text-[#475569] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full">
                    {period.type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                    <strong>Period:</strong> {period.startDate} to {period.endDate}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <strong>Submission:</strong> {period.submissionDeadline}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                    <strong>Review:</strong> {period.reviewDeadline}
                  </span>
                </div>

                {period.totalParticipants !== undefined && (
                  <div className="pt-2 max-w-md">
                    <div className="flex items-center justify-between text-[11px] text-[#64748B] mb-1">
                      <span>Participants: {period.totalParticipants}</span>
                      <span className="font-bold text-[#0F172A]">{period.completionRate}% Done</span>
                    </div>
                    <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#10B981] h-2 rounded-full transition-all"
                        style={{ width: `${period.completionRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* State transitions */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                {period.status === 'Draft' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full shadow-xs"
                    onClick={() => handleUpdateStatus(period.id, 'Active')}
                  >
                    Activate Cycle
                  </Button>
                )}
                {period.status === 'Active' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleUpdateStatus(period.id, 'Locked')}
                    leftIcon={<Lock className="w-3 h-3" />}
                  >
                    Lock Submissions
                  </Button>
                )}
                {period.status === 'Locked' && (
                  <Button
                    variant="soft"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleUpdateStatus(period.id, 'Closed')}
                    leftIcon={<CheckCircle className="w-3 h-3" />}
                  >
                    Close Period
                  </Button>
                )}
                {period.status === 'Closed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleUpdateStatus(period.id, 'Archived')}
                    leftIcon={<Archive className="w-3 h-3" />}
                  >
                    Archive
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Evaluation Period"
        description="Define a new performance evaluation cycle"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}
          <Input
            label="Period Name"
            placeholder="e.g. 2026 Q3 Performance Cycle"
            value={newPeriod.name}
            onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Period Code"
              placeholder="CYC-2026-Q3"
              value={newPeriod.code}
              onChange={(e) => setNewPeriod({ ...newPeriod, code: e.target.value })}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">Cadence</label>
              <select
                value={newPeriod.type}
                onChange={(e) => setNewPeriod({ ...newPeriod, type: e.target.value as PeriodType })}
                className="w-full rounded-xl border border-[#E2E8F0] p-2 bg-white text-xs"
              >
                <option value="Quarterly">Quarterly</option>
                <option value="Annually">Annually</option>
                <option value="Monthly">Monthly</option>
                <option value="Weekly">Weekly</option>
                <option value="Custom">Custom Interval</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={newPeriod.startDate}
              onChange={(e) => setNewPeriod({ ...newPeriod, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={newPeriod.endDate}
              onChange={(e) => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Submission Deadline"
              type="date"
              value={newPeriod.submissionDeadline}
              onChange={(e) => setNewPeriod({ ...newPeriod, submissionDeadline: e.target.value })}
              required
            />
            <Input
              label="Review Deadline"
              type="date"
              value={newPeriod.reviewDeadline}
              onChange={(e) => setNewPeriod({ ...newPeriod, reviewDeadline: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-[#F1F5F9]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Discard
            </Button>
            <Button variant="primary" size="sm" type="submit" className="rounded-xl shadow-xs">
              Save Period
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
