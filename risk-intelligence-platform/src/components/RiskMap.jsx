import React from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const regionCoordinates = {
"North America": [45, -100],
"South America": [-15, -60],
"Europe": [50, 10],
"Africa": [0, 20],
"Asia": [34, 100],
"Oceania": [-25, 135]
};

const RiskMap = ({ data = [] }) => {

return (
<MapContainer
center={[20, 0]}
zoom={2}
scrollWheelZoom={false}
className="h-full w-full"
>

  <TileLayer
    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  />

  {data.map((row, index) => {

    const coords = regionCoordinates[row.Region];

    if (!coords) return null;

    const risk = Number(row.SystemicRisk || 0);

    return (
      <CircleMarker
        key={index}
        center={coords}
        radius={Math.max(5, risk * 25)}
        fillColor={risk > 0.66 ? "#ef4444" : "#60a5fa"}
        color="#020617"
        weight={1}
        fillOpacity={0.7}
      >
        <Tooltip direction="top" opacity={1}>
          <span className="text-xs font-bold">
            {row.Region} — {(risk * 100).toFixed(1)}%
          </span>
        </Tooltip>
      </CircleMarker>
    );

  })}

</MapContainer>


);
};

export default RiskMap;
