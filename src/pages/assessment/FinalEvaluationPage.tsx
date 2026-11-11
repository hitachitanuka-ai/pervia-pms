import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../../lib/database';
import { PerformanceEvaluation } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  TrendingUp,
  Sliders,
  Users,
  Target,
  User,
  ExternalLink,
  Printer,
  FileText,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const FinalEvaluationPage: React.FC = () => {
  const { user, role } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>(db.getEvaluations());
  const [selectedEval, setSelectedEval] = useState<PerformanceEvaluation | null>(null);
  const [approvalComment, setApprovalComment] = useState('');

  // Auto-select evaluation if employeeId or id is in URL params
  useEffect(() => {
    const empParam = searchParams.get('employeeId') || searchParams.get('id');
    if (empParam) {
      const match = evaluations.find(
        (e) => e.employeeId === empParam || e.id === empParam
      );
      if (match) {
        setSelectedEval(match);
      }
    }
  }, [searchParams, evaluations]);

  const handleAction = (evalId: string, action: 'Approve' | 'Revision' | 'Finalize') => {
    const list = db.getEvaluations();
    const ev = list.find((e) => e.id === evalId);
    if (!ev) return;

    if (action === 'Approve') {
      ev.status = 'Approved';
      ev.approvedAt = new Date().toISOString();
      ev.stage = 'Final Approval';
    } else if (action === 'Finalize') {
      ev.status = 'Finalized';
      ev.stage = 'Published';
    } else if (action === 'Revision') {
      ev.status = 'Revision Requested';
      ev.stage = 'Supervisor Assessment';
    }

    db.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.fullName || 'Reviewer',
      userRole: role,
      action: `EVALUATION_${action.toUpperCase()}`,
      module: 'Assessment Workflow',
      details: `Evaluation for ${ev.employeeName} set to ${ev.status}. Note: ${approvalComment || 'Approved via workflow.'}`,
    });

    setEvaluations([...list]);
    setSelectedEval(null);
    setApprovalComment('');
  };

  const avgScore = Number(
    (evaluations.reduce((sum, e) => sum + e.finalScore, 0) / (evaluations.length || 1)).toFixed(1)
  );
  const finalizedCount = evaluations.filter((e) => e.status === 'Finalized' || e.status === 'Approved').length;
  const finalizedPercent = Math.round((finalizedCount / (evaluations.length || 1)) * 100);
  const topTierCount = evaluations.filter((e) => e.ratingGrade === 'A' || e.ratingGrade === 'A+').length;
  const topTierPercent = Math.round((topTierCount / (evaluations.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#292524] tracking-tight">
            Final Performance Evaluation
          </h1>
          <p className="text-xs text-[#78716C] mt-1">
            Multi-stage workflow: Self &bull; Supervisor &bull; Competency &bull; 360 Feedback &bull; Calibration
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/assessment/dossier"
            className="text-xs font-bold text-[#EA580C] bg-[#FFEDD5] border border-[#FED7AA] px-3.5 py-2 rounded-full hover:bg-[#FED7AA] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Dossier (PDF)
          </Link>

          <Link
            to="/analytics/talent-matrix"
            className="text-xs font-bold text-[#18181B] bg-white border border-[#E7E4DC] px-3.5 py-2 rounded-full hover:border-[#EA580C] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#EA580C]" />
            9-Box Talent Matrix
          </Link>
        </div>
      </div>

      {/* Top 3 Summary Cards in reference artboard style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Average Final Score */}
        <div className="bg-white rounded-3xl border border-[#EFE4D7] p-5 shadow-[0_8px_24px_rgba(41,37,36,0.04)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                Average Company Score
              </span>
              <div className="text-3xl font-black text-[#292524] mt-1.5">{avgScore}%</div>
              <span className="text-[11px] font-semibold text-[#A8A29E] mt-0.5 block">
                Across {evaluations.length} evaluated roles
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
              <span>Cycle benchmark</span>
              <span className="text-[#EA580C]">{avgScore}%</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-[#FFEDD5]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FDBA74] to-[#EA580C] relative"
                style={{ width: `${Math.min(100, avgScore)}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#EA580C] shadow-sm transform translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Approvals Finalized */}
        <div className="bg-white rounded-3xl border border-[#EFE4D7] p-5 shadow-[0_8px_24px_rgba(41,37,36,0.04)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                Sign-offs Finalized
              </span>
              <div className="text-3xl font-black text-[#292524] mt-1.5">
                {finalizedCount}{' '}
                <span className="text-sm font-semibold text-[#78716C]">/ {evaluations.length}</span>
              </div>
              <span className="text-[11px] font-semibold text-[#A8A29E] mt-0.5 block">
                Department committee sign-offs
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FBBF24] to-[#D97706] text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
              <span>Completion progress</span>
              <span className="text-[#D97706]">{finalizedPercent}%</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-[#FEF3C7]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FCD34D] to-[#D97706] relative"
                style={{ width: `${Math.min(100, finalizedPercent)}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#D97706] shadow-sm transform translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Grade A Distinctions */}
        <div className="bg-white rounded-3xl border border-[#EFE4D7] p-5 shadow-[0_8px_24px_rgba(41,37,36,0.04)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                High Performers (Grade A)
              </span>
              <div className="text-3xl font-black text-[#EA580C] mt-1.5">{topTierPercent}%</div>
              <span className="text-[11px] font-semibold text-[#A8A29E] mt-0.5 block">
                {topTierCount} leaders exceeding quota targets
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB7185] to-[#E11D48] text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
              <span>Bell-curve quota allowance</span>
              <span className="text-[#EA580C]">{topTierPercent}% (Cap 25%)</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-[#FFE4E6]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FDA4AF] to-[#E11D48] relative"
                style={{ width: `${Math.min(100, (topTierPercent / 35) * 100)}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#E11D48] shadow-sm transform translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluations List */}
      <div className="space-y-4">
        {evaluations.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-3xl border border-[#EFE4D7] p-6 shadow-[0_8px_24px_rgba(41,37,36,0.04)] hover:shadow-md transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Employee info */}
              <div className="flex items-start gap-4 max-w-xl">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/20 font-black text-sm">
                  {ev.employeeName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/organization/employees?employeeId=${ev.employeeId}`}
                      className="text-base font-extrabold text-[#292524] hover:text-[#EA580C] hover:underline transition-colors flex items-center gap-1.5"
                      title="View Employee Profile in Directory"
                    >
                      <span>{ev.employeeName}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#A8A29E]" />
                    </Link>
                    <span className="text-[11px] font-bold text-[#78716C] bg-[#F5EFE6] px-2.5 py-0.5 rounded-full">
                      {ev.employeeRole}
                    </span>
                    <Badge
                      size="sm"
                      variant={
                        ev.status === 'Approved' || ev.status === 'Finalized'
                          ? 'terracotta'
                          : ev.status === 'In Review'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {ev.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-[#78716C]">
                    Division:{' '}
                    <Link
                      to={`/organization/employees?dept=${encodeURIComponent(ev.departmentName)}`}
                      className="font-bold text-[#292524] hover:text-[#EA580C] hover:underline"
                    >
                      {ev.departmentName}
                    </Link>{' '}
                    &bull; Manager: <strong className="text-[#292524]">{ev.managerName}</strong> &bull; Stage:{' '}
                    <strong className="text-[#EA580C]">{ev.stage}</strong>
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-[#EA580C] bg-[#FFEDD5] px-3 py-0.5 rounded-full flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Grade: {ev.ratingGrade}
                    </span>
                    <span className="text-xs text-[#78716C]">
                      Calibration Status: <strong className="text-[#292524]">Calibrated</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Multi-stage Component Tracks with indicator knobs */}
              <div className="bg-[#FDFBF9] p-4 rounded-2xl border border-[#F5EFE6] space-y-3 min-w-[280px] lg:w-80">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#292524]">Component Weights</span>
                  <span className="text-[10px] font-extrabold text-[#EA580C] uppercase tracking-wider">
                    Total: {ev.finalScore}%
                  </span>
                </div>

                {/* KPI Track 60% */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#78716C]">KPI (60% wt)</span>
                    <span className="font-bold text-[#292524]">
                      {ev.kpiScore}% <span className="text-[#A8A29E]">({(ev.kpiScore * 0.6).toFixed(1)} pts)</span>
                    </span>
                  </div>
                  <div className="relative w-full h-1.5 rounded-full bg-[#FFEDD5]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FDBA74] to-[#EA580C] relative"
                      style={{ width: `${Math.min(100, ev.kpiScore)}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#EA580C] shadow-sm transform translate-x-1/2"></div>
                    </div>
                  </div>
                </div>

                {/* Competency Track 20% */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#78716C]">Competency (20% wt)</span>
                    <span className="font-bold text-[#292524]">
                      {ev.competencyScore}%{' '}
                      <span className="text-[#A8A29E]">({(ev.competencyScore * 0.2).toFixed(1)} pts)</span>
                    </span>
                  </div>
                  <div className="relative w-full h-1.5 rounded-full bg-[#FEF3C7]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#FCD34D] to-[#D97706] relative"
                      style={{ width: `${Math.min(100, ev.competencyScore)}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#D97706] shadow-sm transform translate-x-1/2"></div>
                    </div>
                  </div>
                </div>

                {/* Behavioral & 360 Feedback row */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F5EFE6] text-[11px]">
                  <div>
                    <span className="text-[#A8A29E] block text-[10px]">Behav (10%)</span>
                    <strong className="text-[#292524]">{ev.behavioralScore}%</strong>
                  </div>
                  <div>
                    <span className="text-[#A8A29E] block text-[10px]">360 (10%)</span>
                    <strong className="text-[#292524]">{ev.feedbackScore}%</strong>
                  </div>
                </div>
              </div>

              {/* Approval Actions */}
              <div className="flex flex-wrap lg:flex-col items-stretch gap-2 shrink-0">
                <Link
                  to={`/assessment/dossier?employeeId=${ev.employeeId}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-[#FED7AA] bg-[#FFF7ED] text-[11px] font-bold text-[#EA580C] hover:bg-[#FFEDD5] transition-colors shadow-2xs"
                  title="Lihat Formulir Penilaian & Cetak PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Dossier (PDF)
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setSelectedEval(ev)}
                >
                  Review Scoring
                </Button>

                {ev.status !== 'Finalized' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full shadow-sm text-xs"
                    onClick={() => handleAction(ev.id, 'Approve')}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Approve Score
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Evaluation Review Modal */}
      {selectedEval && (
        <Modal
          isOpen={Boolean(selectedEval)}
          onClose={() => setSelectedEval(null)}
          title={`Evaluation Dossier: ${selectedEval.employeeName}`}
          description={`Comprehensive Performance Review • Overall Score: ${selectedEval.finalScore}%`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#FFEDD5] rounded-2xl border border-[#FED7AA] space-y-2">
              <h4 className="font-bold text-[#9A3412]">Enterprise Score Formula Breakdown</h4>
              <p className="font-mono text-[#C2410C] text-xs">
                ({selectedEval.kpiScore} &times; 0.60) + ({selectedEval.competencyScore} &times; 0.20) + (
                {selectedEval.behavioralScore} &times; 0.10) + ({selectedEval.feedbackScore} &times; 0.10) ={' '}
                <strong className="text-sm font-black text-[#292524]">{selectedEval.finalScore}%</strong>
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#FED7AA]/60">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEval(null);
                    navigate(`/assessment/dossier?employeeId=${selectedEval.employeeId}`);
                  }}
                  className="text-[11px] font-bold text-[#EA580C] bg-white/70 hover:bg-white rounded-full shadow-2xs"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                >
                  Buka Dossier Resmi & Cetak PDF &rarr;
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEval(null);
                    navigate(`/kpi/actuals?employeeId=${selectedEval.employeeId}`);
                  }}
                  className="text-[11px] font-bold text-[#78716C] hover:bg-white/80 rounded-full"
                  leftIcon={<Target className="w-3.5 h-3.5" />}
                >
                  KPI Actuals &rarr;
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEval(null);
                    navigate(`/organization/employees?employeeId=${selectedEval.employeeId}`);
                  }}
                  className="text-[11px] font-bold text-[#78716C] hover:bg-white/80 rounded-full"
                  leftIcon={<User className="w-3.5 h-3.5" />}
                >
                  Profile &rarr;
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#292524] mb-1">
                Calibration Committee / Approver Review Notes
              </label>
              <textarea
                rows={3}
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="Enter justification or approval notes for this cycle..."
                className="w-full rounded-2xl border border-[#EFE4D7] p-3 text-xs focus:outline-none focus:border-[#EA580C] focus:ring-3 focus:ring-[#FFEDD5] transition-all bg-white"
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#F5EFE6]">
              <Button
                variant="danger"
                size="sm"
                className="rounded-full"
                onClick={() => handleAction(selectedEval.id, 'Revision')}
                leftIcon={<RotateCcw className="w-3 h-3" />}
              >
                Request Revision
              </Button>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedEval(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-full shadow-sm"
                  onClick={() => handleAction(selectedEval.id, 'Finalize')}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Publish & Finalize
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
