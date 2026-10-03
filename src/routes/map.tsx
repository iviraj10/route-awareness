import { createFileRoute } from "@tanstack/react-router";
import { FilterBar } from "@/components/FilterBar";
import { Page, PageHeader } from "@/components/AppShell";
import { MapPanel } from "@/components/MapPanel";
import { useFilters } from "@/lib/filter-context";
import { highRiskLocations } from "@/lib/accident-analytics";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Mumbai Accident Hotspot Map — RoadSense" },
      {
        name: "description",
        content:
          "Interactive OpenStreetMap view of accident locations with filters for year, road, type and severity.",
      },
      { property: "og:title", content: "Mumbai Accident Hotspot Map — RoadSense" },
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
  const spots = highRiskLocations(filtered);

  return (
    <Page>
      <PageHeader
        title="Mumbai Accident Hotspots"
        description="Filter Mumbai records to identify high-concentration areas, then select any marker for accident details."
      />
      <div className="space-y-5">
        <FilterBar />
        <MapPanel records={filtered} height="min(62vh, 620px)" zoom={12} />
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
