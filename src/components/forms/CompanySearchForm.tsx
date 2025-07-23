import { useState } from 'react';
import { CompanyFormData, LoadingSteps } from '@/types';

interface CompanySearchFormProps {
  onSubmit: (data: CompanyFormData) => Promise<void>;
  loading: boolean;
  loadingSteps: LoadingSteps;
}

export const CompanySearchForm: React.FC<CompanySearchFormProps> = ({
  onSubmit,
  loading,
  loadingSteps
}) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: '',
    departmentName: '',
    positionName: '',
    jobScope: ''
  });

  const handleSubmit = async () => {
    if (!formData.companyName) return;
    
    try {
      await onSubmit(formData);
      alert('✅ 処理が完了しました！');
    } catch (error) {
      alert(`❌ エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  };

  const getLoadingStepClass = (isActive: boolean): string => 
    isActive ? 'text-blue-600' : 'text-gray-400';

  const getLoadingDotClass = (isActive: boolean): string => 
    `w-4 h-4 rounded-full ${isActive ? 'bg-blue-600 animate-pulse' : 'bg-gray-300'}`;

  return (
    <div className="w-80 bg-white shadow-lg p-6 min-h-screen flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-6">企業情報入力</h2>
      
      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            企業名 *
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="企業名を入力してください"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            顧客担当者の部署名
          </label>
          <input
            type="text"
            value={formData.departmentName}
            onChange={(e) => setFormData(prev => ({ ...prev, departmentName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="部署名を入力してください"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            顧客担当者の役職
          </label>
          <input
            type="text"
            value={formData.positionName}
            onChange={(e) => setFormData(prev => ({ ...prev, positionName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例：部長、課長、担当者など"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            顧客担当者の業務範囲
          </label>
          <input
            type="text"
            value={formData.jobScope}
            onChange={(e) => setFormData(prev => ({ ...prev, jobScope: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="分かる範囲で入力してください"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !formData.companyName}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '処理中...' : '有価証券報告書を検索'}
        </button>

        {/* ローディング表示 */}
        {loading && (
          <div className="mt-6 space-y-2">
            <div className={`flex items-center space-x-2 ${getLoadingStepClass(loadingSteps.step1)}`}>
              <div className={getLoadingDotClass(loadingSteps.step1)}></div>
              <span className="text-sm">🔍 有価証券報告書を要約中... (1/4)</span>
            </div>
            <div className={`flex items-center space-x-2 ${getLoadingStepClass(loadingSteps.step2)}`}>
              <div className={getLoadingDotClass(loadingSteps.step2)}></div>
              <span className="text-sm">🤔 担当者の課題仮説立て考え中... (2/4)</span>
            </div>
            <div className={`flex items-center space-x-2 ${getLoadingStepClass(loadingSteps.step3)}`}>
              <div className={getLoadingDotClass(loadingSteps.step3)}></div>
              <span className="text-sm">💡 ソリューションマッチングAI出力中... (3/4)</span>
            </div>
            <div className={`flex items-center space-x-2 ${getLoadingStepClass(loadingSteps.step4)}`}>
              <div className={getLoadingDotClass(loadingSteps.step4)}></div>
              <span className="text-sm">👂 ヒアリング項目出力中... (4/4)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};