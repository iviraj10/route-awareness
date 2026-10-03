import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import type { AccidentRecord } from "@/data/accidents";

const esc = (s: string | number) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const cssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function ClusterLayer({ records }: { records: AccidentRecord[] }) {
  const map = useMap();

  useEffect(() => {
    const colors = {
      Fatal: cssVar("--severity-fatal"),
      Serious: cssVar("--severity-serious"),
      Minor: cssVar("--severity-minor"),
    };
    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 45,
      iconCreateFunction: (cluster) => {
        const n = cluster.getChildCount();
        const size = n < 10 ? 30 : n < 50 ? 36 : 44;
        return L.divIcon({
          html: `<span>${n}</span>`,
          className: "rs-cluster",
          iconSize: [size, size],
        });
      },
    });
    for (const a of records) {
      const m = L.circleMarker([a.latitude, a.longitude], {
        radius: a.severity === "Fatal" ? 7 : a.severity === "Serious" ? 6 : 5,
        color: "#fff",
        weight: 1.5,
        fillColor: colors[a.severity],
        fillOpacity: 0.9,
      });
      m.bindPopup(
        `<div class="rs-popup"><p class="rs-popup-title">${esc(a.location)}</p><dl>` +
          `<dt>Road</dt><dd>${esc(a.road)}</dd><dt>Year</dt><dd>${esc(a.year)}</dd>` +
          `<dt>Type</dt><dd>${esc(a.accidentType)}</dd><dt>Severity</dt><dd>${esc(a.severity)}</dd></dl></div>`,
      );
      group.addLayer(m);
    }
    map.addLayer(group);
    return () => {
      map.removeLayer(group);
    };
  }, [map, records]);

  return null;
}
