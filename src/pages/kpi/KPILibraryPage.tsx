import React, { useState } from 'react';
import { db } from '../../lib/database';
import { KPIIndicator, MeasurementType, CalculationDirection } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { BookOpen, Plus, Search, Filter, Copy, Archive, Target, Layers } from 'lucide-react';

export const KPILibraryPage: React.FC = () => {
  const [kpis, setKpis] = useState<KPIIndicator[]>(db.getKPIIndicators());
  const [search, setSearch] = useState('');
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  const [newKPI, setNewKPI] = useState({
    code: '',
    name: '',
    description: '',
    category: 'Operational Excellence',
    measurementType: 'Percentage' as MeasurementType,
    direction: 'Higher Is Better' as CalculationDirection,
    defaultTarget: 100,
    defaultWeight: 25,
    minScore: 0,
    maxScore: 120,
    unit: '%',
    dataSource: 'Jira / GitHub',
  });

  const filtered = kpis.filter((k) => {
    const matchesSearch =
      k.name.toLowerCase().includes(search.toLowerCase()) ||
      k.code.toLowerCase().includes(search.toLowerCase()) ||
      k.category.toLowerCase().includes(search.toLowerCase());
    const matchesDir = selectedDirection === 'all' || k.direction === selectedDirection;
    return matchesSearch && matchesDir;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKPI.name || !newKPI.code) return;

    const created: KPIIndicator = {
      id: `kpi-${Date.now()}`,
      companyId: db.getCompany().id,
      code: newKPI.code.toUpperCase(),
      name: newKPI.name,
      description: newKPI.description,
      category: newKPI.category,
      departmentName: 'Engineering & Technology',
      measurementType: newKPI.measurementType,
      direction: newKPI.direction,
      defaultTarget: Number(newKPI.defaultTarget),
      defaultWeight: Number(newKPI.defaultWeight),
      minScore: Number(newKPI.minScore),
      maxScore: Number(newKPI.maxScore),
      unit: newKPI.unit,
      dataSource: newKPI.dataSource,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };

    const next = [...kpis, created];
    setKpis(next);
    setModalOpen(false);
  };

  const handleDuplicate = (kpi: KPIIndicator) => {
    const dup: KPIIndicator = {
      ...kpi,
      id: `kpi-${Date.now()}`,
      code: `${kpi.code}-COPY`,
      name: `${kpi.name} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    setKpis([...kpis, dup]);
  };

  const totalWeight = kpis.reduce((sum, k) => sum + k.defaultWeight, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">KPI Library</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Standardized corporate Key Performance Indicators with formula directions and weight rules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            size="md"
            variant={totalWeight === 100 ? 'success' : 'warning'}
            className="hidden sm:inline-flex"
          >
            Active Weight Allocation: {totalWeight}% {totalWeight === 100 ? '(Balanced)' : ''}
          </Badge>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create KPI
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by KPI name, code or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#315E91]"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-[#64748B] font-medium">Calculation Direction:</span>
            <select
              value={selectedDirection}
              onChange={(e) => setSelectedDirection(e.target.value)}
              className="text-xs rounded-lg border border-[#CBD5E1] px-2.5 py-1.5 bg-white text-[#172B4D] focus:outline-none"
            >
              <option value="all">All Directions</option>
              <option value="Higher Is Better">Higher Is Better</option>
              <option value="Lower Is Better">Lower Is Better</option>
              <option value="Exact Target">Exact Target</option>
              <option value="Milestone">Milestone</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((kpi) => (
          <Card key={kpi.id} hover>
            <CardHeader className="py-3 px-5">
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-bold text-[#315E91] bg-[#EAF1F8] px-2 py-0.5 rounded">
                  {kpi.code}
                </span>
                <Badge
                  size="sm"
                  variant={kpi.direction === 'Higher Is Better' ? 'info' : 'warning'}
                >
                  {kpi.direction}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div>
                <h3 className="text-sm font-bold text-[#172B4D]">{kpi.name}</h3>
                <p className="text-xs text-[#64748B] mt-1">{kpi.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0] text-xs">
                <div>
                  <span className="text-[#64748B] text-[10px] uppercase font-semibold block">Target</span>
                  <span className="font-bold text-[#172B4D]">
                    {kpi.defaultTarget} {kpi.unit}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[10px] uppercase font-semibold block">Weight</span>
                  <span className="font-bold text-[#315E91]">{kpi.defaultWeight}%</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[10px] uppercase font-semibold block">Cap Range</span>
                  <span className="font-mono text-[11px] text-[#64748B]">
                    {kpi.minScore}% – {kpi.maxScore}%
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-[#64748B]">
                <span className="truncate">Source: {kpi.dataSource}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicate(kpi)}
                    leftIcon={<Copy className="w-3 h-3" />}
                  >
                    Duplicate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New KPI Indicator"
        description="Add a metric with custom formula direction and scoring boundaries"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="KPI Code"
              placeholder="e.g. ENG-KPI-05"
              value={newKPI.code}
              onChange={(e) => setNewKPI({ ...newKPI, code: e.target.value })}
              required
            />
            <Input
              label="Category"
              placeholder="e.g. Operational Excellence"
              value={newKPI.category}
              onChange={(e) => setNewKPI({ ...newKPI, category: e.target.value })}
              required
            />
          </div>

          <Input
            label="KPI Name"
            placeholder="e.g. Test Automation Code Coverage"
            value={newKPI.name}
            onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
            required
          />

          <Input
            label="Description"
            placeholder="Detailed description and calculation criteria"
            value={newKPI.description}
            onChange={(e) => setNewKPI({ ...newKPI, description: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Calculation Direction</label>
              <select
                value={newKPI.direction}
                onChange={(e) => setNewKPI({ ...newKPI, direction: e.target.value as CalculationDirection })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 bg-white"
              >
                <option value="Higher Is Better">Higher Is Better (Actual / Target × 100)</option>
                <option value="Lower Is Better">Lower Is Better (Target / Actual × 100)</option>
                <option value="Exact Target">Exact Target</option>
                <option value="Milestone">Milestone</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Measurement Type</label>
              <select
                value={newKPI.measurementType}
                onChange={(e) => setNewKPI({ ...newKPI, measurementType: e.target.value as MeasurementType })}
                className="w-full rounded-lg border border-[#CBD5E1] p-2 bg-white"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Numeric">Numeric</option>
                <option value="Rating">Rating</option>
                <option value="Milestone">Milestone</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Target"
              type="number"
              value={newKPI.defaultTarget}
              onChange={(e) => setNewKPI({ ...newKPI, defaultTarget: Number(e.target.value) })}
              required
            />
            <Input
              label="Weight (%)"
              type="number"
              value={newKPI.defaultWeight}
              onChange={(e) => setNewKPI({ ...newKPI, defaultWeight: Number(e.target.value) })}
              required
            />
            <Input
              label="Unit"
              value={newKPI.unit}
              onChange={(e) => setNewKPI({ ...newKPI, unit: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <Button variant="ghost" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save KPI
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
