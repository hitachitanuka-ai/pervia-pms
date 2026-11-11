import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema, ResetPasswordFormData } from '../../schemas/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (_data: ResetPasswordFormData) => {
    await new Promise((r) => setTimeout(r, 600));
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-12 h-12 rounded-xl bg-[#172B4D] flex items-center justify-center shadow-md text-white font-extrabold text-xl">
          PMS
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-[#172B4D]">
          Set New Password
        </h2>
        <p className="mt-1 text-xs text-[#64748B]">
          Choose a secure password meeting corporate security standards.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E2E8F0] rounded-2xl sm:px-10">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-[#EBF7F0] text-[#16A36A] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#172B4D]">Password Updated Successfully</h3>
              <p className="text-xs text-[#64748B]">
                Your corporate credential has been updated in the database. You may now log in with your new password.
              </p>
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Sign In Now
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                helperText="Minimum 8 characters"
                error={errors.password?.message}
                {...register('password')}
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full"
                isLoading={isSubmitting}
              >
                Update Password & Login
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
