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
        description="Filter the dataset and click any marker to see the accident details."
      />
      <div className="space-y-6">
        <FilterBar />
        <MapPanel records={filtered} height="560px" />
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
