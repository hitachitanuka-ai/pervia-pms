import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  KeyRound,
  Copy,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Send,
  Shield,
  Layers,
  Code,
  Check,
  Zap,
} from 'lucide-react';
import { db } from '../../lib/database';

export const ApiIntegrationPage: React.FC = () => {
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://enterprise-hris.apexglobal.com/webhooks/pervia-sync');
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/employees');
  const [testResponse, setTestResponse] = useState<any>(null);

  const sampleApiKey = 'prv_live_9f81a7b8e21c4390d45a9934e892c3a1';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(sampleApiKey);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const handleSendPing = () => {
    setIsPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingResult('HTTP 200 OK — Handshake Verified (Latency: 48ms)');
    }, 1000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/employees',
      desc: 'Retrieve active staff, reporting lines, and current appraisal status',
      sample: {
        total: 128,
        data: [
          { employeeId: 'EMP-001', name: 'Alexander Vance', role: 'Super Admin', department: 'Executive' },
          { employeeId: 'EMP-002', name: 'Elena Rostova', role: 'HR Admin', department: 'Human Resources' },
        ],
      },
    },
    {
      method: 'POST',
      path: '/api/v1/kpi-actuals',
      desc: 'Ingest real-time KPI deliverable metrics from telemetry systems',
      sample: {
        status: 'SUCCESS',
        syncedRecords: 1,
        message: 'Metric deliverable verified and composite score refreshed.',
      },
    },
    {
      method: 'GET',
      path: '/api/v1/evaluations/final',
      desc: 'Query composite appraisal ratings, grade bands, and calibration approvals',
      sample: {
        cycle: '2026 Q1',
        averageRating: 91.4,
        gradeDistribution: { GradeA: '18%', GradeB: '34%', GradeC: '41%' },
      },
    },
  ];

  const handleRunEndpointTest = (ep: any) => {
    setSelectedEndpoint(ep.path);
    setTestResponse(ep.sample);
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
            Developer Platform &bull; REST API & Webhooks
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#18181B] mt-1">
            API & HRIS Webhooks Integration
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Integrate Pervia with external HRIS (Workday, BambooHR, SAP SuccessFactors) via REST API and real-time event webhooks.
          </p>
        </div>
      </div>

      {/* API Key Management Card */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#18181B]">Production API Token</h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Pass this key in the Authorization header: <code className="text-[#EA580C] font-mono">Bearer prv_live_...</code>
            </p>
          </div>
          <Badge variant="success">Active v2.4 (Encrypted)</Badge>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#FDFBF9] border border-[#DDD9CE]">
          <KeyRound className="w-4 h-4 text-[#EA580C] shrink-0" />
          <code className="text-xs font-mono text-[#18181B] flex-1 truncate select-all">
            {sampleApiKey}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyKey}
            className="rounded-xl shrink-0"
            leftIcon={apiKeyCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          >
            {apiKeyCopied ? 'Copied' : 'Copy Key'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('New API token generated and previous key revoked.')}
            className="rounded-xl shrink-0"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Roll Key
          </Button>
        </div>
      </Card>

      {/* Webhooks Subscription Card */}
      <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#18181B]">Event Webhook Subscriptions</h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Receive real-time HTTP POST notifications when evaluations are finalized or goals approved.
            </p>
          </div>
          <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
            TLS 1.3 Secure
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-[#292524] block mb-1">
              Subscriber Destination URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-domain.com/webhooks/pervia"
                className="flex-1 p-2.5 rounded-xl border border-[#DDD9CE] text-xs font-mono bg-white focus:outline-none focus:border-[#EA580C]"
              />
              <Button
                variant="primary"
                size="sm"
                disabled={isPinging}
                onClick={handleSendPing}
                className="rounded-xl shrink-0"
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                {isPinging ? 'Pinging...' : 'Send Test Ping'}
              </Button>
            </div>
          </div>

          {pingResult && (
            <div className="p-3 bg-[#DCFCE7] text-[#16A34A] text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{pingResult}</span>
            </div>
          )}

          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#A8A29E] uppercase tracking-wider block mb-2">
              Subscribed Event Types:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                'evaluation.completed',
                'kpi.actual_recorded',
                'calibration.approved',
                'pip.initiated',
                'coaching.scheduled',
              ].map((ev) => (
                <span
                  key={ev}
                  className="px-2.5 py-1 bg-[#F5EFE6] border border-[#E7E4DC] rounded-lg font-mono text-[11px] text-[#57534E]"
                >
                  {ev}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Interactive REST API Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-[#E7E4DC] bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#18181B]">REST Endpoints Directory</h3>
            <span className="text-xs text-[#78716C]">Click endpoint to test</span>
          </div>

          <div className="space-y-2.5">
            {endpoints.map((ep) => {
              const isSelected = selectedEndpoint === ep.path;
              return (
                <div
                  key={ep.path}
                  onClick={() => handleRunEndpointTest(ep)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#EA580C] bg-[#FFF7ED] shadow-xs'
                      : 'border-[#E7E4DC] hover:border-[#DDD9CE] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          ep.method === 'GET' ? 'bg-[#E0F2FE] text-[#0284C7]' : 'bg-[#DCFCE7] text-[#16A34A]'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <code className="text-xs font-mono font-bold text-[#18181B]">{ep.path}</code>
                    </div>
                    {isSelected && <Badge variant="orange">Active Test</Badge>}
                  </div>
                  <p className="text-[11px] text-[#78716C] mt-1">{ep.desc}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Live Response Payload Sandbox */}
        <Card className="p-6 border-[#E7E4DC] bg-white space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#F5EFE6] pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#EA580C]" />
                <h3 className="text-base font-bold text-[#18181B]">API Sandbox Response</h3>
              </div>
              <Badge variant="success">HTTP 200 OK</Badge>
            </div>

            <div className="mt-3">
              <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider block mb-1.5">
                Output Payload for {selectedEndpoint}:
              </span>
              <pre className="p-4 rounded-2xl bg-[#18181B] text-[#FFEDD5] font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
                {JSON.stringify(testResponse || endpoints[0].sample, null, 2)}
              </pre>
            </div>
          </div>

          <div className="pt-3 border-t border-[#F5EFE6] flex items-center justify-between text-xs text-[#78716C]">
            <span>Content-Type: application/json</span>
            <span>Response Time: 34ms</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
