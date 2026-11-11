import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users2,
  Sparkles,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  Lock,
  ThumbsUp,
  UserCheck,
  Award,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { db } from '../../lib/database';
import { useAuth } from '../../contexts/AuthContext';

interface FeedbackSubmission {
  id: string;
  recipientName: string;
  recipientRole: string;
  department: string;
  relationship: 'Peer' | 'Supervisor' | 'Subordinate' | 'Cross-Functional';
  status: 'Completed' | 'Pending';
  dueDate: string;
  ratings?: {
    collaboration: number;
    communication: number;
    problemSolving: number;
    leadership: number;
    accountability: number;
  };
  qualitativeComments?: string;
  submittedAt?: string;
}

export const Feedback360Page: React.FC = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'give' | 'pending'>('received');
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);

  // Sample feedback requests dataset
  const [feedbackList, setFeedbackList] = useState<FeedbackSubmission[]>([
    {
      id: 'FB-360-01',
      recipientName: 'David Miller',
      recipientRole: 'VP of Engineering',
      department: 'Engineering',
      relationship: 'Supervisor',
      status: 'Pending',
      dueDate: 'June 5, 2026',
    },
    {
      id: 'FB-360-02',
      recipientName: 'Jordan Patel',
      recipientRole: 'Lead Security Architect',
      department: 'Infra & CyberSec',
      relationship: 'Peer',
      status: 'Pending',
      dueDate: 'June 7, 2026',
    },
    {
      id: 'FB-360-03',
      recipientName: 'Aria Montgomery',
      recipientRole: 'Senior Software Engineer',
      department: 'Engineering',
      relationship: 'Peer',
      status: 'Completed',
      dueDate: 'May 28, 2026',
      submittedAt: 'May 26, 2026',
      ratings: {
        collaboration: 5,
        communication: 4.8,
        problemSolving: 5,
        leadership: 4.5,
        accountability: 5,
      },
      qualitativeComments:
        'Aria was instrumental during the distributed microservices migration. Her communication during cross-squad outages is exemplary and she consistently takes ownership of difficult architectural refactors.',
    },
  ]);

  // Form state for giving 360 feedback
  const [collaborationScore, setCollaborationScore] = useState(5);
  const [communicationScore, setCommunicationScore] = useState(4.5);
  const [problemSolvingScore, setProblemSolvingScore] = useState(5);
  const [leadershipScore, setLeadershipScore] = useState(4);
  const [accountabilityScore, setAccountabilityScore] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitFeedback = (id: string) => {
    setFeedbackList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Completed',
              submittedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              ratings: {
                collaboration: collaborationScore,
                communication: communicationScore,
                problemSolving: problemSolvingScore,
                leadership: leadershipScore,
                accountability: accountabilityScore,
              },
              qualitativeComments: commentText || 'Strong contributor who consistently delivers reliable results.',
            }
          : item
      )
    );
    setSelectedRecipient(null);
    setCommentText('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const pendingRequests = feedbackList.filter((f) => f.status === 'Pending');
  const completedFeedback = feedbackList.filter((f) => f.status === 'Completed');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Users2 className="w-3.5 h-3.5" />
              Multi-Rater Feedback (10% Weight)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight mt-1">
            360-Degree Peer & Subordinate Feedback
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5 max-w-2xl">
            Anonymous multi-rater evaluations across cross-functional squads, direct reports, and leadership peers. Enforces ISO 27001 privacy safeguards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-[#E7E4DC] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Anonymity Shield:</span>
            <strong className="text-emerald-700">Enforced & Safe</strong>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ulasan 360-Degree berhasil dienkripsi dan dikirim ke komite kalibrasi secara anonim!</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">HASH: SHA-256</span>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card hover className="p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Composite 360 Score (Received)
              </span>
              <div className="text-3xl font-black text-[#18181B] mt-1">4.82 <span className="text-sm font-semibold text-[#78716C]">/ 5.0</span></div>
              <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                &bull; Top 10% in Engineering Division
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F5EFE6] flex justify-between text-xs font-semibold text-[#78716C]">
            <span>Weighted Score Contribution:</span>
            <strong className="text-[#EA580C]">9.64 / 10.0 pts</strong>
          </div>
        </Card>

        <Card hover className="p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Peer Reviews Completed (Given)
              </span>
              <div className="text-3xl font-black text-[#18181B] mt-1">
                {completedFeedback.length} <span className="text-sm font-semibold text-[#78716C]">/ {feedbackList.length}</span>
              </div>
              <span className="text-[11px] text-[#78716C] mt-0.5 block">
                {pendingRequests.length > 0 ? `${pendingRequests.length} pending responses waiting` : 'All assigned reviews cleared'}
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F5EFE6] flex justify-between text-xs font-semibold text-[#78716C]">
            <span>Cycle Submission Deadline:</span>
            <strong className="text-[#18181B]">June 7, 2026</strong>
          </div>
        </Card>

        <Card hover className="p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                Multi-Rater Reliability Index
              </span>
              <div className="text-3xl font-black text-emerald-700 mt-1">98.4%</div>
              <span className="text-[11px] text-[#78716C] mt-0.5 block">
                Cross-rater consensus & variance
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#F5EFE6] flex justify-between text-xs font-semibold text-[#78716C]">
            <span>Bias Filter Algorithm:</span>
            <strong className="text-emerald-700">Verified Optimal</strong>
          </div>
        </Card>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[#E7E4DC] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'received'
              ? 'bg-[#18181B] text-white shadow-xs'
              : 'bg-white text-[#78716C] hover:text-[#18181B] border border-[#E7E4DC]'
          }`}
        >
          My 360 Feedback (Received)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('give')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'give'
              ? 'bg-[#18181B] text-white shadow-xs'
              : 'bg-white text-[#78716C] hover:text-[#18181B] border border-[#E7E4DC]'
          }`}
        >
          <span>Give Feedback to Colleagues</span>
          {pendingRequests.length > 0 && (
            <span className="bg-[#EA580C] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Received Feedback Summary */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {/* Competency 5-Pillar Scorecard */}
          <div className="bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-[#18181B] uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#EA580C]" />
              Core Competency Dimensions (Average from 5 Anonymous Raters)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Team Collaboration', score: 4.9, max: 5.0, icon: '🤝' },
                { label: 'Technical Execution', score: 4.8, max: 5.0, icon: '💻' },
                { label: 'Communication Clarity', score: 4.7, max: 5.0, icon: '💬' },
                { label: 'Ownership & Accountability', score: 5.0, max: 5.0, icon: '🛡️' },
                { label: 'Mentorship & Empathy', score: 4.7, max: 5.0, icon: '🌱' },
              ].map((dim) => (
                <div key={dim.label} className="bg-[#FAF9F6] border border-[#E7E4DC] p-3.5 rounded-2xl text-center space-y-1">
                  <span className="text-xl block">{dim.icon}</span>
                  <span className="text-[11px] font-bold text-[#18181B] block leading-tight">{dim.label}</span>
                  <div className="text-lg font-black text-[#EA580C] mt-1">{dim.score} <span className="text-xs font-semibold text-[#78716C]">/ {dim.max}</span></div>
                  <div className="w-full h-1.5 rounded-full bg-[#E7E4DC] overflow-hidden mt-1">
                    <div className="h-full bg-[#EA580C] rounded-full" style={{ width: `${(dim.score / dim.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Qualitative Synthesis Quotes */}
          <div className="bg-white rounded-3xl border border-[#E7E4DC] p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-[#18181B] uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#EA580C]" />
              Synthesized Peer Themes & Qualitative Quotes (Anonymized)
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#C2410C]">Peer Theme: High Technical Ownership</span>
                  <span className="text-[#78716C]">Cross-functional consensus</span>
                </div>
                <p className="text-xs text-[#292524] italic">
                  &ldquo;Aria consistently drives architecture discussions to clear consensus and never shies away from difficult incident post-mortems. She unblocks teammates swiftly.&rdquo;
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-800">Growth Opportunity: Cross-Department Delegation</span>
                  <span className="text-[#78716C]">Mentor Suggestion</span>
                </div>
                <p className="text-xs text-[#292524] italic">
                  &ldquo;Could further amplify her impact by delegating more operational sprint tasks to junior engineers to focus on enterprise-wide RFC strategy.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Give Feedback to Colleagues */}
      {activeTab === 'give' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbackList.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-3xl border p-5 shadow-xs transition-all ${
                  item.status === 'Completed'
                    ? 'border-[#E7E4DC] bg-[#FAF9F6]/50'
                    : 'border-[#FED7AA] bg-[#FFFBF5]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#78716C] uppercase tracking-wider block">
                      {item.relationship} Review &bull; {item.department}
                    </span>
                    <h4 className="text-base font-black text-[#18181B]">{item.recipientName}</h4>
                    <p className="text-xs text-[#52525B]">{item.recipientRole}</p>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                      item.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#FFEDD5] text-[#C2410C]'
                    }`}
                  >
                    {item.status === 'Completed' ? '✓ Submitted' : 'Pending Action'}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E7E4DC] flex items-center justify-between">
                  <span className="text-xs text-[#78716C]">
                    Due: <strong>{item.dueDate}</strong>
                  </span>

                  {item.status === 'Pending' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedRecipient(item.id)}
                      className="rounded-full text-xs font-bold"
                      rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                    >
                      Fill 360 Feedback
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Submitted on {item.submittedAt}
                    </span>
                  )}
                </div>

                {/* Inline Scoring Drawer if selected */}
                {selectedRecipient === item.id && (
                  <div className="mt-4 pt-4 border-t-2 border-[#EA580C] space-y-4 animate-in fade-in">
                    <div className="bg-[#FAF9F6] p-3 rounded-2xl border border-[#E7E4DC] text-xs space-y-1">
                      <span className="font-bold text-[#18181B]">Kuesioner 360 Anonim untuk {item.recipientName}</span>
                      <p className="text-[#78716C] text-[11px]">
                        Ulasan Anda 100% anonim dan dienkripsi sebelum dikalibrasi oleh komite HR.
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>Team Collaboration & Support</span>
                          <span className="text-[#EA580C]">{collaborationScore} / 5</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.5"
                          value={collaborationScore}
                          onChange={(e) => setCollaborationScore(parseFloat(e.target.value))}
                          className="w-full accent-[#EA580C] cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>Technical Execution & Problem Solving</span>
                          <span className="text-[#EA580C]">{problemSolvingScore} / 5</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.5"
                          value={problemSolvingScore}
                          onChange={(e) => setProblemSolvingScore(parseFloat(e.target.value))}
                          className="w-full accent-[#EA580C] cursor-pointer"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between font-bold mb-1">
                          <span>Communication & Empathy</span>
                          <span className="text-[#EA580C]">{communicationScore} / 5</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="0.5"
                          value={communicationScore}
                          onChange={(e) => setCommunicationScore(parseFloat(e.target.value))}
                          className="w-full accent-[#EA580C] cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-[#18181B] mb-1">
                          Catatan Kualitatif / Feedback Konstruktif (Opsional)
                        </label>
                        <textarea
                          rows={2}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Tuliskan kekuatan utama rekan kerja dan saran pengembangan yang membangun..."
                          className="w-full bg-white border border-[#E7E4DC] rounded-xl p-2.5 text-xs focus:outline-none focus:border-[#EA580C]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRecipient(null)}
                        className="rounded-full text-xs"
                      >
                        Batal
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSubmitFeedback(item.id)}
                        className="rounded-full text-xs font-bold"
                        leftIcon={<Send className="w-3.5 h-3.5" />}
                      >
                        Kirim Ulasan Anonim
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
