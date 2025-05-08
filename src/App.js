import './index.css';
import React, { useState } from 'react';
import ModelComparisonDashboard from './ModelComparisonDashboard';
import RegressionAnalysisDashboard from './RegressionAnalysisDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('comparison'); // 默认显示 ModelComparisonDashboard

  // 渲染相应的内容组件
  const renderContent = () => {
    switch(activeTab) {
      case 'comparison':
        return <ModelComparisonDashboard activeTab="metrics" />;
      case 'visualization':
        return <ModelComparisonDashboard activeTab="predictions" />; 
      case 'regression':
        return <RegressionAnalysisDashboard />;
      default:
        return <ModelComparisonDashboard activeTab="metrics" />;
    }
  };

  return (
    <div>
      {/* 删除标题和导航按钮 */}
      
      {/* Content area */}
      <div className="chart-container">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
