import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';

// Main Application Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { MyTasksPage } from './pages/tasks/MyTasksPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';

// Organization
import { EmployeeDirectoryPage } from './pages/organization/EmployeeDirectoryPage';
import { DepartmentsPage } from './pages/organization/DepartmentsPage';
import { PositionsPage } from './pages/organization/PositionsPage';
import { OrgChartPage } from './pages/organization/OrgChartPage';

// Performance Cycle
import { EvaluationPeriodsPage } from './pages/cycle/EvaluationPeriodsPage';
import { EvaluationCalendarPage } from './pages/cycle/EvaluationCalendarPage';

// KPI Management
import { KPILibraryPage } from './pages/kpi/KPILibraryPage';
import { ActualPerformancePage } from './pages/kpi/ActualPerformancePage';
import { TargetManagementPage } from './pages/kpi/TargetManagementPage';

// Assessment
import { FinalEvaluationPage } from './pages/assessment/FinalEvaluationPage';
import { AppraisalDossierPage } from './pages/assessment/AppraisalDossierPage';
import { SelfAssessmentPage } from './pages/assessment/SelfAssessmentPage';
import { SupervisorAssessmentPage } from './pages/assessment/SupervisorAssessmentPage';
import { Feedback360Page } from './pages/assessment/Feedback360Page';
import { SalaryIncentiveSimulatorPage } from './pages/assessment/SalaryIncentiveSimulatorPage';

// Development Pages
import { CoachingRecordsPage } from './pages/development/CoachingRecordsPage';
import { DevelopmentPlanPage } from './pages/development/DevelopmentPlanPage';
import { PIPRecordsPage } from './pages/development/PIPRecordsPage';

// Analytics & Reports Pages
import { CompanyReportPage } from './pages/analytics/CompanyReportPage';
import { DepartmentReportPage } from './pages/analytics/DepartmentReportPage';
import { CompetencyGapPage } from './pages/analytics/CompetencyGapPage';
import { RatingDistributionPage } from './pages/analytics/RatingDistributionPage';
import { TalentMatrix9BoxPage } from './pages/analytics/TalentMatrix9BoxPage';


// Data Management Pages
import { ImportExcelPage } from './pages/data/ImportExcelPage';
import { ExportDataPage } from './pages/data/ExportDataPage';
import { ApiIntegrationPage } from './pages/data/ApiIntegrationPage';

// System Settings & Database
import { DatabaseStatusPage } from './pages/settings/DatabaseStatusPage';
import { AuditLogsPage } from './pages/settings/AuditLogsPage';
import { RolesPermissionsPage } from './pages/settings/RolesPermissionsPage';
import { UserManagementPage } from './pages/settings/UserManagementPage';
import { CompanySettingsPage } from './pages/settings/CompanySettingsPage';

// Sub-route contextual modules
import { ModulePlaceholderPage } from './pages/placeholder/ModulePlaceholderPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Enterprise PMS Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* OVERVIEW */}
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="tasks" element={<MyTasksPage />} />
              <Route path="notifications" element={<NotificationsPage />} />

              {/* ORGANIZATION */}
              <Route path="organization/employees" element={<EmployeeDirectoryPage />} />
              <Route path="organization/departments" element={<DepartmentsPage />} />
              <Route path="organization/positions" element={<PositionsPage />} />
              <Route path="organization/chart" element={<OrgChartPage />} />

              {/* PERFORMANCE CYCLE */}
              <Route path="cycle/periods" element={<EvaluationPeriodsPage />} />
              <Route path="cycle/calendar" element={<EvaluationCalendarPage />} />
              <Route path="cycle/workflow" element={<EvaluationPeriodsPage />} />
              <Route path="cycle/history" element={<EvaluationPeriodsPage />} />

              {/* KPI MANAGEMENT */}
              <Route path="kpi/library" element={<KPILibraryPage />} />
              <Route path="kpi/categories" element={<KPILibraryPage />} />
              <Route path="kpi/templates" element={<KPILibraryPage />} />
              <Route path="kpi/assignment" element={<TargetManagementPage />} />
              <Route path="kpi/targets" element={<TargetManagementPage />} />
              <Route path="kpi/actuals" element={<ActualPerformancePage />} />
              <Route path="kpi/evidence" element={<ActualPerformancePage />} />
              <Route path="kpi/monitoring" element={<ActualPerformancePage />} />

              {/* ASSESSMENT */}
              <Route path="assessment/self" element={<SelfAssessmentPage />} />
              <Route path="assessment/supervisor" element={<SupervisorAssessmentPage />} />
              <Route path="assessment/competency" element={<CompetencyGapPage />} />
              <Route path="assessment/behavioral" element={<CompetencyGapPage />} />
              <Route path="assessment/360-feedback" element={<Feedback360Page />} />
              <Route path="assessment/calibration" element={<TalentMatrix9BoxPage />} />
              <Route path="assessment/dossier" element={<AppraisalDossierPage />} />
              <Route path="assessment/final" element={<FinalEvaluationPage />} />
              <Route path="assessment/salary-simulator" element={<SalaryIncentiveSimulatorPage />} />
              <Route path="assessment/merit-matrix" element={<SalaryIncentiveSimulatorPage />} />

              {/* DEVELOPMENT (DEDICATED DISTINCT PAGES) */}
              <Route path="development" element={<Navigate to="/development/coaching" replace />} />
              <Route path="development/coaching" element={<CoachingRecordsPage />} />
              <Route path="development/plan" element={<DevelopmentPlanPage />} />
              <Route path="development/pip" element={<PIPRecordsPage />} />
              <Route path="development/monitoring" element={<PIPRecordsPage />} />

              {/* ANALYTICS & REPORTS (DEDICATED DISTINCT PAGES) */}
              <Route path="analytics" element={<Navigate to="/analytics/company" replace />} />
              <Route path="analytics/company" element={<CompanyReportPage />} />
              <Route path="analytics/department" element={<DepartmentReportPage />} />
              <Route path="analytics/individual" element={<CompanyReportPage />} />
              <Route path="analytics/kpi" element={<DepartmentReportPage />} />
              <Route path="analytics/talent-matrix" element={<TalentMatrix9BoxPage />} />
              <Route path="analytics/9-box" element={<TalentMatrix9BoxPage />} />
              <Route path="analytics/competency" element={<CompetencyGapPage />} />
              <Route path="analytics/competency-gap" element={<CompetencyGapPage />} />
              <Route path="analytics/behavioral" element={<CompetencyGapPage />} />
              <Route path="analytics/feedback-summary" element={<CompanyReportPage />} />
              <Route path="analytics/distribution" element={<RatingDistributionPage />} />

              {/* DATA MANAGEMENT (DEDICATED DISTINCT PAGES) */}
              <Route path="data" element={<Navigate to="/data/import" replace />} />
              <Route path="data/import" element={<ImportExcelPage />} />
              <Route path="data/export" element={<ExportDataPage />} />
              <Route path="data/api" element={<ApiIntegrationPage />} />
              <Route path="data/history" element={<ImportExcelPage />} />

              {/* SYSTEM SETTINGS (/settings/* canonical routes) */}
              <Route path="settings" element={<Navigate to="/settings/company" replace />} />
              <Route path="settings/company" element={<CompanySettingsPage />} />
              <Route path="settings/roles" element={<RolesPermissionsPage />} />
              <Route path="settings/users" element={<UserManagementPage />} />
              <Route path="settings/database" element={<DatabaseStatusPage />} />
              <Route path="settings/audit" element={<AuditLogsPage />} />

              {/* SYSTEM ADMINISTRATION (/admin/* legacy aliases) */}
              <Route path="admin" element={<Navigate to="/settings/company" replace />} />
              <Route path="admin/users" element={<UserManagementPage />} />
              <Route path="admin/roles" element={<RolesPermissionsPage />} />
              <Route path="admin/settings" element={<CompanySettingsPage />} />
              <Route path="admin/ratings" element={<CompanySettingsPage />} />
              <Route path="admin/notifications" element={<NotificationsPage />} />
              <Route path="admin/audit" element={<AuditLogsPage />} />
              <Route path="admin/company" element={<CompanySettingsPage />} />
              <Route path="admin/database" element={<DatabaseStatusPage />} />

              {/* Catch-all for subpaths */}
              <Route path="*" element={<ModulePlaceholderPage />} />
            </Route>

            {/* Default fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
