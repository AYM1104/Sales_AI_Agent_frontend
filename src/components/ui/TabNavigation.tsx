import { Tab } from '@/types';

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: number;
  onTabChange: (tabId: number) => void;
  disabled?: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  disabled = false
}) => {
  const getTabButtonClass = (tabId: number): string => 
    `py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
      activeTab === tabId
        ? 'border-blue-500 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`;

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={getTabButtonClass(tab.id)}
            disabled={disabled}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};