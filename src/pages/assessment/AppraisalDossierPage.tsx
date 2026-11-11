import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PrintableAppraisalDossier } from '../../components/dossier/PrintableAppraisalDossier';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Sparkles, Printer, ShieldCheck } from 'lucide-react';

export const AppraisalDossierPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user, role } = useAuth();
  const employeeId = searchParams.get('employeeId') || searchParams.get('id') || 'EMP-006';

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Heading (Hidden in Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1">
            <Link to="/assessment/final" className="hover:text-[#EA580C] hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Final Evaluation
            </Link>
            <span>&bull;</span>
            <span className="font-semibold text-[#18181B]">Official Appraisal Dossier</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight">
            Printable Appraisal Dossier & Talent Scorecard
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Dokumen resmi rekapitulasi penilaian kinerja tahunan / kuartalan, tanda tangan digital multi-pihak, dan audit trail ISO.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#C2410C] bg-[#FFEDD5] border border-[#FED7AA] px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
            Format Standar Cetak A4 / PDF
          </span>
        </div>
      </div>

      {/* Main Dossier Component */}
      <PrintableAppraisalDossier
        initialEmployeeId={employeeId}
        currentUserRole={role}
        currentUserName={user?.fullName || 'Alexander Vance'}
      />
    </div>
  );
};
