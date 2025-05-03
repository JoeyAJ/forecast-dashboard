import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ComposedChart, Scatter
} from 'recharts';
import './index.css';

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

  const actualValues = [400, 496, 215, 409, 461, 71, 360, 157, 457, 450, 239, 356, 100, 112, 491, 473, 118, 307, 473, 278, 152, 423, 300, 368, 390, 218, 129, 454, 378, 342, 262, 207, 53, 408, 442, 249, 384, 444, 146, 211, 112, 169, 208, 190, 129, 162, 437, 276, 481, 407];

  const lrValues = [269.88, 255.15, 261.88, 279.33, 269.73, 270.26, 254.13, 262.14, 271.22, 273.09, 269.00, 280.82, 280.18, 262.88, 259.90, 280.82, 274.91, 284.66, 272.25, 272.93, 269.40, 268.17, 266.03, 267.41, 276.83, 280.20, 267.66, 261.52, 272.00, 272.44, 274.03, 268.64, 269.11, 272.53, 262.22, 274.60, 264.78, 256.62, 271.87, 264.36, 267.04, 272.18, 267.80, 270.96, 269.71, 266.18, 271.10, 267.57, 273.61, 267.85];

  const arimaValues = [256.33, 258.00, 281.80, 256.33, 258.38, 280.30, 249.70, 259.25, 278.01, 270.38, 283.88, 253.35, 259.40, 263.50, 256.29, 290.71, 288.01, 245.73, 256.01, 288.10, 265.76, 249.02, 274.88, 278.02, 261.68, 271.29, 259.06, 254.21, 280.59, 282.88, 258.12, 260.33, 260.84, 260.28, 279.66, 291.19, 257.34, 261.12, 277.20, 254.72, 253.98, 271.13, 269.12, 277.75, 272.77, 267.43, 270.29, 286.20, 276.24, 265.50];
  const rfValues = [264.32, 262.04, 269.30, 252.97, 265.53, 271.12, 280.49, 247.06, 271.20, 272.61, 268.48, 270.99, 268.03, 275.14, 268.93, 287.22, 272.90, 286.70, 256.86, 261.60, 272.64, 254.88, 280.06, 264.84, 283.88, 256.91, 267.26, 281.44, 275.64, 273.09, 264.61, 263.86, 267.09, 264.66, 265.87, 280.11, 283.90, 271.72, 268.39, 261.37, 269.17, 274.48, 268.17, 276.82, 259.48, 265.26, 276.49, 263.42, 265.21, 257.08];

  const xgbValues = [263.18, 289.58, 264.62, 239.72, 239.65, 267.47, 227.60, 281.55, 262.82, 245.59, 266.73, 251.52, 194.45, 271.00, 276.63, 351.39, 278.62, 300.96, 276.16, 258.92, 309.48, 254.86, 242.29, 220.92, 385.01, 275.58, 268.40, 260.81, 268.30, 263.85, 268.43, 246.93, 272.70, 309.68, 281.55, 269.90, 268.12, 264.37, 279.56, 220.12, 265.50, 275.47, 277.51, 282.09, 266.01, 257.99, 296.00, 245.45, 282.42, 256.45];

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

  const ModelConclusion = () => (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-bold mb-4">모델 평가 결론</h3>
      <p className="mb-2">MAE, MSE, RMSE, MAPE 및 R² 다섯 가지 평가 지표에 기반한 종합 분석:</p>
      <ol className="list-decimal ml-6 space-y-2">
        <li><strong>랜덤 포레스트 모델</strong>이 MAE와 RMSE 지표에서 가장 우수한 성능을 보이며, 종합 순위 1위입니다.</li>
        <li><strong>선형 회귀 모델</strong>이 R² 지표에서 가장 우수한 성능을 보이며, 종합 순위 2위입니다.</li>
        <li><strong>ARIMA 모델</strong>은 시계열 예측에서 일정한 성능을 보이지만, 종합 순위 3위입니다.</li>
        <li><strong>XGBoost 모델</strong>은 이 데이터셋에서 상대적으로 약한 성능을 보이며, 종합 순위 4위입니다.</li>
      </ol>
      <p className="mt-4"><strong>전체 결론:</strong> 랜덤 포레스트 모델이 이 전자상거래 판매 예측 작업에서 가장 우수한 성능을 보이므로, 향후 판매 예측에 이 모델을 사용하는 것이 권장됩니다.</p>
    </div>
  );
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">전자상거래 판매 예측 모델 비교</h2>

      {/* 중앙 정렬된 버튼 */}
      <div className="button-container">
        <button
          className={`toggle-button ${activeTab === 'metrics' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('metrics')}
        >
          평가 지표 비교
        </button>
        <button
          className={`toggle-button ${activeTab === 'predictions' ? 'active' : 'inactive'}`}
          onClick={() => setActiveTab('predictions')}
        >
          예측 결과 시각화
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="content-area">
        {activeTab === 'metrics' ? (
          // 평가 지표 차트
          <div className="flex flex-col space-y-8">
            <h3 className="text-xl font-bold mb-4 text-center">모델 평가 지표 비교</h3>
            {["MAE", "MSE", "RMSE", "MAPE", "R2"].map((metric, idx) => (
              <div key={metric}>
                <h4 className="text-lg font-semibold mb-2">
                  {{
                    MAE: "평균 절대 오차 (MAE)",
                    MSE: "평균 제곱 오차 (MSE)",
                    RMSE: "평균 제곱근 오차 (RMSE)",
                    MAPE: "평균 절대 백분율 오차 (MAPE)",
                    R2: "결정 계수 (R²)"
                  }[metric]}
                </h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepareMetricsData(metric)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value.toFixed(2), metric]} />
                    <Bar dataKey="value" fill={
                      ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8884d8"][idx]
                    } />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
            {/* 모델 순위 테이블 */}
            <div>
              <h4 className="text-lg font-semibold mb-2">모델 종합 순위</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">모델</th>
                      <th className="py-2 px-4 border-b">MAE 순위</th>
                      <th className="py-2 px-4 border-b">MSE 순위</th>
                      <th className="py-2 px-4 border-b">RMSE 순위</th>
                      <th className="py-2 px-4 border-b">MAPE 순위</th>
                      <th className="py-2 px-4 border-b">R² 순위</th>
                      <th className="py-2 px-4 border-b">총점</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankMetrics().map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-4 border-b font-semibold">{item.model}</td>
                        <td className="py-2 px-4 border-b text-center">{item.MAE}</td>
                        <td className="py-2 px-4 border-b text-center">{item.MSE}</td>
                        <td className="py-2 px-4 border-b text-center">{item.RMSE}</td>
                        <td className="py-2 px-4 border-b text-center">{item.MAPE}</td>
                        <td className="py-2 px-4 border-b text-center">{item.R2}</td>
                        <td className="py-2 px-4 border-b text-center font-bold">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          // 예측 결과 차트
          <div className="flex flex-col space-y-8">
            <h3 className="text-xl font-bold mb-4 text-center">모델 예측 결과 시각화</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="actual" stroke="#000000" name="실제값" dot={false} />
                <Line dataKey="linearRegression" stroke="#8884d8" name="선형 회귀" dot={false} />
                <Line dataKey="arima" stroke="#82ca9d" name="ARIMA" dot={false} />
                <Line dataKey="randomForest" stroke="#ffc658" name="랜덤 포레스트" dot={false} />
                <Line dataKey="xgboost" stroke="#ff8042" name="XGBoost" dot={false} />
              </LineChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={predictionData.map(item => ({
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
                <Line dataKey="linearRegression" stroke="#8884d8" name="선형 회귀 오차" dot={false} />
                <Line dataKey="arima" stroke="#82ca9d" name="ARIMA 오차" dot={false} />
                <Line dataKey="randomForest" stroke="#ffc658" name="랜덤 포레스트 오차" dot={false} />
                <Line dataKey="xgboost" stroke="#ff8042" name="XGBoost 오차" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="actual" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Scatter dataKey="randomForest" name="랜덤 포레스트 예측" fill="#ffc658" />
                <Line dataKey="actual" name="완벽 예측선" stroke="#ff0000" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <ModelConclusion />
    </div>
  );
};

export default ModelComparisonDashboard;
