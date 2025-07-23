'use client';

import { useState } from 'react';
import { CompanySearchForm } from '@/components/forms/CompanySearchForm';
import { TabNavigation } from '@/components/ui/TabNavigation';
import { SolutionTab } from '@/components/tabs/SolutionTab';
import { EnhancedPDFButton } from '@/components/ui/EnhancedPDFButton';
import { ReportTemplate } from '@/components/reports/ReportTemplate';
import { useCompanySearch } from '@/hooks/useCompanySearch';
import { useSolutions } from '@/hooks/useSolutions';
import { CompanyFormData, Tab } from '@/types';

const tabs: Tab[] = [
  { id: 0, label: '有価証券報告書要約' },
  { id: 1, label: '仮説立て（担当者課題）' },
  { id: 2, label: 'ソリューションマッチング' },
  { id: 3, label: 'ヒアリング項目提案' },
  { id: 4, label: 'レポート出力' }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [companyFormData, setCompanyFormData] = useState<CompanyFormData>({
    companyName: '',
    departmentName: '',
    positionName: '',
    jobScope: ''
  });
  
  const { loading, results, loadingSteps, searchCompany } = useCompanySearch();
  const { solutions } = useSolutions();

  const handleSearch = async (formData: CompanyFormData): Promise<void> => {
    setCompanyFormData(formData);
    await searchCompany({
      company_name: formData.companyName,
      department_name: formData.departmentName,
      position_name: formData.positionName,
      job_scope: formData.jobScope
    });
  };

  const hasResults = results.summary || results.hypothesis || results.hearing_items || results.matching_result;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* サイドバー */}
        <CompanySearchForm
          onSubmit={handleSearch}
          loading={loading}
          loadingSteps={loadingSteps}
        />

        {/* メインコンテンツ */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">顧客理解AIエージェント</h1>
            
            {/* PDF出力ボタン */}
            <EnhancedPDFButton
              companyData={companyFormData}
              results={results}
              solutions={solutions}
              disabled={!hasResults || loading}
            />
          </div>

          {/* タブナビゲーション */}
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            disabled={loading}
          />

          {/* タブコンテンツ */}
          <div className="bg-white rounded-lg shadow p-6 min-h-96">
            {activeTab === 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">有価証券報告書要約</h2>
                {results.summary ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans">{results.summary}</pre>
                  </div>
                ) : (
                  <p className="text-gray-500">企業名を入力して検索ボタンを押してください。</p>
                )}
              </div>
            )}

            {activeTab === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">AI仮説・担当者課題提案</h2>
                {results.hypothesis ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans">{results.hypothesis}</pre>
                  </div>
                ) : (
                  <p className="text-gray-500">部署名・役職・業務範囲を入力して検索してください。</p>
                )}
              </div>
            )}

            {activeTab === 2 && (
              <SolutionTab
                solutions={solutions}
                matchingResult={results.matching_result}
              />
            )}

            {activeTab === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">訪問時のヒアリング項目（AI提案）</h2>
                {results.hearing_items ? (
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-700 font-sans">{results.hearing_items}</pre>
                  </div>
                ) : (
                  <p className="text-gray-500">部署名と役職を入力して検索してください。</p>
                )}
              </div>
            )}

            {activeTab === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">レポート出力プレビュー</h2>
                {hasResults ? (
                  <ReportTemplate
                    companyData={companyFormData}
                    results={results}
                    solutions={solutions}
                  />
                ) : (
                  <p className="text-gray-500">分析結果がありません。まず企業検索を実行してください。</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}