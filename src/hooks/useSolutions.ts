import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Solution } from '@/types';

export const useSolutions = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolutions = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await apiClient.getSolutions();
      if (response.success) {
        setSolutions(response.solutions);
      } else {
        setError('ソリューションの取得に失敗しました');
      }
    } catch (err) {
      console.error('ソリューション取得エラー:', err);
      setError('ソリューション取得中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  return {
    solutions,
    loading,
    error,
    refetch: fetchSolutions
  };
};