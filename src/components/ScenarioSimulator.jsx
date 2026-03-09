import React, { useState, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export default function ScenarioSimulator({ indicatorState, onSimulate }) {
  const defaultIndicators = {
    rainfall: 0,
    temperature: 0,
    pollution: 150,
    inflation: 4,
    interest: 5,
    unemployment: 5,
    migration: 0,
    urbanGrowth: 1.5,
    tradeImbalance: 5,
    foodPrices: 150,
  };

  const [localState, setLocalState] = useState(indicatorState || defaultIndicators);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (indicatorState) {
      setLocalState(indicatorState);
    }
  }, [indicatorState]);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      onSimulate(localState);
      setIsSimulating(false);
    }, 800);
  };

  const update = (key, val) => {
    setLocalState(prev => ({ ...prev, [key]: parseFloat(val) }));
  };

  const controls = [
    { key: 'rainfall', label: 'Rainfall Anomaly', min: -60, max: 40, unit: '%', color: 'accent-sky-500' },
    { key: 'temperature', label: 'Temperature Anomaly', min: 0, max: 3, step: 0.1, unit: '°C', color: 'accent-rose-500' },
    { key: 'pollution', label: 'Air Pollution Index', min: 50, max: 250, unit: '', color: 'accent-slate-400' },
    { key: 'inflation', label: 'Inflation Rate', min: 2, max: 12, unit: '%', color: 'accent-amber-500' },
    { key: 'interest', label: 'Interest Rates', min: 4, max: 12, unit: '%', color: 'accent-indigo-500' },
    { key: 'unemployment', label: 'Unemployment Rate', min: 3, max: 13, unit: '%', color: 'accent-orange-500' },
    { key: 'migration', label: 'Migration Inflow', min: -10, max: 30, unit: '%', color: 'accent-blue-500' },
    { key: 'urbanGrowth', label: 'Urban Population Growth', min: 0, max: 5, step: 0.1, unit: '%', color: 'accent-emerald-500' },
    { key: 'tradeImbalance', label: 'Trade Imbalance', min: 0, max: 20, unit: '%', color: 'accent-fuchsia-500' },
    { key: 'foodPrices', label: 'Food Price Index', min: 100, max: 250, unit: '', color: 'accent-yellow-500' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[400px] flex flex-col">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">Scenario Simulation Panel</h3>
          <p className="text-xs text-slate-400 mt-1">Adjust environmental and economic indicators to trigger cascading risks.</p>
        </div>
        <button 
          onClick={() => onSimulate(indicatorState || defaultIndicators)}
          className="p-2 text-slate-500 hover:text-slate-300 transition-colors"
          title="Reset to Baseline"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 flex-1 overflow-auto pr-2 custom-scrollbar">
        {controls.map((ctrl) => (
          <div key={ctrl.key}>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium text-slate-400">{ctrl.label}</label>
              <span className={`text-xs font-bold text-slate-200`}>
                {localState[ctrl.key] ?? 0}{ctrl.unit}
              </span>
            </div>
            <input 
              type="range" 
              min={ctrl.min} max={ctrl.max} step={ctrl.step || 1}
              value={localState[ctrl.key] ?? 0}
              onChange={(e) => update(ctrl.key, e.target.value)}
              className={`w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer ${ctrl.color}`}
            />
          </div>
        ))}
      </div>

      <button 
        onClick={handleSimulate}
        disabled={isSimulating}
        className="w-full mt-6 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-colors disabled:opacity-50"
      >
        {isSimulating ? (
          <span className="animate-pulse">Running Interconnection Engine...</span>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" fill="currentColor" /> Run Simulation
          </>
        )}
      </button>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
