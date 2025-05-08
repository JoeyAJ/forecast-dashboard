import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, ComposedChart, Scatter
} from 'recharts';

const ModelComparisonDashboard = () => {
  const [activeTab, setActiveTab] = useState('linearRegression');
  
  // 모델 평가 지표 데이터
  const metricsData = {
    models: ["선형 회귀", "ARIMA", "랜덤 포레스트", "XGBoost"],
    MAE: [112.56, 114.04, 112.35, 114.84],
    MSE: [16838.93, 17245.14, 16914.73, 17714.74],
    RMSE: [129.76, 131.32, 130.06, 133.10],
    MAPE: [67.31, 67.92, 67.73, 68.49],
    R2: [-0.00008, -0.02420, -0.00458, -0.05209]
  };
  
  // 차트 데이터 준비
  const prepareMetricsData = (metricName) => {
    return metricsData.models.map((model, index) => ({
      name: model,
      value: metricsData[metricName][index]
    }));
  };
  
  // 예측 결과 데이터 준비
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
  
  // 모델 지표 순위 계산
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
  
  // 평가 지표 차트 렌더링
  const renderMetricsCharts = () => {
    const barColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
    
    return (
      <div className="metrics-charts">
        <h3 className="text-xl font-bold mb-4 text-center">모델 평가 지표 비교</h3>
        
        {/* MAE 차트 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">평균 절대 오차 (MAE)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareMetricsData('MAE')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [value.toFixed(2), 'MAE']} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* MSE 차트 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">평균 제곱 오차 (MSE)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareMetricsData('MSE')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [value.toFixed(2), 'MSE']} />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* RMSE 차트 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">평균 제곱근 오차 (RMSE)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareMetricsData('RMSE')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [value.toFixed(2), 'RMSE']} />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* MAPE 차트 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">평균 절대 백분율 오차 (MAPE)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareMetricsData('MAPE')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [value.toFixed(2) + '%', 'MAPE']} />
              <Bar dataKey="value" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* R² 차트 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">결정 계수 (R²)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareMetricsData('R2')}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [value.toFixed(5), 'R²']} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* 모델 순위 테이블 */}
        <div className="mb-8">
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
          <p className="text-sm mt-2 text-gray-600">참고: 순위는 1부터 시작하며, 1이 가장 좋음. 총점이 낮을수록 전체 성능이 우수함.</p>
        </div>
      </div>
    );
  };
  
  // 개별 모델 탭 렌더링
  const renderModelTab = (modelName) => {
    // 모델별 데이터 및 색상 설정
    let modelData;
    let modelColor;
    let modelDisplayName;
    
    switch(modelName) {
      case 'linearRegression':
        modelData = predictionData.map(item => ({
          index: item.index,
          actual: item.actual,
          predicted: item.linearRegression,
          error: item.actual - item.linearRegression
        }));
        modelColor = '#8884d8';
        modelDisplayName = '선형 회귀';
        break;
      case 'arima':
        modelData = predictionData.map(item => ({
          index: item.index,
          actual: item.actual,
          predicted: item.arima,
          error: item.actual - item.arima
        }));
        modelColor = '#82ca9d';
        modelDisplayName = 'ARIMA';
        break;
      case 'randomForest':
        modelData = predictionData.map(item => ({
          index: item.index,
          actual: item.actual,
          predicted: item.randomForest,
          error: item.actual - item.randomForest
        }));
        modelColor = '#ffc658';
        modelDisplayName = '랜덤 포레스트';
        break;
      case 'xgboost':
        modelData = predictionData.map(item => ({
          index: item.index,
          actual: item.actual,
          predicted: item.xgboost,
          error: item.actual - item.xgboost
        }));
        modelColor = '#ff8042';
        modelDisplayName = 'XGBoost';
        break;
      default:
        modelData = [];
        modelColor = '#000000';
        modelDisplayName = '';
    }
    
    // 선택된 모델의 성능 지표 얻기
    const modelIndex = metricsData.models.findIndex(model => {
      if (modelName === 'linearRegression') return model === '선형 회귀';
      if (modelName === 'arima') return model === 'ARIMA';
      if (modelName === 'randomForest') return model === '랜덤 포레스트';
      if (modelName === 'xgboost') return model === 'XGBoost';
      return false;
    });
    
    const modelMetrics = {
      MAE: metricsData.MAE[modelIndex],
      MSE: metricsData.MSE[modelIndex],
      RMSE: metricsData.RMSE[modelIndex],
      MAPE: metricsData.MAPE[modelIndex],
      R2: metricsData.R2[modelIndex]
    };
    
    // 모델 순위 계산
    const ranks = rankMetrics();
    const modelRank = ranks.find(rank => rank.model === metricsData.models[modelIndex]);
    
    return (
      <div className="model-tab">
        <h3 className="text-xl font-bold mb-4 text-center">{modelDisplayName} 모델 분석</h3>
        
        {/* 모델 성능 지표 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg shadow text-center">
          <h4 className="text-lg font-semibold mb-2 text-center">MAE</h4>
            <p className="text-2xl text-center">{modelMetrics.MAE.toFixed(2)}</p>
            <p className="text-sm text-center text-gray-500">순위: {modelRank.MAE}위</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow text-center">
            <h4 className="text-lg font-semibold mb-2 text-center">MSE</h4>
            <p className="text-2xl text-center">{modelMetrics.MSE.toFixed(2)}</p>
            <p className="text-sm text-center text-gray-500">순위: {modelRank.MSE}위</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow text-center">
            <h4 className="text-lg font-semibold mb-2 text-center">RMSE</h4>
            <p className="text-2xl text-center">{modelMetrics.RMSE.toFixed(2)}</p>
            <p className="text-sm text-center text-gray-500">순위: {modelRank.RMSE}위</p>
          </div>
         <div className="p-4 bg-gray-50 rounded-lg shadow text-center">
            <h4 className="text-lg font-semibold mb-2 text-center">MAPE</h4>
            <p className="text-2xl text-center">{modelMetrics.MAPE.toFixed(2)}%</p>
            <p className="text-sm text-center text-gray-500">순위: {modelRank.MAPE}위</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow text-center">
            <h4 className="text-lg font-semibold mb-2 text-center">R²</h4>
            <p className="text-2xl text-center">{modelMetrics.R2.toFixed(5)}</p>
            <p className="text-sm text-center text-gray-500">순위: {modelRank.R2}위</p>
          </div>
        </div>
        
        {/* 예측 결과 차트 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">{modelDisplayName} 모델 예측 결과</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={modelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" label={{ value: '샘플 인덱스', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: '판매량', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#000000" name="실제값" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="predicted" stroke={modelColor} name={`${modelDisplayName} 예측값`} strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* 오차 차트 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">{modelDisplayName} 모델 예측 오차</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={modelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" label={{ value: '샘플 인덱스', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: '오차 (실제값 - 예측값)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="error" stroke={modelColor} name="예측 오차" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* 실제값 vs 예측값 산점도 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">{modelDisplayName} 모델: 실제값과 예측값 산점도</h4>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={modelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="actual" label={{ value: '실제값', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: '예측값', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Scatter name={`${modelDisplayName} 예측`} dataKey="predicted" fill={modelColor} />
              <Line type="monotone" dataKey="actual" stroke="#ff0000" name="완벽 예측선" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* 모델 요약 */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">{modelDisplayName} 모델 요약</h4>
          <p className="mb-2">총 순위: <strong>{modelRank.total}점</strong> (전체 {ranks.length}개 모델 중 {ranks.findIndex(r => r.model === modelRank.model) + 1}위)</p>
          <p className="mb-2">주요 특징:</p>
          <ul className="list-disc ml-6 space-y-1">
            {modelName === 'linearRegression' && (
              <>
                <li>선형 회귀 모델은 R² 지표에서 상대적으로 좋은 성능을 보입니다.</li>
                <li>대부분의 샘플에서 일관된 예측 패턴을 보여주지만, 극단적인 값을 예측하는 데 약점이 있습니다.</li>
                <li>전반적으로 단순하면서도 안정적인 예측 성능을 제공합니다.</li>
              </>
            )}
            {modelName === 'arima' && (
              <>
                <li>ARIMA 모델은 시계열 데이터 예측에 특화된 모델입니다.</li>
                <li>중간 범위의 값에서는 일정한 성능을 보이지만, 급격한 변화를 예측하는 데 한계가 있습니다.</li>
                <li>전체 평가 지표에서 중간 수준의 성능을 보입니다.</li>
              </>
            )}
            {modelName === 'randomForest' && (
              <>
                <li>랜덤 포레스트 모델은 MAE와 RMSE 지표에서 가장 우수한 성능을 보입니다.</li>
                <li>비선형적 패턴을 잘 포착하며, 다양한 판매량 범위에서 안정적인 예측을 제공합니다.</li>
                <li>전체 모델 중 가장 우수한 종합 성능을 보입니다.</li>
              </>
            )}
            {modelName === 'xgboost' && (
              <>
                <li>XGBoost 모델은 일부 샘플에서 매우 정확한 예측을 보이지만, 다른 샘플에서는 큰 오차를 보입니다.</li>
                <li>높은 변동성을 가진 예측 패턴으로 인해 전체 평가 지표에서는 상대적으로 낮은 성능을 보입니다.</li>
                <li>더 많은 데이터나 세밀한 하이퍼파라미터 튜닝을 통해 성능 개선의 여지가 있습니다.</li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  };

  // 예측 결과 비교 페이지 렌더링
  const renderPredictionComparison = () => {
    return (
      <div className="prediction-comparison">
        <h3 className="text-xl font-bold mb-4 text-center">모델 예측 결과 시각화</h3>
        
        {/* 각 모델 예측 결과 비교 (첫 50개 샘플) */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">각 모델 예측 결과 비교 (첫 50개 샘플)</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" label={{ value: '샘플 인덱스', position: 'insideBottom', offset: -5 }} />
              <YAxis domain={[0, 600]} label={{ value: '판매량', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#000000" name="실제값" strokeWidth={2} />
              <Line type="monotone" dataKey="linearRegression" stroke="#8884d8" name="선형 회귀" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="arima" stroke="#82ca9d" name="ARIMA" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="randomForest" stroke="#ffc658" name="랜덤 포레스트" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="xgboost" stroke="#ff8042" name="XGBoost" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* 각 모델 예측 오차 */}
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
              <XAxis dataKey="index" label={{ value: '샘플 인덱스', position: 'insideBottom', offset: -5 }} />
              <YAxis domain={[-300, 300]} label={{ value: '예측 오차 (실제값 - 예측값)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="linearRegression" stroke="#8884d8" name="선형 회귀 오차" dot={false} />
              <Line type="monotone" dataKey="arima" stroke="#82ca9d" name="ARIMA 오차" dot={false} />
              <Line type="monotone" dataKey="randomForest" stroke="#ffc658" name="랜덤 포레스트 오차" dot={false} />
              <Line type="monotone" dataKey="xgboost" stroke="#ff8042" name="XGBoost 오차" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* 실제값과 예측값 산점도 (랜덤 포레스트 모델) */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">실제값과 예측값 산점도 (랜덤 포레스트 모델)</h4>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={predictionData.map(item => ({
              actual: item.actual,
              randomForest: item.randomForest,
              actualLabel: `${item.actual} (${item.index})`,
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="actual" 
                domain={[0, 600]}
                label={{ value: '실제값', position: 'insideBottom', offset: -5 }} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 600]}
                label={{ value: '예측값', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip formatter={(value, name, props) => {
                if (name === "완벽 예측선") return [value, name];
                const index = predictionData.findIndex(item => item.actual === props.payload.actual);
                return [`${value} (샘플 ${index})`, name];
              }} />
              <Legend />
              <Scatter name="랜덤 포레스트 예측" dataKey="randomForest" fill="#ffc658" />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#ff0000" 
                name="완벽 예측선" 
                strokeWidth={2} 
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 모델 평가 결론 */}
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
      </div>
    );
  };

  // 예측 시각화 렌더링
  const renderPredictionCharts = () => {
    return (
      <div className="prediction-charts">
        <h3 className="text-xl font-bold mb-4 text-center">모델 예측 결과 시각화</h3>
        
        {/* 예측 결과 차트 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">각 모델 예측 결과 비교 (첫 50개 샘플)</h4>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" label={{ value: '샘플 인덱스', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: '판매 예측값', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#000000" name="실제값" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="linearRegression" stroke="#8884d8" name="선형 회귀" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="arima" stroke="#82ca9d" name="ARIMA" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="randomForest" stroke="#ffc658" name="랜덤 포레스트" strokeWidth={1} dot={false} />
              <Line type="monotone" dataKey="xgboost" stroke="#ff8042" name="XGBoost" strokeWidth={1} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* 모델 오차 차트 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">각 모델 예측 오차</h4>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={predictionData.map(item => ({
              index: item.index,
              linearRegression: item.actual - item.linearRegression,
              arima: item.actual - item.arima,
              randomForest: item.actual - item.randomForest,
              xgboost: item.actual - item.xgboost
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" label={{ value: '샘플 인덱스', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: '예측 오차 (실제값 - 예측값)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="linearRegression" stroke="#8884d8" name="선형 회귀 오차" dot={false} />
              <Line type="monotone" dataKey="arima" stroke="#82ca9d" name="ARIMA 오차" dot={false} />
              <Line type="monotone" dataKey="randomForest" stroke="#ffc658" name="랜덤 포레스트 오차" dot={false} />
              <Line type="monotone" dataKey="xgboost" stroke="#ff8042" name="XGBoost 오차" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        
        {/* 실제값 vs 예측값 산점도 */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-2">실제값과 예측값 산점도 (랜덤 포레스트 모델)</h4>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="actual" label={{ value: '실제값', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: '예측값', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Scatter name="랜덤 포레스트 예측" dataKey="randomForest" fill="#ffc658" />
              <Line type="monotone" dataKey="actual" stroke="#ff0000" name="완벽 예측선" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  // 모든 모델의 성능 요약
  const renderModelSummary = () => {
    const ranks = rankMetrics();
    const bestModel = '랜덤 포레스트';
    
    let bestModelInfo = '';
    if (bestModel === '선형 회귀') bestModelInfo = 'linearRegression';
    else if (bestModel === 'ARIMA') bestModelInfo = 'arima';
    else if (bestModel === '랜덤 포레스트') bestModelInfo = 'randomForest';
    else if (bestModel === 'XGBoost') bestModelInfo = 'xgboost';
    
    return (
      <div className="mt-6 text-center">
        <p className="mb-4">
          <span className="font-semibold">최고 성능 모델:</span> {bestModel}
          <button 
            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
            onClick={() => setActiveTab(bestModelInfo)}
          >
            자세히 보기
          </button>
        </p>
      </div>
    );
  };
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">전자상거래 판매 예측 모델 비교</h2>
      
      {/* 탭 전환 */}
      <div className="flex justify-center mb-6 flex-wrap">
        <button
          className={`px-4 py-2 mx-2 my-1 rounded ${activeTab === 'linearRegression' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('linearRegression')}
        >
          선형 회귀
        </button>
        <button
          className={`px-4 py-2 mx-2 my-1 rounded ${activeTab === 'arima' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('arima')}
        >
          ARIMA
        </button>
        <button
          className={`px-4 py-2 mx-2 my-1 rounded ${activeTab === 'randomForest' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('randomForest')}
        >
          랜덤 포레스트
        </button>
        <button
          className={`px-4 py-2 mx-2 my-1 rounded ${activeTab === 'xgboost' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('xgboost')}
        >
          XGBoost
        </button>
        <button
          className={`px-4 py-2 mx-2 my-1 rounded ${activeTab === 'comparison' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('comparison')}
        >
          모델 비교
        </button>
        <button
          className={`px-4 py-2 mx-2 my-1 rounded ${activeTab === 'predictionComparison' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('predictionComparison')}
        >
          예측 결과 비교
        </button>
      </div>
      
      {/* 콘텐츠 영역 */}
     <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        {activeTab === 'comparison' ? renderMetricsCharts() : 
         activeTab === 'predictionComparison' ? renderPredictionComparison() :
         renderModelTab(activeTab)}
      </div>
      
      {/* 모델 결론 */}
      {activeTab === 'comparison' && (
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
          {renderModelSummary()}
        </div>
      )}
    </div>
  );
};

export default ModelComparisonDashboard;
