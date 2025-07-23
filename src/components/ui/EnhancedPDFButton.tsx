import { useState } from 'react';
import { Results, CompanyFormData, Solution } from '@/types';
import { usePDFExport } from '@/hooks/usePDFExport';
import { generateAnalysisReport, generateHTMLReport } from '@/lib/pdfUtils';

interface EnhancedPDFButtonProps {
  companyData: CompanyFormData;
  results: Results;
  solutions: Solution[];
  disabled?: boolean;
}

export const EnhancedPDFButton: React.FC<EnhancedPDFButtonProps> = ({
  companyData,
  results,
  solutions,
  disabled = false
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isGenerating, exportPDF, testServerPDF } = usePDFExport();

  const hasData = results.summary || results.hypothesis || results.hearing_items || results.matching_result;

  const handleExport = async (type: 'client-basic' | 'client-html' | 'server') => {
    if (disabled || isGenerating || !hasData) return;

    setIsDropdownOpen(false);

    try {
      switch (type) {
        case 'client-basic':
          generateAnalysisReport(companyData, results);
          break;
        case 'client-html':
          await generateHTMLReport('report-content');
          break;
        case 'server':
          await exportPDF(companyData, results, solutions, { type: 'server', format: 'detailed' });
          break;
      }
      alert('✅ PDFが正常に生成されました！');
    } catch (error) {
      console.error('PDF生成エラー:', error);
      alert('❌ PDF生成に失敗しました。');
    }
  };

  const handleTestPDF = async () => {
    try {
      await testServerPDF();
      alert('✅ テストPDFが生成されました！');
    } catch (error) {
      console.error('テストPDF生成エラー:', error);
      alert('❌ テストPDF生成に失敗しました。');
    }
  };

  const buttonDisabled = disabled || isGenerating || !hasData;

  return (
    <div className="relative inline-block text-left">
      {/* メインボタン */}
      <div className="flex">
        <button
          onClick={() => handleExport('client-basic')}
          disabled={buttonDisabled}
          className={`
            inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-l-md shadow-sm
            ${buttonDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }
            transition-colors duration-200
          `}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
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

        {/* ドロップダウンボタン */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={buttonDisabled}
          className={`
            inline-flex items-center px-2 py-2 border border-l-0 border-transparent text-sm font-medium rounded-r-md shadow-sm
            ${buttonDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }
            transition-colors duration-200
          `}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* ドロップダウンメニュー */}
      {isDropdownOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            <button
              onClick={() => handleExport('client-basic')}
              className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              基本PDF (クライアント)
            </button>
            
            <button
              onClick={() => handleExport('client-html')}
              className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              高品質PDF (HTML変換)
            </button>
            
            <button
              onClick={() => handleExport('server')}
              className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              詳細PDF (サーバー生成)
            </button>
            
            <hr className="my-1" />
            
            <button
              onClick={handleTestPDF}
              className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              テストPDF生成
            </button>
          </div>
        </div>
      )}
      
      {/* オーバーレイ（ドロップダウンを閉じるため） */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};