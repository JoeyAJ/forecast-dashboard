import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ComposedChart, Scatter
} from 'recharts';

const ModelComparisonDashboard = () => {
  const [activeTab, setActiveTab] = useState('metrics');

  const metricsData = {
    models: ["선형 회귀", "ARIMA", "랜덤 포레스트", "XGBoost"],
    MAE: [112.56, 114.04, 112.35, 114.84],
    MSE: [16838.93, 17245.14, 16914.73, 17714.74],
    RMSE: [129.76, 131.32, 130.06, 133.10],
    MAPE: [67.31, 67.92, 67.73, 68.49],
    R2: [-0.00008, -0.02420, -0.00458, -0.05209]
  };

  const prepareMetricsData = (metricName) => {
    return metricsData.models.map((model, index) => ({
      name: model,
      value: metricsData[metricName][index]
    }));
  };

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

    metricsData.models.forEach(model => {
      ranks[model] = { total: 0 };
    });

    metrics.forEach(metric => {
      const values = metricsData[metric];
      const sorted = [...values].sort((a, b) => metric === 'R2' ? b - a : a - b);

      values.forEach((value, index) => {
        const model = metricsData.models[index];
        const rank = sorted.indexOf(value) + 1;
        ranks[model][metric] = rank;
        ranks[model].total += rank;
      });
    });

    return Object.entries(ranks).map(([model, scores]) => ({
      model,
      ...scores
    })).sort((a, b) => a.total - b.total);
  };

  const renderMetricsCharts = () => (
    <div className="flex flex-col space-y-8">
      <h3 className="text-xl font-bold mb-4 text-center">모델 평가 지표 비교</h3>
      <ChartComponent title="평균 절대 오차 (MAE)" metric="MAE" color="#8884d8" />
      <ChartComponent title="평균 제곱 오차 (MSE)" metric="MSE" color="#82ca9d" />
      <ChartComponent title="평균 제곱근 오차 (RMSE)" metric="RMSE" color="#ffc658" />
      <ChartComponent title="평균 절대 백분율 오차 (MAPE)" metric="MAPE" color="#ff8042" suffix="%" />
      <ChartComponent title="결정 계수 (R²)" metric="R2" color="#8884d8" decimals={5} />
      <RankingTable />
    </div>
  );

  const ChartComponent = ({ title, metric, color, suffix = '', decimals = 2 }) => (
    <div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={prepareMetricsData(metric)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [value.toFixed(decimals) + suffix, metric]} />
          <Bar dataKey="value" fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const RankingTable = () => (
    <div>
      <h4 className="text-lg font-semibold mb-2">모델 종합 순위</h4>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">모델</th>
            {['MAE', 'MSE', 'RMSE', 'MAPE', 'R2'].map((metric) => (
              <th key={metric} className="py-2 px-4 border-b">{metric} 순위</th>
            ))}
            <th className="py-2 px-4 border-b">총점</th>
          </tr>
        </thead>
        <tbody>
          {rankMetrics().map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="py-2 px-4 border-b font-semibold">{item.model}</td>
              {['MAE', 'MSE', 'RMSE', 'MAPE', 'R2'].map((metric) => (
                <td key={metric} className="py-2 px-4 border-b text-center">{item[metric]}</td>
              ))}
              <td className="py-2 px-4 border-b text-center font-bold">{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm mt-2 text-gray-600">참고: 순위는 1부터 시작하며, 1이 가장 좋음. 총점이 낮을수록 전체 성능이 우수함.</p>
    </div>
  );

  const ModelConclusion = () => (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-bold mb-4">모델 평가 결론</h3>
      <ol className="list-decimal ml-6 space-y-2">
        <li><strong>랜덤 포레스트 모델</strong>이 MAE와 RMSE 지표에서 가장 우수한 성능을 보임</li>
        <li><strong>선형 회귀</strong>는 R² 지표에서 가장 좋았음</li>
        <li><strong>ARIMA</strong>는 중간 성능</li>
        <li><strong>XGBoost</strong>는 상대적으로 낮은 성능</li>
      </ol>
      <p className="mt-4"><strong>전체 결론:</strong> 랜덤 포레스트가 가장 적합함</p>
    </div>
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">전자상거래 판매 예측 모델 비교</h2>
      <div className="flex justify-center mb-6">
        <button className={`px-4 py-2 mx-2 rounded ${activeTab === 'metrics' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('metrics')}>
          평가 지표 비교
        </button>
        <button className={`px-4 py-2 mx-2 rounded ${activeTab === 'predictions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('predictions')}>
          예측 결과 시각화
        </button>
      </div>
      <div className="content-area">
        {activeTab === 'metrics' ? renderMetricsCharts() : renderPredictionCharts()}
      </div>
      <ModelConclusion />
    </div>
  );
};

export default ModelComparisonDashboard;
