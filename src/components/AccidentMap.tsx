import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, TileLayer, Circle } from "react-leaflet";
import { CITY_CENTER, type AccidentRecord } from "@/data/accidents";
import { HIGH_RISK_THRESHOLD, hotspots, severityColor } from "@/lib/accident-analytics";

interface Props {
  records: AccidentRecord[];
  height?: string;
  showHotspots?: boolean;
  interactive?: boolean;
  zoom?: number;
}

export default function AccidentMap({
  records,
  height = "520px",
  showHotspots = true,
  interactive = true,
  zoom = 11,
}: Props) {
  const spots = showHotspots
    ? hotspots(records).filter((s) => s.count >= HIGH_RISK_THRESHOLD)
    : [];

  return (
    <MapContainer
      center={CITY_CENTER}
      zoom={zoom}
      scrollWheelZoom={interactive}
      dragging={interactive}
      style={{ height, width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {spots.map((s, i) => (
        <Circle
          key={`hotspot-${i}`}
          center={[s.latitude, s.longitude]}
          radius={200 + s.count * 45}
          pathOptions={{
            color: "transparent",
            fillColor: "#c0392b",
            fillOpacity: Math.min(0.08 + s.count * 0.012, 0.28),
          }}
        />
      ))}

      {records.map((a) => (
        <CircleMarker
          key={a.id}
          center={[a.latitude, a.longitude]}
          radius={a.severity === "Fatal" ? 7 : a.severity === "Serious" ? 5.5 : 4.5}
          pathOptions={{
            color: severityColor[a.severity],
            weight: 1.5,
            fillColor: severityColor[a.severity],
            fillOpacity: 0.75,
          }}
        >
          <Popup>
            <div className="min-w-45 space-y-1.5 text-sm">
              <p className="text-base font-semibold">{a.location}</p>
              <dl className="text-muted-foreground grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                <dt>Road</dt>
                <dd className="text-foreground">{a.road}</dd>
                <dt>Year</dt>
                <dd className="text-foreground">{a.year}</dd>
                <dt>Type</dt>
                <dd className="text-foreground">{a.accidentType}</dd>
                <dt>Severity</dt>
                <dd className="text-foreground">{a.severity}</dd>
              </dl>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
