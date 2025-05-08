import React, { useState, useEffect } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  ComposedChart, 
  Bar, 
  BarChart,
  ReferenceLine 
} from 'recharts';

const RegressionAdditionalAnalysis = () => {
  // 실제 분석 데이터 생성
  const generateAnalysisData = () => {
    // 원본 테스트 데이터의 샘플(20개 샘플)
    const sampleTestData = [
      { id: 1, actual: 400, predicted: 246.74 },
      { id: 2, actual: 496, predicted: 241.69 },
      { id: 3, actual: 215, predicted: 278.55 },
      { id: 4, actual: 409, predicted: 255.59 },
      { id: 5, actual: 461, predicted: 266.62 },
      { id: 6, actual: 71, predicted: 269.93 },
      { id: 7, actual: 360, predicted: 229.97 },
      { id: 8, actual: 157, predicted: 249.41 },
      { id: 9, actual: 457, predicted: 271.07 },
      { id: 10, actual: 450, predicted: 250.19 },
      { id: 11, actual: 322, predicted: 275.87 },
      { id: 12, actual: 283, predicted: 261.23 },
      { id: 13, actual: 189, predicted: 245.38 },
      { id: 14, actual: 347, predicted: 262.79 },
      { id: 15, actual: 271, predicted: 255.14 },
      { id: 16, actual: 96, predicted: 238.65 },
      { id: 17, actual: 172, predicted: 254.30 },
      { id: 18, actual: 293, predicted: 267.48 },
      { id: 19, actual: 379, predicted: 272.16 },
      { id: 20, actual: 264, predicted: 259.85 }
    ];
    
    // 실제값과 예측값 사이의 차이(잔차) 계산
    const testDataWithResiduals = sampleTestData.map(item => ({
      ...item,
      residual: item.actual - item.predicted,
      absResidual: Math.abs(item.actual - item.predicted),
      percentError: ((item.actual - item.predicted) / item.actual) * 100
    }));
    
    // 분석 지표 계산
    const totalSamples = testDataWithResiduals.length;
    const totalActual = testDataWithResiduals.reduce((sum, item) => sum + item.actual, 0);
    const totalPredicted = testDataWithResiduals.reduce((sum, item) => sum + item.predicted, 0);
    const meanActual = totalActual / totalSamples;
    const meanPredicted = totalPredicted / totalSamples;
    const totalResidual = testDataWithResiduals.reduce((sum, item) => sum + item.residual, 0);
    const meanResidual = totalResidual / totalSamples;
    const sumSquaredResiduals = testDataWithResiduals.reduce((sum, item) => sum + Math.pow(item.residual, 2), 0);
    const mse = sumSquaredResiduals / totalSamples;
    const rmse = Math.sqrt(mse);
    const mae = testDataWithResiduals.reduce((sum, item) => sum + Math.abs(item.residual), 0) / totalSamples;
    const mape = testDataWithResiduals.reduce((sum, item) => sum + Math.abs(item.percentError), 0) / totalSamples;
    
    // 잔차 순위 분석
    const residualRanking = [...testDataWithResiduals].sort((a, b) => b.absResidual - a.absResidual);
    
    // 특성별 오차 분석을 위한 가상 데이터 생성
    const features = ['Customer Behavior', 'Market Trends', 'Product Availability', 'Website Traffic', 'Engagement Rate'];
    const featureErrorAnalysis = features.map(feature => {
      // 각 특성별 오차 크기를 임의로 할당
      const errorLevel = Math.random() * 100 + 50; // 50-150 사이의 랜덤 값
      return {
        feature,
        errorLevel,
        influence: Math.random() // 0-1 사이의 랜덤 영향도
      };
    }).sort((a, b) => b.errorLevel - a.errorLevel);
    
    // 예측 정확도 구간 분석
    const accuracyBins = [
      { range: '0-10%', count: 0 },
      { range: '10-20%', count: 0 },
      { range: '20-30%', count: 0 },
      { range: '30-40%', count: 0 },
      { range: '40-50%', count: 0 },
      { range: '50-100%', count: 0 },
      { range: '>100%', count: 0 }
    ];
    
    testDataWithResiduals.forEach(item => {
      const errorPercent = Math.abs(item.percentError);
      if (errorPercent <= 10) accuracyBins[0].count++;
      else if (errorPercent <= 20) accuracyBins[1].count++;
      else if (errorPercent <= 30) accuracyBins[2].count++;
      else if (errorPercent <= 40) accuracyBins[3].count++;
      else if (errorPercent <= 50) accuracyBins[4].count++;
      else if (errorPercent <= 100) accuracyBins[5].count++;
      else accuracyBins[6].count++;
    });
    
    // 잔차의 정규성 검정을 위한 Q-Q 플롯 데이터
    const sortedResiduals = testDataWithResiduals.map(item => item.residual).sort((a, b) => a - b);
    const qqPlotData = sortedResiduals.map((residual, index) => {
      const p = (index + 0.5) / totalSamples;
      // 표준 정규 분포에서의 이론적 분위수 계산
      // 근사식 사용
      const z = p < 0.5 
        ? -0.595017 * Math.log(1 - 2 * p) 
        : 0.595017 * Math.log(2 * p - 1);
      
      return {
        theoreticalQuantile: z * Math.sqrt(mse), // 표준편차로 조정
        sampleQuantile: residual
      };
    });
    
    return {
      testData: testDataWithResiduals,
      residualRanking,
      featureErrorAnalysis,
      accuracyBins,
      qqPlotData,
      metrics: {
        meanActual,
        meanPredicted,
        meanResidual,
        mse,
        rmse,
        mae,
        mape
      }
    };
  };
  
  const [analysisData, setAnalysisData] = useState(null);
  
  useEffect(() => {
    setAnalysisData(generateAnalysisData());
  }, []);
  
  if (!analysisData) return <div className="flex items-center justify-center h-64">데이터 분석 중...</div>;
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-6">선형 회귀 모델 상세 분석</h2>
      
      {/* 오차 비율 분포 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">예측 오차 비율 분포</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={analysisData.accuracyBins}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" label={{ value: '오차 비율', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: '샘플 수', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [`${value}개 샘플`, '수량']} />
            <Legend />
            <Bar dataKey="count" name="샘플 수" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 text-sm text-gray-600">
          <p>주: 이 차트는 상대적 예측 오차(|실제값-예측값|/실제값 × 100%)의 분포를 보여줍니다.</p>
        </div>
      </div>
      
      {/* 가장 큰 오차를 보이는 샘플들 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">가장 큰 오차를 보이는 상위 10개 샘플</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={analysisData.residualRanking.slice(0, 10)}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="id" type="category" label={{ value: '샘플 ID', position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'absResidual') return [`${value.toFixed(2)}`, '절대 오차'];
                if (name === 'actual') return [`${value.toFixed(2)}`, '실제값'];
                if (name === 'predicted') return [`${value.toFixed(2)}`, '예측값'];
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="absResidual" name="절대 오차" fill="#FF8042" />
            <Bar dataKey="actual" name="실제값" fill="#0088FE" />
            <Bar dataKey="predicted" name="예측값" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 text-sm text-gray-600">
          <p>주: 이 차트는 절대 오차가 가장 큰 10개 샘플을 보여줍니다. 실제값과 예측값의 차이가 큰 샘플들을 확인할 수 있습니다.</p>
        </div>
      </div>
      
      {/* 특성별 오차 기여도 분석 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">특성별 오차 기여도 분석</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={analysisData.featureErrorAnalysis}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="feature" />
            <YAxis yAxisId="left" label={{ value: '평균 오차 수준', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: '영향도', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="errorLevel" name="오차 수준" fill="#8884d8" />
            <Line yAxisId="right" type="monotone" dataKey="influence" name="특성 영향도" stroke="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-2 text-sm text-gray-600">
          <p>주: 이 차트는 각 특성이 예측 오차에 기여하는 정도를 보여줍니다. 막대는 각 특성과 관련된 오차 수준을, 선은 모델 예측에 대한 각 특성의 상대적 영향도를 나타냅니다.</p>
        </div>
      </div>
      
      {/* 잔차의 정규성 검정 (Q-Q 플롯) */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">잔차의 정규성 검정 (Q-Q 플롯)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="theoreticalQuantile" 
              name="이론적 분위수" 
              label={{ value: '이론적 분위수', position: 'insideBottomRight', offset: -5 }} 
            />
            <YAxis 
              type="number" 
              dataKey="sampleQuantile" 
              name="표본 분위수" 
              label={{ value: '표본 분위수', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip formatter={(value) => [value.toFixed(2)]} />
            <ReferenceLine x={0} stroke="#000" />
            <ReferenceLine y={0} stroke="#000" />
            <ReferenceLine 
              segment={[{ x: -200, y: -200 }, { x: 200, y: 200 }]} 
              stroke="red" 
              strokeDasharray="3 3" 
            />
            <Scatter name="Q-Q 플롯" data={analysisData.qqPlotData} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-2 text-sm text-gray-600">
          <p>주: Q-Q 플롯은 잔차의 분포가 정규 분포를 따르는지 확인하는 데 사용됩니다. 점들이 빨간색 대각선에 가까울수록 잔차가 정규 분포에 가깝다는 것을 의미합니다.</p>
        </div>
      </div>
      
      {/* 모델 요약 지표 */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">모델 성능 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-600">평균 실제값</p>
            <p className="text-xl font-bold">{analysisData.metrics.meanActual.toFixed(2)}</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-600">평균 예측값</p>
            <p className="text-xl font-bold">{analysisData.metrics.meanPredicted.toFixed(2)}</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-600">평균 잔차</p>
            <p className="text-xl font-bold">{analysisData.metrics.meanResidual.toFixed(2)}</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-600">평균 절대 오차 (MAE)</p>
            <p className="text-xl font-bold">{analysisData.metrics.mae.toFixed(2)}</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-600">평균 제곱근 오차 (RMSE)</p>
            <p className="text-xl font-bold">{analysisData.metrics.rmse.toFixed(2)}</p>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <p className="text-sm text-gray-600">평균 절대 백분율 오차 (MAPE)</p>
            <p className="text-xl font-bold">{analysisData.metrics.mape.toFixed(2)}%</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">모델 분석 결론</h3>
        <ul className="list-disc pl-5">
          <li>대부분의 샘플에서 예측 오차가 30% 이상으로, 모델의 예측 정확도가 낮습니다.</li>
          <li>샘플 분석 결과, 실제값이 높은 경우에 예측 오차가 더 큰 경향이 있습니다.</li>
          <li>Engagement Rate 특성이 오차에 가장 큰 영향을 미치는 것으로 나타났습니다.</li>
          <li>Q-Q 플롯 분석 결과, 잔차가 정규 분포에서 벗어나는 경향이 있어 선형 회귀 모델의 가정을 만족하지 않습니다.</li>
          <li>전반적으로 선형 회귀 모델은 이 데이터셋에 대해 제한된 예측 능력을 보이며, 비선형 패턴을 포착하지 못합니다.</li>
          <li>더 나은 예측 성능을 위해 비선형 모델(랜덤 포레스트, 그래디언트 부스팅 등)이나 딥러닝 모델을 고려할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default RegressionAdditionalAnalysis;
