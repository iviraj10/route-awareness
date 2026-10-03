import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import ClusterLayer from "@/components/ClusterLayer";
import { CITY_CENTER, type AccidentRecord } from "@/data/accidents";
import { HOTSPOT_MIN_COUNT, hotspots } from "@/lib/accident-analytics";

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

  return (
    <MapContainer
      center={CITY_CENTER}
      zoom={zoom}
      minZoom={10}
      zoomSnap={0.5}
      maxBounds={[[18.84, 72.72], [19.32, 73.08]]}
      maxBoundsViscosity={0.7}
      scrollWheelZoom={interactive}
      dragging={interactive}
      style={{ height, width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="rs-basemap"
        maxZoom={19}
      />

      {spots.map((s, i) => (
        <Circle
          key={`hotspot-${i}`}
          center={[s.latitude, s.longitude]}
          radius={250 + s.count * 30}
          pathOptions={{
            stroke: false,
            fillColor: "var(--severity-fatal)",
            fillOpacity: Math.min(0.08 + s.count * 0.006, 0.18),
            interactive: false,
          }}
        />
      ))}

      <ClusterLayer records={records} />
    </MapContainer>
  );
}

