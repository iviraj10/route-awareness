# Focused UI and usability refinement

## Scope
- Connect the existing dashboard to the shared filters so its four statistics, yearly trend, and map preview update together.
- Refine spacing, typography, cards, panels, filter controls, and map legend using the current restrained visual system.
- Improve chart readability and compactness without adding or removing charts.
- Tighten the safety page copy and structure so guidance clearly relates to the historical analysis.
- Preserve the dataset, map behavior, navigation, calculations, and frontend-only architecture.

## Implementation
- Reuse `FilterBar` and `useFilters` on the dashboard; compute summaries and trends from the filtered records.
- Add a compact active-selection summary near filtered map views and clarify the marker/hotspot legend.
- Update shared page, panel, statistic, and filter styles so refinements apply consistently across all routes.
- Keep marker popups and all existing filter options unchanged.

## Verification
- Check all four routes at desktop and mobile widths.
- Exercise filters and reset; confirm dashboard values, trend, map marker count, and analysis charts update.
- Open a map marker and confirm its details remain available.
- Confirm the final build and browser console are error-free.
