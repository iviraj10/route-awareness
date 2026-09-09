import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { AccidentRecord } from "@/data/accidents";
import { severityColor } from "@/lib/accident-analytics";
import { cn } from "@/lib/utils";

const AccidentMap = lazy(() => import("@/components/AccidentMap"));

interface Props {
  records: AccidentRecord[];
  height?: string;
  interactive?: boolean;
  zoom?: number;
  embedded?: boolean;
}

function Placeholder({ height }: { height: string }) {
  return (
    <div
      style={{ height }}
      className="bg-muted text-muted-foreground flex items-center justify-center text-sm"
    >
      Loading map…
    </div>
  );
}

export function MapPanel({
  records,
  height = "520px",
  interactive = true,
  zoom = 11,
  embedded = false,
}: Props) {
  return (
    <div
      className={cn(
        "bg-surface overflow-hidden rounded-lg",
        embedded ? "-m-4 sm:-m-5 sm:mt-0" : "border-border shadow-card border",
      )}
    >
      <ClientOnly fallback={<Placeholder height={height} />}>
        <Suspense fallback={<Placeholder height={height} />}>
          <AccidentMap
            records={records}
            height={height}
            interactive={interactive}
            zoom={zoom}
          />
        </Suspense>
      </ClientOnly>
      <div className="border-border text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 border-t px-4 py-3 text-xs">
        <span className="text-foreground font-medium">Legend</span>
        {(["Fatal", "Serious", "Minor"] as const).map((s) => (
          <span key={s} className="flex items-center gap-1.5" title={`${s} accident marker`}>
            <span
              className="size-2.5 rounded-full ring-1 ring-foreground/15"
              style={{ backgroundColor: severityColor[s] }}
            />
            {s} marker
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-fatal/20 ring-1 ring-fatal/35" />
          Hotspot concentration
        </span>
        <span className="text-foreground ml-auto font-mono font-medium">{records.length} accidents shown</span>
      </div>
    </div>
  );
}
