-- ====================================================================
-- PERFORMANCE MANAGEMENT SYSTEM (PMS)
-- Initial Schema Migration: 001_initial_schema.sql
-- PostgreSQL / Supabase Compatible DDL with RLS Policies & Constraints
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COMPANIES
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  domain VARCHAR(255),
  logo_url TEXT,
  currency VARCHAR(10) DEFAULT 'USD',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  manager_id UUID,
  parent_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_dept_code UNIQUE (company_id, code)
);

-- 3. POSITIONS
CREATE TABLE IF NOT EXISTS positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  level VARCHAR(50) NOT NULL, -- 'Executive', 'Senior', 'Middle', 'Junior'
  job_family VARCHAR(100),
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_pos_code UNIQUE (company_id, code)
);

-- 4. PROFILES (Users mapped to Supabase auth.users or internal users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Super Admin', 'HR Admin', 'HR Manager', 'Department Manager', 'Supervisor', 'Employee', 'Reviewer')),
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EMPLOYEES
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  employee_id VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  avatar_url TEXT,
  department_id UUID NOT NULL REFERENCES departments(id),
  position_id UUID NOT NULL REFERENCES positions(id),
  manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  supervisor_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  join_date DATE NOT NULL,
  employment_status VARCHAR(50) DEFAULT 'Active' CHECK (employment_status IN ('Active', 'Probation', 'Contract', 'Terminated', 'Resigned')),
  location VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_emp_id UNIQUE (company_id, employee_id)
);

-- 6. ROLES & PERMISSIONS
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EVALUATION PERIODS
CREATE TABLE IF NOT EXISTS evaluation_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Weekly', 'Monthly', 'Quarterly', 'Annually', 'Custom')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  submission_deadline DATE NOT NULL,
  review_deadline DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Active', 'Locked', 'Closed', 'Archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_period_code UNIQUE (company_id, code)
);

-- 8. EVALUATION TEMPLATES
CREATE TABLE IF NOT EXISTS evaluation_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  kpi_weight NUMERIC(5,2) DEFAULT 60.00,
  competency_weight NUMERIC(5,2) DEFAULT 20.00,
  behavioral_weight NUMERIC(5,2) DEFAULT 10.00,
  feedback_weight NUMERIC(5,2) DEFAULT 10.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. EVALUATION ASSIGNMENTS
CREATE TABLE IF NOT EXISTS evaluation_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES evaluation_periods(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  template_id UUID REFERENCES evaluation_templates(id),
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_eval_assign UNIQUE (period_id, employee_id)
);

-- 10. KPI CATEGORIES & INDICATORS
CREATE TABLE IF NOT EXISTS kpi_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kpi_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  department_id UUID REFERENCES departments(id),
  position_id UUID REFERENCES positions(id),
  measurement_type VARCHAR(50) NOT NULL CHECK (measurement_type IN ('Numeric', 'Percentage', 'Rating', 'Milestone')),
  direction VARCHAR(50) NOT NULL CHECK (direction IN ('Higher Is Better', 'Lower Is Better', 'Exact Target', 'Milestone')),
  default_target NUMERIC(12,2) NOT NULL,
  default_weight NUMERIC(5,2) NOT NULL,
  min_score NUMERIC(5,2) DEFAULT 0.00,
  max_score NUMERIC(5,2) DEFAULT 120.00,
  unit VARCHAR(50) NOT NULL,
  data_source VARCHAR(100) DEFAULT 'Internal ERP',
  status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_kpi_code UNIQUE (company_id, code)
);

-- 11. EMPLOYEE KPIS & ACTUALS
CREATE TABLE IF NOT EXISTS employee_kpis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES evaluation_periods(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  kpi_id UUID NOT NULL REFERENCES kpi_indicators(id),
  target NUMERIC(12,2) NOT NULL,
  weight NUMERIC(5,2) NOT NULL,
  actual NUMERIC(12,2),
  achievement_rate NUMERIC(7,2),
  weighted_score NUMERIC(7,2),
  status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'Verified', 'Approved')),
  supervisor_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kpi_actuals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_kpi_id UUID NOT NULL REFERENCES employee_kpis(id) ON DELETE CASCADE,
  date_recorded DATE NOT NULL,
  actual_value NUMERIC(12,2) NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kpi_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_kpi_id UUID NOT NULL REFERENCES employee_kpis(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type VARCHAR(100),
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. COMPETENCIES
CREATE TABLE IF NOT EXISTS competency_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS competencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Core', 'Functional', 'Leadership', 'Digital', 'Communication')),
  description TEXT,
  target_level INT CHECK (target_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS competency_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_id UUID NOT NULL REFERENCES evaluation_periods(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  weight NUMERIC(5,2) DEFAULT 20.00
);

CREATE TABLE IF NOT EXISTS competency_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES competency_assignments(id) ON DELETE CASCADE,
  self_rating INT CHECK (self_rating BETWEEN 1 AND 5),
  supervisor_rating INT CHECK (supervisor_rating BETWEEN 1 AND 5),
  final_rating NUMERIC(4,2),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. BEHAVIORAL INDICATORS & SCORES
CREATE TABLE IF NOT EXISTS behavioral_indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  weight NUMERIC(5,2) DEFAULT 10.00,
  scale_min INT DEFAULT 1,
  scale_max INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS behavioral_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_id UUID NOT NULL REFERENCES evaluation_periods(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  indicator_id UUID NOT NULL REFERENCES behavioral_indicators(id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  evidence TEXT,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. 360-DEGREE FEEDBACK
CREATE TABLE IF NOT EXISTS feedback_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES evaluation_periods(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  min_respondents INT DEFAULT 3,
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback_reviewers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID NOT NULL REFERENCES feedback_campaigns(id) ON DELETE CASCADE,
  target_employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  reviewer_employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  relationship VARCHAR(50) NOT NULL CHECK (relationship IN ('Self', 'Supervisor', 'Peer', 'Subordinate', 'Stakeholder')),
  weight NUMERIC(5,2) DEFAULT 20.00,
  is_anonymous BOOLEAN DEFAULT true,
  status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Submitted', 'Declined'))
);

CREATE TABLE IF NOT EXISTS feedback_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID NOT NULL REFERENCES feedback_reviewers(id) ON DELETE CASCADE,
  overall_score NUMERIC(5,2),
  strengths TEXT,
  improvements TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  response_id UUID NOT NULL REFERENCES feedback_responses(id) ON DELETE CASCADE,
  question_code VARCHAR(50) NOT NULL,
  score INT CHECK (score BETWEEN 1 AND 5),
  comment TEXT
);

-- 15. PERFORMANCE EVALUATION & APPROVALS
CREATE TABLE IF NOT EXISTS performance_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES evaluation_periods(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL,
  kpi_score NUMERIC(6,2) DEFAULT 0.00,
  competency_score NUMERIC(6,2) DEFAULT 0.00,
  behavioral_score NUMERIC(6,2) DEFAULT 0.00,
  feedback_score NUMERIC(6,2) DEFAULT 0.00,
  final_score NUMERIC(6,2) DEFAULT 0.00,
  rating_grade VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Submitted', 'In Review', 'Revision Requested', 'Approved', 'Finalized')),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_perf_eval UNIQUE (period_id, employee_id)
);

CREATE TABLE IF NOT EXISTS evaluation_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID NOT NULL REFERENCES performance_evaluations(id) ON DELETE CASCADE,
  component_type VARCHAR(50) NOT NULL,
  weight NUMERIC(5,2) NOT NULL,
  calculated_score NUMERIC(6,2) NOT NULL,
  is_complete BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS evaluation_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evaluation_id UUID NOT NULL REFERENCES performance_evaluations(id) ON DELETE CASCADE,
  approver_id UUID NOT NULL REFERENCES profiles(id),
  step_order INT NOT NULL,
  action VARCHAR(50) NOT NULL CHECK (action IN ('Approved', 'Revision Requested', 'Rejected')),
  comments TEXT,
  action_date TIMESTAMPTZ DEFAULT NOW()
);

-- 16. DEVELOPMENT & PIP
CREATE TABLE IF NOT EXISTS coaching_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL REFERENCES employees(id),
  session_date DATE NOT NULL,
  topic VARCHAR(255) NOT NULL,
  key_discussion TEXT,
  action_items JSONB DEFAULT '[]',
  status VARCHAR(50) DEFAULT 'Scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS development_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  period_id UUID REFERENCES evaluation_periods(id),
  competency_focus VARCHAR(255) NOT NULL,
  action_plan TEXT NOT NULL,
  target_completion DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'In Progress',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pip_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  supervisor_id UUID NOT NULL REFERENCES employees(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  performance_issue TEXT NOT NULL,
  improvement_targets TEXT NOT NULL,
  check_in_frequency VARCHAR(50) DEFAULT 'Bi-Weekly',
  status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Extended', 'Successfully Completed', 'Unsuccessful')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pip_objectives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pip_id UUID NOT NULL REFERENCES pip_records(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  target_metric TEXT,
  progress_pct INT DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  due_date DATE
);

-- 17. NOTIFICATIONS & AUDIT LOGS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  user_name VARCHAR(255) NOT NULL,
  user_role VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  module VARCHAR(100) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 18. DATA MANAGEMENT & INTEGRATIONS
CREATE TABLE IF NOT EXISTS import_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  module VARCHAR(100) NOT NULL,
  records_count INT DEFAULT 0,
  success_count INT DEFAULT 0,
  error_count INT DEFAULT 0,
  errors JSONB DEFAULT '[]',
  imported_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  api_key_hash TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_id UUID REFERENCES api_integrations(id) ON DELETE SET NULL,
  endpoint VARCHAR(255) NOT NULL,
  status_code INT NOT NULL,
  response_time_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rating_scales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  grade VARCHAR(20) NOT NULL,
  label VARCHAR(100) NOT NULL,
  min_score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) NOT NULL,
  color_code VARCHAR(20) DEFAULT '#315E91'
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper policy for company isolation
CREATE POLICY company_isolation_policy ON profiles
  FOR ALL USING (company_id = (SELECT company_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY employee_view_policy ON employees
  FOR SELECT USING (
    company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY evaluation_privacy_policy ON performance_evaluations
  FOR SELECT USING (
    -- Employee can view own, Manager can view subordinates, HR can view all in company
    (employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()))
    OR (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('Super Admin', 'HR Admin', 'HR Manager', 'Department Manager', 'Supervisor')))
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_emp_dept ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_emp_comp ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_kpi_period ON employee_kpis(period_id, employee_id);
CREATE INDEX IF NOT EXISTS idx_eval_period ON performance_evaluations(period_id, employee_id);
