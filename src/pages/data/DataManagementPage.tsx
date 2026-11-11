import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  FileSpreadsheet,
  Download,
  KeyRound,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  RefreshCw,
  FileCheck2,
  Shield,
  Layers,
} from 'lucide-react';
import { db } from '../../lib/database';
import {
  downloadTemplate,
  downloadExcel,
  downloadCsv,
  downloadJson,
  exportCompanyReportPdf,
} from '../../utils/exportHelpers';

export const DataManagementPage: React.FC = () => {
  const location = useLocation();

  const getInitialTab = () => {
    if (location.pathname.includes('/export')) return 'export';
    if (location.pathname.includes('/api')) return 'api';
    return 'import';
  };

  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'api'>(getInitialTab());
  const [selectedFormat, setSelectedFormat] = useState<'xlsx' | 'csv' | 'pdf' | 'json'>('xlsx');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const sampleApiKey = 'prv_live_9f81a7b8e21c4390d45a9934e8';

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      }, 1500);
    }
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(sampleApiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            Data Architecture & Ingest
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            Data Management & Integrations
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Bulk ingest Excel spreadsheets, export appraisals, and configure real-time HRIS REST API webhooks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Capsule Tab Switcher */}
          <div className="bg-[#EBE9E2] border border-[#DDD9CE] rounded-full p-1 flex items-center gap-1 shadow-xs">
            <button
              onClick={() => setActiveTab('import')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'import'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              Import Data
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'export'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              Export Dossiers
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                activeTab === 'api'
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              API & Webhooks
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Import Excel / CSV */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 border-[#E7E4DC] bg-white flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#18181B]">Employee Roster Template</h4>
                <p className="text-xs text-[#78716C] mt-1">
                  Standard template with Employee ID, Department, Job Title, and Manager Hierarchy columns.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadTemplate('roster')}
                className="mt-4 rounded-full"
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download (.xlsx)
              </Button>
            </Card>

            <Card className="p-5 border-[#E7E4DC] bg-white flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#18181B]">KPI Targets & Metrics Ingest</h4>
                <p className="text-xs text-[#78716C] mt-1">
                  Pre-configured workbook containing Target Quotas, Thresholds, Scoring Formulas, and Weights.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadTemplate('kpis')}
                className="mt-4 rounded-full"
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download (.xlsx)
              </Button>
            </Card>

            <Card className="p-5 border-[#E7E4DC] bg-white flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mb-3">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#18181B]">Actual Performance Submissions</h4>
                <p className="text-xs text-[#78716C] mt-1">
                  Batch actual deliverables ingest for automated monthly or quarterly appraisal updates.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadTemplate('actuals')}
                className="mt-4 rounded-full"
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download (.xlsx)
              </Button>
            </Card>
          </div>

          {/* Upload Dropzone */}
          <Card className="p-8 border-2 border-dashed border-[#DDD9CE] bg-[#FDFBF9] rounded-3xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] text-[#EA580C] mx-auto flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#18181B]">
                Upload Performance Spreadsheet
              </h3>
              <p className="text-xs text-[#78716C] mt-1">
                Drag and drop your .xlsx or .csv workbook, or browse your local file system.
              </p>
            </div>

            <label className="inline-block cursor-pointer">
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleSimulatedUpload}
                className="hidden"
              />
              <Button
                variant="primary"
                size="md"
                disabled={isUploading}
                className="rounded-full shadow-xs pointer-events-none"
              >
                {isUploading ? 'Validating Schema...' : 'Select File from Device'}
              </Button>
            </label>

            {uploadSuccess && (
              <div className="p-3 bg-[#DCFCE7] text-[#16A34A] text-xs font-bold rounded-2xl inline-flex items-center gap-2 mx-auto">
                <CheckCircle2 className="w-4 h-4" />
                <span>Spreadsheet successfully validated and 128 records synced!</span>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab 2: Export Performance Dossiers */}
      {activeTab === 'export' && (
        <Card className="p-6 border-[#E7E4DC] bg-white space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#18181B]">Export Evaluation & Appraisal Dossiers</h3>
            <p className="text-xs text-[#78716C] mt-1">
              Select output format and scope to download complete historical performance packages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { id: 'xlsx', label: 'Microsoft Excel (.xlsx)', desc: 'Multi-tab workbook with formulas' },
              { id: 'csv', label: 'Comma-Separated (.csv)', desc: 'Raw normalized tabular format' },
              { id: 'pdf', label: 'Executive Dossier (.pdf)', desc: 'Formatted reports with signatures' },
              { id: 'json', label: 'Relational JSON Schema', desc: 'Direct DDL payload backup' },
            ].map((f) => (
              <div
                key={f.id}
                onClick={() => setSelectedFormat(f.id as any)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedFormat === f.id
                    ? 'border-[#EA580C] bg-[#FFF7ED] shadow-xs'
                    : 'border-[#E7E4DC] hover:border-[#DDD9CE] bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#18181B]">{f.label}</span>
                  {selectedFormat === f.id && <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />}
                </div>
                <p className="text-[11px] text-[#78716C] mt-1">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#F5EFE6] flex items-center justify-between">
            <span className="text-xs text-[#78716C]">
              Includes: 38 Relational tables &bull; 128 employee dossiers &bull; Q1 2026 Cycle
            </span>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                const dateStr = new Date().toISOString().slice(0, 10);
                const employees = db.getEmployees();
                const departments = db.getDepartments();

                if (selectedFormat === 'xlsx') {
                  const empData = employees.map((e) => ({
                    'Employee ID': e.employeeId,
                    'Full Name': e.fullName,
                    Department: e.departmentName,
                    Position: e.positionTitle,
                    Status: e.employmentStatus,
                    Role: e.role,
                  }));
                  downloadExcel(`Pervia_Enterprise_Data_Archive_${dateStr}.xlsx`, [
                    { name: 'Employees', data: empData },
                    { name: 'Departments', data: departments },
                  ]);
                } else if (selectedFormat === 'csv') {
                  const headers = ['Employee ID', 'Full Name', 'Department', 'Position', 'Status', 'Role', 'Email'];
                  const rows = employees.map((e) => [
                    e.employeeId,
                    e.fullName,
                    e.departmentName,
                    e.positionTitle,
                    e.employmentStatus,
                    e.role,
                    e.email,
                  ]);
                  downloadCsv(`Pervia_Enterprise_Data_Archive_${dateStr}.csv`, headers, rows);
                } else if (selectedFormat === 'pdf') {
                  exportCompanyReportPdf();
                } else if (selectedFormat === 'json') {
                  downloadJson(`Pervia_Complete_Schema_Backup_${dateStr}.json`, {
                    employees,
                    departments,
                    evaluations: db.getEvaluations(),
                    dossiers: db.getAppraisalDossiers(),
                  });
                }
              }}
              className="rounded-full shadow-xs"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Export Archive
            </Button>
          </div>
        </Card>
      )}

      {/* Tab 3: API & Webhooks */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#18181B]">Enterprise REST API Token</h3>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Bearer token for enterprise HRIS systems (Workday, BambooHR, SAP SuccessFactors).
                </p>
              </div>
              <Badge variant="success">Active v2.4</Badge>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#FDFBF9] border border-[#DDD9CE]">
              <code className="text-xs font-mono text-[#18181B] flex-1 truncate">
                {sampleApiKey}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyApiKey}
                className="rounded-xl shrink-0"
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                {apiKeyCopied ? 'Copied!' : 'Copy Key'}
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
            <h3 className="text-base font-bold text-[#18181B]">REST Endpoints Directory</h3>
            <div className="space-y-2 text-xs">
              {[
                { method: 'GET', endpoint: '/api/v1/employees', desc: 'List active staff, roles, and supervisor mapping' },
                { method: 'POST', endpoint: '/api/v1/kpi-actuals', desc: 'Ingest real-time KPI deliverable metrics' },
                { method: 'GET', endpoint: '/api/v1/evaluations/final', desc: 'Retrieve composite appraisal ratings and grade bands' },
                { method: 'POST', endpoint: '/api/v1/webhooks/subscribe', desc: 'Register callbacks for evaluation sign-offs' },
              ].map((ep) => (
                <div
                  key={ep.endpoint}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#FDFBF9] border border-[#F5EFE6]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        ep.method === 'GET'
                          ? 'bg-[#E0F2FE] text-[#0284C7]'
                          : 'bg-[#DCFCE7] text-[#16A34A]'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <code className="font-mono font-bold text-[#18181B]">{ep.endpoint}</code>
                  </div>
                  <span className="text-[#78716C] text-[11px]">{ep.desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
