import { Solution } from '@/types';

interface SolutionTabProps {
  solutions: Solution[];
  matchingResult: string;
}

export const SolutionTab: React.FC<SolutionTabProps> = ({
  solutions,
  matchingResult
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">弊社IoTソリューション一覧</h2>
      
      <div className="space-y-6 mb-8">
        {solutions.map((solution, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">{solution.name}</h3>
            <p className="text-gray-600 mb-1"><strong>特徴:</strong> {solution.features}</p>
            <p className="text-gray-600"><strong>主な用途:</strong> {solution.use_case}</p>
          </div>
        ))}
      </div>
      
      {matchingResult && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AIによるマッチング提案</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-gray-700 font-sans">{matchingResult}</pre>
          </div>
        </div>
      )}
      
      {!matchingResult && (
        <p className="text-gray-500">仮説が出力されるとマッチング提案が表示されます。</p>
      )}
    </div>
  );
};