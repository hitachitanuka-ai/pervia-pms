import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#172B4D] animate-spin" />
        <p className="text-xs text-[#64748B] font-medium tracking-wide uppercase">
          Verifying enterprise credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center mt-12 bg-white rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="w-12 h-12 rounded-full bg-[#FDF2F2] text-[#DC4545] flex items-center justify-center mx-auto mb-3 font-bold">
          !
        </div>
        <h2 className="text-base font-bold text-[#172B4D]">Access Restricted</h2>
        <p className="text-xs text-[#64748B] mt-1">
          Your current active role does not possess the required permission ({requiredPermission}) to access this module.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
