import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { SearchRequest, Results, LoadingSteps } from '@/types';

export const useCompanySearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results>({
    summary: '',
    hypothesis: '',
    hearing_items: '',
    matching_result: ''
  });
  const [loadingSteps, setLoadingSteps] = useState<LoadingSteps>({
    step1: false,
    step2: false,
    step3: false,
    step4: false
  });

  const sleep = (ms: number): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms));

  const searchCompany = async (data: SearchRequest): Promise<void> => {
    setLoading(true);
    setLoadingSteps({ step1: true, step2: false, step3: false, step4: false });

    try {
      const response = await apiClient.searchCompany(data);

      if (response.success) {
        // ステップ1完了
        setLoadingSteps(prev => ({ ...prev, step1: false, step2: true }));
        await sleep(1000);
        
        // ステップ2完了
        setLoadingSteps(prev => ({ ...prev, step2: false, step3: true }));
        await sleep(1000);
        
        // ステップ3完了
        setLoadingSteps(prev => ({ ...prev, step3: false, step4: true }));
        await sleep(1000);
        
        // ステップ4完了
        setLoadingSteps(prev => ({ ...prev, step4: false }));

        setResults({
          summary: response.summary,
          hypothesis: response.hypothesis,
          hearing_items: response.hearing_items,
          matching_result: response.matching_result
        });
        
        return Promise.resolve();
      } else {
        throw new Error(response.error_message || '不明なエラーが発生しました');
      }
    } catch (error) {
      console.error('検索エラー:', error);
      throw error;
    } finally {
      setLoading(false);
      setLoadingSteps({ step1: false, step2: false, step3: false, step4: false });
    }
  };

  return {
    loading,
    results,
    loadingSteps,
    searchCompany
  };
};