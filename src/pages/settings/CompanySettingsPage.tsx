import React, { useState } from 'react';
import { db } from '../../lib/database';
import { Company } from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BuildingIcon, Save, CheckCircle2, ShieldCheck, Sliders } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const CompanySettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company>(db.getCompany());
  const [weights, setWeights] = useState({
    kpi: 60,
    competency: 20,
    behavioral: 10,
    feedback: 10,
  });
  const [minRespondents, setMinRespondents] = useState(3);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const totalWeight = weights.kpi + weights.competency + weights.behavioral + weights.feedback;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalWeight !== 100) return;

    db.addAuditLog({
      userId: user?.id || 'admin',
      userName: user?.fullName || 'Super Admin',
      userRole: user?.role || 'Super Admin',
      action: 'COMPANY_SETTINGS_UPDATED',
      module: 'System Administration',
      details: `Updated enterprise settings and weights for ${company.name}`,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172B4D]">Company & System Settings</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Enterprise tenancy parameters, corporate branding, and evaluation scoring formulas
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Identity */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Identity</CardTitle>
            <CardDescription>Primary corporate tenant details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Legal Name"
                value={company.name}
                onChange={(e) => setCompany({ ...company, name: e.target.value })}
                required
              />
              <Input
                label="Company Code (Tenant ID)"
                value={company.code}
                onChange={(e) => setCompany({ ...company, code: e.target.value })}
                required
              />
              <Input
                label="Primary Business Domain"
                value={company.domain || ''}
                onChange={(e) => setCompany({ ...company, domain: e.target.value })}
              />
              <Input
                label="Default Timezone"
                value={company.timezone}
                onChange={(e) => setCompany({ ...company, timezone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Global Performance Evaluation Weights (Must equal 100%) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Master Evaluation Scoring Formula</CardTitle>
                <CardDescription>
                  Configure baseline component weight allocations. Total must strictly equal 100%.
                </CardDescription>
              </div>
              <Badge
                size="md"
                variant={totalWeight === 100 ? 'success' : 'danger'}
              >
                Sum: {totalWeight}% {totalWeight === 100 ? '(Valid)' : '(Invalid)'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="KPI Weight (%)"
                type="number"
                value={weights.kpi}
                onChange={(e) => setWeights({ ...weights, kpi: Number(e.target.value) })}
                required
              />
              <Input
                label="Competency Weight (%)"
                type="number"
                value={weights.competency}
                onChange={(e) => setWeights({ ...weights, competency: Number(e.target.value) })}
                required
              />
              <Input
                label="Behavioral Weight (%)"
                type="number"
                value={weights.behavioral}
                onChange={(e) => setWeights({ ...weights, behavioral: Number(e.target.value) })}
                required
              />
              <Input
                label="360 Feedback Weight (%)"
                type="number"
                value={weights.feedback}
                onChange={(e) => setWeights({ ...weights, feedback: Number(e.target.value) })}
                required
              />
            </div>

            <div className="pt-2">
              <Input
                label="360 Feedback Minimum Anonymity Threshold"
                type="number"
                value={minRespondents}
                onChange={(e) => setMinRespondents(Number(e.target.value))}
                helperText="Minimum number of completed peer submissions required before showing aggregate results"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            {savedSuccess && (
              <span className="text-xs text-[#16A36A] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Company configurations updated successfully!
              </span>
            )}
            {!savedSuccess && <span />}

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={totalWeight !== 100}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Save Enterprise Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
