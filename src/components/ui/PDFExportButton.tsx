import { useState } from 'react';
import { Results, CompanyFormData } from '@/types';
import { generateAnalysisReport, generateHTMLReport } from '@/lib/pdfUtils';

interface PDFExportButtonProps {
  companyData: CompanyFormData;
  results: Results;
  disabled?: boolean;
  variant?: 'basic' | 'html';
  targetElementId?: string;
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  companyData,
  results,
  disabled = false,
  variant = 'basic',
  targetElementId = 'report-content'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    if (disabled || isGenerating) return;

    // データが空でないかチェック
    const hasData = results.summary || results.hypothesis || results.hearing_items || results.matching_result;
    if (!hasData) {
      alert('エクスポートするデータがありません。まず企業検索を実行してください。');
      return;
    }

    setIsGenerating(true);

    try {
      if (variant === 'html') {
        await generateHTMLReport(targetElementId);
      } else {
        generateAnalysisReport(companyData, results);
      }
      
      alert('✅ PDFが正常に生成されました！');
    } catch (error) {
      console.error('PDF生成エラー:', error);
      alert('❌ PDF生成に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isGenerating}
      className={`
        inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm
        ${disabled || isGenerating
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        }
        transition-colors duration-200
      `}
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          PDF生成中...
        </>
      ) : (
        <>
          <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          PDF出力
        </>
      )}
    </button>
  );
};