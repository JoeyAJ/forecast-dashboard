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
        return <ModelComparisonDashboard />;
      case 'visualization':
        return <div>예측 결과 시각화 내용</div>; // 替换为实际的可视化组件
      case 'regression':
        return <RegressionAnalysisDashboard />;
      default:
        return <ModelComparisonDashboard />;
    }
  };

  return (
    <div>
      <h2>전자상거래 판매 예측 모델 비교</h2>
      
      {/* 只保留一组导航按钮 */}
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
      
      {/* 内容区域 */}
      <div className="chart-container">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
