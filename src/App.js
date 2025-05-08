import './index.css';
import React, { useState } from 'react';
import ModelComparisonDashboard from './ModelComparisonDashboard';
import RegressionAnalysisDashboard from './RegressionAnalysisDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('comparison'); // 默认显示"평가 지표 비교"

  return (
    <div>
      <h1 className="title">전자상거래 판매 예측 모델 비교</h1>
      
      {/* 导航栏/标签切换 */}
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'comparison' ? 'active' : ''}`}
          onClick={() => setActiveTab('comparison')}
        >
          평가 지표 비교
        </button>
        <button 
          className={`tab-button ${activeTab === 'visualization' ? 'active' : ''}`}
          onClick={() => setActiveTab('visualization')}
        >
          예측 결과 시각화
        </button>
        <button 
          className={`tab-button ${activeTab === 'regression' ? 'active' : ''}`}
          onClick={() => setActiveTab('regression')}
        >
          회귀 분석 시각화
        </button>
      </div>
      
      {/* 内容区域 */}
      <div className="content">
        {activeTab === 'comparison' && <ModelComparisonDashboard />}
        {activeTab === 'visualization' && <div>예측 결과 시각화 내용</div>} {/* 如果您已有此组件，替换此行 */}
        {activeTab === 'regression' && <RegressionAnalysisDashboard />}
      </div>
    </div>
  );
}

export default App;
