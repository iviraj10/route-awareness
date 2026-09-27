# RoadSense UI and usability upgrade

## Scope
- Replace the warning symbol with a compact inline road-and-location logo and apply the RoadSense / Road Accident Hotspot Analysis identity in shared navigation and page metadata.
- Remove the dashboard map preview, strengthen the page introduction, refine the four existing statistics, and make the eight-year accident trend the dashboard’s main analytical view.
- Keep the dedicated Mumbai accident map and improve its framing, zoom, marker separation, hotspot styling, legend, and filtered-data context without dropping records or popup details.
- Add a compact, dynamically calculated Key Findings section to Analysis and improve titles, subtitles, axes, tooltips, spacing, empty states, and mobile chart readability.
- Reorganize Safety Information around general road safety, high-risk area awareness, driver precautions, and pedestrian safety while preserving the existing disclaimer.
- Apply restrained shared refinements to typography, spacing, panels, filters, and navigation while preserving the Mumbai dataset, calculations, filter context, routes, and frontend-only architecture.

## Technical details
- Use an inline SVG React logo component with semantic design tokens; no external image dependency.
- Derive findings from the existing filtered record collection using the existing analytics helpers; introduce no fixed analytical values.
- Reduce exact-coordinate marker overlap with deterministic display offsets while keeping every marker tied to its original record and details.
- Keep the year charts on the year-agnostic filtered collection so all eight years remain visible.

## Verification
- Check Dashboard, Accident Map, Analysis, and Safety Information at desktop and mobile widths.
- Exercise every filter and reset; verify statistics, markers, trend, charts, and findings update together.
- Open a map marker and confirm all original popup details remain available.
- Confirm the dashboard map is absent, Mumbai remains correctly framed, navigation works, and the final build and browser console are error-free.
