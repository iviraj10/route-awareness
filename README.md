# RoadSense Dashboard

Build a lightweight, clean, fully functional web application named Road Accident Hotspot Analysis.

Project Objective

Create a simple web-based system that analyzes road accident data and helps users identify accident-prone locations and understand accident patterns through interactive maps, filters, statistics, and charts.

The project is for a 5th-semester academic project, so prioritize simplicity, usability, and working functionality over complex architecture.

UI / UX — IMPORTANT

Create a clean, minimal, professional dashboard.

Do NOT overcrowd the interface.

Do NOT put too many cards, charts, buttons, or sections on one screen.

Use generous spacing and clear visual hierarchy.

Keep navigation simple.

Use a consistent typography and component style.

Use subtle borders, shadows, and restrained colors.

Avoid excessive gradients, animations, glassmorphism, and decorative elements.

Every section should have a clear purpose.

The interface should feel like a real data-analysis application, not a flashy template.

Use a sidebar with only:

Dashboard

Accident Map

Analysis

Safety Information

1. Dashboard

Create a simple overview containing:

Top statistics

Total Accidents

High-Risk Locations

Most Common Accident Type

Most Affected Year

Main content

Accident trend by year

Accident hotspot map preview

Do not add unnecessary widgets.

2. Accident Map

Create a dedicated map page using Leaflet + OpenStreetMap.

The map should:

Display accident locations using markers.

Visually represent areas with higher accident concentration as hotspots.

Allow users to click a marker and view:

Location

Road

Year

Accident Type

Severity

Add the accident filters at the top of the page:

Year

Road / Location

Accident Type

Severity

All filters must actually work and update the displayed accident data on the map.

3. Analysis

Create a dedicated analysis page with a small number of useful charts:

Accidents by Year — line chart

Accidents by Accident Type — bar chart

Accidents by Location/Road — bar chart

Accidents by Severity — simple chart

Charts must automatically update when filters are applied.

Keep charts visually separated with proper spacing. Do not place too many charts in a single row.

4. Safety Information

Create a simple page containing:

General road-safety precautions

Information about accident-prone areas

Basic safety recommendations

Do not claim that the system can guarantee accident prevention or mathematically guarantee a safer route.

5. Data

For the first version, use a local mock dataset so the application works immediately without requiring a backend or external accident-data API.

Each record should contain:

id, date, year, location, road, latitude, longitude, accidentType, severity

Create enough realistic sample records across multiple:

Years

Locations

Roads

Accident types

Severity levels

The data structure should be clean and easy to replace with a real government dataset later.

6. Functional Requirements

This is important: build functionality, not just UI screens.

Dashboard statistics must be calculated from the dataset.

Filters must work.

Map markers must respond to filters.

Charts must use the actual dataset.

Clicking a map marker must show accident details.

Changing filters must update the relevant dashboard/map/chart information.

Avoid hardcoded numbers wherever the value can be calculated from the dataset.

7. Technology

Keep the implementation lightweight.

Use:

React — frontend

Leaflet + OpenStreetMap — map

Recharts — charts

Local JavaScript/JSON data — initial dataset

Do NOT create a backend, database, authentication system, or unnecessary API layer for this first version.

Structure the code so a backend/database can be added later if required.

8. Do NOT Add

Do not add features outside the project scope, including:

Login/signup

Authentication

Payments

AI/ML prediction

Real-time accident tracking

Complex route optimization

Real-time government APIs

Admin panels

Unnecessary backend services

Excessive animations

Unnecessary pages or features

Final Requirement

Build the complete working frontend, not a static prototype.

The final website should be:

Clean + Lightweight + Functional + Easy to Understand + Easy to Demonstrate

Prioritize the core flow:

Accident Data → Filters → Map/Hotspots → Charts → Understanding Accident Patterns

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/61eb8b5c-9f88-42f9-b14d-a60b68a40dc6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
