import { createFileRoute } from "@tanstack/react-router";
import { FilterBar } from "@/components/FilterBar";
import { Page, PageHeader } from "@/components/AppShell";
import { MapPanel } from "@/components/MapPanel";
import { useFilters } from "@/lib/filter-context";
import { HIGH_RISK_THRESHOLD, hotspots } from "@/lib/accident-analytics";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Accident Map — Road Accident Hotspot Analysis" },
      {
        name: "description",
        content:
          "Interactive OpenStreetMap view of accident locations with filters for year, road, type and severity.",
      },
      { property: "og:title", content: "Accident Map — Road Accident Hotspot Analysis" },
      {
        property: "og:description",
        content: "Filterable map of accident locations and hotspot areas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { filtered } = useFilters();
  const spots = hotspots(filtered).filter((s) => s.count >= HIGH_RISK_THRESHOLD);

  return (
    <Page>
      <PageHeader
        title="Accident Map"
        description="Apply filters to update every visible marker and hotspot, then select a marker for details."
      />
      <div className="space-y-5">
        <FilterBar />
        <MapPanel records={filtered} height="540px" />
        {spots.length > 0 && spots[0] ? (
          <p className="text-muted-foreground text-sm">
            {spots.length} high-risk area{spots.length > 1 ? "s" : ""} in the current selection —
            densest near <span className="text-foreground font-medium">{spots[0].location}</span>{" "}
            with {spots[0].count} accidents.
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            No dense accident cluster in the current selection.
          </p>
        )}
      </div>
    </Page>
  );
}
