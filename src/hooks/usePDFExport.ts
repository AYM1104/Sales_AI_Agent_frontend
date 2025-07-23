import { useState } from 'react';
import { CompanyFormData, Results, Solution } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

interface PDFExportOptions {
  type: 'client' | 'server';
  format: 'basic' | 'detailed';
}

export const usePDFExport = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const exportPDF = async (
    companyData: CompanyFormData,
    results: Results,
    solutions: Solution[],
    options: PDFExportOptions = { type: 'client', format: 'basic' }
  ): Promise<void> => {
    setIsGenerating(true);

    try {
      if (options.type === 'server') {
        await exportServerPDF(companyData, results, solutions);
      } else {
        // クライアント側PDF生成（既存の機能）
        const { generateAnalysisReport } = await import('@/lib/pdfUtils');
        generateAnalysisReport(companyData, results);
      }
    } catch (error) {
      console.error('PDF export error:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const exportServerPDF = async (
    companyData: CompanyFormData,
    results: Results,
    solutions: Solution[]
  ): Promise<void> => {
    const requestBody = {
      company_data: {
        company_name: companyData.companyName,
        department_name: companyData.departmentName,
        position_name: companyData.positionName,
        job_scope: companyData.jobScope
      },
      results: {
        summary: results.summary,
        hypothesis: results.hypothesis,
        hearing_items: results.hearing_items,
        matching_result: results.matching_result
      },
      solutions: solutions.map(s => ({
        name: s.name,
        features: s.features,
        use_case: s.use_case
      }))
    };

    const response = await fetch(`${API_BASE_URL}/pdf/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`PDF生成に失敗しました: ${response.status}`);
    }

    // ファイルをダウンロード
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // ファイル名を取得（Content-Dispositionヘッダーから）
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = 'analysis_report.pdf';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=(.+)/);
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/"/g, '');
      }
    }
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const testServerPDF = async (): Promise<void> => {
    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/pdf/test`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`テストPDF生成に失敗しました: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'test_report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Test PDF error:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    exportPDF,
    testServerPDF
  };
};