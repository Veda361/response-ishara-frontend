import { apiClient, API_BASE_URL } from './client';
import type { ISurveyResponse, SurveyListQuery } from '../types/survey';
import type { AnalyticsFilterQuery, AnalyticsOverview } from '../types/analytics';
import type { ApiResponse, PaginationMeta } from '../types/api';

export interface SurveyListResponse {
  responses: ISurveyResponse[];
  pagination: PaginationMeta;
}

export const adminApi = {
  /**
   * Fetch paginated, filtered surveys
   * GET /api/v1/admin/surveys
   */
  async getSurveys(query: SurveyListQuery = {}): Promise<ApiResponse<SurveyListResponse>> {
    return apiClient<SurveyListResponse>('/api/v1/admin/surveys', {
      method: 'GET',
      params: query as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Get single survey by ID
   * GET /api/v1/admin/surveys/:id
   */
  async getSurveyById(id: string): Promise<ApiResponse<ISurveyResponse>> {
    return apiClient<ISurveyResponse>(`/api/v1/admin/surveys/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Delete survey by ID
   * DELETE /api/v1/admin/surveys/:id
   */
  async deleteSurvey(id: string): Promise<ApiResponse<{ message?: string }>> {
    return apiClient<{ message?: string }>(`/api/v1/admin/surveys/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get aggregated analytics overview
   * GET /api/v1/admin/analytics/overview
   */
  async getAnalyticsOverview(
    filters: AnalyticsFilterQuery = {}
  ): Promise<ApiResponse<AnalyticsOverview>> {
    return apiClient<AnalyticsOverview>('/api/v1/admin/analytics/overview', {
      method: 'GET',
      params: filters as Record<string, string | number | boolean | undefined>,
    });
  },

  /**
   * Download CSV export
   * GET /api/v1/admin/surveys/export
   */
  async downloadCsvExport(adminKey: string): Promise<Blob> {
    const url = `${API_BASE_URL}/api/v1/admin/surveys/export?adminKey=${encodeURIComponent(adminKey)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-admin-key': adminKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to export CSV: ${response.statusText}`);
    }

    return await response.blob();
  },
};
