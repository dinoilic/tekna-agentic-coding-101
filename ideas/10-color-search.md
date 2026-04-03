# Color-Based Artwork Search

Find artworks by their dominant color using the color data provided by the API.

## Overview

The API provides a `color` field for artworks containing HSL values and a dominance percentage. Build a color picker that lets users search for artworks matching a chosen color palette.

## API Data

Each artwork's `color` field looks like:
```json
{
  "h": 59,
  "l": 52,
  "s": 12,
  "percentage": 0.002,
  "population": 1217
}
```

## API Endpoints

- **Search with color sort:** `POST /artworks/search` with Elasticsearch range queries on color fields

```json
POST /artworks/search
{
  "query": {
    "bool": {
      "must": [
        { "exists": { "field": "image_id" } },
        { "range": { "color.h": { "gte": 200, "lte": 260 } } },
        { "range": { "color.s": { "gte": 30 } } }
      ]
    }
  },
  "fields": ["id", "title", "artist_display", "image_id", "thumbnail", "color"],
  "limit": 12
}
```

## Implementation Details

- Build a color selector UI — could be a color wheel, a palette of predefined colors, or HSL sliders
- Map the selected color to H/S/L ranges for the API query
- Define color ranges (e.g., "Blue" = h:200-260, "Red" = h:340-360 OR h:0-20, "Green" = h:80-160)
- Display results in the existing artwork grid
- Show a small color swatch on each artwork card representing its dominant color
- Optionally sort results by how closely they match the target color

## Suggested shadcn/ui Components

- **Toggle Group** — predefined color palette buttons
- **Slider** — HSL sliders for fine-grained color selection
- **Popover** — color picker dropdown
- **Badge** — color swatch indicator on cards
- **Tooltip** — show HSL values on hover

## Predefined Color Palette Idea

| Color   | Hue Range | Min Saturation |
|---------|-----------|----------------|
| Red     | 340–20    | 25             |
| Orange  | 20–45     | 25             |
| Yellow  | 45–70     | 20             |
| Green   | 70–170    | 15             |
| Blue    | 170–260   | 15             |
| Purple  | 260–340   | 15             |

## Bonus Ideas

- Create a "Color of the Day" feature that highlights a random color
- Build a gradient palette from multiple artworks' dominant colors
- Visualize the color distribution of search results in a chart
