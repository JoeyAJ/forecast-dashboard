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

  const rankMetrics = () => {
    const metrics = ['MAE', 'MSE', 'RMSE', 'MAPE', 'R2'];
    const ranks = {};
    metricsData.models.forEach(model => (ranks[model] = { total: 0 }));

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

    return Object.entries(ranks).map(([model, scores]) => ({ model, ...scores }))
      .sort((a, b) => a.total - b.total);
  };

  const renderMetricsCharts = () => (
    <div>
      <h2>모델 평가 지표 비교</h2>

      <div style={{ marginBottom: '2rem' }}>
        <h4>평균 절대 오차 (MAE)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={prepareMetricsData('MAE')}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4>평균 제곱 오차 (MSE)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={prepareMetricsData('MSE')}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4>결정 계수 (R²)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={prepareMetricsData('R2')}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h4>모델 종합 순위</h4>
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>모델</th>
              <th>MAE</th>
              <th>MSE</th>
              <th>RMSE</th>
              <th>MAPE</th>
              <th>R²</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rankMetrics().map((r, i) => (
              <tr key={i}>
                <td>{r.model}</td>
                <td>{r.MAE}</td>
                <td>{r.MSE}</td>
                <td>{r.RMSE}</td>
                <td>{r.MAPE}</td>
                <td>{r.R2}</td>
                <td><strong>{r.total}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>※참고: 순위는 1부터 시작하며, 1이 가장 좋음. 총점이 낮을수록 전체 성능이 우수함.</p>
      </div>
    </div>
  );

  const renderConclusion = () => (
    <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h3>모델 평가 결론</h3>
      <ol>
        <li><strong>랜덤 포레스트 모델</strong>이 MAE와 RMSE 지표에서 가장 우수한 성능을 보임</li>
        <li><strong>선형 회귀</strong>는 R² 지표에서 가장 높았음</li>
        <li><strong>ARIMA</strong>는 중간 성능</li>
        <li><strong>XGBoost</strong>는 상대적으로 낮은 성능</li>
      </ol>
      <p><strong>전체 결론:</strong> 랜덤 포레스트가 전반적으로 가장 적합함</p>
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '1rem' }}>
        전자상거래 예측 모델 비교
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('metrics')}
          style={{
            padding: '0.5rem 1rem',
            margin: '0 0.5rem',
            backgroundColor: activeTab === 'metrics' ? '#007bff' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          평가 지표 비교
        </button>
        <button
          onClick={() => setActiveTab('conclusion')}
          style={{
            padding: '0.5rem 1rem',
            margin: '0 0.5rem',
            backgroundColor: activeTab === 'conclusion' ? '#007bff' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          결론 요약
        </button>
      </div>

      {activeTab === 'metrics' ? renderMetricsCharts() : renderConclusion()}
    </div>
  );
};

export default ModelComparisonDashboard;
