import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Network, User, Shield, ArrowRight } from 'lucide-react';
import { db } from '../../lib/database';

export const OrgChartPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A]">Organization Chart</h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Hierarchical reporting lines, executive leadership, and supervisory oversight &bull; Click any member to inspect profile
        </p>
      </div>

      <Card className="p-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Level 1: Executive / CTO */}
          <div
            onClick={() => navigate('/organization/employees')}
            className="w-72 bg-[#0F172A] hover:bg-[#1E293B] text-white p-5 rounded-2xl shadow-sm text-center border border-[#1E293B] cursor-pointer transition-all hover:scale-105 group"
            title="Click to view Alexander Vance in Employee Directory"
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A7F3D0] block">
              Executive Leadership (Level 1)
            </span>
            <h3 className="font-bold text-sm mt-1 text-white group-hover:text-[#A7F3D0] transition-colors">Alexander Vance</h3>
            <p className="text-xs text-[#94A3B8]">Chief Technology Officer</p>
            <span className="inline-block mt-2.5 px-3 py-0.5 bg-[#1E293B] text-[#A7F3D0] text-[10px] font-bold rounded-full">
              Super Admin &bull; View &rarr;
            </span>
          </div>

          {/* Connector */}
          <div className="w-0.5 h-6 bg-[#CBD5E1]" />

          {/* Level 2: VP & Department Heads */}
          <div className="flex flex-wrap justify-center gap-8">
            <div
              onClick={() => navigate('/organization/employees?dept=Engineering')}
              className="w-72 bg-white hover:bg-[#F0FDF4] border-2 border-[#10B981] p-5 rounded-2xl shadow-xs text-center cursor-pointer transition-all hover:scale-105 group"
              title="Click to view Engineering team"
            >
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#059669] block">
                Department Head (Level 2)
              </span>
              <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#059669] transition-colors mt-1">Sarah Chen</h3>
              <p className="text-xs text-[#64748B]">VP of Engineering</p>
              <div className="flex items-center justify-center gap-1.5 mt-2.5">
                <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full">
                  Engineering
                </span>
                <span className="text-[10px] font-bold text-[#0F172A] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full">
                  Dept Manager &bull; View &rarr;
                </span>
              </div>
            </div>

            <div
              onClick={() => navigate('/organization/employees?dept=Human%20Resources')}
              className="w-72 bg-white hover:bg-[#FFF7ED] border border-[#E8EEF3] hover:border-[#EA580C] p-5 rounded-2xl shadow-xs text-center cursor-pointer transition-all hover:scale-105 group"
              title="Click to view Human Resources team"
            >
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] group-hover:text-[#EA580C] block">
                Department Head (Level 2)
              </span>
              <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#EA580C] transition-colors mt-1">Elena Rostova</h3>
              <p className="text-xs text-[#64748B]">Director of Human Resources</p>
              <div className="flex items-center justify-center gap-1.5 mt-2.5">
                <span className="text-[10px] font-bold text-[#EA580C] bg-[#FFEDD5] px-2.5 py-0.5 rounded-full">
                  Human Resources
                </span>
                <span className="text-[10px] font-bold text-[#0F172A] bg-[#F1F5F9] px-2.5 py-0.5 rounded-full">
                  HR Admin &bull; View &rarr;
                </span>
              </div>
            </div>
          </div>

          {/* Connector */}
          <div className="w-0.5 h-6 bg-[#CBD5E1]" />

          {/* Level 3: Lead / Supervisor */}
          <div
            onClick={() => navigate('/organization/employees')}
            className="w-72 bg-white hover:bg-[#FAF5EF] border border-[#E8EEF3] hover:border-[#EA580C] p-5 rounded-2xl shadow-xs text-center cursor-pointer transition-all hover:scale-105 group"
            title="Click to view David Miller in Employee Directory"
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block">
              Direct Supervisor (Level 3)
            </span>
            <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#EA580C] transition-colors mt-1">David Miller</h3>
            <p className="text-xs text-[#64748B]">Lead Frontend Engineer</p>
            <span className="inline-block mt-2 px-3 py-0.5 bg-[#FFEDD5] text-[#C2410C] text-[10px] font-bold rounded-full">
              Supervisor &bull; View &rarr;
            </span>
          </div>

          {/* Connector */}
          <div className="w-0.5 h-6 bg-[#CBD5E1]" />

          {/* Level 4: Senior Contributors */}
          <div className="flex flex-wrap justify-center gap-6">
            <div
              onClick={() => navigate('/organization/employees')}
              className="w-64 bg-[#FAFBFD] hover:bg-[#FFF7ED] border border-[#E8EEF3] hover:border-[#EA580C] p-4 rounded-2xl text-center cursor-pointer transition-all hover:scale-105 group"
              title="Click to view Aria Montgomery in Employee Directory"
            >
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block">
                Direct Report
              </span>
              <h4 className="font-bold text-xs text-[#0F172A] group-hover:text-[#EA580C] transition-colors mt-1">Aria Montgomery</h4>
              <p className="text-[11px] text-[#64748B]">Senior Software Engineer</p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-[#F1F5F9] text-[#475569] text-[10px] font-medium rounded-full">
                Employee &bull; View &rarr;
              </span>
            </div>

            <div
              onClick={() => navigate('/organization/employees')}
              className="w-64 bg-[#FAFBFD] hover:bg-[#FFF7ED] border border-[#E8EEF3] hover:border-[#EA580C] p-4 rounded-2xl text-center cursor-pointer transition-all hover:scale-105 group"
              title="Click to view Jordan Patel in Employee Directory"
            >
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] block">
                Direct Report
              </span>
              <h4 className="font-bold text-xs text-[#0F172A] group-hover:text-[#EA580C] transition-colors mt-1">Jordan Patel</h4>
              <p className="text-[11px] text-[#64748B]">Senior Cloud Architect</p>
              <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-[#F1F5F9] text-[#475569] text-[10px] font-medium rounded-full">
                Reviewer &bull; View &rarr;
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
