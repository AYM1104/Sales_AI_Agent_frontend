// API関連の型定義
export interface Solution {
  name: string;
  features: string;
  use_case: string;
}

export interface SearchRequest {
  company_name: string;
  department_name: string;
  position_name: string;
  job_scope: string;
}

export interface SearchResponse {
  success: boolean;
  summary: string;
  hypothesis: string;
  hearing_items: string;
  matching_result: string;
  error_message?: string;
}

export interface SolutionsResponse {
  success: boolean;
  solutions: Solution[];
}

// UI関連の型定義
export interface Results {
  summary: string;
  hypothesis: string;
  hearing_items: string;
  matching_result: string;
}

export interface LoadingSteps {
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
}

export interface Tab {
  id: number;
  label: string;
}

// フォーム関連
export interface CompanyFormData {
  companyName: string;
  departmentName: string;
  positionName: string;
  jobScope: string;
}