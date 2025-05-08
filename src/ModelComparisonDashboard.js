import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, ComposedChart, Scatter
} from 'recharts';

const ModelComparisonDashboard = () => {
  const [activeTab, setActiveTab] = useState('comparison');

  const metricsData = {
    models: ["선형 회귀", "ARIMA", "랜덤 포레스트", "XGBoost"],
    MAE: [112.56, 114.04, 112.35, 114.84],
    MSE: [16838.93, 17245.14, 16914.73, 17714.74],
    RMSE: [129.76, 131.32, 130.06, 133.10],
    MAPE: [67.31, 67.92, 67.73, 68.49],
    R2: [-0.00008, -0.02420, -0.00458, -0.05209]
  };

  const actualValues = [400, 496, 215, 409, 461, 71, 360, 157, 457, 450, 239, 356, 100, 112, 491, 473, 118, 307, 473, 278, 152, 423, 300, 368, 390, 218, 129, 454, 378, 342, 262, 207, 53, 408, 442, 249, 384, 444, 146, 211, 112, 169, 208, 190, 129, 162, 437, 276, 481, 407];

  const lrValues = [...];  // 線性回歸
  const arimaValues = [...];  // ARIMA
  const rfValues = [...];  // Random Forest
  const xgbValues = [...];  // XGBoost

  const predictionData = Array(50).fill().map((_, i) => ({
    index: i,
    actual: actualValues[i],
    linearRegression: lrValues[i],
    arima: arimaValues[i],
    randomForest: rfValues[i],
    xgboost: xgbValues[i]
  }));

  const rankMetrics = () => {
    const metrics = ['MAE', 'MSE', 'RMSE', 'MAPE', 'R2'];
    const ranks = {};
    metricsData.models.forEach(model => ranks[model] = { total: 0 });
    metrics.forEach(metric => {
      const sorted = [...metricsData[metric]].sort((a, b) => metric === 'R2' ? b - a : a - b);
      metricsData[metric].forEach((value, i) => {
        const model = metricsData.models[i];
        const rank = sorted.indexOf(value) + 1;
        ranks[model][metric] = rank;
        ranks[model].total += rank;
      });
    });
    return Object.entries(ranks).map(([model, scores]) => ({ model, ...scores })).sort((a, b) => a.total - b.total);
  };

  const prepareMetricsData = (metricName) => {
    return metricsData.models.map((model, index) => ({
      name: model,
      value: metricsData[metricName][index]
    }));
  };

  const renderButtonTabs = () => (
    <div className="flex flex-wrap justify-center space-x-2 mb-6">
      <button onClick={() => setActiveTab('comparison')} className={`px-4 py-2 ${activeTab === 'comparison' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>예측 결과 비교</button>
      <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 ${activeTab === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>모델 비교 종합</button>
      <button onClick={() => setActiveTab('linearRegression')} className={`px-4 py-2 ${activeTab === 'linearRegression' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>선형 회귀</button>
      <button onClick={() => setActiveTab('arima')} className={`px-4 py-2 ${activeTab === 'arima' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>ARIMA</button>
      <button onClick={() => setActiveTab('randomForest')} className={`px-4 py-2 ${activeTab === 'randomForest' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>랜덤 포레스트</button>
      <button onClick={() => setActiveTab('xgboost')} className={`px-4 py-2 ${activeTab === 'xgboost' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>XGBoost</button>
    </div>
  );

  const renderComparison = () => {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4 text-center">모델 예측 결과 시각화</h3>
        {/* 第一張圖：各模型預測結果比較 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">각 모델 예측 결과 비교 (첫 50개 샘플)</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#000" name="실제값" />
              <Line type="monotone" dataKey="linearRegression" stroke="#8884d8" name="선형 회귀" />
              <Line type="monotone" dataKey="arima" stroke="#82ca9d" name="ARIMA" />
              <Line type="monotone" dataKey="randomForest" stroke="#ffc658" name="랜덤 포레스트" />
              <Line type="monotone" dataKey="xgboost" stroke="#ff8042" name="XGBoost" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 第二張圖：各模型誤差 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">각 모델 예측 오차</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={predictionData.map(item => ({
              index: item.index,
              linearRegression: item.actual - item.linearRegression,
              arima: item.actual - item.arima,
              randomForest: item.actual - item.randomForest,
              xgboost: item.actual - item.xgboost
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="linearRegression" stroke="#8884d8" name="선형 회귀 오차" />
              <Line type="monotone" dataKey="arima" stroke="#82ca9d" name="ARIMA 오차" />
              <Line type="monotone" dataKey="randomForest" stroke="#ffc658" name="랜덤 포레스트 오차" />
              <Line type="monotone" dataKey="xgboost" stroke="#ff8042" name="XGBoost 오차" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    const ranks = rankMetrics();

    return (
      <div>
        <h3 className="text-xl font-bold mb-4 text-center">모델 비교 종합 시각화</h3>

        {['MAE', 'MSE', 'RMSE', 'MAPE', 'R2'].map((metric, idx) => (
          <div key={metric} className="mb-6">
            <h4 className="text-lg font-semibold mb-2">{metric} 차트</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prepareMetricsData(metric)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042'][idx % 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}

        {/* 表格 */}
        <div className="overflow-x-auto mt-8">
          <h4 className="text-lg font-semibold mb-2">모델 종합 순위</h4>
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">모델</th>
                <th className="px-4 py-2 border">MAE 순위</th>
                <th className="px-4 py-2 border">MSE 순위</th>
                <th className="px-4 py-2 border">RMSE 순위</th>
                <th className="px-4 py-2 border">MAPE 순위</th>
                <th className="px-4 py-2 border">R² 순위</th>
                <th className="px-4 py-2 border font-bold">총점</th>
              </tr>
            </thead>
            <tbody>
              {ranks.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="px-4 py-2 border">{item.model}</td>
                  <td className="px-4 py-2 border">{item.MAE}</td>
                  <td className="px-4 py-2 border">{item.MSE}</td>
                  <td className="px-4 py-2 border">{item.RMSE}</td>
                  <td className="px-4 py-2 border">{item.MAPE}</td>
                  <td className="px-4 py-2 border">{item.R2}</td>
                  <td className="px-4 py-2 border font-bold">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-gray-600 mt-2">※ 점수가 낮을수록 전체 성능이 우수함</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">전자상거래 판매 예측 모델 비교</h2>
      {renderButtonTabs()}
      {activeTab === 'comparison' && renderComparison()}
      {activeTab === 'overview' && renderOverview()}
      {['linearRegression', 'arima', 'randomForest', 'xgboost'].includes(activeTab) && (
        renderModelTab(activeTab)
      )}
    </div>
  );
};

export default ModelComparisonDashboard;
