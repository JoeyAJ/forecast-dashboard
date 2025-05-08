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
      {/* 删除这里的标题 */}
      
      {/* Navigation buttons */}
      <div className="button-container">
        <button 
          className={`toggle-button ${activeTab === 'comparison' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('comparison')}
        >
          평가 지표 비교
        </button>
        <button 
          className={`toggle-button ${activeTab === 'visualization' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('visualization')}
        >
          예측 결과 시각화
        </button>
        <button 
          className={`toggle-button ${activeTab === 'regression' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('regression')}
        >
          회귀 분석 시각화
        </button>
      </div>
      
      {/* Content area */}
      <div className="chart-container">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
