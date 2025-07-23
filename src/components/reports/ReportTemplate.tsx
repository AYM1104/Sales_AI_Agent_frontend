import { Results, CompanyFormData, Solution } from '@/types';

interface ReportTemplateProps {
  companyData: CompanyFormData;
  results: Results;
  solutions: Solution[];
}

export const ReportTemplate: React.FC<ReportTemplateProps> = ({
  companyData,
  results,
  solutions
}) => {
  const currentDate = new Date().toLocaleString('ja-JP');

  return (
    <div id="report-content" className="bg-white p-8 max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          顧客理解AIエージェント 分析結果レポート
        </h1>
        <p className="text-sm text-gray-600">生成日時: {currentDate}</p>
      </div>

      {/* 企業情報 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
          企業情報
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium text-gray-700">企業名:</span>
              <span className="ml-2">{companyData.companyName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">部署名:</span>
              <span className="ml-2">{companyData.departmentName || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">役職:</span>
              <span className="ml-2">{companyData.positionName || 'N/A'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">業務範囲:</span>
              <span className="ml-2">{companyData.jobScope || 'N/A'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 有価証券報告書要約 */}
      {results.summary && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-green-500 pl-3">
            有価証券報告書要約
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
              {results.summary}
            </pre>
          </div>
        </section>
      )}

      {/* 仮説・担当者課題 */}
      {results.hypothesis && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-orange-500 pl-3">
            仮説・担当者課題
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
              {results.hypothesis}
            </pre>
          </div>
        </section>
      )}

      {/* ソリューションマッチング */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-purple-500 pl-3">
          ソリューション情報
        </h2>
        
        {/* ソリューション一覧 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">弊社IoTソリューション一覧</h3>
          <div className="space-y-4">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-300">
                <h4 className="font-medium text-gray-800 mb-2">{solution.name}</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>特徴:</strong> {solution.features}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>主な用途:</strong> {solution.use_case}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* マッチング結果 */}
        {results.matching_result && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">AIによるマッチング提案</h3>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                {results.matching_result}
              </pre>
            </div>
          </div>
        )}
      </section>

      {/* ヒアリング項目 */}
      {results.hearing_items && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-red-500 pl-3">
            訪問時のヒアリング項目
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
              {results.hearing_items}
            </pre>
          </div>
        </section>
      )}

      {/* フッター */}
      <div className="border-t-2 border-gray-300 pt-4 mt-8">
        <p className="text-xs text-gray-500 text-center">
          このレポートは顧客理解AIエージェントによって自動生成されました。
        </p>
      </div>
    </div>
  );
};