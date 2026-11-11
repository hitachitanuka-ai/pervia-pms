import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Play,
  User,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { loginSchema, LoginFormData } from '../../schemas/auth';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { UserRole } from '../../types';
import { PerviaLogo } from '../../components/brand/PerviaLogo';
import { CinematicBumper } from '../../components/auth/CinematicBumper';
import { VisualPanel3D } from '../../components/auth/VisualPanel3D';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Check sessionStorage for cinematic bumper view status
  const [showBumper, setShowBumper] = useState<boolean>(() => {
    // Check if intro has already been viewed in this browser session
    try {
      const viewed = sessionStorage.getItem('pervia_intro_viewed');
      return !viewed;
    } catch {
      return false;
    }
  });

  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoleBadge, setSelectedRoleBadge] = useState<string>('HR Admin');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'hradmin@enterprise-pms.com',
      password: 'Password123!',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setAuthError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickLogin = (email: string, roleName: string) => {
    setValue('email', email);
    setValue('password', 'Password123!');
    setSelectedRoleBadge(roleName);
    setAuthError(null);
  };

  const handleBumperComplete = () => {
    setShowBumper(false);
    try {
      sessionStorage.setItem('pervia_intro_viewed', 'true');
    } catch (e) {
      // ignore storage errors
    }
  };

  const handleReplayIntro = () => {
    setShowBumper(true);
  };

  const demoAccounts: { role: UserRole; name: string; email: string; tag: string }[] = [
    {
      role: 'HR Admin',
      name: 'Elena Rostova',
      email: 'hradmin@enterprise-pms.com',
      tag: 'People & Cycles',
    },
    {
      role: 'Department Manager',
      name: 'Sarah Chen',
      email: 'deptmanager@enterprise-pms.com',
      tag: 'VP Engineering',
    },
    {
      role: 'Supervisor',
      name: 'David Miller',
      email: 'supervisor@enterprise-pms.com',
      tag: 'Team Lead',
    },
    {
      role: 'Employee',
      name: 'Aria Montgomery',
      email: 'employee@enterprise-pms.com',
      tag: 'Sr Engineer',
    },
    {
      role: 'Super Admin',
      name: 'Alexander Vance',
      email: 'superadmin@enterprise-pms.com',
      tag: 'CTO / Exec',
    },
    {
      role: 'HR Manager',
      name: 'Marcus Sterling',
      email: 'hrmanager@enterprise-pms.com',
      tag: 'Calibration',
    },
    {
      role: 'Reviewer',
      name: 'Jordan Patel',
      email: 'reviewer@enterprise-pms.com',
      tag: '360 Peer',
    },
  ];

  return (
    <>
      {/* Cinematic Opening Bumper (Plays on first session visit or when user clicks Replay Intro) */}
      {showBumper && <CinematicBumper onComplete={handleBumperComplete} />}

      {/* Main Split Screen Interactive Login View */}
      <div className="min-h-screen w-full bg-[#FFFBF7] flex flex-col lg:flex-row antialiased selection:bg-[#FED7AA] selection:text-[#EA580C]">
        {/* LEFT SECTION (60% on Desktop): Creative 3D Visual Panel */}
        <div className="hidden lg:block lg:w-[58%] xl:w-[62%] h-full min-h-screen">
          <VisualPanel3D />
        </div>

        {/* RIGHT SECTION (40% on Desktop / Full Width on Mobile): Minimalist Premium Login Card */}
        <div className="w-full lg:w-[42%] xl:w-[38%] min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-white relative z-10 overflow-y-auto">
          {/* Top Bar: Brand Logo & Replay Intro Control */}
          <div className="flex items-center justify-between gap-3 pb-4">
            <PerviaLogo size="md" />

            <button
              type="button"
              onClick={handleReplayIntro}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF7ED] hover:bg-[#FFEDD5] text-[#EA580C] text-xs font-bold border border-[#FED7AA] shadow-2xs transition-all hover:scale-105 cursor-pointer"
              title="Watch Cinematic Intro Bumper again"
            >
              <Play className="w-3 h-3 fill-[#EA580C]" />
              <span>Replay Intro</span>
            </button>
          </div>

          {/* Center: Main Login Form Card */}
          <div className="my-auto py-6 sm:py-8 max-w-md w-full mx-auto space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEDD5] border border-[#FED7AA] text-[10px] font-extrabold text-[#EA580C] uppercase tracking-wider mb-2.5">
                <Sparkles className="w-3 h-3" />
                Sign In to Performance Workspace
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#18181B] tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-xs sm:text-sm text-[#78716C] mt-1 font-medium">
                Sign in to manage goals, input deliverables, and calibrate reviews.
              </p>
            </div>

            {/* Quick Demo Persona Switcher (Convenient for Enterprise Testing) */}
            <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#E7E5E4] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-[#78716C] uppercase tracking-wider">
                <span>Select Demo Persona:</span>
                <span className="text-[#EA580C] font-semibold">{selectedRoleBadge}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleQuickLogin(acc.email, acc.role)}
                    className={`text-[10px] px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                      selectedRoleBadge === acc.role
                        ? 'bg-[#18181B] text-white shadow-xs'
                        : 'bg-white hover:bg-[#FFEDD5] text-[#57534E] hover:text-[#EA580C] border border-[#E7E5E4]'
                    }`}
                  >
                    {acc.role}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Feedback Banner */}
            {authError && (
              <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-2.5 text-xs text-[#DC2626] animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username / Email Field with Icon & Floating Affordance */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#292524]">
                  Workplace Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E7E5E4] bg-white text-xs text-[#18181B] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#EA580C] focus:ring-3 focus:ring-[#FFEDD5] transition-all font-medium min-h-[44px]"
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-[#DC2626] font-medium">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field with Lock Icon & Toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#292524]">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-bold text-[#EA580C] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#A8A29E] absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-2xl border border-[#E7E5E4] bg-white text-xs text-[#18181B] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#EA580C] focus:ring-3 focus:ring-[#FFEDD5] transition-all font-medium min-h-[44px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#A8A29E] hover:text-[#57534E] cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-[#DC2626] font-medium">{errors.password.message}</p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#57534E] select-none">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="w-4 h-4 rounded-md border-[#E7E5E4] text-[#EA580C] focus:ring-[#EA580C] accent-[#EA580C] cursor-pointer"
                  />
                  <span className="font-medium">Remember this device</span>
                </label>
              </div>

              {/* Primary Action Button with Orange Glow */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#C2410C] hover:from-[#EA580C] hover:to-[#9A3412] text-white text-xs sm:text-sm font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#EA580C]/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 min-h-[48px] group"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Your Workspace</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Card Info */}
          <div className="pt-4 border-t border-[#E7E5E4] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#78716C] text-center sm:text-left">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A]" />
              Secure Performance Workspace &bull; SSL 256-bit
            </span>
            <span className="font-mono text-[10px] text-[#A8A29E]">
              &copy; 2026 Pervia PMS Enterprise
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
