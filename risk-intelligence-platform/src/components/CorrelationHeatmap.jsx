import React from "react";

const sectors = [
"Climate",
"Economy",
"Geopolitics",
"Migration",
"Social",
"Trade",
"Urban Infrastructure"
];

const CorrelationHeatmap = ({ data = [] }) => {

const getBgColor = (val) => {
const opacity = Math.abs(val);


if (val > 0) {
  return `rgba(96,165,250,${opacity})`;
} else {
  return `rgba(248,113,113,${opacity})`;
}


};

if (!data || data.length === 0) {
return ( <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">
Awaiting Matrix Data... </div>
);
}

const getValue = (rowSector, colSector) => {
const row = data.find((r) => r.Sector === rowSector);
if (!row) return 0;


const val = Number(row[colSector]);
return isNaN(val) ? 0 : val;


};

return ( <div className="h-full flex flex-col">


  <div className="flex-1 grid grid-cols-8 gap-1 p-2">

    <div></div>

    {sectors.map((s) => (
      <div
        key={s}
        className="text-[8px] text-slate-500 uppercase flex items-center justify-center font-bold"
      >
        {s.substring(0,3)}
      </div>
    ))}

    {sectors.map((rowSector, i) => (
      <React.Fragment key={rowSector}>

        <div className="text-[8px] text-slate-500 uppercase flex items-center font-bold">
          {rowSector.substring(0,3)}
        </div>

        {sectors.map((colSector, j) => {

          const val = i === j ? 1 : getValue(rowSector, colSector);

          return (
            <div
              key={`${i}-${j}`}
              className="aspect-square rounded-sm flex items-center justify-center text-[8px] hover:scale-110 transition-all cursor-crosshair"
              style={{ backgroundColor: getBgColor(val) }}
              title={`${rowSector} ↔ ${colSector}: ${val.toFixed(2)}`}
            >
              <span className={Math.abs(val) > 0.4 ? "text-slate-950 font-bold" : "text-transparent"}>
                {val.toFixed(1)}
              </span>
            </div>
          );
        })}

      </React.Fragment>
    ))}

  </div>

  <div className="mt-2 flex justify-between text-[9px] text-slate-500 border-t border-slate-800 pt-2">
    <span>Negative Correlation</span>
    <div className="h-2 w-24 bg-gradient-to-r from-red-400 via-slate-800 to-blue-400 rounded-full"></div>
    <span>Positive Correlation</span>
  </div>

</div>


);
};

export default CorrelationHeatmap;
