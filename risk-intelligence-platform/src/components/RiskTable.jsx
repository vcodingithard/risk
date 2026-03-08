import React from "react";

const RiskTable = ({ data = [] }) => {

const getStatus = (risk) => {
if (risk > 0.66) return { label: "Critical", color: "text-red-400 bg-red-400/10" };
if (risk > 0.33) return { label: "Elevated", color: "text-yellow-400 bg-yellow-400/10" };
return { label: "Stable", color: "text-green-400 bg-green-400/10" };
};

if (!data || data.length === 0) {
return ( <div className="p-4 text-slate-500 text-sm">
No regional risk data available. </div>
);
}

return ( <div className="overflow-x-auto">

  <table className="w-full text-left border-collapse">

    <thead>
      <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase tracking-wider">
        <th className="p-3">Region</th>
        <th className="p-3">Year</th>
        <th className="p-3 text-right">Systemic Risk</th>
        <th className="p-3 text-center">Status</th>
      </tr>
    </thead>

    <tbody className="text-sm">
      {data.slice(0, 12).map((row, index) => {

        const riskValue = row.SystemicRisk ?? 0;
        const status = getStatus(riskValue);

        return (
          <tr
            key={index}
            className="border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors"
          >

            <td className="p-3 font-semibold text-slate-200">
              {row.Region || "Unknown"}
            </td>

            <td className="p-3 text-slate-400">
              {row.Year}
            </td>

            <td className="p-3 text-right font-mono text-blue-400">
              {Number(riskValue).toFixed(4)}
            </td>

            <td className="p-3 text-center">
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${status.color}`}>
                {status.label}
              </span>
            </td>

          </tr>
        );
      })}
    </tbody>

  </table>

</div>

);
};

export default RiskTable;
