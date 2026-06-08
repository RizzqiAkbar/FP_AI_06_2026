import { AnalysisResult } from '../types/analysis';

interface ResultCardProps {
  result: AnalysisResult;
  onScanAnother: () => void;
}

export default function ResultCard({ result, onScanAnother }: ResultCardProps) {
  const { analysis } = result;
  const nutritionSummary = analysis?.nutrition_summary || (result as any).nutrition_data || {};

  const getRiskColor = (score: number | string) => {
    if (typeof score === 'string' || isNaN(Number(score))) return 'text-gray-400';
    if (Number(score) < 50) return 'text-red-600';
    if (Number(score) < 80) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBg = (score: number | string) => {
    if (typeof score === 'string' || isNaN(Number(score))) return 'bg-gray-50 border-gray-200 shadow-gray-100';
    if (Number(score) < 50) return 'bg-red-50 border-red-200 shadow-red-100';
    if (Number(score) < 80) return 'bg-yellow-50 border-yellow-200 shadow-yellow-100';
    return 'bg-green-50 border-green-200 shadow-green-100';
  };

  const getRiskLabel = (score: number | string) => {
    if (typeof score === 'string' || isNaN(Number(score))) return 'Unknown Risk';
    if (Number(score) < 50) return 'High Risk';
    if (Number(score) < 80) return 'Moderate Risk';
    return 'Safe to Consume';
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Analysis Result</h2>
          <p className="text-gray-500 mt-1">Personalized nutrition insights based on your profile.</p>
        </div>
        <button 
          onClick={onScanAnother} 
          className="px-6 py-3 bg-white text-gray-800 rounded-xl font-bold shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all duration-200 flex items-center"
        >
          <span className="mr-2">↻</span> Scan Another
        </button>
      </div>
      
      {/* Score Card */}
      <div className={`relative overflow-hidden p-10 rounded-3xl shadow-lg border text-center transition-all duration-500 hover:shadow-xl ${getRiskBg(analysis.risk_score)}`}>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-7h2v5h-2z"/></svg>
        </div>
        <h3 className="text-lg font-bold text-gray-700 uppercase tracking-widest relative z-10">Health Risk Score</h3>
        <div className="flex justify-center items-baseline mt-4 relative z-10">
          <span className={`text-8xl font-black tracking-tighter ${getRiskColor(analysis.risk_score)}`}>
            {analysis.risk_score}
          </span>
          {typeof analysis.risk_score === 'number' && (
            <span className="text-4xl text-gray-400 font-bold ml-2">/100</span>
          )}
        </div>
        <div className="mt-4 relative z-10">
          <span className={`inline-block px-6 py-2 rounded-full text-xl font-black tracking-wide ${
            typeof analysis.risk_score === 'number' ? (
              analysis.risk_score < 50 ? 'bg-red-100 text-red-700' : 
              analysis.risk_score < 80 ? 'bg-yellow-100 text-yellow-700' : 
              'bg-green-100 text-green-700'
            ) : 'bg-gray-200 text-gray-700'
          }`}>
            {getRiskLabel(analysis.risk_score)}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recommendation */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 shadow-sm text-blue-500">💡</div> 
            Recommendation
          </h3>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-900 p-6 rounded-2xl border border-blue-100/50 flex-grow font-medium text-lg leading-relaxed shadow-inner">
            {analysis.recommendation}
          </div>
        </div>

        {/* Nutrition Summary */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 shadow-sm text-purple-500">📊</div> 
            Nutrition Facts
          </h3>
          <ul className="space-y-5">
            <li className="flex justify-between items-center border-b border-gray-50 pb-4">
              <span className="text-gray-500 font-semibold text-lg">Calories</span>
              <span className="font-black text-gray-800 bg-gray-100/80 px-4 py-1.5 rounded-lg shadow-sm">{nutritionSummary?.calories ?? 0}</span>
            </li>
            <li className="flex justify-between items-center border-b border-gray-50 pb-4">
              <span className="text-gray-500 font-semibold text-lg">Protein</span>
              <span className="font-black text-gray-800 bg-gray-100/80 px-4 py-1.5 rounded-lg shadow-sm">{nutritionSummary?.protein ?? 0}</span>
            </li>
            <li className="flex justify-between items-center border-b border-gray-50 pb-4">
              <span className="text-gray-500 font-semibold text-lg">Sugar</span>
              <span className="font-black text-gray-800 bg-gray-100/80 px-4 py-1.5 rounded-lg shadow-sm">{nutritionSummary?.sugar ?? 0}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-500 font-semibold text-lg">Fat</span>
              <span className="font-black text-gray-800 bg-gray-100/80 px-4 py-1.5 rounded-lg shadow-sm">{nutritionSummary?.fat ?? 0}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Deep Analysis */}
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-400 to-emerald-600"></div>
        <h3 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4 shadow-sm text-emerald-500">🔬</div> 
          Personalized Analysis
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg font-medium">
          {analysis.analysis}
        </p>
      </div>

      {/* Alternatives */}
      {analysis.alternatives && analysis.alternatives.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-10 rounded-3xl shadow-lg border border-green-100/50">
          <h3 className="text-2xl font-extrabold text-gray-800 mb-8 flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center mr-4 shadow-sm text-green-600">✅</div> 
            Better Alternatives
          </h3>
          <div className="flex flex-wrap gap-4">
            {analysis.alternatives.map((alt, idx) => (
              <span key={idx} className="bg-white border border-green-200/60 text-green-800 px-6 py-4 rounded-2xl font-bold shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center">
                <span className="text-green-500 mr-3 text-xl">✓</span> {alt}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
