import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { Employee, Department, TalentGridItem, KPIEvidenceItem, PIPRecord } from '../types';

/**
 * Universal file download trigger using native Blob and URL.createObjectURL.
 * Avoids browser popup blockers and iframe sandbox restrictions.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 200);
}

/**
 * Download UTF-8 CSV with BOM for universal Excel & spreadsheet compatibility.
 */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]): void {
  const escapeCell = (cell: string | number) => {
    const str = String(cell ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCell).join(',');
  const rowLines = rows.map((r) => r.map(escapeCell).join(',')).join('\n');
  const csvContent = '\uFEFF' + headerLine + '\n' + rowLines;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerBlobDownload(blob, filename.endsWith('.csv') ? filename : `${filename}.csv`);
}

/**
 * Download JSON data file.
 */
export function downloadJson(filename: string, data: any): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  triggerBlobDownload(blob, filename.endsWith('.json') ? filename : `${filename}.json`);
}

/**
 * Download multi-sheet or single-sheet Excel workbook using xlsx.
 */
export function downloadExcel(
  filename: string,
  sheets: { name: string; data: Record<string, any>[] }[]
): void {
  const wb = XLSX.utils.book_new();
  sheets.forEach((s) => {
    const ws = XLSX.utils.json_to_sheet(s.data);
    XLSX.utils.book_append_sheet(wb, ws, s.name.substring(0, 31));
  });
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

/**
 * Generate official Excel templates for Data Management & Import workflows.
 */
export function downloadTemplate(type: 'roster' | 'kpis' | 'actuals'): void {
  const dateStr = new Date().toISOString().slice(0, 10);

  if (type === 'roster') {
    const sampleData = [
      {
        'Employee ID (NIK)': 'EMP-001',
        'Full Name': 'Alexander Vance',
        Email: 'alexander.vance@company.com',
        Department: 'Executive Board',
        'Job Title': 'Chief Executive Officer',
        'Employment Status': 'Active',
        Role: 'Super Admin',
        'Join Date (YYYY-MM-DD)': '2019-03-15',
        'Direct Supervisor ID': '-',
      },
      {
        'Employee ID (NIK)': 'EMP-006',
        'Full Name': 'Aria Montgomery',
        Email: 'aria.montgomery@company.com',
        Department: 'Engineering & Technology',
        'Job Title': 'Senior Software Engineer',
        'Employment Status': 'Active',
        Role: 'Employee',
        'Join Date (YYYY-MM-DD)': '2022-01-10',
        'Direct Supervisor ID': 'EMP-002',
      },
      {
        'Employee ID (NIK)': 'EMP-014',
        'Full Name': 'Dwi Prasetyo',
        Email: 'dwi.prasetyo@company.com',
        Department: 'Sales & Business Development',
        'Job Title': 'Enterprise Account Executive',
        'Employment Status': 'Active',
        Role: 'Employee',
        'Join Date (YYYY-MM-DD)': '2023-04-01',
        'Direct Supervisor ID': 'EMP-004',
      },
    ];
    downloadExcel(`Pervia_Template_Employee_Roster_${dateStr}.xlsx`, [
      { name: 'Employee Roster', data: sampleData },
    ]);
  } else if (type === 'kpis') {
    const sampleData = [
      {
        'KPI Code': 'ENG-KPI-01',
        'Indicator Name': 'Sprint Story Points Delivery & Reliability',
        Department: 'Engineering & Technology',
        'Target Value': 80,
        Unit: 'pts',
        'Weight %': 25,
        'Measurement Type': 'Numeric',
        'Calculation Direction': 'Higher Is Better',
        Threshold: 70,
        Stretch: 95,
      },
      {
        'KPI Code': 'ENG-KPI-02',
        'Indicator Name': 'Production Defect Density & SLA MTTR',
        Department: 'Engineering & Technology',
        'Target Value': 1.5,
        Unit: 'hours',
        'Weight %': 20,
        'Measurement Type': 'Numeric',
        'Calculation Direction': 'Lower Is Better',
        Threshold: 2.0,
        Stretch: 1.0,
      },
      {
        'KPI Code': 'SALES-KPI-01',
        'Indicator Name': 'Quarterly Net New ARR Closed',
        Department: 'Sales & Business Development',
        'Target Value': 500000,
        Unit: 'USD',
        'Weight %': 40,
        'Measurement Type': 'Numeric',
        'Calculation Direction': 'Higher Is Better',
        Threshold: 450000,
        Stretch: 600000,
      },
    ];
    downloadExcel(`Pervia_Template_KPI_Targets_${dateStr}.xlsx`, [
      { name: 'KPI Targets', data: sampleData },
    ]);
  } else {
    const sampleData = [
      {
        'Submission ID': 'ACT-2026-001',
        'Employee ID': 'EMP-006',
        'KPI Code': 'ENG-KPI-01',
        'Actual Value Attained': 85,
        Unit: 'pts',
        'Submission Date': '2026-03-31',
        'Deliverable Notes': 'Resolved 85 story points across sprint 14 to 18 with 0 sprint rollovers',
        'Evidence URL or Document Key': 'https://jira.internal/sprints/2026-q1-report.pdf',
        'Status': 'Pending Review',
      },
      {
        'Submission ID': 'ACT-2026-002',
        'Employee ID': 'EMP-006',
        'KPI Code': 'ENG-KPI-02',
        'Actual Value Attained': 1.2,
        Unit: 'hours',
        'Submission Date': '2026-03-31',
        'Deliverable Notes': 'P1 MTTR maintained at 1.2 hours with zero unhandled incidents',
        'Evidence URL or Document Key': 'https://datadog.internal/monitors/p1-sla-q1.pdf',
        'Status': 'Verified',
      },
    ];
    downloadExcel(`Pervia_Template_Actual_Deliverables_${dateStr}.xlsx`, [
      { name: 'Actual Deliverables', data: sampleData },
    ]);
  }
}

/**
 * Generate Executive Company Report PDF
 */
export function exportCompanyReportPdf(data?: {
  companyName?: string;
  cycleName?: string;
  overallScore?: number;
}): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 15;

  // Header Bar
  doc.setFillColor(234, 88, 12);
  doc.rect(margin, y, contentWidth, 3, 'F');
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(24, 24, 27);
  doc.text('PERVIA ENTERPRISE PERFORMANCE MANAGEMENT', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 113, 108);
  doc.text('EXECUTIVE BOARD REPORT • LAPORAN CAPAIAN PRESTASI KORPORASI TAHUNAN', margin, y);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}`, pageWidth - margin, y, { align: 'right' });
  y += 8;

  // Divider
  doc.setDrawColor(231, 228, 220);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  // Highlights Box
  doc.setFillColor(255, 247, 237);
  doc.setDrawColor(254, 215, 170);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(194, 65, 12);
  doc.text('RINGKASAN EKSEKUTIF KINERJA KORPORASI (CYCLE 2026 Q1)', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(41, 37, 36);
  doc.text('• Skor Indeks Komposit Korporasi: 91.4% (Rating A - Exceeds Expectations)', margin + 4, y + 11);
  doc.text('• Tingkat Pemenuhan Target KPI: 94.5% dari seluruh sasaran strategis tercapai', margin + 4, y + 15.5);
  doc.text('• Total Karyawan Terevaluasi: 128 Pegawai across 6 Departemen Utama', margin + 4, y + 20);
  y += 28;

  // Department Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(24, 24, 27);
  doc.text('Kinerja Berdasarkan Departemen', margin, y);
  y += 5;

  // Table header
  doc.setFillColor(245, 239, 230);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(87, 83, 78);
  doc.text('DEPARTEMEN', margin + 3, y + 4.2);
  doc.text('HEADCOUNT', margin + 65, y + 4.2);
  doc.text('KPI SCORE', margin + 95, y + 4.2);
  doc.text('COMPETENCY', margin + 125, y + 4.2);
  doc.text('GRADE BAND', margin + 155, y + 4.2);
  y += 6;

  const depts = [
    { name: 'Sales & Business Development', headcount: '28', kpi: '96.0%', comp: '4.6 / 5.0', grade: 'Grade A (Top Performer)' },
    { name: 'Engineering & Technology', headcount: '42', kpi: '93.8%', comp: '4.4 / 5.0', grade: 'Grade A' },
    { name: 'Product Management & UX', headcount: '16', kpi: '91.2%', comp: '4.3 / 5.0', grade: 'Grade A-' },
    { name: 'Marketing & Growth', headcount: '18', kpi: '89.5%', comp: '4.1 / 5.0', grade: 'Grade B+' },
    { name: 'People & Culture (HR)', headcount: '12', kpi: '92.1%', comp: '4.5 / 5.0', grade: 'Grade A' },
    { name: 'Finance & Legal Operations', headcount: '12', kpi: '88.4%', comp: '4.0 / 5.0', grade: 'Grade B+' },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(24, 24, 27);

  depts.forEach((d, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(253, 251, 249);
      doc.rect(margin, y, contentWidth, 6, 'F');
    }
    doc.text(d.name, margin + 3, y + 4.2);
    doc.text(d.headcount, margin + 65, y + 4.2);
    doc.text(d.kpi, margin + 95, y + 4.2);
    doc.text(d.comp, margin + 125, y + 4.2);
    doc.text(d.grade, margin + 155, y + 4.2);
    y += 6;
  });

  y += 8;

  // Strategic Initiatives Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('REKOMENDASI KOMITE REMUNERASI & PENGEMBANGAN SDM', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('1. Alokasi Bonus Tahunan disetujui sebesar 105% dari target dasar berkat pencapaian target ARR korporasi.', margin + 4, y + 12);
  doc.text('2. Kalibrasi kurva normal 9-Box disahkan dengan 18% Top Stars, 68% Core Performers, dan 6% High Risk.', margin + 4, y + 17);
  doc.text('3. Program percepatan suksesi disiapkan untuk 8 kader pimpinan dalam radar High Potential.', margin + 4, y + 22);
  doc.text('4. Rencana perbaikan kinerja (PIP) diawasi aktif untuk 4 pegawai dengan pendampingan mingguan.', margin + 4, y + 27);

  // Footer
  doc.setDrawColor(231, 228, 220);
  doc.line(margin, 280, margin + contentWidth, 280);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(168, 162, 158);
  doc.text('Pervia Enterprise PMS • Laporan Resmi Dewan Direksi • ISO 9001 / ISO 27001 Certified', margin, 285);
  doc.text('Halaman 1 dari 1 • Confidential', pageWidth - margin, 285, { align: 'right' });

  doc.save(`Pervia_Executive_Company_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Generate Calibration Audit & Bell-Curve Distribution Report PDF
 */
export function exportCalibrationAuditPdf(): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 15;

  doc.setFillColor(234, 88, 12);
  doc.rect(margin, y, contentWidth, 3, 'F');
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(24, 24, 27);
  doc.text('PERVIA CALIBRATION COMMITTEE & BELL-CURVE AUDIT', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 113, 108);
  doc.text('BERITA ACARA AUDIT DISTRIBUSI PERINGKAT & PENCEGAHAN RATING INFLATION', margin, y);
  y += 8;

  doc.setDrawColor(231, 228, 220);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  // Quota Breakdown
  doc.setFillColor(255, 247, 237);
  doc.setDrawColor(254, 215, 170);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(194, 65, 12);
  doc.text('HASIL AUDIT KUOTA NORMALISASI KURVA LONCENG (BELL-CURVE)', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(41, 37, 36);
  doc.text('• Top Performers (Grade A / Stars): 18.2% (Target Kuota: 15.0% - 20.0%) → Status: COMPLIANT', margin + 4, y + 11.5);
  doc.text('• Core Contributors (Grade B / Solid): 68.4% (Target Kuota: 60.0% - 70.0%) → Status: COMPLIANT', margin + 4, y + 16);
  doc.text('• Development / Risk (Grade C & D): 13.4% (Target Kuota: 5.0% - 15.0%) → Status: COMPLIANT', margin + 4, y + 20.5);
  y += 30;

  // Audit Override Log
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(24, 24, 27);
  doc.text('Daftar Penyesuaian / Override Sidang Komite Kalibrasi', margin, y);
  y += 5;

  doc.setFillColor(245, 239, 230);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFontSize(7);
  doc.setTextColor(87, 83, 78);
  doc.text('ID & NAMA PEGAWAI', margin + 3, y + 4.2);
  doc.text('DEPT', margin + 55, y + 4.2);
  doc.text('SEMULA', margin + 95, y + 4.2);
  doc.text('KALIBRASI', margin + 120, y + 4.2);
  doc.text('STATUS SIDANG', margin + 150, y + 4.2);
  y += 6;

  const overrides = [
    { name: 'Aria Montgomery (EMP-006)', dept: 'Engineering', orig: 'High Potential', calib: 'Star (Box 9)', status: 'Diratifikasi Komite' },
    { name: 'Budi Santoso (EMP-007)', dept: 'Sales & BD', orig: 'Core Performer', calib: 'High Performer (Box 6)', status: 'Diratifikasi Komite' },
    { name: 'Citra Dewi (EMP-008)', dept: 'Marketing', orig: 'Inconsistent', calib: 'Core Contributor (Box 5)', status: 'Diratifikasi Komite' },
    { name: 'Denny Setiawan (EMP-009)', dept: 'Finance', orig: 'Low Potential', calib: 'Risk / Action Needed', status: 'Diratifikasi Komite' },
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(24, 24, 27);

  overrides.forEach((o, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(253, 251, 249);
      doc.rect(margin, y, contentWidth, 6, 'F');
    }
    doc.text(o.name, margin + 3, y + 4.2);
    doc.text(o.dept, margin + 55, y + 4.2);
    doc.text(o.orig, margin + 95, y + 4.2);
    doc.text(o.calib, margin + 120, y + 4.2);
    doc.text(o.status, margin + 150, y + 4.2);
    y += 6;
  });

  y += 15;
  // Signatures
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(24, 24, 27);
  doc.text('Ketua Sidang Komite Kalibrasi', margin + 10, y);
  doc.text('Direktur Sumber Daya Manusia (HR)', margin + 110, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.text('( Dr. Ir. Alexander Vance )', margin + 10, y);
  doc.text('( Elena Rostova, CHRO )', margin + 110, y);

  doc.save(`Pervia_Calibration_Audit_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Generate PIP Clearance Certificate PDF
 */
export function exportPIPClearanceCertificatePdf(pip: {
  id: string;
  employeeName: string;
  employeeId?: string;
  departmentName?: string;
  department?: string;
  supervisorName?: string;
  mentor?: string;
  startDate: string;
  endDate: string;
  notes?: string;
}): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 25;

  const empId = pip.employeeId || 'EMP-018';
  const dept = pip.departmentName || pip.department || 'Operations';
  const supervisor = pip.supervisorName || pip.mentor || 'Supervisor';

  // Elegant Certificate Border
  doc.setDrawColor(234, 88, 12);
  doc.setLineWidth(1);
  doc.rect(margin - 8, y - 12, contentWidth + 16, 255);

  doc.setDrawColor(254, 215, 170);
  doc.setLineWidth(0.4);
  doc.rect(margin - 6, y - 10, contentWidth + 12, 251);

  // Logo / Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(234, 88, 12);
  doc.text('PERVIA ENTERPRISE PERFORMANCE MANAGEMENT', pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(24, 24, 27);
  doc.text('CERTIFICATE OF REMEDIAL CLEARANCE', pageWidth / 2, y, { align: 'center' });
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(120, 113, 108);
  doc.text('SERTIFIKAT KELULUSAN & PEMENUHAN TARGET PROGRAM PEMBINAAN KINERJA (PIP)', pageWidth / 2, y, { align: 'center' });
  doc.text(`Nomor Registrasi: PRV-PIP-CERT/${pip.id.replace('PIP-', '').replace('pip-', '')}/2026`, pageWidth / 2, y + 4.5, { align: 'center' });
  y += 18;

  // Body Text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(41, 37, 36);
  doc.text('Dengan ini Dewan Komite Kinerja & HR Director Perusahaan menerangkan bahwa:', pageWidth / 2, y, { align: 'center' });
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(234, 88, 12);
  doc.text(pip.employeeName, pageWidth / 2, y, { align: 'center' });
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(87, 83, 78);
  doc.text(`NIK: ${empId} • Departemen: ${dept}`, pageWidth / 2, y, { align: 'center' });
  y += 14;

  const clearanceText = [
    'Telah menyelesaikan seluruh rangkaian agenda pembinaan performa kerja Performance Improvement Plan (PIP)',
    `selama periode evaluasi intensif (${pip.startDate} s/d ${pip.endDate}) di bawah bimbingan langsung ${supervisor},`,
    `serta berhasil memenuhi seluruh butir komitmen target pemulihan dengan status akhir dinyatakan:`,
  ];
  clearanceText.forEach((line) => {
    doc.text(line, pageWidth / 2, y, { align: 'center' });
    y += 5;
  });
  y += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(22, 163, 74);
  doc.text('LULUS & MEMENUHI STANDAR KOMPETENSI (SATISFACTORILY CLEARED)', pageWidth / 2, y, { align: 'center' });
  y += 16;

  // Summary Grid
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(21, 128, 61);
  doc.text('HASIL REVIEW AKHIR PEMBINAAN KINERJA:', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text(`• Catatan Supervisor: "${pip.notes || 'Pegawai menunjukkan perbaikan disiplin dan kualitas deliverable secara signifikan.'}"`, margin + 4, y + 12);
  doc.text(`• Milestone Terselesaikan: 100% komitmen KPI tercapai di atas threshold standar.`, margin + 4, y + 17);
  doc.text(`• Tindak Lanjut: Status kepegawaian dikembalikan ke status reguler aktif penuh tanpa batasan penugasan.`, margin + 4, y + 22);
  doc.text(`• Audit Compliance: Terverifikasi oleh HR Compliance & Tim Legal Perusahaan.`, margin + 4, y + 27);
  y += 44;

  // Signatures
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(24, 24, 27);
  doc.text('Atasan Langsung / Mentor', margin + 15, y);
  doc.text('Kepala Divisi SDM / HR Director', margin + 105, y);
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.text(`( ${supervisor} )`, margin + 15, y);
  doc.text('( Elena Rostova, CHRO )', margin + 105, y);

  doc.save(`Pervia_PIP_Clearance_Certificate_${empId}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Generate KPI Deliverable Evidence Salinan Bukti (Text/Proof export)
 */
export function exportEvidenceProofFile(evidence: KPIEvidenceItem): void {
  const content = `================================================================================
PERVIA ENTERPRISE PERFORMANCE MANAGEMENT SYSTEM (PMS)
SALINAN BUKTI DELIVERABLE KPI RESMI & DIGITAL ATTESTATION
================================================================================

Nomor Registrasi   : PRV-VERIF-${evidence.id}
Nama Dokumen       : ${evidence.fileName}
ID Pegawai (NIK)   : ${evidence.employeeId}
Nama Pegawai       : ${evidence.employeeName}
Kode KPI Terkait   : ${evidence.kpiCode} - ${evidence.kpiName}
Tanggal Pengunggahan: ${evidence.uploadDate}
Ukuran Berkas      : ${evidence.fileSize}
Tipe Berkas        : ${evidence.documentType}
Integritas SHA-256 : ${evidence.shaHash}

--------------------------------------------------------------------------------
RINCIAN CAPAIAN & KLAIM DELIVERABLE
--------------------------------------------------------------------------------
Target Deliverable : ${evidence.target} ${evidence.unit}
Realisasi Aktual   : ${evidence.claimedActual} ${evidence.unit}
Persentase Capaian : ${((evidence.claimedActual / evidence.target) * 100).toFixed(1)}%
Status Verifikasi  : ${evidence.status}
Catatan Verifikator: ${evidence.supervisorRemarks || 'Telah diperiksa dan diverifikasi secara berkala sesuai standar ISO 9001.'}

--------------------------------------------------------------------------------
CHECKLIST VALIDASI ATASAN LANGSUNG:
--------------------------------------------------------------------------------
[X] 1. Integritas Bukti & Tautan Resmi Valid (Data commit / log / dokumen sistem terverifikasi)
[X] 2. Pemenuhan Target Kuantitatif & SLA (Sesuai timeline sprint & SLA disepakati)
[X] 3. Kebenaran Kalkulasi & Bobot Metrik (Formula scoring akurat tanpa duplikasi)
[X] 4. Konfirmasi Diskusi 1-on-1 (Hasil deliverables telah dibahas bersama atasan)

--------------------------------------------------------------------------------
Dokumen ini merupakan salinan bukti sah yang diakui oleh sistem penilaian kinerja
Pervia Enterprise PMS dan terikat dengan kebijakan kerahasiaan korporasi.
================================================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  triggerBlobDownload(blob, `Bukti_Verifikasi_${evidence.kpiCode}_${evidence.employeeId}.txt`);
}
