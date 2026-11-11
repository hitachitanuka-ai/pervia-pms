import React, { useState, useEffect, useRef } from 'react';
import {
  Target,
  Trophy,
  TrendingUp,
  ClipboardCheck,
  Award,
  Sparkles,
  Users,
  CheckCircle2,
  LineChart,
} from 'lucide-react';

export const VisualPanel3D: React.FC = () => {
  // Mouse parallax state: normalized -1 to +1
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // calculate normalized coordinates relative to center of panel
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMousePos({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Parallax offsets
  const tiltX = mousePos.y * -10; // degrees
  const tiltY = mousePos.x * 12; // degrees
  const lightX = 50 + mousePos.x * 20; // percent
  const lightY = 45 + mousePos.y * 20; // percent

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[580px] lg:min-h-screen bg-gradient-to-br from-[#FFFBF7] via-[#FFF5EB] to-[#FEEAD8] p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden select-none border-r border-[#E7E5E4]/80"
    >
      {/* Dynamic Mouse-Following Light Spot */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-radial from-[#FDBA74]/35 via-[#FED7AA]/15 to-transparent blur-3xl pointer-events-none transition-all duration-300 ease-out"
        style={{
          left: `${lightX}%`,
          top: `${lightY}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Subtle organic wavy contours in background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gridGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FB923C" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path
          d="M-100 200 C 150 120, 300 350, 700 240 C 950 160, 1100 380, 1400 260"
          fill="none"
          stroke="url(#gridGrad)"
          strokeWidth="2.5"
        />
        <path
          d="M-100 450 C 200 380, 450 600, 800 480 C 1050 400, 1200 620, 1500 500"
          fill="none"
          stroke="url(#gridGrad)"
          strokeWidth="2"
        />
      </svg>

      {/* Top Section: Typography Branding & Impact Statement */}
      <div className="relative z-20 space-y-3 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#E7E5E4] backdrop-blur-md shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
          <span className="text-[11px] font-bold text-[#EA580C] uppercase tracking-wider">
            Enterprise Performance Suite
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#18181B] tracking-tight leading-tight">
          Performance is Progress.
        </h1>

        <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-lg font-medium">
          Manage goals, measure deliverables, and unlock the full collective potential of your teams in one cinematic, unified workspace.
        </p>
      </div>

      {/* Centerpiece: 3D Performance Universe Ecosystem with Parallax Tilt */}
      <div
        className="relative z-10 flex-1 flex items-center justify-center my-6 sm:my-10"
        style={{
          perspective: '1000px',
        }}
      >
        <div
          className="relative w-72 sm:w-96 h-72 sm:h-96 flex items-center justify-center transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tiltX}px) rotateY(${tiltY}px) scale3d(1, 1, 1)`,
          }}
        >
          {/* Orbital Concentric Wireframe Tracks */}
          <div className="absolute w-[340px] sm:w-[440px] h-[170px] sm:h-[220px] rounded-full border border-[#EA580C]/20 border-dashed pointer-events-none -rotate-12 animate-[spin_40s_linear_infinite]" />
          <div className="absolute w-[360px] sm:w-[470px] h-[180px] sm:h-[235px] rounded-full border border-[#FDBA74]/30 pointer-events-none rotate-25 animate-[spin_50s_linear_infinite_reverse]" />

          {/* Central 3D Glowing Core Sphere - Orbit Galaxy 3D, 100% Transparent, No Background Box or Frame */}
          <div className="relative z-10 w-52 sm:w-68 h-52 sm:h-68 flex items-center justify-center group">
            {/* Ambient Soft Glow Aura (Zero harsh background borders) */}
            <div className="absolute w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-radial from-[#FB923C]/30 via-[#EA580C]/15 to-transparent blur-3xl pointer-events-none scale-125" />

            {/* Embedded 3D Sphere Render - Orbital Galaxy 3D */}
            <img
              src="/assets/aistudio/sphere_orbit_clean.png"
              alt="Orbital Galaxy 3D"
              className="w-full h-full object-contain filter drop-shadow-[0_25px_40px_rgba(234,88,12,0.3)] animate-[spin_45s_linear_infinite] group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Floating Glass Card 1: KPI Deliverable (Top-Left) */}
          <div
            className="absolute -top-4 -left-4 sm:-left-12 z-20 bg-white/90 backdrop-blur-md border border-[#E7E5E4] rounded-2xl p-3.5 shadow-xl transition-transform duration-300 ease-out hover:scale-105 cursor-default flex items-center gap-3"
            style={{
              transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -16}px, 20px)`,
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FB923C] to-[#EA580C] text-white flex items-center justify-center shadow-md shadow-[#EA580C]/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider block">
                Target Alignment
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-black text-[#18181B]">98.4%</span>
                <span className="text-[10px] font-bold text-[#16A36A] bg-[#DCFCE7] px-1.5 py-0.2 rounded-full">
                  Exceeds
                </span>
              </div>
            </div>
          </div>

          {/* Floating Glass Card 2: 360 Feedback Rating (Bottom-Right) */}
          <div
            className="absolute -bottom-6 -right-4 sm:-right-10 z-20 bg-white/90 backdrop-blur-md border border-[#E7E5E4] rounded-2xl p-3.5 shadow-xl transition-transform duration-300 ease-out hover:scale-105 cursor-default flex items-center gap-3"
            style={{
              transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20}px, 30px)`,
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-white flex items-center justify-center shadow-md shadow-[#D97706]/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#A8A29E] uppercase tracking-wider block">
                360 Feedback
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-black text-[#18181B]">Grade A</span>
                <span className="text-[10px] text-[#78716C] font-semibold">5 Evaluators</span>
              </div>
            </div>
          </div>

          {/* Floating Glass Card 3: Employee Team Synergy (Bottom-Left) */}
          <div
            className="absolute -bottom-8 left-2 sm:left-4 z-20 bg-white/90 backdrop-blur-md border border-[#E7E5E4] rounded-2xl px-3 py-2 shadow-lg transition-transform duration-300 ease-out hover:scale-105 flex items-center gap-2.5"
            style={{
              transform: `translate3d(${mousePos.x * -12}px, ${mousePos.y * 12}px, 15px)`,
            }}
          >
            <div className="flex -space-x-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80"
                alt="Avatar"
                className="w-6 h-6 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=80"
                alt="Avatar"
                className="w-6 h-6 rounded-full border-2 border-white object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&q=80"
                alt="Avatar"
                className="w-6 h-6 rounded-full border-2 border-white object-cover"
              />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-bold text-[#18181B] block leading-none">128 Staff</span>
              <span className="text-[9px] font-bold text-[#EA580C]">92.5% Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Feature Pills */}
      <div className="relative z-20 pt-4 border-t border-[#E7E5E4]/80 flex flex-wrap items-center justify-between gap-3 text-xs text-[#57534E]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />
            KPI Continuous Calibration
          </span>
          <span className="hidden sm:flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
            Multi-Rater 360 Ecosystem
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#A8A29E]">Pervia PMS &bull; v2.4</span>
      </div>
    </div>
  );
};
