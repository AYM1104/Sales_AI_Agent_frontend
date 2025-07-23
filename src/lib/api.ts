import { SearchRequest, SearchResponse, SolutionsResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getSolutions(): Promise<SolutionsResponse> {
    return this.request<SolutionsResponse>('solutions');
  }

  async searchCompany(data: SearchRequest): Promise<SearchResponse> {
    return this.request<SearchResponse>('/search-company', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async healthCheck(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/');
  }
}

export const apiClient = new ApiClient();
