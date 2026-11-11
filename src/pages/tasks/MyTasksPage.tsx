import React, { useState } from 'react';
import { db } from '../../lib/database';
import { SystemTask, SLAEscalationLog } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  CheckSquare,
  Clock,
  Filter,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  AlertTriangle,
  BellRing,
  Send,
  ShieldCheck,
  User,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<SystemTask[]>(db.getTasks());
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [slaEscalations, setSlaEscalations] = useState<SLAEscalationLog[]>(db.getSLAEscalationLogs());

  // Modal states (Area 5)
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [reminderType, setReminderType] = useState<'H-3' | 'H-1' | 'Custom'>('H-3');
  const [customReminderMsg, setCustomReminderMsg] = useState('');
  const [slaAuditModalOpen, setSlaAuditModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const toggleTask = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: t.status === 'Completed' ? ('In Progress' as const) : ('Completed' as const) }
        : t
    );
    setTasks(updated);
  };

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const pendingCount = tasks.filter((t) => t.status !== 'Completed').length;
  const completionRate = Math.round((completedCount / (tasks.length || 1)) * 100);

  const filteredTasks = tasks.filter((t) => {
    const matchesPriority = filterPriority === 'all' || t.priority.toLowerCase() === filterPriority;
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.module.toLowerCase().includes(search.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const handleSendReminder = () => {
    const res = db.sendBulkCycleReminder(reminderType, customReminderMsg);
    if (res.success) {
      setActionSuccessMsg(`Broadcast pengingat siklus (${reminderType}) berhasil dikirimkan kepada ${res.recipientCount} staf!`);
      setReminderModalOpen(false);
      setTimeout(() => setActionSuccessMsg(null), 6000);
    }
  };

  const handleTriggerEscalation = (taskId: string, title: string) => {
    const reason = `Batas waktu SLA 7 hari kerja telah terlampaui untuk peninjauan '${title}'. Eskalasi Level 1 otomatis diteruskan ke Department Head & HR.`;
    const res = db.triggerSLAEscalation(taskId, reason);
    if (res) {
      setSlaEscalations([...db.getSLAEscalationLogs()]);
      setActionSuccessMsg(`Eskalasi SLA untuk tugas '${title}' berhasil diterbitkan dan dinotifikasikan ke manajemen!`);
      setSlaAuditModalOpen(false);
      setTimeout(() => setActionSuccessMsg(null), 6000);
    }
  };

  // Helper to determine SLA Status and badge
  const getTaskSlaBadge = (task: SystemTask) => {
    if (task.status === 'Completed') {
      return {
        label: 'SLA: Selesai Tepat Waktu',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        overdue: false,
      };
    }
    if (task.priority === 'High') {
      return {
        label: 'SLA: Terlambat (+4 Hari) • Eskalasi Aktif',
        bg: 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse',
        overdue: true,
      };
    }
    if (task.dueDate.includes('Today') || task.dueDate.includes('2026-04-03')) {
      return {
        label: 'SLA: Jatuh Tempo Hari Ini (23:59 WIB)',
        bg: 'bg-amber-50 text-amber-900 border-amber-200',
        overdue: false,
      };
    }
    return {
      label: 'SLA: Sisa 2 Hari Kerja (On Track)',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      overdue: false,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#78716C] mb-1">
            <span className="font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
              SLA Watchdog & Queue
            </span>
            <span>&bull;</span>
            <span>Siklus 2026 Q1</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#292524] tracking-tight">
            Tugas & Antrean Tindakan (SLA Watchdog)
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Manajemen antrean review, pemantauan batas waktu SLA 7 hari, dan otomasi eskalasi ke pimpinan divisi.
          </p>
        </div>

        {/* Action Controls for Area 5 (SLA Automation & Reminders) */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReminderModalOpen(true)}
            className="rounded-full shadow-xs text-xs font-bold"
            leftIcon={<BellRing className="w-3.5 h-3.5 text-[#EA580C]" />}
          >
            Kirim Pengingat Batas Waktu
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setSlaAuditModalOpen(true)}
            className="rounded-full shadow-xs text-xs font-bold"
            leftIcon={<Zap className="w-3.5 h-3.5" />}
          >
            Audit SLA & Jalankan Eskalasi
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">{actionSuccessMsg}</p>
              <p className="text-[11px] text-emerald-700">Tercatat dalam log audit ISO 9001 dengan stempel waktu resmi.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            SLA TRIGGERED
          </span>
        </div>
      )}

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl border border-[#EFE4D7] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                Pending Actions
              </span>
              <div className="text-3xl font-black text-[#292524] mt-1.5">{pendingCount}</div>
              <span className="text-[11px] font-semibold text-[#A8A29E] mt-0.5 block">
                Memerlukan review atau persetujuan
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
              <span>Antrean Tersisa</span>
              <span className="text-[#EA580C]">{100 - completionRate}% remaining</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-[#FFEDD5]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FDBA74] to-[#EA580C] relative"
                style={{ width: `${Math.min(100, 100 - completionRate)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#EFE4D7] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                Selesai Tepat Waktu
              </span>
              <div className="text-3xl font-black text-[#292524] mt-1.5">{completedCount}</div>
              <span className="text-[11px] font-semibold text-[#A8A29E] mt-0.5 block">
                Sign-off terselesaikan dalam batas SLA
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FBBF24] to-[#D97706] text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
              <span>Tingkat Kepatuhan SLA</span>
              <span className="text-[#D97706]">{completionRate}%</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-[#FEF3C7]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FCD34D] to-[#D97706] relative"
                style={{ width: `${Math.min(100, completionRate)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#EFE4D7] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                Eskalasi SLA Aktif
              </span>
              <div className="text-3xl font-black text-[#EA580C] mt-1.5">
                {slaEscalations.length}
              </div>
              <span className="text-[11px] font-semibold text-rose-700 mt-0.5 block">
                Diteruskan ke Kepala Divisi & HR
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FB7185] to-[#E11D48] text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-[#78716C]">
              <span>Tingkat Eskalasi</span>
              <span className="text-rose-700 font-bold">Level 1 (Dept Head)</span>
            </div>
            <div className="relative w-full h-2 rounded-full bg-[#FFE4E6]">
              <div className="h-full rounded-full bg-[#E11D48]" style={{ width: '40%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Task Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-3 border border-[#E7E4DC]">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer uppercase ${
                filterPriority === p
                  ? 'bg-[#18181B] text-white shadow-xs'
                  : 'text-[#78716C] hover:bg-[#FAF9F6]'
              }`}
            >
              {p === 'all' ? 'Semua Prioritas' : `${p} Priority`}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tugas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-[#FAF9F6] border border-[#E7E4DC] rounded-full text-xs text-[#18181B] focus:outline-none focus:border-[#EA580C]"
          />
        </div>
      </div>

      {/* Task List Cards */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const sla = getTaskSlaBadge(task);

          return (
            <div
              key={task.id}
              className={`bg-white rounded-2xl border p-4.5 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.status === 'Completed'
                  ? 'border-[#E7E4DC] opacity-75'
                  : sla.overdue
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-[#E7E4DC] hover:border-[#EA580C]'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border cursor-pointer transition-colors ${
                    task.status === 'Completed'
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-[#D4D4D8] hover:border-[#EA580C]'
                  }`}
                >
                  {task.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2 py-0.5 rounded-md">
                      {task.module}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sla.bg}`}
                    >
                      {sla.label}
                    </span>
                  </div>

                  <h3
                    className={`text-xs sm:text-sm font-bold text-[#18181B] leading-tight ${
                      task.status === 'Completed' ? 'line-through text-[#78716C]' : ''
                    }`}
                  >
                    {task.title}
                  </h3>

                  <div className="flex items-center gap-3 text-[11px] text-[#78716C]">
                    <span>Batas Waktu: <strong className="text-[#18181B]">{task.dueDate}</strong></span>
                    <span>&bull;</span>
                    <span>Prioritas: <strong className="uppercase">{task.priority}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {sla.overdue && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTriggerEscalation(task.id, task.title)}
                    className="rounded-full text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
                  >
                    Eskalasi ke Kadiv
                  </Button>
                )}

                <Link to={task.link}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-full text-xs shadow-xs"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    Buka Tugas
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active SLA Escalation Log Table (Area 5 Core Feature) */}
      <div className="bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E4DC] pb-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-black text-[#18181B] tracking-tight uppercase flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#EA580C]" />
              Daftar Eskalasi Pelanggaran SLA Aktif (Audit Watchdog)
            </h2>
            <p className="text-xs text-[#78716C]">
              Tugas evaluasi yang melampaui batas SLA 7 hari dan telah dieskalasikan secara otomatis ke pimpinan divisi.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#FAF9F6] border border-[#E7E4DC] px-2.5 py-1 rounded-full text-[#78716C]">
            AUTOMATED WATCHDOG
          </span>
        </div>

        <div className="overflow-x-auto border border-[#E7E4DC] rounded-2xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF9F6] text-[#78716C] border-b border-[#E7E4DC] text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Tugas Tertunda</th>
                <th className="py-2.5 px-3">Pegawai Terkait</th>
                <th className="py-2.5 px-3">Penanggung Jawab</th>
                <th className="py-2.5 px-2 text-center">Hari Keterlambatan</th>
                <th className="py-2.5 px-3">Tingkat Eskalasi</th>
                <th className="py-2.5 px-3">Diteruskan Kepada</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4DC] text-[#18181B]">
              {slaEscalations.map((esc) => (
                <tr key={esc.id} className="hover:bg-[#FAF9F6] transition-colors">
                  <td className="py-3 px-3 font-bold text-[#18181B] max-w-xs">
                    {esc.taskTitle}
                  </td>
                  <td className="py-3 px-3 text-[#52525B]">
                    {esc.employeeName} ({esc.employeeId})
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-[#18181B] block">{esc.assignedToName}</span>
                    <span className="text-[10px] text-[#78716C]">{esc.assignedToRole}</span>
                  </td>
                  <td className="py-3 px-2 text-center font-mono font-black text-rose-700">
                    +{esc.daysOverdue} Hari
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                      {esc.escalationLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#18181B] text-[11px] font-semibold">
                    {esc.escalatedTo}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[10px] font-mono font-bold text-[#EA580C] bg-[#FFEDD5] px-2 py-0.5 rounded-full">
                      {esc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: REMINDER DISPATCHER (Area 5) */}
      {reminderModalOpen && (
        <Modal
          isOpen={reminderModalOpen}
          onClose={() => setReminderModalOpen(false)}
          title="Dispatcher Pengingat Batas Waktu Siklus (Cycle Countdown Reminder)"
          description="Kirimkan notifikasi broadcast otomatis kepada pegawai yang belum menyelesaikan tahap evaluasi."
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[#78716C] mb-1">
                Pilih Tipe Countdown Pengingat
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setReminderType('H-3')}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    reminderType === 'H-3'
                      ? 'border-[#EA580C] bg-[#FFEDD5] text-[#9A3412] font-bold'
                      : 'border-[#E7E4DC] bg-[#FAF9F6] text-[#78716C]'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1 text-[#EA580C]" />
                  <span>Pengingat H-3</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReminderType('H-1')}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    reminderType === 'H-1'
                      ? 'border-rose-400 bg-rose-50 text-rose-900 font-bold'
                      : 'border-[#E7E4DC] bg-[#FAF9F6] text-[#78716C]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 mx-auto mb-1 text-rose-600" />
                  <span>Panggilan Akhir H-1</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReminderType('Custom')}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    reminderType === 'Custom'
                      ? 'border-[#EA580C] bg-[#FFEDD5] text-[#9A3412] font-bold'
                      : 'border-[#E7E4DC] bg-[#FAF9F6] text-[#78716C]'
                  }`}
                >
                  <Send className="w-4 h-4 mx-auto mb-1 text-[#EA580C]" />
                  <span>Pesan Khusus</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#78716C] mb-1">
                Pratinjau Pesan Broadcast Notifikasi & Email
              </label>
              {reminderType === 'Custom' ? (
                <textarea
                  rows={3}
                  value={customReminderMsg}
                  onChange={(e) => setCustomReminderMsg(e.target.value)}
                  placeholder="Tulis pesan pengingat khusus untuk staf..."
                  className="w-full bg-[#FAF9F6] border border-[#E7E4DC] rounded-xl p-3 text-xs focus:outline-none focus:border-[#EA580C]"
                />
              ) : (
                <div className="p-3 bg-[#FAF9F6] border border-[#E7E4DC] rounded-xl text-[#292524] leading-relaxed">
                  {reminderType === 'H-3'
                    ? 'Pengingat Siklus 2026 Q1: Batas waktu pengisian Self-Assessment & 360 Feedback berakhir dalam 3 hari (Jumat, 23:59 WIB).'
                    : 'PERINGATAN TERAKHIR H-1: Batas penutupan siklus evaluasi kuartal 1 tersisa 24 jam. Mohon segera finalisasi formulir penilaian Anda.'}
                </div>
              )}
            </div>

            <div className="p-3 bg-[#FFF7ED] rounded-xl border border-[#FED7AA] flex items-center justify-between text-[11px]">
              <span className="text-[#9A3412] font-semibold">Target Penerima: Seluruh 128 Karyawan Aktif</span>
              <span className="text-xs font-mono font-bold text-[#EA580C]">IN-APP & EMAIL</span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E7E4DC]">
              <Button variant="ghost" size="sm" onClick={() => setReminderModalOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={handleSendReminder} className="rounded-full shadow-xs">
                Kirimkan Broadcast Pengingat
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: SLA ESCALATION ENGINE AUDIT (Area 5) */}
      {slaAuditModalOpen && (
        <Modal
          isOpen={slaAuditModalOpen}
          onClose={() => setSlaAuditModalOpen(false)}
          title="Audit Otomatis Kepatuhan SLA & Engine Eskalasi"
          description="Sistem memindai antrean tugas yang melebihi batas waktu toleransi 7 hari kerja."
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold text-rose-900 block">Ditemukan 1 Pelanggaran SLA Kritis</span>
                <span className="text-[11px] text-rose-800">
                  Tugas 'Supervisor Review untuk Aria Montgomery' oleh Sarah Chen terlambat 4 hari kerja.
                </span>
              </div>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E7E4DC] space-y-2">
              <span className="font-bold text-[#18181B] block">Alur Eskalasi Otomatis yang Akan Dijalankan:</span>
              <ol className="list-decimal pl-4 space-y-1 text-[#52525B]">
                <li>Penerbitan notifikasi darurat (High Alert) ke Department Head & HR Director.</li>
                <li>Pencatatan pelanggaran SLA dalam rekam jejak kepatuhan operasional ISO 9001.</li>
                <li>Penugasan delegasi penilaian jika tidak diselesaikan dalam 48 jam ke depan.</li>
              </ol>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E7E4DC]">
              <Button variant="ghost" size="sm" onClick={() => setSlaAuditModalOpen(false)}>
                Tutup
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleTriggerEscalation('task-002', 'Supervisor Assessment Review Aria Montgomery')}
                className="rounded-full shadow-xs bg-rose-700 hover:bg-rose-800"
              >
                Kirimkan Eskalasi Level 1 Sekarang
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
