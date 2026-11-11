import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { db } from '../../lib/database';
import { downloadTemplate } from '../../utils/exportHelpers';

export const ImportExcelPage: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Sample import history
  const [importHistory, setImportHistory] = useState([
    {
      id: 'IMP-2026-092',
      filename: 'Q1_2026_Actual_KPI_Deliverables.xlsx',
      type: 'Actual Deliverables',
      uploadedBy: 'Elena Rostova (HR Admin)',
      date: 'Apr 10, 2026, 09:30 AM',
      rows: 128,
      status: 'Completed',
      errors: 0,
    },
    {
      id: 'IMP-2026-088',
      filename: 'Enterprise_Employee_Roster_Q1.xlsx',
      type: 'Employee Roster',
      uploadedBy: 'Marcus Sterling (HR Manager)',
      date: 'Apr 02, 2026, 02:15 PM',
      rows: 128,
      status: 'Completed',
      errors: 0,
    },
    {
      id: 'IMP-2026-074',
      filename: 'Sales_Quota_Targets_2026.csv',
      type: 'KPI Targets',
      uploadedBy: 'Sarah Chen (Dept Manager)',
      date: 'Mar 15, 2026, 11:45 AM',
      rows: 42,
      status: 'Completed',
      errors: 0,
    },
  ]);

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true);
        setImportHistory((prev) => [
          {
            id: `IMP-2026-0${Math.floor(Math.random() * 90) + 10}`,
            filename: file.name,
            type: 'Manual Upload Batch',
            uploadedBy: 'Davis Levin (You)',
            date: 'Just now',
            rows: 64,
            status: 'Completed',
            errors: 0,
          },
          ...prev,
        ]);
        setTimeout(() => setUploadSuccess(false), 5000);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            Data Pipelines &bull; Spreadsheet Ingest
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            Import Excel & CSV Spreadsheets
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Bulk ingest corporate employee rosters, KPI quota libraries, and quarterly actual performance metrics.
          </p>
        </div>
      </div>

      {/* Official Downloadable Templates */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#18181B]">Official Enterprise Import Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border-[#E7E4DC] bg-white flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#18181B]">Employee Roster Template</h4>
              <p className="text-xs text-[#78716C] mt-1">
                Standard format for Employee ID, Department, Position Level, Email, and Manager reporting lines.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate('roster')}
              className="mt-4 rounded-full"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Template (.xlsx)
            </Button>
          </Card>

          <Card className="p-5 border-[#E7E4DC] bg-white flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#18181B]">KPI Targets & Metrics Ingest</h4>
              <p className="text-xs text-[#78716C] mt-1">
                Pre-configured workbook containing Metric Codes, Weight percentages, Targets, and Threshold bands.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate('kpis')}
              className="mt-4 rounded-full"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Template (.xlsx)
            </Button>
          </Card>

          <Card className="p-5 border-[#E7E4DC] bg-white flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#18181B]">Actual Deliverables Submissions</h4>
              <p className="text-xs text-[#78716C] mt-1">
                Batch actual achievement quantities, evidence links, and supervisor verification status rows.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadTemplate('actuals')}
              className="mt-4 rounded-full"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download Template (.xlsx)
            </Button>
          </Card>
        </div>
      </div>

      {/* Upload Dropzone */}
      <Card className="p-8 border-2 border-dashed border-[#DDD9CE] bg-[#FDFBF9] rounded-3xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] text-[#EA580C] mx-auto flex items-center justify-center">
          <Upload className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#18181B]">
            Upload Completed Spreadsheet
          </h3>
          <p className="text-xs text-[#78716C] mt-1">
            Supports .xlsx, .xls, and .csv formats up to 50MB. Auto-validates columns against schema definitions.
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
            {isUploading ? 'Validating Workbook Schema...' : 'Select File from Computer'}
          </Button>
        </label>

        {uploadSuccess && (
          <div className="p-3 bg-[#DCFCE7] text-[#16A34A] text-xs font-bold rounded-2xl inline-flex items-center gap-2 mx-auto">
            <CheckCircle2 className="w-4 h-4" />
            <span>Success: {uploadedFileName} parsed with 0 errors and synced to database!</span>
          </div>
        )}
      </Card>

      {/* Import History Table */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#18181B]">Spreadsheet Ingest Audit Trail</h3>
          <span className="text-xs text-[#78716C]">Recent bulk data uploads</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#F5EFE6] text-[#78716C] uppercase font-bold text-[10px]">
                <th className="py-2.5 px-3">Batch ID</th>
                <th className="py-2.5 px-3">Workbook File</th>
                <th className="py-2.5 px-3">Data Domain</th>
                <th className="py-2.5 px-3">Uploaded By</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Rows</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5EFE6]">
              {importHistory.map((h) => (
                <tr key={h.id} className="hover:bg-[#FDFBF9]">
                  <td className="py-3 px-3 font-mono font-bold text-[#EA580C]">{h.id}</td>
                  <td className="py-3 px-3 font-bold text-[#18181B]">{h.filename}</td>
                  <td className="py-3 px-3 text-[#57534E]">{h.type}</td>
                  <td className="py-3 px-3 text-[#57534E]">{h.uploadedBy}</td>
                  <td className="py-3 px-3 text-[#78716C]">{h.date}</td>
                  <td className="py-3 px-3 font-bold text-[#18181B]">{h.rows} rows</td>
                  <td className="py-3 px-3">
                    <Badge variant="success">Completed</Badge>
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
