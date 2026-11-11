import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../schemas/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ForgotPasswordPage: React.FC = () => {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    // Simulate enterprise secure token dispatch
    await new Promise((r) => setTimeout(r, 600));
    setSubmittedEmail(data.email);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 rounded-xl bg-[#172B4D] flex items-center justify-center shadow-md text-white font-extrabold text-xl">
          PMS
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#172B4D]">
          Reset Corporate Password
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          Enter your registered work email to receive a secure recovery link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E2E8F0] rounded-2xl sm:px-10">
          {submittedEmail ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-[#EBF7F0] text-[#16A36A] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#172B4D]">Password Reset Dispatched</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                If an active corporate profile exists for{' '}
                <strong className="text-[#172B4D]">{submittedEmail}</strong>, an encrypted reset link
                valid for 15 minutes has been delivered.
              </p>
              <div className="pt-2">
                <Link to="/reset-password">
                  <Button variant="outline" size="sm" className="w-full mb-2">
                    Enter Recovery Code / Reset Password
                  </Button>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#315E91] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Registered Business Email"
                type="email"
                placeholder="name@apexglobal.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isSubmitting}
              >
                Send Password Reset Link
              </Button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#172B4D] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
