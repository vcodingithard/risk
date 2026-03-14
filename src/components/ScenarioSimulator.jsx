import React, { useState, useEffect } from 'react';
import { Play, RotateCcw } from 'lucide-react';

export default function ScenarioSimulator({ indicatorState, onSimulate }) {
  const defaultIndicators = {
    rainfall: 0, temperature: 0, pollution: 150, inflation: 4,
    interest: 5, unemployment: 5, migration: 0, urbanGrowth: 1.5,
    tradeImbalance: 5, foodPrices: 150,
  };

  const [localState, setLocalState] = useState(indicatorState || defaultIndicators);
  const [isSimulating, setIsSimulating] = useState(false);

  const update = (key, val) => setLocalState(prev => ({ ...prev, [key]: parseFloat(val) }));

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      onSimulate(localState);
      setIsSimulating(false);
    }, 800);
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
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full flex flex-col shadow-inner">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Scenario Simulator</h3>
          <p className="text-xs text-slate-500 mt-1">Modulate variables to observe cascading failure points.</p>
        </div>
        <button onClick={() => { setLocalState(defaultIndicators); onSimulate(defaultIndicators); }} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-5 overflow-y-auto pr-2 custom-scrollbar">
        {controls.map((ctrl) => (
          <div key={ctrl.key} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[10px] uppercase font-semibold text-slate-500">{ctrl.label}</label>
              <span className="text-xs font-mono text-indigo-400">{localState[ctrl.key]}{ctrl.unit}</span>
            </div>
            <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step || 1} value={localState[ctrl.key]} onChange={(e) => update(ctrl.key, e.target.value)} className={`w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer ${ctrl.color}`} />
          </div>
        ))}
      </div>

      <button onClick={handleSimulate} disabled={isSimulating} className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
        {isSimulating ? <span className="animate-pulse">Analyzing Propagations...</span> : <><Play className="w-4 h-4" fill="white" /> Run Simulation</>}
      </button>
    </div>
  );
}