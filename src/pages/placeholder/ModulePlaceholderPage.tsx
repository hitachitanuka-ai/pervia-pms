import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/database';

interface ModuleMetadata {
  title: string;
  category: string;
  description: string;
  primaryAction: { label: string; to: string };
  metrics: { label: string; value: string | number }[];
}

export const ModulePlaceholderPage: React.FC = () => {
  const location = useLocation();
  const { role } = useAuth();

  const getMetadata = (path: string): ModuleMetadata => {
    if (path.includes('calendar')) {
      return {
        title: 'Evaluation Calendar',
        category: 'Performance Cycle',
        description: 'Company-wide timeline of performance submission windows, review deadlines, and calibration meetings.',
        primaryAction: { label: 'View Evaluation Periods', to: '/cycle/periods' },
        metrics: [
          { label: 'Active Cycle', value: '2026 Q1' },
          { label: 'Self Assessment Cutoff', value: 'Apr 7, 2026' },
          { label: 'Calibration Review', value: 'Apr 21, 2026' },
        ],
      };
    }
    if (path.includes('workflow')) {
      return {
        title: 'Evaluation Workflow',
        category: 'Performance Cycle',
        description: 'Automated 9-step evaluation pipeline with supervisory escalations and HR sign-offs.',
        primaryAction: { label: 'Go to Final Evaluation', to: '/assessment/final' },
        metrics: [
          { label: 'Workflow Stages', value: '9 Stages' },
          { label: 'Active Stage', value: 'Stage 2: Supervisor' },
          { label: 'Approvals Pending', value: '4 Evaluations' },
        ],
      };
    }
    if (path.includes('self')) {
      return {
        title: 'Employee Self Assessment',
        category: 'Assessment',
        description: 'Employee portal to record self-reflections, KPI deliverables, competency ratings, and qualitative milestones.',
        primaryAction: { label: 'Track KPI Actuals', to: '/kpi/actuals' },
        metrics: [
          { label: 'Self Score Draft', value: '98.5%' },
          { label: 'Competencies Rated', value: '5 / 5' },
          { label: 'Due Date', value: 'Apr 7, 2026' },
        ],
      };
    }
    if (path.includes('supervisor')) {
      return {
        title: 'Supervisor Assessment',
        category: 'Assessment',
        description: 'Manager evaluation portal to review direct reports, verify evidence, score competencies, and submit review ratings.',
        primaryAction: { label: 'Conduct Final Evaluation', to: '/assessment/final' },
        metrics: [
          { label: 'Direct Reports', value: '2 Team Members' },
          { label: 'Completed Reviews', value: '1 / 2' },
          { label: 'Pending Verification', value: '1 Evidence File' },
        ],
      };
    }
    if (path.includes('360-feedback')) {
      return {
        title: '360-Degree Peer Feedback',
        category: 'Assessment',
        description: 'Multi-rater feedback from peers, subordinates, and stakeholders with enforced minimum respondent thresholds.',
        primaryAction: { label: 'View Evaluation Summary', to: '/assessment/final' },
        metrics: [
          { label: 'Min Respondent Threshold', value: '3 Completed' },
          { label: 'Anonymity Shield', value: 'Active' },
          { label: 'Weight Allocation', value: '10% of Final' },
        ],
      };
    }
    if (path.includes('calibration')) {
      return {
        title: 'Assessment Calibration Committee',
        category: 'Assessment',
        description: 'HR and departmental leadership calibration session to align performance distribution across teams and eliminate rating bias.',
        primaryAction: { label: 'View All Evaluations', to: '/assessment/final' },
        metrics: [
          { label: 'Bell Curve Compliance', value: '96% Alignment' },
          { label: 'Evaluations in Review', value: '4 Records' },
          { label: 'Committee Lead', value: 'Marcus Sterling' },
        ],
      };
    }
    if (path.includes('coaching')) {
      return {
        title: 'Coaching & Mentoring Records',
        category: 'Development',
        description: 'Structured 1-on-1 supervisory coaching logs, discussion agendas, and mutual action item tracking.',
        primaryAction: { label: 'Go to Employees', to: '/organization/employees' },
        metrics: [
          { label: 'Active Coaching Plans', value: '3 Sessions' },
          { label: 'Next Scheduled', value: 'Tomorrow 10:00 AM' },
          { label: 'Action Items Done', value: '85%' },
        ],
      };
    }
    if (path.includes('pip')) {
      return {
        title: 'Performance Improvement Plan (PIP)',
        category: 'Development',
        description: 'Structured improvement programs with objective targets, bi-weekly reviews, and supportive coaching notes.',
        primaryAction: { label: 'View Employee Directory', to: '/organization/employees' },
        metrics: [
          { label: 'Active PIP Plans', value: '1 Plan' },
          { label: 'Review Frequency', value: 'Bi-Weekly' },
          { label: 'Objective Milestones', value: '3 Defined' },
        ],
      };
    }

    return {
      title: 'Performance Management Module',
      category: 'Analytics & Administration',
      description: 'Enterprise data module configured with PostgreSQL relational persistence and role-based access control.',
      primaryAction: { label: 'Return to Dashboard', to: '/dashboard' },
      metrics: [
        { label: 'Active Tenant', value: db.getCompany().name },
        { label: 'User Role', value: role },
        { label: 'Database State', value: 'Online' },
      ],
    };
  };

  const meta = getMetadata(location.pathname);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider bg-[#ECFDF5] px-2.5 py-0.5 rounded-full">
              {meta.category}
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#0F172A] mt-1">{meta.title}</h1>
          <p className="text-xs text-[#64748B] mt-0.5 max-w-2xl leading-relaxed">{meta.description}</p>
        </div>

        <Link to={meta.primaryAction.to}>
          <Button variant="primary" size="sm" className="rounded-full shadow-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            {meta.primaryAction.label}
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {meta.metrics.map((m, idx) => (
          <Card key={idx} hover className="p-5">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              {m.label}
            </span>
            <p className="text-xl font-extrabold text-[#0F172A] mt-1">{m.value}</p>
          </Card>
        ))}
      </div>

      {/* Module Overview Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">Enterprise System Status</h3>
            <p className="text-xs text-[#64748B]">Normalized relational database &bull; Schema 001_initial_schema.sql</p>
          </div>
          <Link to="/admin/database">
            <Button variant="outline" size="sm" className="rounded-full">
              View Database
            </Button>
          </Link>
        </div>

        <div className="p-4 bg-[#FAFBFD] border border-[#E8EEF3] rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-bold text-[#0F172A]">Module Configured & Healthy</p>
            <p className="text-[#64748B] mt-0.5">
              Role permissions and audit logs active for this performance lifecycle phase.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
