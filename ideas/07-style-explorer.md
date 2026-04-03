# Art Style Explorer

Browse artworks grouped by artistic style (Impressionism, Cubism, Art Nouveau, etc.) with visual style cards and curated collections.

## Overview

The API provides `style_titles` for each artwork — an array of styles like "Impressionism", "Post-Impressionism", "Cubism", "Art Deco", etc. Build a visual style browser that lets users explore the collection by artistic movement.

## API Endpoints

- **Search by style:** `POST /artworks/search` with Elasticsearch term query

### Example: Fetch Impressionist Paintings

```json
POST /artworks/search
{
  "query": {
    "bool": {
      "must": [
        { "term": { "style_titles.keyword": "Impressionism" } },
        { "exists": { "field": "image_id" } }
      ]
    }
  },
  "fields": ["id", "title", "artist_display", "date_display", "image_id", "thumbnail", "artwork_type_title", "style_titles"],
  "limit": 12
}
```

- **Aggregate styles:** Use Elasticsearch aggregations to get popular styles with counts

```json
POST /artworks/search
{
  "query": { "exists": { "field": "image_id" } },
  "aggregations": {
    "styles": {
      "terms": { "field": "style_titles.keyword", "size": 30 }
    }
  },
  "limit": 0
}
```

## Implementation Details

- Create a "Styles" landing page that shows style cards in a grid
- Each style card shows the style name, artwork count, and a sample artwork image
- Use the aggregations endpoint to get the most popular styles and their counts
- Clicking a style card navigates to a filtered view showing artworks in that style
- Reuse the existing `ArtworkGrid` component for the filtered results

## Suggested shadcn/ui Components

- **Card** — style cards with cover image and name
- **Badge** — artwork count per style
- **Tabs** — switch between "Search" and "Browse by Style" views
- **Breadcrumb** — navigation trail (Home > Styles > Impressionism)
- **Skeleton** — loading states for style cards

## Bonus Ideas

- Add a brief description of each art movement (hardcoded or from an external source)
- Show a timeline of when each style was most prevalent based on artwork dates
- Let users combine multiple styles to find cross-movement works
