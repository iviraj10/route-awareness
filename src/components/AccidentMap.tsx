import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, TileLayer, Circle } from "react-leaflet";
import { CITY_CENTER, type AccidentRecord } from "@/data/accidents";
import { HOTSPOT_MIN_COUNT, hotspots, severityColor } from "@/lib/accident-analytics";

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
    ? hotspots(records).filter((s) => s.count >= HOTSPOT_MIN_COUNT)
    : [];

  const displayRecords = offsetOverlappingRecords(records);

  return (
    <MapContainer
      center={CITY_CENTER}
      zoom={zoom}
      minZoom={10}
      maxBounds={[[18.84, 72.72], [19.32, 73.08]]}
      maxBoundsViscosity={0.7}
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
            fillOpacity: Math.min(0.06 + s.count * 0.009, 0.2),
          }}
        />
      ))}

      {displayRecords.map(({ record: a, latitude, longitude }) => (
        <CircleMarker
          key={a.id}
          center={[latitude, longitude]}
          radius={a.severity === "Fatal" ? 6.5 : a.severity === "Serious" ? 5 : 4}
          pathOptions={{
            color: severityColor[a.severity],
            weight: 1.5,
            fillColor: severityColor[a.severity],
            fillOpacity: 0.68,
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

function offsetOverlappingRecords(records: AccidentRecord[]) {
  const seen = new Map<string, number>();
  return records.map((record) => {
    const key = `${record.latitude.toFixed(5)}|${record.longitude.toFixed(5)}`;
    const index = seen.get(key) ?? 0;
    seen.set(key, index + 1);
    if (index === 0) return { record, latitude: record.latitude, longitude: record.longitude };

    const ring = Math.floor((index - 1) / 8) + 1;
    const angle = ((index - 1) % 8) * (Math.PI / 4);
    const distance = ring * 0.00075;
    return {
      record,
      latitude: record.latitude + Math.sin(angle) * distance,
      longitude: record.longitude + Math.cos(angle) * distance,
    };
  });
}
