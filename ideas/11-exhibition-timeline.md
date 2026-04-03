# Exhibition Timeline

Browse past and current exhibitions at the Art Institute of Chicago on an interactive timeline.

## Overview

The API has an exhibitions endpoint with 6,000+ exhibitions spanning over a century. Build a timeline view that lets users browse exhibitions chronologically and see the artworks that were part of each exhibition.

## API Endpoints

- **List exhibitions:** `GET /exhibitions?limit=20&page=1&fields=id,title,short_description,image_url,status,aic_start_at,aic_end_at`
- **Exhibition detail:** `GET /exhibitions/{id}?fields=id,title,short_description,description,image_url,status,aic_start_at,aic_end_at,artwork_ids`
- **Search exhibitions:** `GET /exhibitions/search?q={query}&fields=id,title,short_description,image_url,aic_start_at,aic_end_at`
- **Batch artworks from exhibition:** `GET /artworks?ids={comma_separated_ids}&fields=id,title,artist_display,image_id,thumbnail`

## Implementation Details

- Create a timeline view with exhibition cards arranged chronologically
- Each card shows the exhibition title, date range, description, and cover image
- Allow filtering by status (Current, Upcoming, Closed)
- Search exhibitions by name or topic
- Clicking an exhibition card opens a detail view showing:
  - Full description
  - Date range
  - A grid of artworks in the exhibition (fetched via `artwork_ids`)
- Consider a horizontal scrollable timeline or a vertical list with year markers

## Suggested shadcn/ui Components

- **Card** — exhibition cards with image, title, dates
- **Badge** — exhibition status (Current, Upcoming, Closed)
- **Sheet** — exhibition detail panel
- **Separator** — year dividers in the timeline
- **Scroll Area** — horizontal scrolling timeline
- **Select** — filter by status
- **Input** — search exhibitions

## Bonus Ideas

- Group exhibitions by decade with collapsible year sections
- Show overlapping exhibitions on a Gantt-chart style timeline
- Highlight currently running exhibitions with a special visual treatment
