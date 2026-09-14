import { apiClient } from './client';
import type { CreateSurveyInput } from '../types/survey';
import type { ApiResponse } from '../types/api';

export interface HealthData {
  status: string;
  database: string;
}

export const surveyApi = {
  /**
   * Submit student survey response to POST /api/v1/survey
   */
  async submitSurvey(data: CreateSurveyInput): Promise<ApiResponse<{ message?: string }>> {
    return apiClient<{ message?: string }>('/api/v1/survey', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Check backend health and DB status GET /api/v1/health
   */
  async checkHealth(): Promise<ApiResponse<HealthData>> {
    return apiClient<HealthData>('/api/v1/health', {
      method: 'GET',
      timeoutMs: 15000,
    });
  },
};
