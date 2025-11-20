# RouteMapper

RouteMapper is a Next.js (App Router) application that lets travelers design sightseeing routes by combining interactive mapping with lightweight persistence.

## Core Features

- Leaflet + OpenStreetMap basemap to place landmarks via clicks.
- Landmark search powered by the public Nominatim geocoder (OpenStreetMap) so users can add precise coordinates without guessing.
- Ordered landmark list with drag-style controls (move up/down, edit, remove) that keeps the route polyline in sync.
- Route persistence in JSON files under `data/routes/`, simulating a simple database that can be versioned with the project.
- Shareable route links (`/view-route/:id`) so anyone with the URL can open the full map without authentication.
- Lightweight user identity stored in `localStorage` (UUID + username) to avoid full auth while keeping attribution on saved routes.

## Technical Decisions

- **Mapping library**: Leaflet was selected instead of Google Maps to avoid API keys and simplify local development. Tiles come from OpenStreetMap and attribution is injected automatically by Leaflet.
- **Dynamic asset loading**: Leaflet CSS/JS are injected only on the client inside `MapComponent` to keep the Next.js server build lean.
- **Marker management**: Landmarks are rendered as `circleMarker`s plus numbered div icons so the order stays visible on the map. Routes are connected with a dashed polyline and the viewport auto-fits all landmarks.
- **Geocoding**: Rather than depending on a paid provider, the client queries the Nominatim search endpoint with gentle rate of one request per user action. Results expose both a friendly label and full description so the creator can edit details after inserting the landmark.
- **Persistence**: `lib/routes-storage.ts` reads/writes individual JSON files keyed by route ID. This keeps the implementation transparent and easy to reset for evaluation, while still matching the requirement of file-based storage.
- **Temporary identity**: `lib/context/user-context.tsx` assigns a UUID once per browser and stores the username in `localStorage`, aligning with the requirement to avoid full JWT auth.

## Development Notes

1. Install dependencies with `pnpm install` (or npm/yarn if preferred).
2. Run the dev server with `pnpm dev` and open http://localhost:3000.
3. JSON routes are stored in `data/routes/`. Delete files there to reset the dataset.

## Usage Tips

- From the dashboard, enter a username once to unlock the creator flow.
- On the **Create Route** page, either click the map or search for a location by name/address. Each saved route requires at least two landmarks.
- After saving, copy the share link from the Route Details panel and send it to anyone. They can paste the ID on `/view-route` or visit the link directly.

All UI copy and comments remain in English to keep the codebase consistent.

