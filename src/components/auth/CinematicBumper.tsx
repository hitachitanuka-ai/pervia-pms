import React, { useState, useEffect, useRef } from 'react';
import {
  Target,
  LineChart,
  Trophy,
  ClipboardCheck,
  TrendingUp,
  Users,
  FastForward,
} from 'lucide-react';
import { PerviaLogo } from '../brand/PerviaLogo';

interface CinematicBumperProps {
  onComplete: () => void;
}

export const CinematicBumper: React.FC<CinematicBumperProps> = ({ onComplete }) => {
  // Timeline timer (in ms): 0 to 5000ms
  const [elapsed, setElapsed] = useState(0);
  const [isSkipped, setIsSkipped] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Handle keyboard escape to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Main chronological timeline runner
  useEffect(() => {
    const startTime = performance.now();

    const tick = (currentTime: number) => {
      const ms = currentTime - startTime;
      setElapsed(ms);

      if (ms >= 5000) {
        handleFinish();
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Ambient canvas floating dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: {
      x: number;
      y: number;
      radius: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
    }[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.4 ? 28 : 38,
    }));

    let pId: number;
    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 55%, ${p.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#F97316';
        ctx.fill();
      });

      pId = requestAnimationFrame(drawParticles);
    };

    pId = requestAnimationFrame(drawParticles);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(pId);
    };
  }, []);

  const handleFinish = () => {
    setIsSkipped(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  const handleSkip = () => {
    if (isSkipped) return;
    setIsSkipped(true);
    onComplete();
  };

  // Derive scene progress
  const isScene2 = elapsed >= 700;
  const isScene3 = elapsed >= 1700;
  const isScene4 = elapsed >= 3000;
  const isScene5 = elapsed >= 4000;

  // 6 orbiting performance icons
  const orbitIcons = [
    { label: 'Goals', sub: 'Target Alignment', icon: Target, angle: 0, color: '#F97316' },
    { label: 'KPI', sub: 'Deliverables', icon: LineChart, angle: 60, color: '#EA580C' },
    { label: 'Achievement', sub: 'Excellence', icon: Trophy, angle: 120, color: '#F59E0B' },
    { label: 'Evaluation', sub: 'Calibration', icon: ClipboardCheck, angle: 180, color: '#C2410C' },
    { label: 'Growth', sub: 'Continuous Dev', icon: TrendingUp, angle: 240, color: '#FB923C' },
    { label: 'People', sub: 'Collective Synergy', icon: Users, angle: 300, color: '#EA580C' },
  ];

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between overflow-hidden bg-[#FFFBF7] p-6 sm:p-10 select-none transition-opacity duration-700 ${
        isSkipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Canvas for floating micro-particles */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Warm Ambient Radial Backdrop (Scene 1) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(254,215,170,0.45)_0%,_rgba(255,247,237,0.7)_45%,_#FFFBF7_100%)] pointer-events-none" />

      {/* Subtle organic glowing light orb in background */}
      <div
        className={`absolute w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full bg-gradient-to-tr from-[#FED7AA]/40 via-[#FDBA74]/30 to-[#FB923C]/20 blur-3xl transition-all duration-1000 ${
          elapsed > 200 ? 'scale-100 opacity-90' : 'scale-50 opacity-0'
        }`}
      />

      {/* Top Header Bar: Skip Intro Button */}
      <div className="w-full flex justify-end z-50">
        <button
          type="button"
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-[#57534E] hover:text-[#EA580C] text-xs font-bold border border-[#E7E5E4] shadow-xs backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
        >
          <span>Skip Intro</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Central Interactive Universe Container */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center my-auto px-4">
        {/* 3D Motion Universe Stage */}
        <div className="relative w-full h-[330px] sm:h-[390px] flex items-center justify-center">
          {/* Orbital Elliptical Rings (Scene 2 & 3) */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
              isScene2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            {/* Orbital Ring 1: Horizontal tilted */}
            <div
              className="absolute w-[320px] sm:w-[460px] h-[150px] sm:h-[210px] rounded-full border border-[#EA580C]/25 shadow-[0_0_15px_rgba(234,88,12,0.08)] pointer-events-none animate-[spin_24s_linear_infinite]"
              style={{ transform: 'rotate(-20deg)' }}
            />
            {/* Orbital Ring 2: Counter rotated tilted */}
            <div
              className="absolute w-[340px] sm:w-[490px] h-[170px] sm:h-[230px] rounded-full border border-[#FDBA74]/40 border-dashed pointer-events-none animate-[spin_32s_linear_infinite_reverse]"
              style={{ transform: 'rotate(25deg)' }}
            />
            {/* Orbital Ring 3: Wide subtle trajectory */}
            <div
              className="absolute w-[380px] sm:w-[560px] h-[200px] sm:h-[280px] rounded-full border border-[#FED7AA]/30 pointer-events-none"
              style={{ transform: 'rotate(60deg)' }}
            />
          </div>

          {/* 6 Orbiting Performance Universe Icons (Scene 3) */}
          {isScene3 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {orbitIcons.map((item, idx) => {
                // calculate angle on circular / elliptical track
                const baseAngle = (item.angle + (elapsed - 1700) * 0.02) * (Math.PI / 180);
                const radiusX = window.innerWidth < 640 ? 140 : 210;
                const radiusY = window.innerWidth < 640 ? 95 : 135;
                const x = Math.cos(baseAngle) * radiusX;
                const y = Math.sin(baseAngle) * radiusY;
                const IconComp = item.icon;

                return (
                  <div
                    key={item.label}
                    className="absolute flex flex-col items-center gap-1.5 transition-transform duration-300"
                    style={{
                      transform: `translate3d(${x}px, ${y}px, 0)`,
                      animation: `fadeInUp 0.6s ease-out ${idx * 0.12}s forwards`,
                    }}
                  >
                    <div className="relative p-2.5 sm:p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E7E5E4] shadow-lg shadow-[#EA580C]/10 flex items-center justify-center group hover:scale-110 transition-transform">
                      <IconComp className="w-4 h-4 sm:w-5 sm:h-5 text-[#EA580C]" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#EA580C] animate-ping" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#44403C] bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#E7E5E4]/60 whitespace-nowrap shadow-2xs">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Central Core: Orbit Galaxy 3D - 100% Transparent, No Container Background (Scene 2 & 3) */}
          <div
            className={`relative z-20 flex items-center justify-center transition-all duration-1000 ${
              isScene2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            {/* Luminous Inner Core Glow */}
            <div className="absolute w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-[#EA580C] to-[#FB923C] blur-2xl opacity-60 animate-pulse" />

            {/* Orbit Galaxy 3D Render - Transparent Clean PNG */}
            <div className="relative w-44 h-44 sm:w-60 sm:h-60 flex items-center justify-center">
              <img
                src="/assets/aistudio/sphere_orbit_clean.png"
                alt="Orbit Galaxy 3D"
                className="w-full h-full object-contain filter drop-shadow-[0_25px_40px_rgba(234,88,12,0.35)] animate-[spin_40s_linear_infinite]"
              />
            </div>
          </div>
        </div>

        {/* Scene 4: Brand Reveal Typography - Situated Below the 3D Moving Object with zero overlap */}
        <div
          className={`mt-4 sm:mt-6 z-30 flex flex-col items-center text-center transition-all duration-700 ${
            isScene4
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          {/* Pervia Logo & Name */}
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 sm:px-6 py-2.5 rounded-3xl border border-[#E7E5E4] shadow-xl">
            <PerviaLogo size="md" showText={false} />
            <div className="text-left">
              <h1 className="text-xl sm:text-2xl font-black text-[#18181B] tracking-tight leading-none font-sans">
                Pervia
              </h1>
              <p className="text-[9px] sm:text-[10px] font-bold text-[#EA580C] tracking-widest uppercase mt-0.5">
                PERFORMANCE MANAGEMENT SYSTEM
              </p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xs sm:text-sm font-semibold text-[#57534E] mt-2.5 tracking-wide">
            &ldquo;Empowering People. Elevating Performance.&rdquo;
          </p>

          {/* Progress indicator bar */}
          <div className="w-36 sm:w-44 h-1 bg-[#E7E5E4] rounded-full overflow-hidden mt-3.5">
            <div
              className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${Math.min(100, Math.max(0, ((elapsed - 3000) / 1000) * 100))}%` }}
            />
          </div>
        </div>

        {/* Scene 5: Expanding Orange Wave Transition (4000ms+) */}
        {isScene5 && (
          <div
            className="absolute rounded-full bg-gradient-to-tr from-[#EA580C] via-[#F97316] to-[#FED7AA] pointer-events-none transition-all duration-1000 ease-in-out opacity-20"
            style={{
              width: `${(elapsed - 4000) * 2.5}px`,
              height: `${(elapsed - 4000) * 2.5}px`,
            }}
          />
        )}
      </div>

      {/* Footer minimal info */}
      <div className="w-full flex items-center justify-between text-[11px] text-[#A8A29E] font-medium pointer-events-none">
        <span>PMS &bull; Cinematic Orange Experience</span>
        <span>Press ESC to Skip</span>
      </div>
    </div>
  );
};
